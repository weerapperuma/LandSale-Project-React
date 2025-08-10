import React, { useEffect, useState } from 'react';
import LandCard from '../components/LandCard';
import { toast } from 'react-toastify';

type LandFromAPI = {
    _id: string;
    title: string;
    description: string;
    price: number;
    district: string;
    city: string;
    images: string[];
    createdAt?: string;
    userId: string;
};

const Wishlist: React.FC = () => {
    const [wishlist, setWishlist] = useState<LandFromAPI[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('User not logged in');

                const res = await fetch('http://localhost:5000/api/v1/wishlist', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error('Failed to fetch wishlist');

                const data = await res.json();
                setWishlist(data.data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const handleRemove = async (landId: string, title: string) => {
        const confirm = window.confirm(`Remove "${title}" from your wishlist?`);
        if (!confirm) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/v1/wishlist/${landId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to remove from wishlist');
            }

            setWishlist((prev) => prev.filter((item) => item._id !== landId));
            toast.success(`"${title}" removed from wishlist`);
        } catch (err) {
            console.error(err);
            toast.error('Failed to remove from wishlist');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-6xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Wishlist</h1>

                {loading && <p className="text-center text-gray-600">Loading your wishlist...</p>}

                {error && <p className="text-center text-red-600">{error}</p>}

                {!loading && wishlist.length === 0 && (
                    <p className="text-center text-gray-500">Your wishlist is empty.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {wishlist.map((land) => (
                        <div key={land._id} className="relative group">
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

                            {/* Remove from wishlist button on hover */}
                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleRemove(land._id, land.title)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-1 px-3 rounded shadow"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
