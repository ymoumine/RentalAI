import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  HomeIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhotoIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

const apiURL = 'http://localhost:5000/api';

export default function Id() {
    const router = useRouter();
    const id = Number(router.query.id);
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        axios.get(`${apiURL}/get_data`)
            .then(response => {
                let properties = [];
                
                // Handle different response formats
                if (typeof response.data === 'string') {
                    try {
                        // Clean and parse the string as JSON
                        const cleanedData = response.data
                            .replace(/: NaN/g, ': null')
                            .replace(/: Infinity/g, ': null')
                            .replace(/: -Infinity/g, ': null');
                            
                        const parsedData = JSON.parse(cleanedData);
                        
                        // Check if parsed data is an array
                        if (Array.isArray(parsedData)) {
                            properties = parsedData;
                        } else {
                            // If parsed data is an object that contains an array
                            properties = parsedData.listings || parsedData.properties || [];
                        }
                    } catch (e) {
                        console.error('Error parsing string data:', e);
                        console.log('Raw data sample:', response.data.substring(0, 200) + '...');
                        properties = [];
                        setError("Error parsing property data");
                    }
                } else if (Array.isArray(response.data)) {
                    properties = response.data;
                } else {
                    // If response.data is not an array but has a property that contains the array
                    properties = response.data.listings || response.data.properties || [];
                }
                
                console.log("Properties count:", properties.length);
                const foundProperty = properties.find(item => item && item.Id === id);
                
                if (foundProperty) {
                    console.log("Found property:", foundProperty.Id);
                    setProperty(foundProperty);
                } else {
                    console.error("Property not found with ID:", id);
                    setError("Property not found");
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("API Error:", error);
                setError("Error loading property details");
                setLoading(false);
            });
    }, [id]);

    // handle bedroom calculation
    const handBedroomNumber = (bedroom: string) => {
      // param is a string : 1 || 1 + 0 eg.
      if (bedroom.includes('+')) {
          const parts = bedroom.split('+');
          bedroom = (Number(parts[0]) + Number(parts[1])).toString();
      }

      return bedroom
    }

    // Helper function to check if a feature exists
    const hasFeature = (feature) => {
        if (!property || !property['Property.AmmenitiesNearBy']) return false;
        return property['Property.AmmenitiesNearBy'].includes(feature);
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href="/listings" className="text-white hover:text-fuchsia-400 transition-colors">
                            <ArrowLeftIcon className="h-6 w-6" />
                        </Link>
                        <h1 className="text-3xl font-bold text-white">Property Details</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                        <p className="ml-4 text-fuchsia-500 font-medium">Loading property details...</p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-900 text-white p-6 rounded-lg">
                        <p className="text-lg">{error}</p>
                        <Link href="/listings" className="mt-4 inline-block px-4 py-2 bg-fuchsia-600 text-white rounded-md hover:bg-fuchsia-700 transition-colors">
                            Back to Listings
                        </Link>
                    </div>
                )}

                {/* Property Details */}
                {!loading && !error && property && (
                    <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        {/* Property Header */}
                        <div className="relative">
                            <div className="h-64 sm:h-80 bg-gray-700">
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-700">
                                    {property['Building.Type'] ? (
                                        <>
                                            <PhotoIcon className="h-16 w-16 text-gray-500 mb-2" />
                                            <div className="text-center px-4">
                                                <p className="text-xl font-semibold text-white">{property['Building.Type']}</p>
                                                <p className="text-gray-400">{handBedroomNumber(property['Building.Bedrooms'])} Bedroom{handBedroomNumber(property['Building.Bedrooms']) !== '1' ? 's' : ''}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <BuildingOfficeIcon className="h-24 w-24 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 to-transparent p-6">
                                <h2 className="text-2xl font-bold text-white">{property['Property.Address.AddressText']}</h2>
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="p-6">
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                                    <CurrencyDollarIcon className="h-6 w-6 text-fuchsia-500" />
                                    <div>
                                        <p className="text-sm text-gray-400">Monthly Rent</p>
                                        <p className="text-xl font-bold text-white">{property['Property.LeaseRent'] || 'Contact for price'}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                                    <HomeIcon className="h-6 w-6 text-fuchsia-500" />
                                    <div>
                                        <p className="text-sm text-gray-400">Property Type</p>
                                        <p className="text-xl font-bold text-white">{property['Building.Type'] || 'Not specified'}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-400">Bedrooms</p>
                                        <p className="text-xl font-bold text-white">{handBedroomNumber(property['Building.Bedrooms']) || 'Not specified'}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-3">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm text-gray-400">Bathrooms</p>
                                        <p className="text-xl font-bold text-white">{property['Building.BathroomTotal'] || 'Not specified'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {property['PublicRemarks'] && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
                                    <p className="text-gray-300 whitespace-pre-line">{property['PublicRemarks']}</p>
                                </div>
                            )}

                            {/* Features */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-4">Features & Amenities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className={`flex items-center gap-2 ${hasFeature('Public Transit') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Public Transit') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Public Transit</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-2 ${hasFeature('Recreation') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Recreation') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Recreation</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-2 ${hasFeature('Shopping') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Shopping') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Shopping</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-2 ${hasFeature('Highway') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Highway') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Highway</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-2 ${hasFeature('Park') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Park') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Park</span>
                                    </div>
                                    
                                    <div className={`flex items-center gap-2 ${hasFeature('Schools') ? 'text-white' : 'text-gray-500'}`}>
                                        {hasFeature('Schools') ? (
                                            <CheckCircleIcon className="h-5 w-5 text-fuchsia-500" />
                                        ) : (
                                            <XCircleIcon className="h-5 w-5 text-gray-500" />
                                        )}
                                        <span>Schools</span>
                                    </div>
                                </div>
                            </div>

                            {/* Location */}
                            {property['Property.Address.Latitude'] && property['Property.Address.Longitude'] && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold text-white mb-4">Location</h3>
                                    <div className="h-64 bg-gray-700 rounded-lg overflow-hidden">
                                        <iframe 
                                            width="100%" 
                                            height="100%" 
                                            frameBorder="0" 
                                            scrolling="no" 
                                            marginHeight={0} 
                                            marginWidth={0} 
                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${property['Property.Address.Longitude']-0.01},${property['Property.Address.Latitude']-0.01},${property['Property.Address.Longitude']+0.01},${property['Property.Address.Latitude']+0.01}&layer=mapnik&marker=${property['Property.Address.Latitude']},${property['Property.Address.Longitude']}`}
                                            style={{ border: 0 }}
                                        ></iframe>
                                    </div>
                                </div>
                            )}
                        </div>
                </div>
                )}
            </main>
        </div>
    );
}