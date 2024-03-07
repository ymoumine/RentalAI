import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import React, {SetStateAction, useEffect, useState} from "react";

const apiURL = 'http://localhost:5000/api';

export default function Listings() {
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

    const [predictionResult, setPredictionResult] = useState(null);
    const [accuracyResult, setAccuracyResult] = useState("");

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

    const handleCollegeCheckboxChange = (e: { target: { checked: boolean } }) => {
        setCollege(e.target.checked);
    };

    const handleHospitalCheckboxChange = (e: { target: { checked: boolean } }) => {
        setHospital(e.target.checked);
    };

    const handleUniversityCheckboxChange = (e: { target: { checked: boolean } }) => {
        setUniversity(e.target.checked);
    };

    const handleSchoolsCheckboxChange = (e: { target: { checked: boolean } }) => {
        setSchools(e.target.checked);
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

        console.log(formData)

        try {
            const response = await fetch(apiURL+'/get_prediction', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const res:{prediction: any, accuracy: any} = await response.json();

                setPredictionResult(res.prediction);
                setAccuracyResult(res.accuracy);

                console.log("Form data successfully sent to Flask backend");
                // Reset the form or handle success as needed
            } else {
                console.error("Failed to send form data to Flask backend");
            }
        } catch (error) {
            console.error("Error while sending form data:", error);
        }
    }

    return (
        <>
            <header className="bg-gray-700 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Rental Predictions</h1>
                </div>
            </header>
            <main className="bg-gray-900">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-12">

                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base font-semibold text-white">Predict your perfect rental:</h2>

                                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-6">

                                    {/* Used to calculate PropertyAddressLongitude & PropertyAddressLatitude */}
                                    <div className="sm:col-span-2">
                                        <label htmlFor="country"
                                               className="block text-sm font-medium leading-6 text-gray-300">
                                            City
                                        </label>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                name="first-name"
                                                id="first-name"
                                                autoComplete="given-name"
                                                onChange={handleCityChange}
                                                className="block text-black w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder: focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            />
                                        </div>
                                    </div>

                                    {/* ProvinceName */}
                                    <div className="sm:col-span-2">
                                        <label htmlFor="country"
                                               className="block text-sm font-medium leading-6 text-gray-300">
                                            Province
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="country"
                                                name="country"
                                                autoComplete="country-name"
                                                onChange={handleProvinceChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value={0}>Ontario</option>
                                                <option value={1}>Quebec</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2 flex justify-content-center">

                                        <div className="px-2">
                                            {/*BuildingBedrooms*/}
                                            <label htmlFor="country"
                                                   className="block text-sm font-medium leading-6 text-gray-300">
                                                Bedrooms
                                            </label>
                                            <input
                                                className="quantity text-black"
                                                id="id_form-0-quantity"
                                                name="form-0-quantity"
                                                min={1}
                                                max={9}
                                                type="number"
                                                value={bedNumb}
                                                onChange={handleBedChange}
                                            />
                                        </div>

                                        {/*BuildingStoriesTotal*/}
                                        <div className="px-2">
                                            <label htmlFor="country"
                                                   className="block text-sm font-medium leading-6 text-gray-300">
                                                Stories
                                            </label>
                                            <input
                                                className="quantity text-black"
                                                id="id_form-0-quantity"
                                                name="form-0-quantity"
                                                min={1}
                                                max={5}
                                                type="number"
                                                value={storyNumb}
                                                onChange={handleStoryChange}
                                            />
                                        </div>
                                    </div>

                                    {/*BuildingType*/}
                                    <div className="sm:col-span-3">
                                        <label htmlFor="country"
                                               className="block text-sm font-medium leading-6 text-gray-300">
                                            Building Type
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="country"
                                                name="country"
                                                autoComplete="country-name"
                                                onChange={handleBuildingTypeChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value={0}>Apartment</option>
                                                <option value={1}>Home</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* hasLaundry */}
                                    <div className="sm:col-span-2">
                                        <label htmlFor="country"
                                               className="block text-sm font-medium leading-6 text-gray-300">
                                            In Site Ameneties
                                        </label>
                                        <div className="mt-2">
                                            <select
                                                id="country"
                                                name="country"
                                                autoComplete="country-name"
                                                onChange={handleAmenitiesChange}
                                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                            >
                                                <option value={7}>None</option>
                                                <option value={1}>Furnished, Laundry Facility</option>
                                                <option value={2}>Laundry - In Suite</option>
                                                <option value={3}>Laundry - In Suite, Exercise Centre</option>
                                                <option value={4}>Laundry Facility</option>
                                                <option value={5}>Party Room, Laundry Facility, Exercise Centre</option>
                                                <option value={6}>Storage - Locker</option>

                                                <option>Exercise Centre</option>
                                            </select>
                                        </div>
                                    </div>


                                    <div className="sm:col-span-4">
                                        <label htmlFor="country"
                                               className="block text-sm font-medium leading-6 text-gray-300">
                                            Ammenities Near by:
                                        </label>

                                        {/*PublicTransit*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    PublicTransit
                                                </label>
                                            </div>

                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handlePublicTransitCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*RecreationNearby*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Recreation
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleRecreationCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Shopping*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Shops
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleShopsCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Highway*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Highway
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleHighwayCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Park*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Park
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleParkCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Schools*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Schools
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleSchoolsCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*CEGEP*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    College
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleCollegeCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Hospital*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Hospital
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleHospitalCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*University*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    University
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleUniversityCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                        {/*Property.ParkingType*/}
                                        <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                            <div className="sm:col-span-2">
                                                <label htmlFor="country"
                                                       className="text-sm font-medium leading-6 text-gray-400 pr-10">
                                                    Parking
                                                </label>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <input
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    type="checkbox"
                                                    onChange={handleParkingCheckboxChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-600"
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {/*ParkingSizeType*/}
                                    <div className="sm:col-span-4 grid grid-cols-1 gap-x-6 sm:grid-cols-6">
                                        <div className="sm:col-span-2">
                                            <label htmlFor="country"
                                                   className="block text-sm font-medium leading-6 text-gray-300">
                                                Parking Size
                                            </label>
                                            <div className="mt-2">
                                                <select
                                                    id="country"
                                                    name="country"
                                                    autoComplete="country-name"
                                                    onChange={handleParkingSizeChange}
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                                >
                                                    <option value={0}>None</option>
                                                    <option value={1}>Small (0-5)</option>
                                                    <option value={2}>Big (6-10)</option>
                                                    <option value={3}>Huge ({'>'}10)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/*Year & Month & Day*/}
                                        <div className="sm:col-span-2 pl-20">
                                            <label htmlFor="calendarDate"
                                                   className="block text-sm font-medium leading-5 text-gray-300">
                                                Posted:
                                            </label>
                                            <input id="calendarDate" name="calendarDate" type="date"
                                                   value={postedDate}
                                                   onChange={handlePostedDateChange}
                                                   className="mt-2 p-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 sm:text-sm sm:leading-5"/>
                                        </div>

                                        <div className="flex items-center justify-end gap-x-6 sm:col-span-2 ml-10">
                                            <button
                                                type="submit"
                                                className="rounded-md bg-fuchsia-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {predictionResult !== null && (
                                    <div className="mt-4 text-fuchsia-500">
                                        <p style={{fontSize: '1.5em'}}>Prediction Result: ${predictionResult}</p>
                                        <p style={{fontSize: '1.5em'}}>Result Accuracy: {parseFloat(accuracyResult).toFixed(2)}%</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}