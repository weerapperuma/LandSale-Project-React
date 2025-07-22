import React from 'react'

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
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
      {/* Image */}
      <img
        src={land.image}
        alt={land.title}
        className="w-full h-48 object-cover"
      />

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold text-gray-800">{land.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{land.description}</p>
        <p className="text-sm text-blue-600 font-semibold">{land.location}</p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-green-600 font-bold text-md">${land.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{new Date(land.listedDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default LandCard
