import json
import pickle
from datetime import datetime

import numpy as np
import requests
from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
from time import sleep
from math import ceil
import os
from random import randint
from requests import HTTPError
import pandas as pd
from external.realtorAPI import get_coordinates, get_property_list, get_property_details
import matplotlib.pyplot as plt
from flasgger import Swagger
from pymongo import MongoClient
from io import BytesIO

# use Agg backend for plotting
plt.switch_backend('Agg')

from dotenv import load_dotenv
import boto3

# Load environment variables
load_dotenv()

import shap
import plotly.express as px
from tqdm import tqdm
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score, mean_absolute_error

swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'specifications',
            "route": "/rental_ai_api.json", 
        }
    ],
    "static_url_path": "/flasgger_static",
    "specs_route": "/documentation/swagger/"
}

API_URL = os.environ.get('API_URL', 'http://localhost:5000/api')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')
S3_BUCKET = os.environ.get('S3_BUCKET_NAME', 'rental-ai-ml-images')

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION', 'us-east-2')
)

app = Flask(__name__)
CORS(app, origins=[FRONTEND_URL])

swag = Swagger(app, config=swagger_config)

# Initialize MongoDB connection
client = MongoClient(MONGODB_URI)
db = client['rentalai_db']
properties_collection = db['properties']

# Function to load data from CSV to MongoDB
def load_data_to_mongodb():
    try:
        # Load OttawaON data
        ottawa_df = pd.read_csv('data/df_set.csv')
        
        # Convert DataFrame to list of dictionaries
        ottawa_records = ottawa_df.to_dict('records')
        
        # clear existing data and insert new data
        properties_collection.delete_many({})
        properties_collection.insert_many(ottawa_records)
        
        print("Data successfully loaded into MongoDB")
    except Exception as e:
        print(f"Error loading data to MongoDB: {e}")

# Call this function when the app starts
load_data_to_mongodb()

# Handle OPTIONS requests (preflight)
# @app.route('/', methods=['OPTIONS'])
# def handle_options():
#     return '', 200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*','Content-Type':'application/json'}

def get_property_list_by_city(city, building_type):
    """ Gets a list of properties for a given city, and caches it. """

    # coords = get_coordinates(city)  # Creates bounding box for city
    coords = ["44.9617738","45.5376502","-76.3555857","-75.2465783"] # Ottawa
    max_pages = 1
    current_page = 1
    filename = "data/df_2025.csv"

    # data = pd.DataFrame()
    if os.path.exists(filename):
        results_df = pd.read_csv(filename)
        ## If the queries were interrupted, this will resume from the last page
        current_page = ceil(results_df.shape[0]/200) + 1
        max_pages = current_page + 1
    else:
        results_df = pd.DataFrame()
    while current_page <= max_pages:
        try:
            data = get_property_list(
                coords[0], coords[1], 
                coords[2], coords[3],
                building_type,
                current_page=current_page)
            ## Rounds up the total records by the records per page to nearest int
            max_pages = ceil(data["Paging"]["TotalRecords"]/data["Paging"]["RecordsPerPage"])
            for json in data["Results"]:
                # Use concat instead of append (which is deprecated)
                new_row = pd.json_normalize(json)
                results_df = pd.concat([results_df, new_row], ignore_index=True)

            print("continuing: " + str(current_page))
            # Save after each successful page fetch
            results_df.to_csv(filename, index=False)
            current_page += 1

            sleep(randint(600, 900))  # sleep 10-15 minutes to avoid rate-limit
        except HTTPError:
            print("Error occurred on city: " + city)
            sleep(randint(3000, 3600))  # sleep for 50-60 minutes if limited

    return results_df


# def get_property_details_from_csv(filename):
#     """ Gets the details of a list of properties from the CSV file created above. """
#     results_df = pd.read_csv(filename)
#     if "HasDetails" not in results_df.columns:
#         results_df["HasDetails"] = 0
#     for index, row in results_df.iterrows():
#         if row["HasDetails"] == 1:
#             continue
#         property_id = str(row["Id"])
#         mls_reference_number = str(row["MlsNumber"])
#         try:
#             data = get_property_details(property_id, mls_reference_number)
#             results_df = results_df.join(pd.json_normalize(data), lsuffix='_')
#             results_df.loc[index, 'HasDetails'] = 1
#
#             try:
#                 # Step 1: Read the existing CSV file into a DataFrame
#                 existing_df = pd.read_csv(filename)
#             except FileNotFoundError:
#                 # Handle the case where the file doesn't exist initially
#                 existing_df = pd.DataFrame()
#
#             # Step 2: Append new data
#             results_df = pd.concat([existing_df, results_df])
#
#             # Step 3: Remove redundancy
#             combined_df = results_df.drop_duplicates(subset='Id')
#
#             # Step 4: Save updated dataframe
#             combined_df.to_csv(filename, index=False)
#
#             sleep(randint(600, 900))
#         except HTTPError:
#             print("Error occurred on propertyID: " + property_id)
#             sleep(randint(3000, 3600))
#     return results_df


@app.route('/api/home', methods=['GET'])
def home():
    """
    Home route
    ---
    responses:
      200:
        description: Returns a welcome message
    """
    return jsonify({
        'message': "Welcome to RentalAI API"
    })


@app.route('/api/property', methods=['GET'])
def list_properties():
    """
    List properties cached
    ---
    responses:
      200:
        description: Returns the top 10 properties from MongoDB
    """
    try:
        # Get all property keys
        property_keys = properties_collection.find({}, {'_id': 0})
        properties = []
        
        # Limit to 10 properties for testing
        for key in property_keys[:10]:
            properties.append(key)
        
        return render_template('dataframe.html', records=properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/property/<city>', methods=['GET'])
def update(city):
    # df_new = get_property_details_from_csv(city)
    # BuildingTypeId
    #     1 House
    #     17 Apartment
    houses = 1
    # results_houses = get_property_list_by_city(city, building_type=houses)

    apartments = 17
    result_apartments = get_property_list_by_city(city, building_type=apartments)

    # Check if result_apartments is a DataFrame
    # if isinstance(result_apartments, pd.DataFrame):
    #     # Concatenate the two DataFrames
    #     results_df = pd.concat([results_df, result_apartments], ignore_index=True)
    # else:
    #     print(f"Invalid result type: {type(result_apartments)}")
    #
    # # Convert DataFrame to a list of dictionaries
    # data = results_df.to_json(orient='records')
    #
    # # Convert the data to JSON
    # json_data = json.loads(data)

    # Concatenate DataFrames
    concatenated_df = pd.concat([result_apartments], ignore_index=True)
    # Convert the DataFrame to JSON and return as a response
    json_data = concatenated_df.to_json(orient='records')

    return json_data


@app.route('/api/get_data', methods=['GET'])
def get_data():
    """
    Get all property data
    ---
    responses:
      200:
        description: Returns all property data from MongoDB
    """
    try:
        # Get all properties from MongoDB
        properties = list(properties_collection.find({}, {'_id': 0}))
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



# @app.route('/api/get_prediction', methods=['POST'])
# def get_pred():
#     """
#     Predicts the property price based on input features.

#     ---
#     parameters:
#       - in: body
#         name: body
#         required: true
#         schema:
#           type: object
#           properties:
#             province:
#               type: integer
#               example: 1
#             bedNumb:
#               type: number
#               format: float
#               example: 3
#             storyNumb:
#               type: number
#               format: float
#               example: 2
#             buildingType:
#               type: integer
#               example: 1
#             city:
#               type: string
#               example: "Ottawa"
#             amenities:
#               type: integer
#               example: 1
#             publicTransit:
#               type: integer
#               example: 1
#             recreation:
#               type: integer
#               example: 1
#             shops:
#               type: integer
#               example: 1
#             highway:
#               type: integer
#               example: 1
#             park:
#               type: integer
#               example: 1
#             schools:
#               type: integer
#               example: 1
#             college:
#               type: integer
#               example: 0
#             hospital:
#               type: integer
#               example: 1
#             university:
#               type: integer
#               example: 1
#             hasParking:
#               type: integer
#               example: 1
#             postedDate:
#               type: string
#               format: date
#               example: "2024-01-01"
#             parkingSize:
#               type: integer
#               example: 2
#     responses:
#       200:
#         description: Successful prediction
#         schema:
#           type: object
#           properties:
#             prediction:
#               type: array
#               items:
#                 type: number
#                 format: float
#               example: [450000.0]
#     """
#     data = request.json

#     ProvinceName = int(data['province'])
#     BuildingBedrooms = float(data['bedNumb'])
#     BuildingStoriesTotal = float(data['storyNumb'])
#     BuildingType = int(data['buildingType'])

#     city = data['city']

#     # coords = get_coordinates("Ottawa")  # [latMin, latMax, lonMin, lonMax]
#     # TO FIX, GOT BOUDS FROM API FOR NOW, for ottawa
#     # "boundingbox": [
#     #     "44.9617738",
#     #     "45.5376502",
#     #     "-76.3555857",
#     #     "-75.2465783"
#     # ]
#     coords = ["44.9617738","45.5376502","-76.3555857","-75.2465783"]
#     PropertyAddressLongitude = float(coords[2]) + float(coords[3]) / 2
#     PropertyAddressLatitude = float(coords[0]) + float(coords[1]) / 2

#     hasLaundry = int(data['amenities'])
#     PublicTransit = int(data['publicTransit'])
#     RecreationNearby = int(data['recreation'])
#     Shopping = int(data['shops'])
#     Highway = int(data['highway'])
#     Park = int(data['park'])
#     Schools = int(data['schools'])
#     CEGEP = int(data['college'])
#     Hospital = int(data['hospital'])
#     University = int(data['university'])
#     PropertyParkingType = int(data['hasParking'])

#     postedDate = data['postedDate']

#     Year = int(postedDate.split('-')[0])
#     Month = int(postedDate.split('-')[1])
#     Day = int(postedDate.split('-')[2])

#     ParkingSizeType = int(data['parkingSize'])

#     # Load the model
#     with open('model.pkl', 'rb') as file:
#         model = pickle.load(file)

#     features = [[ProvinceName, BuildingBedrooms, BuildingStoriesTotal,
#                  BuildingType, PropertyAddressLongitude, PropertyAddressLatitude,
#                  hasLaundry, PublicTransit, RecreationNearby, Shopping, Highway,
#                  Park, Schools, CEGEP, Hospital, University, PropertyParkingType,
#                  Year, Month, Day, ParkingSizeType]]

#     prediction = model.predict(features)

#     prediction_list = prediction.tolist()

#     return jsonify({
#         'prediction': prediction_list,
#     })

# Function to save plot to S3
def save_plot_to_s3(plt, filename):
    # Save plot to BytesIO object
    img_data = BytesIO()
    plt.savefig(img_data, format='png', bbox_inches='tight')
    img_data.seek(0)
    
    # Upload to S3
    s3_client.upload_fileobj(
        img_data, 
        S3_BUCKET, 
        filename,
        ExtraArgs={'ContentType': 'image/png'}
    )
    
    # Return the public URL
    return f"https://{S3_BUCKET}.s3.amazonaws.com/{filename}"


@app.route('/api/get_rent_by_month', methods=['GET'])
def plot_rent_prices():
    """
    Monthly average
    ---
    responses:
      200:
        description: Returns the image path of the plot for the Monthly average rental prices
    """
    try:
        # Get all property data from MongoDB
        property_keys = properties_collection.find({}, {'_id': 0})
        properties = []
        
        for key in property_keys:
            properties.append(key)
        
        # Convert to DataFrame
        df = pd.DataFrame(properties)
        
        df['target'] = df['Property.LeaseRentUnformattedValue']

        # Convert 'InsertedDateUTC' to datetime format
        ticks_per_second = 1e7  # 1 tick = 100 nanoseconds, 1 second = 1e7 ticks
        epoch_ticks = 621355968000000000  # Ticks from 0001-01-01 to 1970-01-01

        # Convert 'InsertedDateUTC' to datetime format
        df['InsertedDateUTC'] = pd.to_datetime((df['InsertedDateUTC'] - epoch_ticks) / ticks_per_second, unit='s', utc=True, errors='coerce')

        # Convert to Canada (Eastern Time)
        df['postedDate'] = df['InsertedDateUTC'].dt.tz_convert('America/Toronto')

        # Sort DataFrame by 'postedDate'
        df = df.sort_values(by='postedDate')

        # Plotting
        plt.figure(figsize=(15, 6))
        plt.plot(df['postedDate'], df['target'], marker='o', linestyle='-', color='purple')
        plt.title('Rent Prices Over Time')
        plt.xlabel('Posted Date')
        plt.ylabel('Rent Price')
        plt.grid(True)

        filename = 'rent_prices_plot.png'

        # For production: save to S3
        if os.environ.get('ENVIRONMENT') == 'production':
            image_path = save_plot_to_s3(plt, filename)
            plt.close()
            return jsonify({'image_path': image_path})  
        
        # For local development: save to static folder  
        else:
            # Make sure the static directory exists
            os.makedirs('static', exist_ok=True)
            
            image_path = f'./static/{filename}'
            plt.savefig(image_path) 
            plt.close()
            # Return the local path
            return jsonify({
                'image_path': f"{API_URL}/static/{filename}"
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/api/get_rent_distr', methods=['GET'])
def plot_rent_histo():
    """
    Distribution of rental prices
    ---
    responses:
      200:
        description: Returns the image path of the plot for the distribution of rental prices across all listings
    """
    try:
        # Get all properties from MongoDB
        properties = list(properties_collection.find({}, {'_id': 0}))
        
        # Convert to DataFrame
        df = pd.DataFrame(properties)

        # Assuming 'Property.LeaseRentUnformattedValue' is the column with rental prices
        rental_prices = df['Property.LeaseRentUnformattedValue']

        plt.figure(figsize=(15, 6))
        # Create a histogram to show the distribution of rental prices
        plt.hist(rental_prices, bins=10, edgecolor='black', color='purple')
        plt.title('Distribution of Rental Prices')
        plt.xlabel('Rental Price')
        plt.ylabel('Frequency')

        filename = 'rent_prices_histo.png'

         # For production: save to S3
        if os.environ.get('ENVIRONMENT') == 'production':
            image_path = save_plot_to_s3(plt, filename)
            plt.close()
            return jsonify({'image_path': image_path})
        
        # For local development: save to static folder
        else:
            # Make sure the static directory exists
            os.makedirs('static', exist_ok=True)
            
            image_path = f'./static/{filename}'
            plt.savefig(image_path)
            plt.close()
            
            # Return the local path
            return jsonify({
                'image_path': f"{API_URL}/static/{filename}"
            })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
