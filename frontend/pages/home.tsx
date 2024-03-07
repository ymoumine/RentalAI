import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid';

const features = [
    {
        name: 'Find the perfect rent.',
        description:
            'Discover your ideal rental property with accurate predictions based on your criteria and preferences.',
        icon: CloudArrowUpIcon,
    },
    {
        name: 'Secure and reliable.',
        description: 'Enjoy a secure and reliable platform with advanced SSL certificates to protect your information.',
        icon: LockClosedIcon,
    },
    {
        name: 'Data-driven predictions.',
        description: 'Benefit from database backups and data-driven insights to make informed rental decisions.',
        icon: ServerIcon,
    },
];

export default function Home() {
    return (
        <>
            <header className="bg-gray-700 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Rental AI</h1>
                </div>
            </header>
            <main className="bg-gray-900">
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <div
                        className="relative isolate overflow-hidden bg-gray-900 px-6 pt-16 shadow-2xl sm:rounded-3xl sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
                        <svg
                            viewBox="0 0 1024 1024"
                            className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0"
                            aria-hidden="true"
                        >
                            <circle cx={512} cy={512} r={512} fill="url(#759c1415-0410-454c-8f7c-9a820de03641)"
                                    fillOpacity="0.7"/>
                            <defs>
                                <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
                                    <stop stopColor="#7775D6"/>
                                    <stop offset={1} stopColor="#E935C1"/>
                                </radialGradient>
                            </defs>
                        </svg>
                        <div
                            className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-12 lg:text-left">
                            <h2 className="text-base font-semibold leading-7 text-fuchsia-700">Find Your Ideal Rent</h2>
                            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">A
                                Smarter Way to Rent</p>
                            <p className="mt-6 text-lg leading-8 text-gray-300">
                                Discover the perfect rental property that meets your criteria and preferences. Our
                                platform
                                uses advanced predictions to help you make informed decisions.
                            </p>
                            <dl className="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-300 lg:max-w-none">
                                {features.map((feature) => (
                                    <div key={feature.name} className="relative pl-9">
                                        <dt className="inline font-semibold text-fuchsia-700">
                                            <feature.icon
                                                className="absolute left-1 top-1 h-5 w-5 text-fuchsia-700"
                                                aria-hidden="true"/>
                                            {feature.name}
                                        </dt>
                                        {' '}
                                        <dd className="inline">{feature.description}</dd>
                                    </div>
                                ))}
                            </dl>
                    </div>
                <div className="relative mt-16 h-80 lg:mt-8">
                    <img
                        src="https://www.matellio.com/blog/wp-content/uploads/2022/09/How-Can-Machine-Learning-Applications-in-Real-Estate-Beneficial-768x384.jpg"
                        alt="Product screenshot"
                        className="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10 md:hue-rotate-60 pr-36"
                        width={1824}
                        height={1080}
                    />
                </div>
                    </div>
                </div>
            </main>
        </>
)
;
}
