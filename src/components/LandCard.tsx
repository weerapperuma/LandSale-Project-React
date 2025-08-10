import React, { useState } from 'react'
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

  const handleClick = () => {
    toast.info(`You clicked on "${land.title}"`, {
      position: 'bottom-right',
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
    })
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent triggering card click
    setIsFavorite((prev) => !prev)
    toast.success(
        !isFavorite
            ? `"${land.title}" added to favorites`
            : `"${land.title}" removed from favorites`,
        {
          position: 'bottom-right',
          autoClose: 1500,
          hideProgressBar: true,
        }
    )
  }

  return (
      <div
          onClick={handleClick}
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
