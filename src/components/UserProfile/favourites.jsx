"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { motion, AnimatePresence } from "framer-motion"

function Favourites() {
  const [favData, setFavData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState({ show: false, message: "", type: "" })
  const email = localStorage.getItem("userEmail")

  useEffect(() => {
    const handleFav = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:8000/getFav", {
          params: { email },
        })
        setFavData(response.data)
      } catch (error) {
        console.error(error)
        showNotification("Failed to load favorites. Please try again.", "error")
      }
      setIsLoading(false)
    }

    handleFav()
  }, [email])

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type })
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" })
    }, 3000)
  }

  const addToCart = async (foodItem) => {
    try {
      // Fetch existing cart items
      const cartResponse = await axios.get("http://localhost:8000/getCartItems", {
        params: { email },
      })

      const existingCartItems = cartResponse.data || []

      // Check if the item is already in the cart
      const itemIndex = existingCartItems.findIndex((item) => item.foodId === foodItem.id)
      if (itemIndex !== -1) {
        // If the item is already in the cart, increase the quantity
        existingCartItems[itemIndex].quantity += 1
      } else {
        // If the item is not in the cart, add it with quantity 1
        existingCartItems.push({
          foodId: foodItem.id,
          name: foodItem.name,
          image: foodItem.image,
          quantity: 1,
          price: foodItem.price,
        })
      }

      // Save the updated cart items
      const response = await axios.post("http://localhost:8000/cart/save", {
        email,
        cartItems: existingCartItems,
      })

      if (response.status === 200) {
        showNotification("Item added to cart successfully!", "success")
        localStorage.setItem(foodItem.id, JSON.stringify(existingCartItems))
        try {
          // Remove the item from favourites
          const removeFromFavResponse = await axios.post("http://localhost:8000/deleteFav", {
            email,
            foodId: foodItem.id, // Send the foodId to remove from favourites
          })
          if (removeFromFavResponse.status === 200) {
            console.log("Item removed from favourites successfully!")
            // Update the favData state to remove the item from the UI
            setFavData(favData.filter((item) => item.id !== foodItem.id))
          } else {
            console.error("Failed to remove item from favourites.")
          }
        } catch (error) {
          console.error("Error removing item from favourites:", error)
          showNotification("There was an error removing the item from favourites.", "error")
        }
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
      showNotification("There was an error adding the item to the cart.", "error")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg ${
              notification.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">My Favorites</h1>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6)
              .fill()
              .map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Skeleton height={120} width={120} className="rounded-lg" />
                      <div className="flex-1">
                        <Skeleton height={24} width="80%" className="mb-2" />
                        <Skeleton height={20} width="60%" className="mb-2" />
                        <Skeleton height={36} width={100} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div>
            {favData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <AnimatePresence>
                  {favData.map((item, index) => (
                    <motion.div
                      key={item.id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg">
                            <img
                              src={item.image || "/placeholder.svg?height=128&width=128"}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                              onError={(e) => {
                                e.target.src = "/placeholder.svg?height=128&width=128"
                              }}
                            />
                            <div className="absolute top-0 right-0">
                              <span className="inline-flex items-center rounded-bl-lg rounded-tr-lg bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              ₹{Number.parseFloat(item.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h2 className="text-lg font-semibold text-gray-800 mb-1">{item.name}</h2>
                              <div className="flex items-center mb-2">
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`h-4 w-4 ${i < 4 ? "text-yellow-400" : "text-gray-300"}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">(4.0)</span>
                              </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-gray-600 text-sm">
                                <span className="font-medium">Total:</span> ₹{Number.parseFloat(item.price).toFixed(2)}
                              </p>
                              <button
                                className="flex items-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors duration-200"
                                onClick={() => addToCart(item)}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                  />
                                </svg>
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="bg-gray-100 rounded-full p-6 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">No favorites yet</h2>
                <p className="text-gray-600 max-w-md mb-6">
                  Explore our menu and add your favorite items to see them here.
                </p>
                <a
                  href="/menu"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Browse Menu
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Add CSS for staggered animation
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
document.head.appendChild(style)

export default Favourites

