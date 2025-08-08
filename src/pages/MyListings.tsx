import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LandCard from '../components/LandCard'

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

const MyListings: React.FC = () => {
    const [lands, setLands] = useState<LandFromAPI[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLands = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/v1/lands')
                if (!res.ok) {
                    throw new Error('Failed to fetch lands')
                }
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

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">My Listings</h1>
                    <Link
                        to="/createland"
                        className="inline-flex items-center bg-green-600 text-white font-semibold px-4 py-2 rounded hover:bg-green-700 transition"
                    >
                        + Create New Listing
                    </Link>
                </div>

                {loading && (
                    <p className="text-center text-gray-600">Loading your listings...</p>
                )}

                {error && (
                    <p className="text-center text-red-600">{error}</p>
                )}

                {!loading && lands.length === 0 && (
                    <p className="text-center text-gray-500">No current ads.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {lands.map((land) => (
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
                    ))}
                </div>
            </div>
        </div>
    )
}

export default MyListings
