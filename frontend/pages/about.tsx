import { useState } from 'react';
import { 
    CodeBracketIcon, 
    ServerIcon, 
    DocumentTextIcon,
    CpuChipIcon,
    GlobeAltIcon,
    ArrowPathIcon,
    CloudArrowUpIcon,
    CommandLineIcon,
    CubeTransparentIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    DocumentMagnifyingGlassIcon,
    PhotoIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function DevDocumentation() {
    // State for expandable sections
    const [expandedSections, setExpandedSections] = useState({
        frontend: false,
        backend: false,
        ml: false,
        data: false
    });

    // Toggle section expansion
    const toggleSection = (section: string) => {
        setExpandedSections(prevState => ({
            ...prevState,
            [section]: !prevState[section as keyof typeof prevState]
        }));
    };

    // Microservices architecture components
    const microservices = [
        {
            name: "Frontend Service",
            description: "Next.js application serving the user interface",
            tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Hooks"],
            port: 3000,
            icon: CodeBracketIcon,
            color: "border-blue-500",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-400"
        },
        {
            name: "Backend API Service",
            description: "Flask API handling data retrieval and processing",
            tech: ["Flask", "Python", "Swagger", "Pandas", "CORS"],
            port: 5000,
            icon: ServerIcon,
            color: "border-green-500",
            bgColor: "bg-green-500/10",
            textColor: "text-green-400"
        },
        {
            name: "ML Prediction Service",
            description: "Dedicated service for machine learning predictions",
            tech: ["Flask", "Scikit-learn", "NumPy", "Pickle", "Jupyter Notebook", "Swagger", "CORS"],
            port: 5001,
            icon: CpuChipIcon,
            color: "border-purple-500",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-400"
        },
        {
            name: "MongoDB",
            description: "Database for storing test and property data",
            tech: ["MongoDB", "NoSQL"],
            color: "border-red-500",
            bgColor: "bg-red-500/10",
            icon: DocumentMagnifyingGlassIcon,
            textColor: "text-red-400"
        },
        {
            name: "AWS S3 Storage",
            description: "Cloud storage for images and charts",
            tech: ["AWS S3", "Bucket"],
            color: "border-orange-500",
            bgColor: "bg-orange-500/10",
            textColor: "text-orange-400",
            icon: CloudArrowUpIcon
        },
        {
            name: "API Wrapper",
            description: "Wrapper of external APIs for fetching property data",
            tech: ["Realtor API", "OpenStreetMap"],
            icon: GlobeAltIcon,
            color: "border-yellow-500",
            bgColor: "bg-yellow-500/10",
            textColor: "text-yellow-400"
        }
    ];

    // External APIs and data sources
    const externalApis = [
        {
            name: "Realtor API",
            description: "Provides real-time property listings and details",
            usage: "Used wrapper to fetch property data which is then stored in CSV files, later used for initial seeding of the database",
            icon: GlobeAltIcon,
            color: "text-amber-400"
        },
        {
            name: "OpenStreetMap",
            description: "Provides mapping and geolocation services",
            usage: "Used for the realtor API wrapper to get properties within a set of coordinates",
            icon: GlobeAltIcon,
            color: "text-emerald-400"
        }
    ];

    // Project structure with file tree
    const projectStructure = {
        frontend: [
            { path: "components/BudgetMap.tsx", description: "Map component for displaying properties within budget" },
            { path: "components/MapComponent.tsx", description: "OpenStreetMap integration for property visualization" },
            { path: "components/header.tsx", description: "Navigation header component with user menu" },
            { path: "pages/index.tsx", description: "Homepage with landing image from S3" },
            { path: "pages/predictions.tsx", description: "Rental price prediction page" },
            { path: "pages/listings/index.tsx", description: "Property listings page with search and filtering" },
            { path: "pages/listings/property/[id].tsx", description: "Individual property details page" },
            { path: "pages/dashboard.tsx", description: "Analytics dashboard with charts from S3" },
            { path: "pages/about.tsx", description: "Developer documentation (this page)" },
            { path: "next.config.mjs", description: "Next.js configuration with image domains" },
        ],
        backend: [
            { path: "data/df_set.csv", description: "Main dataset for property listings" },
            { path: "external/realtorAPI.py", description: "Wrapper for the Realtor API" },
            { path: "static/rent_prices_histo.png", description: "Rent distribution histogram" },
            { path: "static/rent_prices_plot.png", description: "Rent prices over time chart" },
            { path: "templates/dataframe.html", description: "Template for displaying property data" },
            { path: "app.py", description: "Main Flask application with API endpoints" },
            { path: "requirements.txt", description: "Python dependencies" },
        ],
        ml: [
            { path: "data/test_set.csv", description: "Test data for predictions and feature importance" },
            { path: "static/rent_feat_import.png", description: "Feature importance visualization" },
            { path: "ml_server.py", description: "Dedicated ML prediction service" },
            { path: "ML.ipynb", description: "Jupyter notebook for model development" },
            { path: "model.pkl", description: "Serialized machine learning model" },
        ]
    };

    // API Endpoints
    const apiEndpoints = [
        {
            service: "Backend API",
            endpoints: [
                { path: "/api/get_data", description: "Retrieves property listings" },
                { path: "/api/get_rent_by_month", description: "Returns rent prices over time chart" },
                { path: "/api/get_rent_distr", description: "Returns rent distribution chart" },
            ]
        },
        {
            service: "ML Service",
            endpoints: [
                { path: "/api/get_prediction", description: "Predicts rental price based on input features" },
                { path: "/api/get_importance", description: "Returns feature importance visualization" },
                { path: "/api/get_test_data", description: "Retrieves test data from MongoDB" },
            ]
        }
    ];

    const BACKEND_URL = process.env.BACKEND_URL;
    const ML_API_URL = process.env.ML_API_URL;

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 py-6 px-4 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
                        <CommandLineIcon className="h-8 w-8 text-fuchsia-500" />
                        <span>RentalAI Developer Documentation</span>
                    </h1>
                    <nav className="flex flex-wrap gap-4">
                        <a href="#architecture" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-sm">
                            Architecture
                        </a>
                        <a href="#data-sources" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-sm">
                            Data Sources
                        </a>
                        <a href="#project-structure" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-sm">
                            Project Structure
                        </a>
                        <a href="#api-endpoints" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-sm">
                            API Endpoints
                        </a>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section id="architecture" className="mb-16">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-8">
                        <h2 className="text-3xl font-bold mb-6 text-white">RentalAI: Microservices Architecture</h2>
                        <p className="text-gray-300 mb-8">
                            RentalAI is a rental price prediction platform built with a modern microservices architecture. 
                            The system consists of three main services: a Next.js frontend, a Flask backend API, a 
                            dedicated ML prediction service, a MongoDB database, and a AWS S3 storage, as well as a wrapper for the Realtor API. This architecture allows for independent scaling, deployment, 
                            and maintenance of each component.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {microservices.map((service) => (
                                <div 
                                    key={service.name} 
                                    className={`rounded-lg border ${service.color} ${service.bgColor} p-6 transition-all hover:scale-105`}
                                >
                                    <div className="flex items-center mb-4">
                                        <service.icon className={`h-6 w-6 ${service.textColor} mr-3`} />
                                        <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                                    </div>
                                    <p className="text-gray-300 mb-4">{service.description}</p>
                                    <div className="bg-gray-800 bg-opacity-50 rounded-lg p-3">
                                        <p className="text-sm text-gray-400 mb-2">Used:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {service.tech.map((tech) => (
                                                <span 
                                                    key={tech} 
                                                    className={`px-2 py-1 rounded-md text-xs font-medium ${service.textColor} bg-gray-800`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Architecture Diagram */}
                        <div className="mt-12 bg-gray-900 rounded-xl border border-gray-800 p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">System Architecture Diagram</h3>
                            
                            <div className="relative w-full h-[500px] bg-gray-950 rounded-lg p-4">
                                <svg className="w-full h-full" viewBox="0 0 1000 500" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    {/* Background Grid */}
                                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1f2937" strokeWidth="0.5" />
                                    </pattern>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                    
                                    {/* Frontend Service Node */}
                                    <g className="frontend-node">
                                        <rect x="400" y="30" width="200" height="100" rx="8" fill="#1e3a8a" fillOpacity="0.2" stroke="#3b82f6" strokeWidth="2" />
                                        <text x="500" y="60" textAnchor="middle" fill="#3b82f6" fontWeight="bold">Frontend Service</text>
                                        <text x="500" y="80" textAnchor="middle" fill="#9ca3af" fontSize="12">Next.js</text>
                                        <text x="500" y="100" textAnchor="middle" fill="#9ca3af" fontSize="12">React, TypeScript, Tailwind</text>
                                    </g>
                                    
                                    {/* Backend API Service Node */}
                                    <g className="backend-node">
                                        <rect x="150" y="280" width="200" height="100" rx="8" fill="#065f46" fillOpacity="0.2" stroke="#10b981" strokeWidth="2" />
                                        <text x="250" y="310" textAnchor="middle" fill="#10b981" fontWeight="bold">Backend API Service</text>
                                        <text x="250" y="330" textAnchor="middle" fill="#9ca3af" fontSize="12">Flask</text>
                                        <text x="250" y="350" textAnchor="middle" fill="#9ca3af" fontSize="12">Python, Pandas, Swagger</text>
                                    </g>
                                    
                                    {/* ML Service Node */}
                                    <g className="ml-node">
                                        <rect x="650" y="280" width="200" height="100" rx="8" fill="#5b21b6" fillOpacity="0.2" stroke="#8b5cf6" strokeWidth="2" />
                                        <text x="750" y="310" textAnchor="middle" fill="#8b5cf6" fontWeight="bold">ML Prediction Service</text>
                                        <text x="750" y="330" textAnchor="middle" fill="#9ca3af" fontSize="12">Flask, Pickle</text>
                                        <text x="750" y="350" textAnchor="middle" fill="#9ca3af" fontSize="12">Scikit-learn, SHAP, Random Forest</text>
                                    </g>
                                    
                                    {/* S3 Storage Node */}
                                    <g className="s3-node">
                                        <rect x="820" y="80" width="150" height="80" rx="8" fill="#92400e" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                                        <text x="895" y="110" textAnchor="middle" fill="#f59e0b" fontWeight="bold">AWS S3</text>
                                        <text x="895" y="130" textAnchor="middle" fill="#9ca3af" fontSize="12">Image Storage</text>
                                        <text x="895" y="150" textAnchor="middle" fill="#9ca3af" fontSize="12">Visualizations</text>
                                    </g>
                                    
                                    {/* MongoDB Node */}
                                    <g className="mongodb-node">
                                        <rect x="30" y="80" width="150" height="80" rx="8" fill="#7f1d1d" fillOpacity="0.2" stroke="#ef4444" strokeWidth="2" />
                                        <text x="105" y="110" textAnchor="middle" fill="#ef4444" fontWeight="bold">MongoDB</text>
                                        <text x="105" y="130" textAnchor="middle" fill="#9ca3af" fontSize="12">Test Data</text>
                                        <text x="105" y="150" textAnchor="middle" fill="#9ca3af" fontSize="12">Property Records</text>
                                    </g>
                                    
                                    {/* Curved Connection Paths */}
                                    {/* Frontend to Backend API */}
                                    <path d="M 450 130 C 400 180, 350 230, 250 280" stroke="#10b981" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="320" y="270" textAnchor="middle" fill="#d1d5db" fontSize="10">GET /api/get_data</text>
                                    
                                    {/* Frontend to Backend for S3 paths */}
                                    <path d="M 400 130 C 350 180, 300 230, 200 280" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="360" y="150" textAnchor="middle" fill="#d1d5db" fontSize="10">GET /api/get_image_paths</text>
                                    
                                    {/* Frontend to ML Service */}
                                    <path d="M 550 130 C 600 180, 650 230, 750 280" stroke="#5b21b6" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="630" y="150" textAnchor="middle" fill="#d1d5db" fontSize="10">POST /api/get_prediction</text>
                                    
                                    {/* Backend to S3 */}
                                    <path d="M 350 330 C 500 250, 700 180, 820 120" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="580" y="230" textAnchor="middle" fill="#d1d5db" fontSize="10">Fetch/Store Charts</text>
                                    
                                    {/* ML Service to S3 */}
                                    <path d="M 850 330 C 860 270, 865 210, 870 160" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="880" y="250" textAnchor="middle" fill="#d1d5db" fontSize="10">Fetch/Store Visualizations</text>
                                    
                                    {/* ML Service to MongoDB */}
                                    <path d="M 650 330 C 500 250, 300 180, 180 120" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="420" y="230" textAnchor="middle" fill="#d1d5db" fontSize="10">Seed/Fetch Test Data</text>
                                    
                                    {/* Backend to MongoDB */}
                                    <path d="M 150 300 C 130 250, 110 200, 100 160" stroke="#ef4444" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="110" y="230" textAnchor="middle" fill="#d1d5db" fontSize="10">Seed Property Data</text>
                                    <text x="110" y="240" textAnchor="middle" fill="#d1d5db" fontSize="10">(server start-up)</text>

                                    {/* API Wrapper */}
                                    <path d="M 250 380 L 250 420" stroke="yellow" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                                    <text x="250" y="440" textAnchor="middle" fill="yellow" fontWeight="bold">API Wrapper</text>
                                </svg>
                                
                                {/* Legend */}
                                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-900/80 rounded-lg p-2 flex gap-4 text-xs">
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-blue-400 mr-1"></span>
                                        <span className="text-blue-300">Frontend</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-green-400 mr-1"></span>
                                        <span className="text-green-300">Backend API</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-purple-400 mr-1"></span>
                                        <span className="text-purple-300">ML Service</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-amber-400 mr-1"></span>
                                        <span className="text-amber-300">S3 Storage</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="inline-block w-3 h-3 rounded-full bg-red-400 mr-1"></span>
                                        <span className="text-red-300">MongoDB</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-gray-400 text-sm mt-8 text-center flex flex-col items-center">
                                <p>
                                    The architecture follows a microservices pattern where each component has a specific responsibility.
                                    The frontend communicates with both the main backend API and the ML service for predictions.
                                    Data visualizations are stored in AWS S3 for efficient delivery, while MongoDB stores test and property data for the ML service.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* Data Sources */}
                <section id="data-sources" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <GlobeAltIcon className="h-6 w-6 text-fuchsia-500" />
                        External APIs & Data Sources
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-20">
                        {externalApis.map((api) => (
                            <div key={api.name} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                                <div className="flex items-center mb-4">
                                    <api.icon className={`h-6 w-6 ${api.color} mr-3`} />
                                    <h3 className="text-xl font-semibold text-white">{api.name}</h3>
                                </div>
                                <p className="text-gray-300 mb-4">{api.description}</p>
                                <div className="bg-gray-800 rounded p-4">
                                    <p className="text-sm text-gray-400">
                                        <span className="text-fuchsia-400 font-medium">Implementation: </span>
                                        {api.usage}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
                {/* Project Structure */}
                <section id="project-structure" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <DocumentTextIcon className="h-6 w-6 text-fuchsia-500" />
                        Project Structure
                    </h2>
                    
                    <div className="flex flex-col space-y-6">
                        {/* Frontend Structure */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-auto">
                            <button 
                                onClick={() => toggleSection('frontend')}
                                className="w-full flex items-center justify-between"
                                type="button"
                                aria-expanded={expandedSections.frontend}
                            >
                                <div className="flex items-center">
                                    <CodeBracketIcon className="h-5 w-5 text-blue-400 mr-3" />
                                    <h3 className="text-xl font-semibold text-white">Frontend</h3>
                                </div>
                                {expandedSections.frontend ? (
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.frontend ? 'max-h-[500px] overflow-y-auto' : 'max-h-0'}`}>
                                <div className="pl-4 border-l border-gray-700 mt-4 space-y-3">
                                    {projectStructure.frontend.map((item) => (
                                        <div key={item.path} className="group">
                                            <p className="text-blue-300 font-mono text-sm">{item.path}</p>
                                            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* Backend Structure */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-auto">
                            <button 
                                onClick={() => toggleSection('backend')}
                                className="w-full flex items-center justify-between"
                                type="button"
                                aria-expanded={expandedSections.backend}
                            >
                                <div className="flex items-center">
                                    <ServerIcon className="h-5 w-5 text-green-400 mr-3" />
                                    <h3 className="text-xl font-semibold text-white">Backend API</h3>
                                </div>
                                {expandedSections.backend ? (
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.backend ? 'max-h-[500px] overflow-y-auto' : 'max-h-0'}`}>
                                <div className="pl-4 border-l border-gray-700 mt-4 space-y-3">
                                    {projectStructure.backend.map((item) => (
                                        <div key={item.path} className="group">
                                            <p className="text-green-300 font-mono text-sm">{item.path}</p>
                                            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        {/* ML Service Structure */}
                        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 h-auto">
                            <button 
                                onClick={() => toggleSection('ml')}
                                className="w-full flex items-center justify-between"
                                type="button"
                                aria-expanded={expandedSections.ml}
                            >
                                <div className="flex items-center">
                                    <CpuChipIcon className="h-5 w-5 text-purple-400 mr-3" />
                                    <h3 className="text-xl font-semibold text-white">ML Service</h3>
                                </div>
                                {expandedSections.ml ? (
                                    <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <ChevronRightIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.ml ? 'max-h-[500px] overflow-y-auto' : 'max-h-0'}`}>
                                <div className="pl-4 border-l border-gray-700 mt-4 space-y-3">
                                    {projectStructure.ml.map((item) => (
                                        <div key={item.path} className="group">
                                            <p className="text-purple-300 font-mono text-sm">{item.path}</p>
                                            <p className="text-gray-400 text-xs group-hover:text-gray-300 transition-colors">
                                                {item.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* API Endpoints */}
                <section id="api-endpoints" className="mb-16">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <ServerIcon className="h-6 w-6 text-fuchsia-500" />
                        API Endpoints
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {apiEndpoints.map((service) => (
                            <div key={service.service} className="bg-gray-900 rounded-xl border border-gray-800 p-6">
                                <h3 className="text-xl font-semibold text-white mb-4">{service.service}</h3>
                                <div className="space-y-3">
                                    {service.endpoints.map((endpoint) => (
                                        <div key={endpoint.path} className="bg-gray-800 rounded-lg p-3">
                                            <p className="text-fuchsia-400 font-mono text-sm">{endpoint.path}</p>
                                            <p className="text-gray-400 text-xs mt-1">{endpoint.description}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 flex gap-4">
                                    <a href={`${ service.service === 'Backend API' ? BACKEND_URL : ML_API_URL}/documentation/swagger`} target="_blank" className="text-green-400 hover:text-green-300 flex items-center">
                                        <DocumentTextIcon className="h-4 w-4 mr-1" />
                                        {service.service} Documentation
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
                
            </main>

            {/* <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 mb-2">
                        RentalAI Documentation - Microservices Architecture
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2024 RentalAI. Developed with ❤️ by the RentalAI Team.
                    </p>
                </div>
            </footer> */}
        </div>
    );
}