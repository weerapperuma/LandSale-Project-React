import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, User, LogOut, Settings,
  Home, Heart, Map, UserCircle, UserCog
} from 'lucide-react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import type { AppDispatch, RootState } from '../app/store'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { token } = useSelector((state: RootState) => state.auth)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const isAuthenticated = Boolean(token)

  const handleLogout = () => {
    dispatch(logout())
    setShowUserMenu(false)
  }

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
          {/* Left: Logo */}
          <Link to="/" className="text-3xl font-extrabold flex items-center gap-2 tracking-tight drop-shadow-sm">
            <span className="bg-white bg-opacity-20 rounded-full p-2 shadow-md">🌍</span>
            <span className="ml-1 font-serif italic">Land<span className="text-yellow-300">Market</span></span>
          </Link>

          {/* Right side: Nav Icons + User Button */}
          <div className="flex items-center space-x-6">
            {/* Nav Icons */}
            <div className="hidden md:flex space-x-5 items-center">
              <Link to="/" title="Home" className="hover:text-yellow-200 transition">
                <Home size={22} />
              </Link>
              <Link to="/lands" title="Listings" className="hover:text-yellow-200 transition">
                <Map size={22} />
              </Link>
              <Link to="/wishlist" title="Wishlist" className="hover:text-yellow-200 transition">
                <Heart size={22} />
              </Link>
            </div>

            {/* Auth / User */}
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

                    {/* User Dropdown */}
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

            {/* Mobile Menu Toggle */}
            <button
                className="md:hidden text-white focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded-full p-1"
                onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
            <div className="md:hidden px-6 pb-4 pt-2 space-y-4 bg-gradient-to-br from-sky-500 via-blue-400 to-cyan-300 text-white font-medium rounded-b-2xl shadow-lg animate-fade-in-down">
              <Link to="/" className="flex items-center gap-3 hover:text-yellow-100 transition" onClick={() => setIsOpen(false)}>
                <Home size={20} />
                Home
              </Link>
              <Link to="/lands" className="flex items-center gap-3 hover:text-yellow-100 transition" onClick={() => setIsOpen(false)}>
                <Map size={20} />
                Listings
              </Link>
              <Link to="/wishlist" className="flex items-center gap-3 hover:text-yellow-100 transition" onClick={() => setIsOpen(false)}>
                <Heart size={20} />
                Wishlist
              </Link>

              {isAuthenticated ? (
                  <div className="border-t border-white/20 pt-3 mt-3 space-y-2">
                    <Link to="/profile" className="block hover:text-yellow-100 transition" onClick={() => setIsOpen(false)}>Profile</Link>
                    <Link to="/settings" className="block hover:text-yellow-100 transition" onClick={() => setIsOpen(false)}>Settings</Link>
                    <button onClick={() => { handleLogout(); setIsOpen(false) }} className="block w-full text-left text-red-200 hover:text-red-100 transition">
                      Sign Out
                    </button>
                  </div>
              ) : (
                  <Link to="/login" className="block hover:bg-yellow-200/20 text-yellow-50 font-bold mt-2 rounded-full px-4 py-2 transition flex items-center gap-2" onClick={() => setIsOpen(false)}>
                    <UserCircle size={18} />
                    Sign In
                  </Link>
              )}
            </div>
        )}
      </nav>
  )
}

export default NavBar
