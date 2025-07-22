import React from 'react'
import { Link } from 'react-router-dom'

const Footer: React.FC = () => {
  return (
    <footer className="bg-sky-700 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Column 1 */}
        <div>
          <h2 className="text-xl font-bold mb-2">LandMarket</h2>
          <p className="text-sm text-gray-200">
            Buy and sell land across the country with trust and ease.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:underline">Home</Link></li>
            <li><Link to="/lands" className="hover:underline">Listings</Link></li>
            <li><Link to="/wishlist" className="hover:underline">Wishlist</Link></li>
            <li><Link to="/favourites" className="hover:underline">Favourites</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <p className="text-sm">📧 support@landmarket.com</p>
          <p className="text-sm">📞 +1 (555) 123-4567</p>
          <p className="text-sm mt-2">© {new Date().getFullYear()} LandMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
