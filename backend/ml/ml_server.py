import json
import pickle
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from flasgger import Swagger
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import shap
from pymongo import MongoClient
import os
import boto3
from io import BytesIO

# Use Agg backend for plotting
plt.switch_backend('Agg')

# Get environment variables with defaults for local development
API_URL = os.environ.get('API_URL', 'http://localhost:5000')
ML_API_URL = os.environ.get('ML_API_URL', 'http://localhost:5001')
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:3000')
MONGODB_URI = os.environ.get('MONGODB_URI', 'mongodb://localhost:27017/')

app = Flask(__name__, static_folder='static', static_url_path='/static')
# Configure CORS to allow requests from the frontend
CORS(app, origins=[FRONTEND_URL])
swag = Swagger(app)

# Initialize MongoDB connection
client = MongoClient(MONGODB_URI)
db = client['rentalai_db']
properties_collection = db['properties']
test_collection = db['test_data']

# Initialize S3 client
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.environ.get('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.environ.get('AWS_SECRET_ACCESS_KEY'),
    region_name=os.environ.get('AWS_REGION', 'us-east-1')
)

S3_BUCKET = os.environ.get('S3_BUCKET_NAME', 'rentalai-models')
MODEL_KEY = os.environ.get('MODEL_KEY', 'model.pkl')
S3_IMAGES_BUCKET = os.environ.get('S3_IMAGES_BUCKET', 'rentalai-static-images')

# Function to load model from S3
def load_model_from_s3():
    try:
        # Download model from S3
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=MODEL_KEY)
        model_data = response['Body'].read()
        
        # Load model from bytes
        model = pickle.loads(model_data)
        print(f"Successfully loaded model from S3: {S3_BUCKET}/{MODEL_KEY}")
        return model
    except Exception as e:
        print(f"Error loading model from S3: {e}")
        # Fallback to local model if available
        if os.path.exists('model.pkl'):
            print("Loading local model instead")
            with open('model.pkl', 'rb') as file:
                return pickle.load(file)
        raise

# Function to save plot to S3
def save_plot_to_s3(plt, filename):
    # Save plot to BytesIO object
    img_data = BytesIO()
    plt.savefig(img_data, format='png', bbox_inches='tight')
    img_data.seek(0)
    
    # Upload to S3
    s3_client.upload_fileobj(
        img_data, 
        S3_IMAGES_BUCKET, 
        filename,
        ExtraArgs={'ContentType': 'image/png', 'ACL': 'public-read'}
    )
    
    # Return the public URL
    return f"https://{S3_IMAGES_BUCKET}.s3.amazonaws.com/{filename}"

# Load the model
model = load_model_from_s3()

@app.route('/api/get_prediction', methods=['POST'])
def get_pred():
    """
    Predicts the property price based on input features.

    ---
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            province:
              type: integer
              example: 1
            bedNumb:
              type: number
              format: float
              example: 3
            storyNumb:
              type: number
              format: float
              example: 2
            buildingType:
              type: integer
              example: 1
            city:
              type: string
              example: "Ottawa"
            amenities:
              type: integer
              example: 1
            publicTransit:
              type: integer
              example: 1
            recreation:
              type: integer
              example: 1
            shops:
              type: integer
              example: 1
            highway:
              type: integer
              example: 1
            park:
              type: integer
              example: 1
            schools:
              type: integer
              example: 1
            college:
              type: integer
              example: 0
            hospital:
              type: integer
              example: 1
            university:
              type: integer
              example: 1
            hasParking:
              type: integer
              example: 1
            postedDate:
              type: string
              format: date
              example: "2024-01-01"
            parkingSize:
              type: integer
              example: 2
    responses:
      200:
        description: Successful prediction
        schema:
          type: object
          properties:
            prediction:
              type: array
              items:
                type: number
                format: float
              example: [450000.0]
    """
    data = request.json

    ProvinceName = int(data['province'])
    BuildingBedrooms = float(data['bedNumb'])
    BuildingStoriesTotal = float(data['storyNumb'])
    BuildingType = int(data['buildingType'])

    city = data['city']

    # coords = get_coordinates("Ottawa")  # [latMin, latMax, lonMin, lonMax]
    # TO FIX, GOT BOUDS FROM API FOR NOW, for ottawa
    # "boundingbox": [
    #     "44.9617738",
    #     "45.5376502",
    #     "-76.3555857",
    #     "-75.2465783"
    # ]
    coords = ["44.9617738","45.5376502","-76.3555857","-75.2465783"]
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

@app.route('/api/get_importance', methods=['GET'])
def plot_feat_import():
    """
    Feature Importance
    ---
    responses:
      200:
        description: Returns the image path of the plot for the factors that most influence our rental price prediction
    """
    try:
        # Check if MongoDB is connected
        try:
            # Simple ping to check connection
            client.admin.command('ping')
            print("MongoDB connected successfully")
        except Exception as e:
            print(f"MongoDB connection error: {e}")
            return jsonify({"error": f"MongoDB connection error: {str(e)}"}), 500
            
        # Get test data from MongoDB
        try:
            test_data = list(test_collection.find({}, {'_id': 0}))
            if not test_data:
                print("No test data found in MongoDB")
                return jsonify({"error": "No test data found in MongoDB"}), 500
                
            print(f"Found {len(test_data)} test records")
        except Exception as e:
            print(f"Error retrieving test data: {e}")
            return jsonify({"error": f"Error retrieving test data: {str(e)}"}), 500
        
        # Convert to DataFrame
        test = pd.DataFrame(test_data)
        
        # Check if 'target' column exists
        if 'target' not in test.columns:
            print("'target' column not found in test data")
            return jsonify({"error": "'target' column not found in test data"}), 500
            
        X_test = test.drop('target', axis=1)

        # Fits the explainer
        try:
            explainer = shap.Explainer(model.predict, X_test)
            # Calculates the SHAP values - It takes some time
            shap_values = explainer(X_test)
        except Exception as e:
            print(f"Error in SHAP calculation: {e}")
            return jsonify({"error": f"Error in SHAP calculation: {str(e)}"}), 500

        # Create plot
        try:
            plt.figure()
            shap.plots.beeswarm(shap_values, max_display=10, show=False)
            plt.title('Features Importance (Beeswarm Plot)')
            plt.xlabel('SHAP Value')
            plt.ylabel('Features')
        except Exception as e:
            print(f"Error creating plot: {e}")
            return jsonify({"error": f"Error creating plot: {str(e)}"}), 500

        # Save the plot to S3
        try:
            # Generate a unique filename
            filename = f"rent_feat_import_{int(time.time())}.png"
            
            # For production: save to S3
            if os.environ.get('ENVIRONMENT') == 'production':
                image_url = save_plot_to_s3(plt, filename)
                plt.close()
                return jsonify({'image_path': image_url})
            
            # For local development: save to static folder
            else:
                # Make sure the static directory exists
                os.makedirs('static', exist_ok=True)
                
                image_path = 'static/rent_feat_import.png'
                plt.savefig(image_path, bbox_inches='tight')
                plt.close()
                
                # Return the local path
                return jsonify({
                    'image_path': f"{ML_API_URL}/static/rent_feat_import.png"
                })
                
        except Exception as e:
            print(f"Error saving plot: {e}")
            return jsonify({"error": f"Error saving plot: {str(e)}"}), 500

    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(debug=os.environ.get('DEBUG', 'True').lower() == 'true', 
            host='0.0.0.0', 
            port=port) 