import React, { useEffect, useState } from 'react'
import LandCard from '../components/LandCard.tsx'
import Footer from '../components/Footer.tsx'

type LandFromAPI = {
    _id: string
    title: string
    description: string
    price: number
    district: string
    city: string
    images: string[]
    createdAt?: string
    userId: string
}

const Home: React.FC = () => {
    const [lands, setLands] = useState<LandFromAPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const landsPerPage = 9

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/v1/lands')
                if (!res.ok) throw new Error('Failed to fetch lands')

                const data = await res.json()
                setLands(data.data)
            } catch (err: any) {
                setError(err.message || 'Something went wrong')
            } finally {
                setLoading(false)
            }
        }
        fetchLands()
    }, [])

    // Pagination calculations
    const indexOfLastLand = currentPage * landsPerPage
    const indexOfFirstLand = indexOfLastLand - landsPerPage
    const currentLands = lands.slice(indexOfFirstLand, indexOfLastLand)
    const totalPages = Math.ceil(lands.length / landsPerPage)

    if (loading) {
        return <p className="text-center mt-10">Loading lands...</p>
    }

    if (error) {
        return <p className="text-center mt-10 text-red-600">{error}</p>
    }

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800">
            {/* Hero Section */}
            <section className="bg-green-700 text-white py-20 px-4 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy and Sell Land Easily</h1>
                <p className="text-lg md:text-xl mb-8">Find the perfect piece of land or sell yours to the right buyer.</p>
            </section>

            {/* All Lands Section */}
            <h2 className="text-2xl font-bold mb-8 text-center mt-12">All Lands</h2>
            <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {currentLands.length === 0 ? (
                    <p className="text-center col-span-full">No land listings available.</p>
                ) : (
                    currentLands.map((land) => (
                        <LandCard
                            key={land._id}
                            land={{
                                landId: land._id,
                                title: land.title,
                                description: land.description,
                                price: land.price,
                                location: `${land.city}, ${land.district}`,
                                image: land.images[0] || 'https://via.placeholder.com/400x300?text=No+Image',
                                listedDate: land.createdAt || '',
                                ownerId: land.userId,
                            }}
                        />
                    ))
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`px-4 py-2 rounded ${
                                currentPage === index + 1
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
            <div className="flex justify-center items-center my-6">
                <div className="relative w-full max-w-xs h-12 overflow-hidden">
                    {/* Runner */}
                    <span
                        className="absolute animate-toHome text-2xl"
                        role="img"
                        aria-label="runner"
                    >
                        📍
                    </span>

                    {/* Home */}
                    <span
                        className="absolute right-0 text-3xl"
                        role="img"
                        aria-label="house"
                    >
                        🏡
                    </span>
                </div>
            </div>

            <style>
                {`
                    @keyframes toHome {
                      0% { left: -2rem; }
                      100% { left: calc(100% - 2rem); }
                    }
                    
                    .animate-toHome {
                      position: absolute;
                      animation: toHome 3s ease-in-out infinite;
                    }
                    `}
            </style>
            <Footer />
        </div>
    )
}

export default Home
