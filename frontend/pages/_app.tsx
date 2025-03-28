import type { AppProps } from 'next/app'
import "../app/globals.css";
import Header from "@/components/header";

import { Inter } from "next/font/google";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className={inter.className}>
            <Header></Header>
            <Component {...pageProps}/>
        </div>
    );
}