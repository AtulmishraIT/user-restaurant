"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import axios from "axios"
import { SearchIcon, Star, Plus, Minus, ShoppingCart, DiamondIcon as Indian, Leaf, Drumstick } from "lucide-react"

function Search() {
  const [search, setSearch] = useState("")
  const [cart, setCart] = useState([])
  const [foodData, setFoodData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const GetFoodData = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get("http://localhost:5000/getFoodData")
        setFoodData(Array.isArray(response.data.foodItems) ? response.data.foodItems : [])
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    GetFoodData()
  }, [])

  useEffect(() => {
    // Initialize cart from localStorage and filter out non-cart items
    const storedCart = Object.keys(localStorage)
      .map((key) => {
        try {
          const item = JSON.parse(localStorage.getItem(key))
          // Check if the item has the properties of a cart item
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

  // Filter food items based on the search query
  const filteredFoodItems =
    foodData.length > 0 && foodData[0]?.foodItems
      ? foodData[0].foodItems.filter((item) => item.name && item.name.toLowerCase().includes(search.toLowerCase()))
      : []

  const AddtoCart = (food) => {
    const existingItem = cart.find((item) => item.id === food.id)
    let updatedCart
    if (existingItem) {
      updatedCart = cart.map((item) => (item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item))
    } else {
      updatedCart = [...cart, { ...food, quantity: 1 }]
    }
    setCart(updatedCart)
    localStorage.setItem(food.id, JSON.stringify(updatedCart.find((item) => item.id === food.id)))
  }

  const updateQuantity = (foodId, quantity) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === foodId) {
          const updatedItem = { ...item, quantity: item.quantity + quantity }
          if (updatedItem.quantity > 0) localStorage.setItem(foodId, JSON.stringify(updatedItem))
          else {
            localStorage.removeItem(foodId)
          }
          return updatedItem
        }
        return item
      })
      .filter((item) => item.quantity > 0) // Remove items with quantity 0
    setCart(updatedCart)
  }

  return (
    <div className="min-h-screen mt-8 bg-gradient-to-b from-slate-50 to-slate-100 py-24 px-4">
      {/* Search Bar - Fixed at top */}
      <div className="fixed top-[67px] left-0 right-0 z-10 bg-white shadow-md py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center bg-white rounded-full border border-gray-300 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-center p-3 text-gray-500">
              <SearchIcon size={20} />
            </div>
            <input
              type="text"
              placeholder="Search for delicious food..."
              value={search}
              className="w-full p-3 outline-none text-gray-700"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 transition-colors duration-300">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Cart Count Badge */}
      {cart.length > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed top-20 right-6 z-20 bg-green-600 text-white rounded-full p-3 shadow-lg"
        >
          <a href="/cart"><ShoppingCart size={20} /></a>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
            {cart.reduce((total, item) => total + item.quantity, 0)}
          </span>
        </motion.div>
      )}

      {/* Food Items Grid */}
      <div className="max-w-7xl mx-auto pt-16">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : filteredFoodItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFoodItems.map((food) => (
              <motion.div
                key={food.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
              >
                <div className="relative h-48 overflow-hidden">
                  <img className="w-full h-full object-cover" src={food.image || "/placeholder.svg"} alt={food.name} />
                  <div className="absolute top-3 right-3 bg-white rounded-full p-1 shadow">
                    {food.category === "Non-veg" ? (
                      <Drumstick className="text-red-500" size={18} />
                    ) : (
                      <Leaf className="text-green-500" size={18} />
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{food.name}</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      5.0
                    </span>
                  </div>

                  <div className="flex items-center mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className={i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"} />
                    ))}
                  </div>

                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center text-gray-800">
                      <Indian size={18} className="mr-1" />
                      <span className="font-bold text-xl">₹{food.price}</span>
                    </div>

                    <AnimatePresence mode="wait">
                      {cart.find((item) => item.id === food.id) ? (
                        <motion.div
                          key="quantity-controls"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center border border-gray-200 rounded-lg overflow-hidden"
                        >
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            onClick={() => updateQuantity(food.id, -1)}
                          >
                            <Minus size={16} />
                          </motion.button>
                          <motion.span
                            key={cart.find((item) => item.id === food.id)?.quantity}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="px-3 font-bold text-green-600"
                          >
                            {cart.find((item) => item.id === food.id)?.quantity}
                          </motion.span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
                            onClick={() => updateQuantity(food.id, 1)}
                          >
                            <Plus size={16} />
                          </motion.button>
                        </motion.div>
                      ) : (
                        <motion.button
                          key="add-to-cart"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center transition-colors duration-300"
                          onClick={() => AddtoCart(food)}
                        >
                          <ShoppingCart size={16} className="mr-1" />
                          Add to Cart
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <SearchIcon size={48} className="text-gray-400 mb-4" />
            <p className="text-xl text-gray-500 mb-2">No matching food items found</p>
            <p className="text-gray-400">Try a different search term</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Search

