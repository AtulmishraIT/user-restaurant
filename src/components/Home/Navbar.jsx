"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import Loading from "../../Loading"
import {
  Search,
  User,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Home,
  Coffee,
  Heart,
  CreditCard,
  MapPin,
  Phone,
  ChevronDown,
  ShoppingBag,
} from "lucide-react"
import foodData from "../../food/food1.json"

function Navbar() {
  const [userData, setUserData] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isLogout, setIsLogout] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const navigate = useNavigate()

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail")
        if (!email) {
          throw new Error("User email not found")
        }
        const response = await axios.get(`http://localhost:8000/home/${email}`)
        setUserData(response.data)
      } catch (err) {
        setError(err.message || "Failed to fetch user data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const fetchCartCount = () => {
      const data = foodData.foodItems.map((food) => localStorage.getItem(food.id)).filter((items) => items !== null)
      setCartCount(data.length)
    }

    fetchCartCount()

    // Set up interval to refresh cart count
    const intervalId = setInterval(fetchCartCount, 2000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  // Handle logout
  const handleLogout = async () => {
    if (isLogout === true) {
      try {
        await axios.post("http://localhost:8000/logout")
        setTimeout(() => {
          localStorage.removeItem("userEmail")
          localStorage.removeItem("token")
          localStorage.clear()
          setUserData(null)
          navigate("/login")
          setIsLogout(false)
        }, 1000)
      } catch (err) {
        console.error("Logout failed:", err)
      }
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen)
  }

  if (isLoading) {
    return (
      <div className="z-50">
        <Loading />
      </div>
    )
  }

  return (
    <>
      <nav className="bg-gradient-to-r from-green-700 to-green-600 fixed w-full z-20 top-0 start-0 border-b border-green-800 shadow-lg">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <img alt="Restaurant Logo" src="../src/food/logo.png" className="w-auto h-10" />
                <span className="text-xl font-bold text-white tracking-wide hidden sm:block">Restaurant</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-6">
                <Link
                  to="/home"
                  className="flex items-center text-white hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Home
                </Link>
                <Link
                  to="/Dine"
                  className="flex items-center text-white hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Coffee className="w-4 h-4 mr-1" />
                  Dine-in
                </Link>
                <Link
                  to="/search"
                  className="flex items-center text-white hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  <Search className="w-4 h-4 mr-1" />
                  Search
                </Link>
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {userData && userData.isLogin ? (
                <>
                  {/* User Name (Desktop) */}
                  <span className="hidden md:block text-white font-medium">{userData.name}</span>

                  {/* Cart */}
                  <Link
                    to="/cart"
                    className="relative p-2 text-white bg-green-600 rounded-full hover:bg-green-500 transition-colors duration-200"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile Menu */}
                  <div className="relative">
                    <button
                      onClick={toggleProfileMenu}
                      className="flex items-center text-white hover:bg-green-600 p-2 rounded-full transition-colors duration-200"
                    >
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>

                    {isProfileMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-50 border-t-2 border-green-600 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                          <p className="text-xs text-gray-500 truncate">{localStorage.getItem("userEmail")}</p>
                        </div>

                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <User className="w-4 h-4 mr-2 text-gray-500" />
                          Profile
                        </Link>

                        <Link
                          to="/profile/order"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2 text-gray-500" />
                          Orders
                        </Link>

                        <Link
                          to="/profile/Dine"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Coffee className="w-4 h-4 mr-2 text-gray-500" />
                          Dine-in
                        </Link>

                        <Link
                          to="/profile/favourites"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Heart className="w-4 h-4 mr-2 text-gray-500" />
                          Favorites
                        </Link>

                        <Link
                          to="/profile/payment"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <CreditCard className="w-4 h-4 mr-2 text-gray-500" />
                          Payment
                        </Link>

                        <Link
                          to="/profile/addresses"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                          Address
                        </Link>

                        <Link
                          to="/profile/contact"
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          Contact
                        </Link>

                        <div className="border-t border-gray-100 mt-1">
                          <button
                            onClick={() => setIsLogout(true)}
                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  to="/Login"
                  className="bg-white text-green-700 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 shadow-md"
                >
                  Get Started
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                onClick={toggleMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-green-600 focus:outline-none transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-green-800 shadow-inner animate-slideDown">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/home"
                className="flex items-center text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-2" />
                Home
              </Link>
              <Link
                to="/Dine"
                className="flex items-center text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Coffee className="w-5 h-5 mr-2" />
                Dine-in
              </Link>
              <Link
                to="/search"
                className="flex items-center text-white hover:bg-green-700 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Search className="w-5 h-5 mr-2" />
                Search
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {isLogout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-lg shadow-xl p-6 mx-4 max-w-sm w-full transform transition-all">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
            <p className="text-sm text-gray-500 mb-4">Are you sure you want to log out of your account?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setIsLogout(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar

