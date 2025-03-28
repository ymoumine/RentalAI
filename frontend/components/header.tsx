import {Fragment} from 'react'
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import Link from 'next/link';
import {usePathname} from "next/navigation";
import {
    ChartPieIcon,
    ChevronDownIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    ArrowPathIcon,
    ArrowLeftEndOnRectangleIcon,
    UserIcon,
    InboxIcon,
    HomeIcon,
    BuildingOfficeIcon,
    CommandLineIcon,
    MapIcon,
    ChartBarIcon,
    DocumentTextIcon,
    CurrencyDollarIcon
} from "@heroicons/react/20/solid";

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://www.kindpng.com/picc/m/259-2590523_circle-profile-picture-tumblr-moon-purple-png-transparent.png',
}

// Navigation routes with icons
const listRoutes = [
    {name: 'Home', href: '/', icon: HomeIcon},
    {name: 'Dashboard', href: '/dashboard', icon: ChartBarIcon},
    {name: 'Listings', href: '/listings', icon: BuildingOfficeIcon},
    {name: 'Predictions', href: '/predictions', icon: MapIcon},
    {name: 'About', href: '/about', icon: CommandLineIcon},
]

// Replace userNavigation with buyMeCoffee
const buyMeCoffee = {
    name: 'Buy Me a Coffee',
    href: 'https://www.buymeacoffee.com/ymoumine', // Replace with your actual username
    icon: CurrencyDollarIcon
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

export default function Header() {
    const pathname = usePathname();

    return (
        <div className="min-h-full">
            <Disclosure as="nav" className="bg-gray-900 shadow-lg">
                {({open}) => (
                    <>
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="flex h-16 items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <Link href="/" className="flex items-center">
                                            <span className="text-fuchsia-500 font-bold text-xl">Rental</span>
                                            <span className="text-white font-bold text-xl">AI</span>
                                        </Link>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-10 flex items-baseline space-x-4">
                                            {listRoutes.map((route) => (
                                                <Link
                                                    key={route.name}
                                                    href={route.href}
                                                    className={classNames(
                                                        pathname == route.href
                                                            ? 'bg-gray-700 text-white'
                                                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                        'rounded-md px-3 py-2 text-sm font-medium flex items-center gap-2 transition-colors duration-200'
                                                    )}
                                                    aria-current={pathname == route.href ? 'page' : undefined}
                                                >
                                                    <route.icon className="h-4 w-4" />
                                                    {route.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="hidden md:block">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        {/* Profile dropdown */}
                                        <Menu as="div" className="relative ml-3">
                                            <div>
                                                <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                    <span className="sr-only">Open user menu</span>
                                                    <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                                                </Menu.Button>
                                            </div>
                                            <Transition
                                                as={Fragment}
                                                enter="transition ease-out duration-100"
                                                enterFrom="transform opacity-0 scale-95"
                                                enterTo="transform opacity-100 scale-100"
                                                leave="transition ease-in duration-75"
                                                leaveFrom="transform opacity-100 scale-100"
                                                leaveTo="transform opacity-0 scale-95"
                                            >
                                                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                    <Menu.Item>
                                                        {({active}) => (
                                                            <a
                                                                href={buyMeCoffee.href}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={classNames(
                                                                    active ? 'bg-gray-700' : '',
                                                                    'flex items-center gap-3 px-4 py-2 text-sm text-white'
                                                                )}
                                                            >
                                                                <buyMeCoffee.icon className="h-5 w-5 text-yellow-400" />
                                                                {buyMeCoffee.name}
                                                            </a>
                                                        )}
                                                    </Menu.Item>
                                                </Menu.Items>
                                            </Transition>
                                        </Menu>
                                    </div>
                                </div>
                                <div className="-mr-2 flex md:hidden">
                                    {/* Mobile menu button */}
                                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                        <span className="sr-only">Open main menu</span>
                                        {open ? (
                                            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                        )}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </div>

                        {/* Mobile menu */}
                        <Disclosure.Panel className="md:hidden">
                            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                {listRoutes.map((route) => (
                                    <Disclosure.Button
                                        key={route.name}
                                        as="a"
                                        href={route.href}
                                        className={classNames(
                                            pathname === route.href
                                                ? 'bg-gray-700 text-white'
                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                            'flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium'
                                        )}
                                        aria-current={pathname === route.href ? 'page' : undefined}
                                    >
                                        <route.icon className="h-5 w-5" />
                                        {route.name}
                                    </Disclosure.Button>
                                ))}
                                
                            </div>
                            
                            <div className="border-t border-gray-700 pt-4 pb-3">
                                <div className="flex items-center px-5">
                                    <div className="flex-shrink-0">
                                        <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-white">{user.name}</div>
                                        <div className="text-sm font-medium text-gray-400">{user.email}</div>
                                    </div>
                                </div>
                                <div className="mt-3 space-y-1 px-2">
                                    <Disclosure.Button
                                        as="a"
                                        href={buyMeCoffee.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                    >
                                        <buyMeCoffee.icon className="h-5 w-5 text-yellow-400" />
                                        {buyMeCoffee.name}
                                    </Disclosure.Button>
                                </div>
                            </div>
                        </Disclosure.Panel>
                    </>
                )}
            </Disclosure>
        </div>
    );
}