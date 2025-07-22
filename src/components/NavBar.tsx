import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-sky-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          🌍 <span className="tracking-wide">LandMarket</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-white">
          <Link to="/" className="hover:text-sky-200 transition">Home</Link>
          <Link to="/lands" className="hover:text-sky-200 transition">Listings</Link>
          <Link to="/wishlist" className="hover:text-sky-200 transition">Wishlist</Link>
          <Link to="/favourites" className="hover:text-sky-200 transition">Favourites</Link>
        </div>

        {/* Sign In Button */}
        <div className="hidden md:flex">
          <Link
            to="/login"
            className="bg-white text-sky-600 font-semibold px-4 py-2 rounded-lg hover:bg-sky-100 transition duration-200 shadow-sm"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 space-y-4 bg-sky-500 text-white font-medium">
          <Link to="/" className="block hover:text-sky-100" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/lands" className="block hover:text-sky-100" onClick={() => setIsOpen(false)}>Listings</Link>
          <Link to="/wishlist" className="block hover:text-sky-100" onClick={() => setIsOpen(false)}>Wishlist</Link>
          <Link to="/favourites" className="block hover:text-sky-100" onClick={() => setIsOpen(false)}>Favourites</Link>
          <Link to="/login" className="block hover:text-sky-100 pt-2" onClick={() => setIsOpen(false)}>Sign In</Link>
        </div>
      )}
    </nav>
  )
}

export default NavBar
