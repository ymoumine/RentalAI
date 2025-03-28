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
    ChevronDownIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

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
            tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
            port: 3000,
            icon: CodeBracketIcon,
            color: "border-blue-500",
            bgColor: "bg-blue-500/10",
            textColor: "text-blue-400"
        },
        {
            name: "Backend API Service",
            description: "Flask API handling data retrieval and processing",
            tech: ["Flask", "Python", "Swagger", "Pandas"],
            port: 5000,
            icon: ServerIcon,
            color: "border-green-500",
            bgColor: "bg-green-500/10",
            textColor: "text-green-400"
        },
        {
            name: "ML Prediction Service",
            description: "Dedicated service for machine learning predictions",
            tech: ["Flask", "Scikit-learn", "NumPy", "Pickle"],
            port: 5001,
            icon: CpuChipIcon,
            color: "border-purple-500",
            bgColor: "bg-purple-500/10",
            textColor: "text-purple-400"
        }
    ];

    // External APIs and data sources
    const externalApis = [
        {
            name: "Realtor API",
            description: "Provides real-time property listings and details",
            usage: "Used to fetch property data which is then cached in CSV files for performance",
            icon: GlobeAltIcon,
            color: "text-amber-400"
        },
        {
            name: "OpenStreetMap",
            description: "Provides mapping and geolocation services",
            usage: "Used to display property locations and enable spatial search functionality",
            icon: GlobeAltIcon,
            color: "text-emerald-400"
        },
        {
            name: "CSV Data Caching",
            description: "Local storage of property data for improved performance",
            usage: "Property data is cached in CSV files to reduce API calls and improve response times",
            icon: ArrowPathIcon,
            color: "text-blue-400"
        }
    ];

    // Project structure with file tree
    const projectStructure = {
        frontend: [
            { path: "components/", description: "Reusable UI components" },
            { path: "components/BudgetMap.tsx", description: "Map component for displaying properties within budget" },
            { path: "components/MapComponent.tsx", description: "OpenStreetMap integration for property visualization" },
            { path: "components/header.tsx", description: "Navigation header component" },
            { path: "pages/", description: "Application routes and pages" },
            { path: "pages/index.tsx", description: "Homepage" },
            { path: "pages/predictions.tsx", description: "Rental price prediction page" },
            { path: "pages/listings/index.tsx", description: "Property listings page" },
            { path: "pages/listings/property/[id].tsx", description: "Individual property details page" },
            { path: "pages/dashboard.tsx", description: "Analytics dashboard" },
            { path: "pages/about/contact.tsx", description: "Developer documentation (this page)" },
        ],
        backend: [
            { path: "app.py", description: "Main Flask application with API endpoints" },
            { path: "realtorAPI.py", description: "Wrapper for the Realtor API" },
            { path: "OttawaON.csv", description: "Cached property listings data" },
            { path: "test_set.csv", description: "Test data for predictions" },
            { path: "requirements.txt", description: "Python dependencies" },
        ],
        ml: [
            { path: "ml_server.py", description: "Dedicated ML prediction service" },
            { path: "ML.ipynb", description: "Jupyter notebook for model development" },
            { path: "model.pkl", description: "Serialized machine learning model" },
        ]
    };

    // Deployment workflow
    const deploymentSteps = [
        {
            title: "Frontend Deployment",
            steps: [
                "Build Next.js application with `npm run build`",
                "Deploy to Vercel, Netlify, or containerize with Docker",
                "Configure environment variables for API endpoints"
            ]
        },
        {
            title: "Backend API Deployment",
            steps: [
                "Package Flask application with dependencies",
                "Deploy to cloud provider (AWS, GCP, Azure) or containerize",
                "Configure CORS and security settings"
            ]
        },
        {
            title: "ML Service Deployment",
            steps: [
                "Package ML service with model artifacts",
                "Deploy as separate service on port 5001",
                "Configure scaling based on prediction load"
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100">
            {/* Header */}
            <header className="bg-gray-900 border-b border-gray-800 py-6 px-4 sticky top-0">
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
                        <a href="#deployment" className="text-gray-300 hover:text-fuchsia-400 transition-colors text-sm">
                            Deployment
                        </a>
                    </nav>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-12">
                {/* Introduction */}
                <section id="architecture" className="mb-16">
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl border border-gray-800 p-8">
                        <h2 className="text-3xl font-bold mb-6 text-white">RentalAI: Microservices Architecture</h2>
                        <p className="text-gray-300 mb-8 max-w-3xl">
                            RentalAI is a rental price prediction platform built with a modern microservices architecture. 
                            The system consists of three main services: a Next.js frontend, a Flask backend API, and a 
                            dedicated ML prediction service. This architecture allows for independent scaling, deployment, 
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
                                    <p className="text-gray-300 mb-4 text-sm">{service.description}</p>
                                    <div className="bg-gray-900/50 rounded p-3">
                                        <p className="text-xs text-gray-400 mb-2">Technologies:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {service.tech.map((tech) => (
                                                <span 
                                                    key={tech} 
                                                    className={`${service.bgColor} px-2 py-1 rounded text-xs ${service.textColor}`}
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="mt-12 bg-gray-900/50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-white mb-6">Architecture Diagram</h3>
                            
                            <div className="flex flex-col items-center">
                                {/* Architecture Diagram */}
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8 w-full">
                                    {/* Frontend */}
                                    <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 text-center w-full md:w-1/4">
                                        <p className="text-blue-300 font-medium">Next.js Frontend</p>
                                        <p className="text-xs text-gray-400 mt-1">Port 3000</p>
                                    </div>
                                    
                                    {/* Arrow down for mobile, right for desktop */}
                                    <div className="md:hidden text-gray-500">↓</div>
                                    <div className="hidden md:block text-gray-500">→</div>
                                    
                                    {/* Backend Services */}
                                    <div className="w-full md:w-2/5">
                                        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 text-center mb-4">
                                            <p className="text-green-300 font-medium">Flask Backend API</p>
                                            <p className="text-xs text-gray-400 mt-1">Port 5000</p>
                                        </div>
                                        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4 text-center">
                                            <p className="text-purple-300 font-medium">ML Prediction Service</p>
                                            <p className="text-xs text-gray-400 mt-1">Port 5001</p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Data Sources */}
                                <div className="mt-8 pt-8 border-t border-gray-700 w-full">
                                    <p className="text-center text-gray-400 mb-4">External Data Sources</p>
                                    <div className="flex flex-col md:flex-row justify-center gap-4">
                                        <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-center">
                                            <p className="text-amber-300 text-sm">Realtor API</p>
                                        </div>
                                        <div className="bg-emerald-900/30 border border-emerald-700 rounded-lg p-3 text-center">
                                            <p className="text-emerald-300 text-sm">OpenStreetMap</p>
                                        </div>
                                        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 text-center">
                                            <p className="text-blue-300 text-sm">CSV Data Cache</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-gray-400 text-sm mt-8 text-center flex flex-col items-center">
                                <p>
                                    The architecture follows a microservices pattern where each component has a specific responsibility.
                                    The frontend communicates with both the main backend API and the ML service for predictions.
                                    Data is fetched from external APIs and cached locally for improved performance.
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
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.frontend ? 'max-h-[500px]' : 'max-h-0'}`}>
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
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.backend ? 'max-h-[500px]' : 'max-h-0'}`}>
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
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expandedSections.ml ? 'max-h-[500px]' : 'max-h-0'}`}>
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
                
            </main>

            <footer className="bg-gray-900 border-t border-gray-800 py-8 px-4">
                <div className="max-w-7xl mx-auto text-center">
                    <p className="text-gray-400 mb-2">
                        RentalAI Documentation - Microservices Architecture
                    </p>
                    <p className="text-gray-500 text-sm">
                        © 2024 RentalAI. Developed with ❤️ by the RentalAI Team.
                    </p>
                </div>
            </footer>
        </div>
    );
}