import {Link, useNavigate} from 'react-router-dom'
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
  const [showWishlistPreview, setShowWishlistPreview] = useState(false)
  const [showListPreview, setShowListPreview] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.auth)
  const isAuthenticated = Boolean(token)
  const role = localStorage.getItem('role') // read role

  // Refs for click-outside behavior
  const userMenuRef = useRef<HTMLDivElement | null>(null)
  const wishlistRef = useRef<HTMLDivElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }
  const navigate = useNavigate()
  const handleListClick = () => {
    if (isAuthenticated) {
      navigate('/mylistings');
    } else {
      setShowListPreview(true);
      setShowWishlistPreview(false); // Close wishlist popup
    }
  };
  const handleMobileWishlistClick = () => {
    setShowWishlistPreview(prev => {
      const newState = !prev;
      if (newState) {
        setShowListPreview(false);
      }
      return newState;
    });
  };

  const handleWishlistClick = () => {
    if (isAuthenticated) {
      navigate('/wishlist');
    } else {
      setShowListPreview(true);
      setShowWishlistPreview(false); // Close wishlist popup
    }
  };

  // Close wishlist preview on outside click
  useEffect(() => {
    const handleClickOutsideWishlist = (event: MouseEvent) => {
      if (wishlistRef.current && !wishlistRef.current.contains(event.target as Node)) {
        setShowWishlistPreview(false)
      }
    }
    if (showWishlistPreview) {
      document.addEventListener('mousedown', handleClickOutsideWishlist)
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideWishlist)
  }, [showWishlistPreview])

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutsideUserMenu = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutsideUserMenu)
    }
    return () => document.removeEventListener('mousedown', handleClickOutsideUserMenu)
  }, [showUserMenu])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (listRef.current && !listRef.current.contains(event.target as Node)) {
        setShowListPreview(false)
      }
    }
    if (showListPreview) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showListPreview])

  return (
      <nav className="bg-gradient-to-r from-sky-600 via-blue-500 to-cyan-400 text-white shadow-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-extrabold flex items-center gap-2">
            <span className="bg-white bg-opacity-20 rounded-full p-2">🌍</span>
            <span className="ml-1 font-serif italic">
            Land<span className="text-yellow-300">Market</span>
          </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Left links */}
            <div className="flex space-x-5 items-center">
              <Link to="/" title="Home" className="hover:text-yellow-200">
                <Home size={22} />
              </Link>

              {/* Listings */}
              <div className="relative" ref={listRef}>
                <button
                    onClick={handleListClick}
                    className="hover:text-yellow-200"
                    title="Listings"
                >
                  <Map size={22} />
                </button>

                {showListPreview && !isAuthenticated && (
                    <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border py-4 px-5 z-50">
                      <AuthRequiredPopup
                          show={true}
                          onClose={() => setShowListPreview(false)}
                          message="Please sign in to view your listings."
                      />
                    </div>
                )}
              </div>

              {/* Wishlist */}
              <div className="relative" ref={wishlistRef}>
                <button
                    onClick={handleWishlistClick}
                    className="hover:text-yellow-200"
                    title="Wishlist"
                >
                  <Heart size={22} />
                </button>

                {showWishlistPreview && !isAuthenticated && (
                    <div className="absolute right-0 mt-2 w-72 bg-white text-gray-800 rounded-xl shadow-2xl border py-4 px-5 z-50">
                      <AuthRequiredPopup
                          show={true}
                          onClose={() => setShowWishlistPreview(false)}
                          message="Please sign in to view your listings."
                      />
                    </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-3">
              {isAuthenticated && role === 'ADMIN' && (
                  <Link
                      to="/admin/dashboard"
                      className="bg-white/20 px-4 py-2 rounded-full hover:bg-white/30 flex items-center gap-2"
                  >
                    <UserCog size={18} />
                    Admin Dashboard
                  </Link>
              )}

              {isAuthenticated && role !== 'ADMIN' && (
                  <div className="relative" ref={userMenuRef}>
                    <button
                        onClick={() => setShowUserMenu(prev => !prev)}
                        className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full hover:bg-white/30"
                    >
                      <User size={18} />
                      <span>User</span>
                    </button>
                    {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border py-2 z-50">
                          <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                            <User size={16} className="mr-3" /> Profile
                          </Link>
                          <Link to="/settings" className="flex items-center px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                            <Settings size={16} className="mr-3" /> Settings
                          </Link>
                          <button
                              onClick={handleLogout}
                              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 text-sm"
                          >
                            <LogOut size={16} className="mr-3" /> Sign Out
                          </button>
                        </div>
                    )}
                  </div>
              )}

              {!isAuthenticated && (
                  <Link
                      to="/login"
                      className="bg-white/90 text-sky-700 font-bold px-5 py-2 rounded-full hover:bg-yellow-200 flex items-center gap-2"
                  >
                    <UserCircle size={18} />
                    Sign In
                  </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
              className="md:hidden text-white"
              onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {isOpen && (
            <div className="md:hidden bg-sky-700 px-4 pb-4 space-y-3">
              <Link to="/" className="flex items-center gap-2 py-2 text-white hover:text-yellow-200">
                <Home size={20} /> Home
              </Link>
              <Link to="/mylistings" className="flex items-center gap-2 py-2 text-white hover:text-yellow-200">
                <Map size={20} /> My Listings
              </Link>
              <button
                  onClick={handleMobileWishlistClick}
                  className="flex items-center gap-2 py-2 text-white hover:text-yellow-200"
              >
                <Heart size={20} /> Wishlist
              </button>


              {isAuthenticated && role === 'ADMIN' && (
                  <Link
                      to="/admindashboard"
                      className="flex items-center gap-2 py-2 text-white hover:text-yellow-200"
                  >
                    <UserCog size={20} /> Admin Dashboard
                  </Link>
              )}

              {isAuthenticated && role !== 'ADMIN' && (
                  <>
                    <Link to="/profile" className="flex items-center gap-2 py-2 text-white hover:text-yellow-200">
                      <User size={20} /> Profile
                    </Link>
                    <Link to="/settings" className="flex items-center gap-2 py-2 text-white hover:text-yellow-200">
                      <Settings size={20} /> Settings
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 py-2 text-red-300 hover:text-red-100"
                    >
                      <LogOut size={20} /> Sign Out
                    </button>
                  </>
              )}

              {!isAuthenticated && (
                  <Link
                      to="/login"
                      className="flex items-center gap-2 py-2 text-white hover:text-yellow-200"
                  >
                    <UserCircle size={20} /> Sign In
                  </Link>
              )}
            </div>
        )}
      </nav>
  )
}

export default NavBar
