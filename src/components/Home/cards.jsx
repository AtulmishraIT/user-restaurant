"use client"

import { useEffect, useState } from "react"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import "boxicons/css/boxicons.min.css"

function FoodCards() {
  const [category, setCategory] = useState("")
  const [cart, setCart] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [fav, setFav] = useState({})
  const [foodData, setFoodData] = useState()
  const [showToast, setShowToast] = useState({ visible: false, message: "" })
  const email = localStorage.getItem("userEmail")

  // Fetch food data
  useEffect(() => {
    const getFoodData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/getFoodData")
        setFoodData(Array.isArray(response.data.foodItems) ? response.data.foodItems : [])
      } catch (error) {
        console.log(error)
      }
    }
    getFoodData()
  }, [])

  // Initialize cart from localStorage
  useEffect(() => {
    const storedCart = Object.keys(localStorage)
      .map((key) => {
        try {
          const item = JSON.parse(localStorage.getItem(key))
          if (item && item.id && item.quantity) {
            return item
          }
        } catch (e) {
          return null
        }
        return null
      })
      .filter((item) => item !== null)
    setCart(storedCart)
  }, [])

  // Clear localStorage if not logged in
  useEffect(() => {
    if (!email) {
      localStorage.clear()
    }
  }, [email])

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  // Handle category filter change
  const handleCheckboxChange = (e) => {
    try {
      if (e.target.checked) {
        setTimeout(() => {
          setCategory(e.target.value)
        }, 100)
      } else {
        setCategory("")
      }
    } finally {
    }
  }

  // Display toast notification
  const displayToast = (message) => {
    setShowToast({ visible: true, message })
    setTimeout(() => {
      setShowToast({ visible: false, message: "" })
    }, 3000)
  }

  // Add item to cart
  const addToCart = (food) => {
    if (!email) {
      displayToast("Please login to add items to cart")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
      return
    }

    const existingItem = cart.find((item) => item.id === food.id)
    let updatedCart

    if (existingItem) {
      updatedCart = cart.map((item) => (item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }]
    }

    setCart(updatedCart)
    localStorage.setItem(food.id, JSON.stringify(updatedCart.find((item) => item.id === food.id)))
    displayToast(`${food.name} added to cart!`)
  }

  // Update item quantity in cart
  const updateQuantity = (foodId, quantity) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === foodId) {
          const updatedItem = { ...item, quantity: item.quantity + quantity }
          if (updatedItem.quantity > 0) {
            localStorage.setItem(foodId, JSON.stringify(updatedItem))
            displayToast(`Cart updated!`)
          } else {
            localStorage.removeItem(foodId)
            displayToast(`Item removed from cart`)
          }
          return updatedItem
        }
        return item
      })
      .filter((item) => item.quantity > 0)

    setCart(updatedCart)
  }

  // Toggle favorite status
  const handleFav = (foodId) => {
    if (!email) {
      displayToast("Please login to add favorites")
      setTimeout(() => {
        window.location.href = "/login"
      }, 1000)
      return
    }

    setFav((prevFav) => ({
      ...(prevFav !== foodId.id),
      [foodId.id]: !prevFav[foodId.id],
    }))

    try {
      axios
        .post("http://localhost:8000/fav", {
          email,
          foodId,
        })
        .then((res) => {
          displayToast(fav[foodId.id] ? "Removed from favorites" : "Added to favorites")
        })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="bg-white mt-10 min-h-screen ml-6 max-sm:ml-4 max-sm:w-full pb-20">
      
      {/* Toast notification */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          >
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with logo */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <i className="bx bxs-restaurant text-5xl text-amber-600">AB</i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Delicious Menu</h1>
          <p className="text-gray-500 mt-2 text-center max-w-2xl">
            Discover our wide range of mouth-watering dishes prepared with the finest ingredients
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-10">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <input
              type="checkbox"
              id="veg-filter"
              value="Veg"
              checked={category === "Veg"}
              onChange={handleCheckboxChange}
              className="w-4 h-4 accent-green-500"
            />
            <label htmlFor="veg-filter" className="flex items-center cursor-pointer">
              <div className="w-6 h-6 mr-2 bg-green-100 rounded-full flex items-center justify-center">
                <i className="bx bxs-leaf text-green-600"></i>
              </div>
              <span className="font-medium">Vegetarian</span>
            </label>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow">
            <input
              type="checkbox"
              id="non-veg-filter"
              value="Non-veg"
              checked={category === "Non-veg"}
              onChange={handleCheckboxChange}
              className="w-4 h-4 accent-red-500"
            />
            <label htmlFor="non-veg-filter" className="flex items-center cursor-pointer">
              <div className="w-6 h-6 mr-2 bg-red-100 rounded-full flex items-center justify-center">
                <i className="bx bxs-food-menu text-red-600"></i>
              </div>
              <span className="font-medium">Non-Vegetarian</span>
            </label>
          </div>
        </div>
      </div>

      {/* Food cards grid */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          // Loading skeletons
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                  <Skeleton height={200} className="w-full" />
                  <div className="p-5 space-y-3">
                    <Skeleton height={24} width="75%" />
                    <Skeleton height={16} width="50%" />
                    <div className="flex justify-between items-center pt-2">
                      <Skeleton height={24} width={80} />
                      <Skeleton height={40} width={120} className="rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          // Actual food cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {foodData &&
              foodData[0]?.foodItems
                .filter((food) => !category || food.category === category)
                .map((food) => (
                  <motion.div
                    key={food.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {/* Food image */}
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={food.image || "/placeholder.svg"}
                        alt={food.name}
                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                      />

                      {/* Category badge */}
                      <div
                        className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
                          food.category === "Non-veg" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                        }`}
                      >
                        {food.category}
                      </div>

                      {/* Favorite button */}
                      <button
                        onClick={() => handleFav(food)}
                        className="absolute top-3 left-3 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
                        aria-label={fav[food.id] ? "Remove from favorites" : "Add to favorites"}
                      >
                        <i
                          className={`bx ${fav[food.id] ? "bxs-heart text-red-500" : "bx-heart text-gray-500"} text-xl`}
                        ></i>
                      </button>
                    </div>

                    {/* Food details */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold mb-1 text-gray-800">{food.name}</h3>

                      {/* Ratings */}
                      <div className="flex items-center mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i
                            key={star}
                            className={`bx bxs-star ${star <= 4 ? "text-yellow-400" : "text-gray-300"}`}
                          ></i>
                        ))}
                        <span className="ml-2 text-xs font-medium text-gray-500">4.0 (120)</span>
                      </div>

                      {/* Price and actions */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center">
                          <i className="bx bx-rupee text-xl"></i>
                          <span className="text-gray-800 font-bold text-xl">{food.price}</span>
                        </div>

                        <AnimatePresence mode="wait">
                          {cart.find((item) => item.id === food.id) ? (
                            <motion.div
                              key="quantity-controls"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center bg-gray-100 rounded-full overflow-hidden"
                            >
                              <button
                                onClick={() => updateQuantity(food.id, -1)}
                                className="p-2 hover:bg-gray-200 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <i className="bx bx-minus"></i>
                              </button>

                              <motion.span
                                key={cart.find((item) => item.id === food.id)?.quantity}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-8 text-center font-bold"
                              >
                                {cart.find((item) => item.id === food.id)?.quantity}
                              </motion.span>

                              <button
                                onClick={() => updateQuantity(food.id, 1)}
                                className="p-2 hover:bg-gray-200 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <i className="bx bx-plus"></i>
                              </button>
                            </motion.div>
                          ) : (
                            <motion.button
                              key="add-button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => addToCart(food)}
                              className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors"
                            >
                              <i className="bx bx-cart-add"></i>
                              <span>Add</span>
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading &&
          foodData &&
          foodData[0]?.foodItems.filter((food) => !category || food.category === category).length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 opacity-30 flex items-center justify-center">
                <i className="bx bx-dish text-6xl text-gray-400"></i>
              </div>
              <h3 className="text-xl font-medium text-gray-500">No items found</h3>
              <p className="text-gray-400 mt-2">Try changing your filter or check back later</p>
            </div>
          )}
      </div>

      {/* Floating cart button */}
      {cart.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="fixed bottom-6 right-6">
          <a
            href="/cart"
            className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
          >
            <i className="bx bxs-cart text-xl"></i>
            <span className="font-medium">View Cart ({cart.reduce((acc, item) => acc + item.quantity, 0)})</span>
          </a>
        </motion.div>
      )}
    </div>
  )
}

export default FoodCards

