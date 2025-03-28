import { useState, useRef, useEffect } from "react";
import BudgetMap from '../components/BudgetMap';
import { 
  HomeIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

const apiURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const mlApiURL = process.env.NEXT_PUBLIC_ML_API_URL || 'http://localhost:5001/api';

export default function Predictions() {
  const [bedNumb, setBed] = useState(1);
  const [storyNumb, setStory] = useState(1);
  const [city, setCity] = useState("");
  const [province, setProvince] = useState(0);
  const [buildingType, setBuildingType] = useState(0);
  const [amenities, setAmenities] = useState(7);
  const [publicTransit, setPublicTransit] = useState(false);
  const [recreation, setRecreation] = useState(false);
  const [shops, setShops] = useState(false);
  const [highway, setHighway] = useState(false);
  const [park, setPark] = useState(false);
  const [schools, setSchools] = useState(false);
  const [college, setCollege] = useState(false);
  const [hospital, setHospital] = useState(false);
  const [university, setUniversity] = useState(false);
  const [hasParking, setParking] = useState(false);
  const [parkingSize, setParkingSize] = useState(0);
  const [postedDate, setPostedDate] = useState("2024-01-01");

  const [predictionResult, setPredictionResult] = useState(0);
  const [minPredictionResult, setMinPredictionResult] = useState(0);
  const [maxPredictionResult, setMaxPredictionResult] = useState(0);
  const [accuracyResult, setAccuracyResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [listings, setListings] = useState([]);
  const [showMap, setShowMap] = useState(false);
  
  // Reference to the map section for scrolling
  const mapSectionRef = useRef<HTMLDivElement>(null);

  // Handle form input changes
  const handleBedChange = (e: { target: { value: string } }) => {
    setBed(parseInt(e.target.value, 10) || 0);
  };

  const handleStoryChange = (e: { target: { value: string } }) => {
    setStory(parseInt(e.target.value, 10) || 0);
  };

  const handleCityChange = (e: { target: { value: string } }) => {
    setCity(e.target.value);
  };

  const handleProvinceChange = (e: { target: { value: string } }) => {
    setProvince(parseInt(e.target.value, 10) || 0);
  };

  const handleBuildingTypeChange = (e: { target: { value: string } }) => {
    setBuildingType(parseInt(e.target.value, 10) || 0);
  };

  const handleAmenitiesChange = (e: { target: { value: string } }) => {
    setAmenities(parseInt(e.target.value, 10) || 0);
  };

  const handlePublicTransitCheckboxChange = (e: { target: { checked: boolean } }) => {
    setPublicTransit(e.target.checked);
  };

  const handleRecreationCheckboxChange = (e: { target: { checked: boolean } }) => {
    setRecreation(e.target.checked);
  };

  const handleShopsCheckboxChange = (e: { target: { checked: boolean } }) => {
    setShops(e.target.checked);
  };

  const handleHighwayCheckboxChange = (e: { target: { checked: boolean } }) => {
    setHighway(e.target.checked);
  };

  const handleParkCheckboxChange = (e: { target: { checked: boolean } }) => {
    setPark(e.target.checked);
  };

  const handleSchoolsCheckboxChange = (e: { target: { checked: boolean } }) => {
    setSchools(e.target.checked);
  };

  const handleCollegeCheckboxChange = (e: { target: { checked: boolean } }) => {
    setCollege(e.target.checked);
  };

  const handleHospitalCheckboxChange = (e: { target: { checked: boolean } }) => {
    setHospital(e.target.checked);
  };

  const handleUniversityCheckboxChange = (e: { target: { checked: boolean } }) => {
    setUniversity(e.target.checked);
  };

  const handleParkingCheckboxChange = (e: { target: { checked: boolean } }) => {
    setParking(e.target.checked);
  };

  const handleParkingSizeChange = (e: { target: { value: string } }) => {
    setParkingSize(parseInt(e.target.value, 10) || 0);
  };

  const handlePostedDateChange = (e: { target: { value: string } }) => {
    setPostedDate(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      bedNumb,
      storyNumb,
      city,
      province,
      buildingType,
      amenities,
      publicTransit,
      recreation,
      shops,
      highway,
      park,
      schools,
      college,
      hospital,
      university,
      hasParking,
      parkingSize,
      postedDate,
    };

    try {
      const response = await fetch(`${mlApiURL}/get_prediction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const res:{prediction: any, accuracy: any} = await response.json();

        let targetPrice = res.prediction;
        setPredictionResult(targetPrice);
        setMinPredictionResult(targetPrice - 200);
        setMaxPredictionResult(targetPrice + 200);
        setAccuracyResult(res.accuracy);
        
        // Fetch listings after prediction is successful
        fetchListings();
      } else {
        console.error("Failed to send form data to Flask backend");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error while sending form data:", error);
      setIsLoading(false);
    }
  }
  
  // Separate function to fetch listings
  const fetchListings = () => {
    fetch(apiURL+'/get_data')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text(); // Get response as text first
      })
      .then(textData => {
        let data;
        
        // Try to parse the text data
        try {
          // Clean the string data to handle invalid JSON values
          const cleanedData = textData
            .replace(/: NaN/g, ': null')
            .replace(/: Infinity/g, ': null')
            .replace(/: -Infinity/g, ': null');
            
          data = JSON.parse(cleanedData);
          
          // Handle different data formats
          if (Array.isArray(data)) {
            setListings(data);
          } else if (data && typeof data === 'object') {
            // If data is an object that contains an array
            const listingsArray = data.listings || data.properties || [];
            setListings(listingsArray);
          } else {
            console.error('Unexpected data format:', typeof data);
            setListings([]);
          }
        } catch (e) {
          console.error('Error parsing listings data:', e);
          console.log('Raw data sample:', textData.substring(0, 200) + '...');
          setListings([]);
        }
        
        setShowMap(true);
        setIsLoading(false);
        
        // Scroll to map section after data is loaded
        const slowScrollToRef = () => {
          if (!mapSectionRef.current) return;
        
          const targetPosition = mapSectionRef.current.getBoundingClientRect().top + window.scrollY;
          const startPosition = window.scrollY;
          const distance = targetPosition - startPosition;
          const duration = 1000; // Adjust for slower or faster speed (1000ms = 1s)
          let startTime = null;
        
          const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
          };
        
          const animationStep = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const elapsedTime = currentTime - startTime;
            const nextScroll = easeInOutQuad(elapsedTime, startPosition, distance, duration);
        
            window.scrollTo(0, nextScroll);
        
            if (elapsedTime < duration) {
              requestAnimationFrame(animationStep);
            }
          };
        
          requestAnimationFrame(animationStep);
        };
        
        // Use a delay if necessary
        setTimeout(slowScrollToRef, 100);
        

      })
      .catch(error => {
        console.error('Error fetching listings:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-800 shadow-md">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <CurrencyDollarIcon className="h-8 w-8 text-fuchsia-500" />
            Rental Predictions
          </h1>
          <p className="mt-2 text-gray-400">Find your perfect rental based on your preferences</p>
        </div>
      </header>
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <HomeIcon className="h-6 w-6 text-fuchsia-500" />
              Enter Your Rental Preferences
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pl-20 pt-5 flex items-center">
                {/* Property Details Section */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                    <BuildingOfficeIcon className="h-5 w-5 text-fuchsia-500" />
                    Property Details
                  </h3>
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-300 ">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    name="bedrooms"
                    value={bedNumb}
                    onChange={handleBedChange}
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm "
                  >
                    <option value={1}>1 Bedroom</option>
                    <option value={2}>2 Bedrooms</option>
                    <option value={3}>3 Bedrooms</option>
                    <option value={4}>4 Bedrooms</option>
                    <option value={5}>5+ Bedrooms</option>
                  </select>
                </div>
                
                {/* Stories */}
                <div>
                  <label htmlFor="stories" className="block text-sm font-medium text-gray-300">
                    Stories
                  </label>
                  <select
                    id="stories"
                    name="stories"
                    value={storyNumb}
                    onChange={handleStoryChange}
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  >
                    <option value={1}>1 Story</option>
                    <option value={2}>2 Stories</option>
                    <option value={3}>3 Stories</option>
                    <option value={4}>4+ Stories</option>
                  </select>
                </div>
                
                {/* Building Type */}
                <div>
                  <label htmlFor="buildingType" className="block text-sm font-medium text-gray-300">
                    Building Type
                  </label>
                  <select
                    id="buildingType"
                    name="buildingType"
                    value={buildingType}
                    onChange={handleBuildingTypeChange}
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  >
                    <option value={0}>Apartment</option>
                    <option value={1}>House</option>
                  </select>
                </div>
                
                {/* Location Section */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                    <MapPinIcon className="h-5 w-5 text-fuchsia-500" />
                    Location
                  </h3>
                </div>
                
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-300">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    id="city"
                    value={city}
                    onChange={handleCityChange}
                    placeholder="e.g. Toronto"
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  />
                </div>
                
                {/* Province */}
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-300">
                    Province
                  </label>
                  <select
                    id="province"
                    name="province"
                    value={province}
                    onChange={handleProvinceChange}
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  >
                    <option value={0}>Ontario</option>
                    <option value={1}>Quebec</option>
                  </select>
                </div>
                
                {/* Amenities Section */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                    <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                    Amenities & Features
                  </h3>
                </div>
                
                {/* Amenities */}
                <div>
                  <label htmlFor="amenities" className="block text-sm font-medium text-gray-300">
                    Laundry
                  </label>
                  <select
                    id="amenities"
                    name="amenities"
                    value={amenities}
                    onChange={handleAmenitiesChange}
                    className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  >
                    <option value={0}>None</option>
                    <option value={1}>In Building</option>
                    <option value={2}>In Unit</option>
                    <option value={3}>Hookups</option>
                  </select>
                </div>
                
                {/* Parking */}
                <div>
                  <label htmlFor="parking" className="block text-sm font-medium text-gray-300">
                    Parking
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      id="parking"
                      name="parking"
                      type="checkbox"
                      checked={hasParking}
                      onChange={handleParkingCheckboxChange}
                      className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                    />
                    <label htmlFor="parking" className="ml-2 block text-sm text-gray-300">
                      Has Parking
                    </label>
                  </div>
                </div>
                
                {/* Parking Size (only show if hasParking is true) */}
                {hasParking && (
                  <div>
                    <label htmlFor="parkingSize" className="block text-sm font-medium text-gray-300">
                      Parking Size
                    </label>
                    <select
                      id="parkingSize"
                      name="parkingSize"
                      value={parkingSize}
                      onChange={handleParkingSizeChange}
                      className="mt-1 block w-3/4 rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                    >
                      <option value={1}>Small (0-5 spots)</option>
                      <option value={2}>Medium (6-10 spots)</option>
                      <option value={3}>Large (10+ spots)</option>
                    </select>
                  </div>
                )}
                
                {/* Nearby Features */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 pt-5">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nearby Features
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="flex items-center">
                      <input
                        id="publicTransit"
                        name="publicTransit"
                        type="checkbox"
                        checked={publicTransit}
                        onChange={handlePublicTransitCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="publicTransit" className="ml-2 block text-sm text-gray-300">
                        Public Transit
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="recreation"
                        name="recreation"
                        type="checkbox"
                        checked={recreation}
                        onChange={handleRecreationCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="recreation" className="ml-2 block text-sm text-gray-300">
                        Recreation
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="shops"
                        name="shops"
                        type="checkbox"
                        checked={shops}
                        onChange={handleShopsCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="shops" className="ml-2 block text-sm text-gray-300">
                        Shopping
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="highway"
                        name="highway"
                        type="checkbox"
                        checked={highway}
                        onChange={handleHighwayCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="highway" className="ml-2 block text-sm text-gray-300">
                        Highway
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="park"
                        name="park"
                        type="checkbox"
                        checked={park}
                        onChange={handleParkCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="park" className="ml-2 block text-sm text-gray-300">
                        Park
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="schools"
                        name="schools"
                        type="checkbox"
                        checked={schools}
                        onChange={handleSchoolsCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="schools" className="ml-2 block text-sm text-gray-300">
                        Schools
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="college"
                        name="college"
                        type="checkbox"
                        checked={college}
                        onChange={handleCollegeCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="college" className="ml-2 block text-sm text-gray-300">
                        College
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="hospital"
                        name="hospital"
                        type="checkbox"
                        checked={hospital}
                        onChange={handleHospitalCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="hospital" className="ml-2 block text-sm text-gray-300">
                        Hospital
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="university"
                        name="university"
                        type="checkbox"
                        checked={university}
                        onChange={handleUniversityCheckboxChange}
                        className="h-4 w-4 rounded border-gray-600 text-fuchsia-600 focus:ring-fuchsia-500"
                      />
                      <label htmlFor="university" className="ml-2 block text-sm text-gray-300">
                        University
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-6">
                  <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
                    <CalendarIcon className="h-5 w-5 text-fuchsia-500" />
                    Listing Date
                  </h3>
                </div> */}
                
                {/* Posted Date */}
                {/* <div>
                  <label htmlFor="postedDate" className="block text-sm font-medium text-gray-300">
                    Posted Date
                  </label>
                  <input
                    type="date"
                    name="postedDate"
                    id="postedDate"
                    value={postedDate}
                    onChange={handlePostedDateChange}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 text-white shadow-sm focus:border-fuchsia-500 focus:ring-fuchsia-500 sm:text-sm"
                  />
                </div> */}
                
                {/* Submit Button */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-3 mt-8">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full sm:w-auto px-6 py-3 rounded-md text-white font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fuchsia-500 ${
                      isLoading 
                        ? 'bg-gray-600 cursor-not-allowed' 
                        : 'bg-fuchsia-600 hover:bg-fuchsia-700'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Predicting...
                      </div>
                    ) : (
                      'Predict Rental Price'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Prediction Result */}
          {predictionResult !== 0 && (
            <div className="bg-gray-700 px-6 py-8 border-t border-gray-600 ">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Your Predicted Budget</h3>
                  <p className="text-gray-300 text-sm">Based on your preferences, we recommend this budget range</p>
                </div>
                <div className="bg-gray-800 rounded-lg px-6 py-4 shadow-inner mt-4 sm:mt-0">
                  <p className="text-fuchsia-400 text-sm font-medium">Estimated Monthly Rent</p>
                  <p className="text-3xl font-bold text-white">${minPredictionResult} - ${maxPredictionResult}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Map Section */}
        {predictionResult !== 0 && (
          <div className="mt-2" ref={mapSectionRef}>
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="px-6 py-8">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <MapPinIcon className="h-6 w-6 text-fuchsia-500" />
                  Properties Within Your Budget
                </h2>
                
                {showMap ? (
                  <BudgetMap 
                    minBudget={minPredictionResult} 
                    maxBudget={maxPredictionResult} 
                    listings={listings} 
                  />
                ) : (
                  <div className="flex justify-center items-center py-16 bg-gray-700 rounded-lg">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                    <p className="ml-4 text-fuchsia-500 font-medium">Loading properties...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}