import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import LandCard from '../components/LandCard'
import {toast} from "react-toastify";

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
                const userId=localStorage.getItem('userId')
                const res = await fetch(`http://localhost:5000/api/v1/lands/user/${userId}`)

                if (!userId) {
                    throw new Error('User not logged in')
                }
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
                        <div key={land._id} className="relative group">
                            {/* Card */}
                            <LandCard
                                land={{
                                    landId: land._id,
                                    title: land.title,
                                    description: land.description,
                                    price: land.price,
                                    location: `${land.city}, ${land.district}`,
                                    image: land.images[0] || 'https://placehold.co/400x300?text=No+Image',
                                    listedDate: land.createdAt || '',
                                    ownerId: land.userId,
                                }}
                            />

                            {/* Hover Buttons */}
                            <div className="absolute top-4 right-4 flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => toast.info(`Update clicked for "${land.title}"`)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-1 px-3 rounded shadow"
                                >
                                    Update
                                </button>
                                <button
                                    onClick={() => toast.error(`Delete clicked for "${land.title}"`)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded shadow"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}

export default MyListings
