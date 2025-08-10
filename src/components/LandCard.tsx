import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { Heart } from 'lucide-react'

type LandProps = {
  landId: string
  title: string
  description: string
  price: number
  location: string
  image: string
  listedDate: string
  ownerId: string
}

const LandCard: React.FC<{ land: LandProps }> = ({ land }) => {
  const [isFavorite, setIsFavorite] = useState(false)

  // On mount, check if this land is already in the wishlist
  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        // Call your API to get the user's wishlist
        const res = await fetch('http://localhost:5000/api/v1/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Failed to fetch wishlist')

        const data = await res.json()
        // data.data is array of wishlist lands
        const isInWishlist = data.data.some((item: any) => item._id === land.landId)
        setIsFavorite(isInWishlist)
      } catch (err) {
        console.error('Wishlist check error:', err)
      }
    }
    checkWishlist()
  }, [land.landId])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation() // prevent triggering card click

    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('You must be logged in to manage your wishlist')
      return
    }

    try {
      if (!isFavorite) {
        // Add to wishlist
        const res = await fetch('http://localhost:5000/api/v1/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ landId: land.landId }),
        })

        if (!res.ok) throw new Error('Failed to add to wishlist')

        setIsFavorite(true)
        toast.success(`"${land.title}" added to favorites`)
      } else {
        // Remove from wishlist
        const res = await fetch(`http://localhost:5000/api/v1/wishlist/${land.landId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) throw new Error('Failed to remove from wishlist')

        setIsFavorite(false)
        toast.success(`"${land.title}" removed from favorites`)
      }
    } catch (err) {
      console.error('Wishlist toggle error:', err)
      toast.error('Error updating wishlist')
    }
  }

  return (
      <div
          onClick={() => toast.info(`You clicked on "${land.title}"`)}
          className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-[1.01] cursor-pointer transition-all duration-300 overflow-hidden relative"
      >
        {/* Image */}
        <div className="relative">
          <img
              src={land.image}
              alt={land.title}
              className="w-full h-48 object-cover transition-all duration-300"
          />
          {/* Heart Icon */}
          <button
              onClick={toggleFavorite}
              className="absolute top-2 right-2 p-1 bg-white/70 rounded-full hover:bg-white transition"
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
                size={22}
                className={`transition-colors duration-300 ${
                    isFavorite ? 'fill-green-500 text-green-500' : 'text-gray-500'
                }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="text-lg font-bold text-gray-800">{land.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{land.description}</p>
          <p className="text-sm text-blue-600 font-semibold">{land.location}</p>
          <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-bold text-md">
            ${land.price.toLocaleString()}
          </span>
            <span className="text-xs text-gray-500">
            {new Date(land.listedDate).toLocaleDateString()}
          </span>
          </div>
        </div>
      </div>
  )
}

export default LandCard
