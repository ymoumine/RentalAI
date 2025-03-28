import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios';
import { 
  BuildingOfficeIcon, 
  MagnifyingGlassIcon, 
  ArrowsUpDownIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  BedIcon,
  BathIcon,
  HomeIcon,
  MapPinIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { number, string } from "yup";

const apiURL = 'http://localhost:5000/api';
const itemsPerPage = 8; // Number of items per page

export default function Listings() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('price-asc'); // Default sort by price ascending
    const [imageErrors, setImageErrors] = useState({});

    useEffect(() => {
        setLoading(true);
        axios.get(apiURL+'/get_data')
            .then(response => {
                console.log('API Response:', response.data);
                
                // Check if response.data is a string (possibly JSON)
                if (typeof response.data === 'string') {
                    try {
                        // Try to clean and parse the string as JSON
                        // Replace NaN with null to make it valid JSON
                        const cleanedData = response.data
                            .replace(/: NaN/g, ': null')
                            .replace(/: Infinity/g, ': null')
                            .replace(/: -Infinity/g, ': null');
                            
                        const parsedData = JSON.parse(cleanedData);
                        console.log('Parsed string data:', parsedData);
                        
                        // Check if parsed data is an array
                        if (Array.isArray(parsedData)) {
                            processData(parsedData);
                        } else {
                            // If parsed data is an object that contains an array
                            const dataArray = parsedData.listings || parsedData.properties || [];
                            processData(dataArray);
                        }
                    } catch (e) {
                        console.error('Error parsing string data:', e);
                        console.log('Raw data sample:', response.data.substring(0, 200) + '...');
                        setData([]);
                    }
                    setLoading(false);
                    return;
                }
                
                // Check if response.data is an array
                if (!Array.isArray(response.data)) {
                    console.error('Expected array but got:', typeof response.data);
                    // If response.data is not an array but has a property that contains the array
                    const dataArray = response.data.listings || response.data.properties || [];
                    processData(dataArray);
                    setLoading(false);
                    return;
                }
                
                // Process array data
                processData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('API Error:', error);
                setError(error);
                setLoading(false);
            });
    }, []);

    // Helper function to process data
    const processData = (rawData) => {
        // Add a unique index to each item to use as a key
        const dataWithUniqueKeys = (rawData || []).map((item, index) => ({
            ...item,
            _uniqueIndex: index // Add a unique index property
        }));
        
        // Remove any duplicates based on Id
        const uniqueData = [];
        const idSet = new Set();
        
        dataWithUniqueKeys.forEach(item => {
            if (item.Id && !idSet.has(item.Id)) {
                idSet.add(item.Id);
                uniqueData.push(item);
            } else if (!item.Id) {
                // If no Id exists, use the unique index as identifier
                uniqueData.push(item);
            }
        });
        
        console.log('Processed data:', uniqueData);
        setData(uniqueData);
    };

    // handle bedroom calculation
    const handBedroomNumber = (bedroom: string) => {
        // param is a string : 1 || 1 + 0 eg.
        if (bedroom.includes('+')) {
            const parts = bedroom.split('+');
            bedroom = (Number(parts[0]) + Number(parts[1])).toString();
        }

        return bedroom
    }

    const filteredData = data.filter(item => {
        // Check if item is valid before accessing properties
        if (!item) return false;
        
        const address = item['Property.Address.AddressText'] || '';
        const price = item['Property.LeaseRent'] || '';
        const bedrooms = item['Building.Bedrooms'] || '';
        const buildingType = item['Building.Type'] || '';
        
        const searchString = `${address} ${price} ${bedrooms} ${buildingType}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    // Sort data based on sortBy value
    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'price-asc') {
            return extractPrice(a['Property.LeaseRent'] || '0') - extractPrice(b['Property.LeaseRent'] || '0');
        } else if (sortBy === 'price-desc') {
            return extractPrice(b['Property.LeaseRent'] || '0') - extractPrice(a['Property.LeaseRent'] || '0');
        } else if (sortBy === 'bedrooms-asc') {
            return parseInt(a['Building.Bedrooms'] || '0', 10) - parseInt(b['Building.Bedrooms'] || '0', 10);
        } else if (sortBy === 'bedrooms-desc') {
            return parseInt(b['Building.Bedrooms'] || '0', 10) - parseInt(a['Building.Bedrooms'] || '0', 10);
        }
        return 0;
    });

    // Paginate data
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

    // Helper function to extract numeric price from string
    function extractPrice(priceString) {
        const match = priceString.match(/\$?([\d,]+)/);
        if (match) {
            return parseInt(match[1].replace(/,/g, ''), 10);
        }
        return 0;
    }

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="bg-gray-900 min-h-screen">
            <header className="bg-gray-800 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                        <BuildingOfficeIcon className="h-8 w-8 text-fuchsia-500" />
                        Available Properties
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500"></div>
                        <p className="ml-4 text-fuchsia-500 font-medium">Loading properties...</p>
                    </div>
                ) : (
                    <>
                        {/* Search and Filter */}
                        <div className="mb-8 bg-gray-800 rounded-xl p-6 shadow-lg">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                        placeholder="Search by address, price, bedrooms..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <div className="w-full md:w-64">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <ArrowsUpDownIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-md leading-5 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:border-fuchsia-500"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="price-asc">Price: Low to High</option>
                                            <option value="price-desc">Price: High to Low</option>
                                            <option value="bedrooms-asc">Bedrooms: Low to High</option>
                                            <option value="bedrooms-desc">Bedrooms: High to Low</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-gray-400 text-sm">
                                Showing {paginatedData.length} of {filteredData.length} properties
                            </div>
                        </div>

                        {/* Property Grid */}
                        {paginatedData.length === 0 ? (
                            <div className="bg-gray-800 rounded-lg p-8 text-center">
                                <BuildingOfficeIcon className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                                <h3 className="text-xl font-medium text-white mb-2">No properties found</h3>
                                <p className="text-gray-400">Try adjusting your search criteria</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {paginatedData.map((listing) => (
                                    <Link 
                                        href={`/listings/property/${listing.Id}`}
                                        key={`listing-${listing._uniqueIndex}`}
                                        className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
                                    >
                                        <div className="h-48 bg-gray-700 relative">
                                            <div className="w-full h-full flex flex-col items-center justify-center">
                                                <PhotoIcon className="h-12 w-12 text-gray-500 mb-2" />
                                                <div className="text-center px-4">
                                                    <p className="text-gray-400">{listing['Building.Type'] || 'Property'}</p>
                                                    <p className="text-gray-500 text-sm">{handBedroomNumber(listing['Building.Bedrooms']) || '0'} BR</p>
                                                </div>
                                            </div>
                                            <div className="absolute top-0 right-0 bg-fuchsia-600 text-white px-3 py-1 m-2 rounded-md font-medium">
                                                {listing['Property.LeaseRent'] || 'Contact'}
                                            </div>
                                        </div>
                                        <div className="p-4 flex-1 flex flex-col">
                                            <h3 className="text-white font-medium text-lg mb-2 line-clamp-1">{listing['Property.Address.AddressText']}</h3>
                                            <div className="text-gray-400 mb-4 line-clamp-2">
                                                {listing['PublicRemarks'] ? (
                                                    listing['PublicRemarks'].substring(0, 100) + (listing['PublicRemarks'].length > 100 ? '...' : '')
                                                ) : (
                                                    'No description available'
                                                )}
                                            </div>
                                            <div className="mt-auto flex items-center text-gray-300 text-sm">
                                                <div className="flex items-center mr-4">
                                                    <HomeIcon className="h-4 w-4 mr-1 text-fuchsia-500" />
                                                    <span>{handBedroomNumber(listing['Building.Bedrooms']) || '0'} BR</span>
                                                </div>
                                                <div className="flex items-center">
                                                    <MapPinIcon className="h-4 w-4 mr-1 text-fuchsia-500" />
                                                    <span>{listing['PostalCode']}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-8">
                                <nav className="flex items-center gap-1">
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className={`p-2 rounded-md ${
                                            currentPage === 1 
                                                ? 'text-gray-500 cursor-not-allowed' 
                                                : 'text-white hover:bg-gray-700'
                                        }`}
                                    >
                                        <ChevronLeftIcon className="h-5 w-5" />
                                    </button>
                                    
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i + 1}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`px-3 py-1 rounded-md ${
                                                currentPage === i + 1
                                                    ? 'bg-fuchsia-600 text-white'
                                                    : 'text-gray-300 hover:bg-gray-700'
                                            }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                    
                                    <button
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className={`p-2 rounded-md ${
                                            currentPage === totalPages 
                                                ? 'text-gray-500 cursor-not-allowed' 
                                                : 'text-white hover:bg-gray-700'
                                        }`}
                                    >
                                        <ChevronRightIcon className="h-5 w-5" />
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}
