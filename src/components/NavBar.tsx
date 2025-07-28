import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import type { AppDispatch, RootState } from '../app/store'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <nav className="bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-400 text-white shadow-xl sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold flex items-center gap-2 tracking-tight drop-shadow-sm">
          <span className="bg-white bg-opacity-20 rounded-full p-2 shadow-md">🌍</span>
          <span className="ml-1 font-serif italic">Land<span className="text-yellow-300">Market</span></span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 items-center font-medium text-white">
          <Link to="/" className="hover:text-yellow-200 hover:underline underline-offset-4 transition">Home</Link>
          <Link to="/lands" className="hover:text-yellow-200 hover:underline underline-offset-4 transition">Listings</Link>
          <Link to="/wishlist" className="hover:text-yellow-200 hover:underline underline-offset-4 transition">Wishlist</Link>
          <Link to="/favourites" className="hover:text-yellow-200 hover:underline underline-offset-4 transition">Favourites</Link>
        </div>

        {/* User Menu / Sign In Button */}
        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition duration-200"
              >
                <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                  <User size={16} />
                </div>
                <span className="font-medium">{user?.name || user?.email}</span>
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="mr-3" />
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} className="mr-3" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-white/90 text-sky-700 font-bold px-5 py-2 rounded-full hover:bg-yellow-200 hover:text-sky-900 transition duration-200 shadow-md border border-sky-100"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full p-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden px-6 pb-4 pt-2 space-y-3 bg-gradient-to-br from-sky-500 via-blue-400 to-cyan-300 text-white font-medium rounded-b-2xl shadow-lg animate-fade-in-down">
          <Link to="/" className="block hover:text-yellow-100 hover:underline underline-offset-4 transition" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/lands" className="block hover:text-yellow-100 hover:underline underline-offset-4 transition" onClick={() => setIsOpen(false)}>Listings</Link>
          <Link to="/wishlist" className="block hover:text-yellow-100 hover:underline underline-offset-4 transition" onClick={() => setIsOpen(false)}>Wishlist</Link>
          <Link to="/favourites" className="block hover:text-yellow-100 hover:underline underline-offset-4 transition" onClick={() => setIsOpen(false)}>Favourites</Link>
          
          {isAuthenticated ? (
            <>
              <div className="border-t border-white/20 pt-3 mt-3">
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center">
                    <User size={16} />
                  </div>
                  <span className="text-sm">{user?.name || user?.email}</span>
                </div>
                <Link to="/profile" className="block hover:text-yellow-100 transition mb-2" onClick={() => setIsOpen(false)}>Profile</Link>
                <Link to="/settings" className="block hover:text-yellow-100 transition mb-2" onClick={() => setIsOpen(false)}>Settings</Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-200 hover:text-red-100 transition"
                >
                  Sign Out
                </button>
              </div>
            </>
          ) : (
            <Link to="/login" className="block hover:bg-yellow-200/20 text-yellow-50 font-bold mt-2 rounded-full px-4 py-2 transition" onClick={() => setIsOpen(false)}>Sign In</Link>
          )}
        </div>
      )}
    </nav>
  )
}

export default NavBar
