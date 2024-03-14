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
from realtorAPI import get_coordinates, get_property_list, get_property_details
import matplotlib.pyplot as plt
import shap
import plotly.express as px
from tqdm import tqdm
from sklearn.metrics import accuracy_score, mean_squared_error, r2_score, mean_absolute_error

app = Flask(__name__)
CORS(app)

""" Wrapper the queries module to get property data from realtor.ca. """


# Handle OPTIONS requests (preflight)
# @app.route('/', methods=['OPTIONS'])
# def handle_options():
#     return '', 200, {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*','Content-Type':'application/json'}

def get_property_list_by_city(city, building_type):
    """ Gets a list of properties for a given city, and returns it as a CSV file. """

    coords = get_coordinates(city)  # Creates bounding box for city
    max_pages = 1
    current_page = 1
    filename = "OttawaON.csv"

    data = pd.DataFrame()
    if os.path.exists(filename):
        results_df = pd.read_csv(filename)
        ## If the queries were interrupted, this will resume from the last page
        # current_page = ceil(results_df.shape[0]/200) + 1
        # max_pages = current_page + 1
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
            max_pages = ceil(data["Paging"]["TotalRecords"] / data["Paging"]["RecordsPerPage"])
            for json in data["Results"]:
                results_df = results_df._append(pd.json_normalize(json), ignore_index=True)

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
    return jsonify({
        'message': "total_pages"
    })


@app.route('/api/property', methods=['GET'])
def list():
    try:
        # Step 1: Read the existing CSV file into a DataFrame
        results_df = pd.read_csv("OttawaON.csv")
    except FileNotFoundError:
        # Handle the case where the file doesn't exist initially
        results_df = pd.DataFrame()

    records = results_df.head(10).to_json(orient='records')  # Limit to 10 records for testing
    records_json = json.loads(records)
    # print(records[1])
    return render_template('dataframe.html', records=records_json)


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
    # Assuming `results_df` is your DataFrame
    try:
        # Step 1: Read the existing CSV file into a DataFrame
        results_df = pd.read_csv("OttawaON.csv")
    except FileNotFoundError:
        # Handle the case where the file doesn't exist initially
        results_df = pd.DataFrame()

    results_df = results_df.where(pd.notna(results_df), None)

    # Convert DataFrame to a list of dictionaries
    data = results_df.to_json(orient='records')

    # Convert the data to JSON
    json_data = json.loads(data)

    return json_data


@app.route('/api/get_prediction', methods=['POST'])
def get_pred():
    data = request.json

    ProvinceName = int(data['province'])
    BuildingBedrooms = float(data['bedNumb'])
    BuildingStoriesTotal = float(data['storyNumb'])
    BuildingType = int(data['buildingType'])

    city = data['city']
    coords = get_coordinates(city)  # [latMin, latMax, lonMin, lonMax]
    PropertyAddressLongitude = float(coords[2]) + float(coords[3]) / 2
    PropertyAddressLatitude = float(coords[0]) + float(coords[1]) / 2

    hasLaundry = int(data['amenities'])
    PublicTransit = int(data['publicTransit'])
    RecreationNearby = int(data['recreation'])
    Shopping = int(data['shops'])
    Highway = int(data['highway'])
    Park = int(data['park'])
    Schools = int(data['schools'])
    CEGEP = int(data['college'])
    Hospital = int(data['hospital'])
    University = int(data['university'])
    PropertyParkingType = int(data['hasParking'])

    postedDate = data['postedDate']

    Year = int(postedDate.split('-')[0])
    Month = int(postedDate.split('-')[1])
    Day = int(postedDate.split('-')[2])

    ParkingSizeType = int(data['parkingSize'])

    # Load the model
    with open('model.pkl', 'rb') as file:
        model = pickle.load(file)

    features = [[ProvinceName, BuildingBedrooms, BuildingStoriesTotal,
                 BuildingType, PropertyAddressLongitude, PropertyAddressLatitude,
                 hasLaundry, PublicTransit, RecreationNearby, Shopping, Highway,
                 Park, Schools, CEGEP, Hospital, University, PropertyParkingType,
                 Year, Month, Day, ParkingSizeType]]

    prediction = model.predict(features)

    prediction_list = prediction.tolist()

    return jsonify({
        'prediction': prediction_list,
    })


@app.route('/api/get_rent_by_month', methods=['GET'])
def plot_rent_prices():
    # Assuming you have a DataFrame with columns 'postedDate' and 'target' (rent prices)
    df = pd.read_csv('OttawaON.csv')

    df['target'] = df['Property.LeaseRentUnformattedValue']

    # Convert 'InsertedDateUTC' to datetime format

    # 'InsertedDateUTC' is in ticks
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

    # Save the plot as an image
    image_path = 'static/rent_prices_plot.png'
    plt.savefig(image_path)

    return jsonify({
        'image_path': image_path
    })

@app.route('/api/get_rent_distr', methods=['GET'])
def plot_rent_histo():

    df = pd.read_csv('OttawaON.csv')

    # Assuming 'Property.LeaseRentUnformattedValue' is the column with rental prices
    rental_prices = df['Property.LeaseRentUnformattedValue']

    plt.figure(figsize=(15, 6))
    # Create a histogram to show the distribution of rental prices
    plt.hist(rental_prices, bins=10, edgecolor='black', color='purple')
    plt.title('Distribution of Rental Prices')
    plt.xlabel('Rental Price')
    plt.ylabel('Frequency')

    # Save the plot as an image
    image_path = 'static/rent_prices_histo.png'
    plt.savefig(image_path)
    plt.close()  # Close the plot to avoid displaying it

    return jsonify({
        'image_path': image_path
    })

@app.route('/api/get_importance', methods=['GET'])
def plot_feat_import():

    # Load the model
    with open('model.pkl', 'rb') as file:
        model = pickle.load(file)

    test = pd.read_csv('test_set.csv')
    X_test = test.drop('target', axis=1)

    # Fits the explainer
    explainer = shap.Explainer(model.predict, X_test)
    # Calculates the SHAP values - It takes some time
    shap_values = explainer(X_test)

    # Calculate average absolute SHAP values for each feature
    mean_shap_values = np.abs(shap_values.values).mean(axis=0)

    plt.figure()

    shap.plots.beeswarm(shap_values, max_display=X_test.shape[1], show=False) # Plot feature importances

    plt.title('Features Importance (Beeswarm Plot)')
    plt.xlabel('SHAP Value')
    plt.ylabel('Features')

    # Save the plot as an image
    image_path = 'static/rent_feat_import.png'
    plt.savefig(image_path,bbox_inches='tight')
    plt.close()  # Close the plot to avoid displaying it

    return jsonify({
        'image_path': image_path
    })


if __name__ == '__main__':
    app.run(debug=True, port=5000)
