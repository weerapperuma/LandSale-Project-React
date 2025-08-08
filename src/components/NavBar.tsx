import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, User, LogOut, Settings,
  Home, Heart, Map, UserCircle, UserCog
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import type { AppDispatch, RootState } from '../app/store'
import AuthRequiredPopup from "./AuthRequiredPopup"

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.auth)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = Boolean(token)
  const [showWishlistPreview, setShowWishlistPreview] = useState(false)
  const wishlistRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
          wishlistRef.current &&
          !wishlistRef.current.contains(event.target as Node)
      ) {
        setShowWishlistPreview(false)
      }
    }

    if (showWishlistPreview) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWishlistPreview])

  useEffect(() => {
    if (isAuthenticated) {
      setShowWishlistPreview(false)
    }
  }, [isAuthenticated])

  return (
      <nav className="bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-400 text-white shadow-xl sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold flex items-center gap-2 tracking-tight drop-shadow-sm">
            <span className="bg-white bg-opacity-20 rounded-full p-2 shadow-md">🌍</span>
            <span className="ml-1 font-serif italic">Land<span className="text-yellow-300">Market</span></span>
          </Link>

          <div className="flex items-center space-x-6">
            <div className="hidden md:flex space-x-5 items-center">
              <Link to="/" title="Home" className="hover:text-yellow-200 transition">
                <Home size={22} />
              </Link>
              <Link to="/mylistings" title="Listings" className="hover:text-yellow-200 transition">
                <Map size={22} />
              </Link>
              <div className="relative" ref={wishlistRef}>
                <button
                    onClick={() => {
                      setShowWishlistPreview((prev) => !prev)
                    }}
                    className="hover:text-yellow-200 transition"
                    title="Wishlist"
                >
                  <Heart size={22} />
                </button>

                {showWishlistPreview && (
                    <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 py-4 px-5 z-50 animate-fade-in-down transition-all duration-300 ease-out">
                      {isAuthenticated ? (
                          <>
                            <div className="text-center mb-3">
                              <h4 className="text-md font-semibold text-gray-700">Your Wishlist</h4>
                              <p className="text-sm text-gray-500 mb-2">
                                Here are your saved properties.
                              </p>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center justify-between">
                                <span>🌾 Land in Ella</span>
                                <span className="text-xs text-gray-500">Rs. 3.5M</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span>🏨 Colombo Plot</span>
                                <span className="text-xs text-gray-500">Rs. 7.8M</span>
                              </div>
                            </div>
                            <div className="mt-4 text-center border-t border-gray-100 pt-2">
                              <Link
                                  to="/wishlist"
                                  className="text-sm text-blue-600 hover:underline font-medium"
                                  onClick={() => setShowWishlistPreview(false)}
                              >
                                View full wishlist →
                              </Link>
                            </div>
                          </>
                      ) : (
                          <AuthRequiredPopup
                              show={true}
                              onClose={() => setShowWishlistPreview(false)}
                              message="Please sign in to view your wishlist."
                          />
                      )}
                    </div>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 hover:bg-white/30 transition duration-200"
                    >
                      <UserCog size={18} />
                      <span className="font-medium">User</span>
                    </button>

                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm text-gray-600">Signed in as</p>
                            <p className="text-sm font-medium text-gray-900">User</p>
                          </div>
                          <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>
                            <User size={16} className="mr-3" />
                            Profile
                          </Link>
                          <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition" onClick={() => setShowUserMenu(false)}>
                            <Settings size={16} className="mr-3" />
                            Settings
                          </Link>
                          <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                            <LogOut size={16} className="mr-3" />
                            Sign Out
                          </button>
                        </div>
                    )}
                  </div>
              ) : (
                  <Link
                      to="/login"
                      className="bg-white/90 text-sky-700 font-bold px-5 py-2 rounded-full hover:bg-yellow-200 hover:text-sky-900 transition duration-200 shadow-md border border-sky-100 flex items-center gap-2"
                  >
                    <UserCircle size={18} />
                    Sign In
                  </Link>
              )}
            </div>

            <button
                className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full p-1"
                onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>
  )
}

export default NavBar
