import React from 'react'
import { Link } from 'react-router-dom'
import LandCard from '../components/LandCard.tsx'
import lands from '../data/lands.json'
import Footer from '../components/Footer.tsx'
const Home: React.FC = () => {
    const featuredLands = lands.slice(0, 3);


  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      {/* Hero Section */}
      <section className="bg-green-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Buy and Sell Land Easily</h1>
        <p className="text-lg md:text-xl mb-8">Find the perfect piece of land or sell yours to the right buyer.</p>
        <Link
          to="/lands"
          className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          Browse Listings
        </Link>
      </section>

      {/* Featured Lands */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center">Featured Lands</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Example land cards */}
          {featuredLands.map((land) => (
            <LandCard key={land.landId} land={land} />
          ))}
        </div>
      </section>

      {/* Land Card */}
      <h2 className="text-2xl font-bold mb-8 text-center">All Lands</h2>
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {lands.map((land) => (
        <LandCard key={land.landId} land={land} />
      ))}
    </div>
    <Footer/>
    </div>
  )
}

export default Home
