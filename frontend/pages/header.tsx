import {Fragment, useEffect, useState} from 'react'
import {Disclosure, Menu, Popover, Transition} from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import {internal_getCurrentFunctionWaitUntil} from "next/dist/server/web/internal-edge-wait-until";
import Link from 'next/link';
import {useNavigate} from 'react-router-dom';
import {redirect, usePathname} from "next/navigation";
import {
    ArrowPathIcon,
    ChartPieIcon,
    ChevronDownIcon,
    CursorArrowRaysIcon,
    FingerPrintIcon,
    SquaresPlusIcon,
    ArrowLeftEndOnRectangleIcon,
    UserIcon,
    InboxIcon
} from "@heroicons/react/20/solid";
import {Simulate} from "react-dom/test-utils";
import drop = Simulate.drop;
import {useRouter} from "next/router";

const user = {
    name: 'Tom Cook',
    email: 'tom@example.com',
    imageUrl:
        'https://www.kindpng.com/picc/m/259-2590523_circle-profile-picture-tumblr-moon-purple-png-transparent.png',
}

// Our Navigation routes
const listRoutes = [
    { name: 'Dashboard', href: '/home'},
    { name: 'Listings', href: '/listings'},
    { name: 'Predictions', href: '/predictions'},
    { name: 'Data', href: '/data'},
]

const dropRoutes = [
    { name: 'Contact Us', description: 'Get a better understanding of your traffic', href: '/about/contact', icon: ChartPieIcon },
    { name: 'Project', description: 'Speak directly to your customers', href: '#', icon: CursorArrowRaysIcon },
    { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: FingerPrintIcon },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: SquaresPlusIcon },
    { name: 'Machine Learning', description: 'Build strategic funnels that will convert', href: '#', icon: ArrowPathIcon },
]

const userNavigation = [
    { name: 'Your Profile', href: '#', icon: UserIcon},
    { name: 'Settings', href: '#', icon: InboxIcon},
    { name: 'Sign out', href: '#', icon: ArrowLeftEndOnRectangleIcon},
]

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}



export default function Header() {
    const pathname = usePathname();

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-gray-900">
                    {({ open }) => (
                        <>
                            {/* Web Nav header */}
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex h-16 items-center justify-between">
                                    <div className="flex items-center">
                                        <Link
                                            className="flex-shrink-0" href={'/'}>
                                            <img
                                                className="h-8 w-8"
                                                src="https://tailwindui.com/img/logos/mark.svg?color=fuchsia&shade=900"
                                                alt="Your Company"
                                            />
                                        </Link>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {listRoutes.map((route) => (
                                                    <Link
                                                        href={route.href}
                                                        className={classNames(
                                                            pathname == route.href
                                                                ? 'bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800'
                                                                : 'text-gray-300 hover:bg-gray-500 hover:text-white',
                                                            'rounded-md px-3 py-2 text-sm font-medium'
                                                        )}
                                                        aria-current={pathname == route.href ? 'page' : undefined}
                                                    >
                                                        {route.name}
                                                    </Link>
                                                ))}

                                                {/* About dropdown */}
                                                <Popover className="relative">
                                                    <Popover.Button
                                                        className={classNames(
                                                            pathname?.includes('/about')
                                                                ? 'bg-gray-700 text-white'
                                                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                            'inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium'
                                                        )}>
                                                        <span>About</span>
                                                        <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                                    </Popover.Button>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-200"
                                                        enterFrom="opacity-0 translate-y-1"
                                                        enterTo="opacity-100 translate-y-0"
                                                        leave="transition ease-in duration-150"
                                                        leaveFrom="opacity-100 translate-y-0"
                                                        leaveTo="opacity-0 translate-y-1"
                                                    >
                                                        <Popover.Panel className="absolute left-1/2 z-10 mt-5 flex w-screen max-w-max -translate-x-1/2 px-4">
                                                            <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-gray-800 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                                <div className="p-4">
                                                                    {dropRoutes.map((item) => (
                                                                        <div key={item.name} className={classNames(pathname == item.href ? "group relative flex gap-x-6 rounded-lg p-4 bg-gray-600" : "group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-700")}>
                                                                            <div className={classNames(pathname == item.href ? "mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white" : "mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white")}>
                                                                                <item.icon className={classNames(pathname == item.href ? "h-6 w-6 text-indigo-600" : "h-6 w-6 text-gray-600 group-hover:text-indigo-600")} aria-hidden="true" />
                                                                            </div>
                                                                            <div>
                                                                                <a href={item.href} className="font-semibold text-gray-100">
                                                                                    {item.name}
                                                                                    <span className="absolute inset-0" />
                                                                                </a>
                                                                                <p className="mt-1 text-gray-400">{item.description}</p> {/* span makes the whole element clickable */}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </Popover.Panel>
                                                    </Transition>
                                                </Popover>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">

                                            {/* Profile dropdown */}
                                            <Popover as="div" className="relative ml-3">
                                                <div>
                                                    <Popover.Button className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        <img className="h-8 w-8 rounded-full" src={user.imageUrl} alt="" />
                                                    </Popover.Button>
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
                                                    <Popover.Panel
                                                        className="absolute left-1/2 z-10 w-screen mt-5 flex max-w-max -translate-x-1/2 px-4">
                                                        <div className="max-w-md flex-auto overflow-hidden rounded-3xl bg-gray-800 text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                                            <div className="p-4">
                                                                {userNavigation.map((item) => (
                                                                    <div key={item.name}
                                                                         className={classNames(pathname == item.href ? "group relative items-center flex gap-x-6 rounded-lg p-4 bg-gray-600" : "group relative items-center flex gap-x-6 rounded-lg p-4 over:bg-gray-700")}>
                                                                        <div
                                                                            className={classNames(pathname == item.href ? "mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-white" : "mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white")}>
                                                                            <item.icon
                                                                                className={classNames(pathname == item.href ? "h-6 w-6 text-indigo-600" : "h-6 w-6 text-gray-600 group-hover:text-indigo-600")}
                                                                                aria-hidden="true"/>
                                                                        </div>
                                                                        <div>
                                                                            <a href={item.href}
                                                                               className="font-semibold text-white">
                                                                                {item.name}
                                                                                <span className="absolute inset-0"/> {/* span makes the whole element clickable */}
                                                                            </a>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </Popover.Panel>
                                                </Transition>
                                            </Popover>

                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">

                                        {/* Mobile menu button */}
                                        <Disclosure.Button
                                            className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-0.5"/>
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true"/>
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true"/>
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>
                            {/* Mobile menu nav */}
                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    {listRoutes.map((route) => (
                                        <Disclosure.Button
                                            key={route.name}
                                            as="a"
                                            href={route.href}
                                            className={classNames(
                                                pathname === route.href ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block rounded-md px-3 py-2 text-base font-medium'
                                            )}
                                            aria-current={pathname === route.href ? 'page' : undefined}
                                        >
                                            {route.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pb-3 pt-4">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <img className="h-10 w-10 rounded-full" src={user.imageUrl} alt="" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{user.name}</div>
                                            <div className="text-sm font-medium leading-none text-gray-400">{user.email}</div>
                                        </div>
                                        {/*<button*/}
                                        {/*    type="button"*/}
                                        {/*    className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"*/}
                                        {/*>*/}
                                        {/*    <span className="absolute -inset-1.5" />*/}
                                        {/*    <span className="sr-only">View notifications</span>*/}
                                        {/*    <BellIcon className="h-6 w-6" aria-hidden="true" />*/}
                                        {/*</button>*/}
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        {userNavigation.map((item) => (
                                            <Disclosure.Button
                                                key={item.name}
                                                as="a"
                                                href={item.href}
                                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                            >
                                                {item.name}
                                            </Disclosure.Button>
                                        ))}
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            </div>
        </>
    );
}