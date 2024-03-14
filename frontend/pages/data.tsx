import {useEffect, useState} from "react";

const stats = [
    { id: 1, name: 'Properties listed', value: '100+' },
    { id: 2, name: 'Machine Learning models', value: 'RF, DT, SVC' },
    { id: 3, name: 'Accuracy', value: '+81%' },
];

const apiURL = 'http://localhost:5000/'

export default function Data() {

    const [imagePath1, setImagePath1] = useState('');
    const [imagePath2, setImagePath2] = useState('');
    const [imagePath3, setImagePath3] = useState('');

    useEffect(() => {
        // Make a request to the Flask route to get the image path
        fetch(apiURL+'api/get_rent_by_month')
            .then(response => response.json())
            .then(data => setImagePath1(data.image_path))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        // Make a request to the Flask route to get the image path
        fetch(apiURL+'api/get_rent_distr')
            .then(response => response.json())
            .then(data => setImagePath2(data.image_path))
            .catch(error => console.error('Error:', error));
    }, []);

    useEffect(() => {
        // Make a request to the Flask route to get the image path
        fetch(apiURL+'api/get_importance')
            .then(response => response.json())
            .then(data => setImagePath3(data.image_path))
            .catch(error => console.error('Error:', error));
    }, []);

    return (
        <>
            <header className="bg-gray-700 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Platform Insights</h1>
                </div>
            </header>
            <main className="bg-gray-900">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div className="bg-white py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                                {stats.map((stat) => (
                                    <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                                        <dt className="text-base leading-7 text-black">{stat.name}</dt>
                                        <dd className="order-first text-3xl font-semibold tracking-tight text-fuchsia-700 sm:text-5xl">
                                            {stat.value}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </div>
                    </div>
                    <div className="flex justify-content-center">
                        {imagePath1 && <img src={apiURL + imagePath1} alt="Rent Prices Over Time"/>}
                    </div>

                    <div className="flex justify-content-center">
                        {imagePath2 && <img src={apiURL + imagePath2} alt="Rent Prices Ditribution"/>}
                    </div>

                    <div className="ml-36">
                        {imagePath3 && <img src={apiURL + imagePath3} alt="Important Features in our Predictions"/>}
                    </div>
                </div>
            </main>
        </>
    );
}
