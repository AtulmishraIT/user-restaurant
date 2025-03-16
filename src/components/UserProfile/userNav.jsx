"use client"

import { useEffect, useState } from "react"
import { Link, Routes, Route, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiPackage,
  FiHeart,
  FiCreditCard,
  FiMapPin,
  FiMessageSquare,
  FiLogOut,
  FiMenu,
  FiX,
  FiUser,
} from "react-icons/fi"
import { RiRestaurantLine } from "react-icons/ri"

// Import components
import Favourites from "./favourites"
import Payment from "./payment"
import UserProfile from "./UserProfile"
import Order from "./order"
import Contact from "./contact"
import Addresses from "./Addresses"
import Dinein from "./dinein"
import Login from "../Login/Login"

function UserNav() {
  const location = useLocation()
  const [activeItem, setActiveItem] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Get current path from location
  useEffect(() => {
    const path = location.pathname.split("/").pop()
    if (path) {
      setActiveItem(path)
      localStorage.setItem("activeItem", path)
    } else {
      const storedActive = localStorage.getItem("activeItem") || "order"
      setActiveItem(storedActive)
    }
  }, [location])

  const handleItemClick = (item) => {
    localStorage.setItem("activeItem", item)
    if (item === "logout") {
      localStorage.clear()
    }
    setActiveItem(item)
    setIsMenuOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const menuItems = [
    { path: "order", name: "Orders", icon: <FiPackage size={20} /> },
    { path: "Dine", name: "Dine-in", icon: <RiRestaurantLine size={20} /> },
    { path: "favourites", name: "Favourites", icon: <FiHeart size={20} /> },
    { path: "payment", name: "Payment", icon: <FiCreditCard size={20} /> },
    { path: "addresses", name: "Addresses", icon: <FiMapPin size={20} /> },
    { path: "contact", name: "Contact Us", icon: <FiMessageSquare size={20} /> },
  ]

  // Animation variants
  const sidebarVariants = {
    open: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { x: "-100%", opacity: 0, transition: { duration: 0.3 } },
  }

  const menuItemVariants = {
    initial: { x: -20, opacity: 0 },
    animate: (i) => ({
      x: 0,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
    exit: { x: -20, opacity: 0 },
  }

  return (
    <div className="flex flex-col md:flex-row *:text-gray-800 w-full min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <button
          onClick={toggleMenu}
          className="p-2 rounded-full bg-white shadow-md text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-72 bg-white shadow-lg h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
              <FiUser size={20} />
            </div>
            <div>
              <h2 className="font-bold text-gray-800">User Dashboard</h2>
              <p className="text-sm text-gray-500">Manage your account</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item, index) => (
              <motion.li key={item.path} custom={index} initial="initial" animate="animate" variants={menuItemVariants}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeItem === item.path
                      ? "bg-orange-50 text-orange-600 font-medium shadow-sm"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => handleItemClick(item.path)}
                >
                  <span
                    className={`w-9 h-9 flex items-center justify-center rounded-full ${
                      activeItem === item.path ? "bg-orange-100" : "bg-gray-100"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="ml-3">{item.name}</span>
                  {activeItem === item.path && (
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-orange-500 ml-auto" layoutId="activeIndicator" />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              to="logout"
              className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
              onClick={() => handleItemClick("logout")}
            >
              <span className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100">
                <FiLogOut size={20} />
              </span>
              <span className="ml-3">Logout</span>
            </Link>
          </div>
        </nav>

        <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-100">
          © {new Date().getFullYear()} Restaurant. All rights reserved.
        </div>
      </div>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
              onClick={toggleMenu}
            />

            <motion.div
              className="fixed top-0 left-0 h-full w-72 bg-white z-50 md:hidden overflow-y-auto"
              variants={sidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <FiUser size={20} />
                  </div>
                  <h2 className="font-bold text-gray-800">Menu</h2>
                </div>
                <button onClick={toggleMenu} className="p-2 rounded-full hover:bg-gray-100 text-gray-500">
                  <FiX size={20} />
                </button>
              </div>

              <nav className="py-6 px-4">
                <ul className="space-y-1">
                  {menuItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      custom={index}
                      initial="initial"
                      animate="animate"
                      variants={menuItemVariants}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                          activeItem === item.path
                            ? "bg-orange-50 text-orange-600 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => handleItemClick(item.path)}
                      >
                        <span
                          className={`w-9 h-9 flex items-center justify-center rounded-full ${
                            activeItem === item.path ? "bg-orange-100" : "bg-gray-100"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span className="ml-3">{item.name}</span>
                      </Link>
                    </motion.li>
                  ))}

                  <motion.li custom={menuItems.length} initial="initial" animate="animate" variants={menuItemVariants}>
                    <Link
                      to="logout"
                      className="flex items-center px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200 mt-6"
                      onClick={() => handleItemClick("logout")}
                    >
                      <span className="w-9 h-9 flex items-center justify-center rounded-full bg-red-100">
                        <FiLogOut size={20} />
                      </span>
                      <span className="ml-3">Logout</span>
                    </Link>
                  </motion.li>
                </ul>
              </nav>

              <div className="p-4 text-center text-xs text-gray-500 border-t border-gray-100 absolute bottom-0 w-full">
                © {new Date().getFullYear()} Restaurant. All rights reserved.
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 max-w-5xl mx-auto">
          <Routes>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="favourites" element={<Favourites />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order" element={<Order />} />
            <Route path="Dine" element={<Dinein />} />
            <Route path="contact" element={<Contact />} />
            <Route path="addresses" element={<Addresses />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default UserNav