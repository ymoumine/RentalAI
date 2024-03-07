import {useRouter} from "next/router";

export default function Id() {
    const router = useRouter();
    const id = router.query.id;

    return (
        <>
            <header className="bg-gray-700 shadow">
                <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold tracking-tight text-white">Property {id}</h1>
                </div>
            </header>
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">

                </div>
            </main>
        </>
    );
}