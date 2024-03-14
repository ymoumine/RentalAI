import Link from "next/link";
import {useEffect, useState} from "react";
import axios from 'axios';

const apiURL = 'http://localhost:5000/api';
const itemsPerPage = 4; // number of items per page
export default function Index() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from your Flask endpoint
        fetch(apiURL+'/get_data')
            .then(response => response.json())
            .then(jsonData => {
                // Parse the JSON string into an array
                //const dataArray = JSON.parse(jsonData);
                console.log(jsonData[1])
                setData(jsonData);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const [currentPage, setCurrentPage] = useState(1);

    // Calculate total number of pages
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Ensure currentPage is within valid range

    // Calculate index range for the current page
    const startIndex = currentPage + itemsPerPage - 5;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // Filter the data to display only items for the current page
    const currentPageData = data.slice(startIndex, endIndex);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <>
            <header className="bg-gray-700 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Rental Listings</h1>
                </div>
            </header>
            <main className="bg-gray-900">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <ul role="list" className="divide-y divide-gray-500">
                        {Array.isArray(data) && data.length > 0 ? (
                            currentPageData.map(param => (
                                <Link key={param['Id']}
                                      className="flex justify-between gap-x-6 py-8 hover:bg-gray-700 rounded-3xl"
                                      href={'listings/property/' + param['Id']}>
                                    <div className="flex min-w-0 gap-x-4 ml-10">
                                        <img className="h-12 w-12 flex-none"
                                             src={"https://www.pinclipart.com/picdir/big/387-3872576_purple-home-5-icon-free-icons-house-with.png"}
                                             alt=""/>
                                        <div className="min-w-0 flex-auto">
                                            <p className="text-md font-semibold leading-6">{param['Property.Address.AddressText']}</p>
                                            <a className="text-md font-semibold leading-5 text-fuchsia-800"
                                               href={"https://www.realtor.ca/" + param['RelativeURLEn']}> See
                                                More...</a>
                                            <p className="mt-1 truncate text-sm leading-5 text-gray-400">{param['ProvinceName']}</p>
                                        </div>
                                    </div>
                                    <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end mr-10">
                                        <p className="text-md leading-6">{param['Property.LeaseRent']}</p>
                                        {param['Building.Bedrooms'] ? (
                                            <p className="mt-1 text-sm leading-5 text-gray-400">
                                                Bedrooms: {param['Building.Bedrooms']}
                                            </p>
                                        ) : (
                                            <div className="mt-1 flex items-center gap-x-1.5">
                                                <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                                                </div>
                                                <p className="text-sm leading-5 text-gray-400">Studio</p>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))) : (
                            <main
                                className="grid min-h-full place-items-center bg-gray-800 px-6 py-24 sm:py-32 lg:px-8">
                                <div className="text-center">
                                    <p className="text-base font-semibold text-fuchsia-700">404</p>
                                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-100 sm:text-5xl">Server
                                        Error</h1>
                                    <p className="mt-6 text-base leading-7 text-gray-300">Sorry, we couldn’t retrieve
                                        any data.</p>
                                    <div className="mt-10 flex items-center justify-center gap-x-6">
                                        <a
                                            href="/home"
                                            className="rounded-md bg-fuchsia-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Go back home
                                        </a>
                                        <a href="/about/contact" className="text-sm font-semibold text-gray-300">
                                            Learn More <span aria-hidden="true">&rarr;</span>
                                        </a>
                                    </div>
                                </div>
                            </main>
                        )}
                    </ul>
                    {/* Pagination controls */}
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-400"
                        >
                            Previous
                        </button>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage >= totalPages}
                            className="px-4 py-2 bg-gray-800 text-white rounded-md disabled:bg-gray-400"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}