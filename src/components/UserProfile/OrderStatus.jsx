"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Home,
  ChevronLeft,
  FileText,
  Send,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  AlertCircle,
  Truck,
  Package,
  ChefHat,
  Receipt,
  Utensils,
} from "lucide-react"

// Fix for default icon issue with Leaflet
const fixLeafletIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  })
}

// Custom icons for markers
const createCustomIcon = (iconUrl, size = [40, 40]) => {
  return new L.Icon({
    iconUrl,
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
    popupAnchor: [0, -size[1]],
  })
}

const OrderStatus = () => {
  const [orderPhase, setOrderPhase] = useState("received")
  const [previousPhase, setPreviousPhase] = useState(null)
  const [currentPosition, setCurrentPosition] = useState([19.2173692, 73.15]) // Default position
  const [userAddress, setUserAddress] = useState([19.2173692, 73.1659614]) // Default user address
  const [distance, setDistance] = useState(null)
  const [duration, setDuration] = useState(null)
  const [foodData, setFoodData] = useState([])
  const [isDelivered, setIsDelivered] = useState(false)
  const [order, setOrder] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")
  const [showFeedbackForm, setShowFeedbackForm] = useState(false)

  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: "",
    foodQuality: null,
    deliveryTime: null,
    packaging: null,
  })
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false)
  const [restaurantIcon, setRestaurantIcon] = useState(null)
  const [homeIcon, setHomeIcon] = useState(null)
  const [pollingInterval, setPollingInterval] = useState(null)
  const [orders, setOrders] = useState([])

  const email = localStorage.getItem("userEmail");
  const orderPhases = ["received", "processing", "cooking", "out for delivery", "delivered"]
  const isOrderAdded = typeof window !== "undefined" ? localStorage.getItem("orderAdded") : null
  const mapRef = useRef(null)

  // Initialize Leaflet icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      fixLeafletIcon()
      setRestaurantIcon(createCustomIcon("https://cdn-icons-png.flaticon.com/512/8090/8090408.png"))
      setHomeIcon(createCustomIcon("https://cdn-icons-png.flaticon.com/512/1946/1946488.png"))
    }
  }, [])

  // Fetch cart items
  useEffect(() => {
    const getFoodData = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:8000/getCartItems", {
          params: { email },
        })
        console.log("Cart Items Response:", response.data, email); // Debug the response
        setFoodData(response.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
        setLoading(false)
      }
    }

    if (email) {
      getFoodData()
    }
  }, [email])

  // Get user location and address
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentPosition([position.coords.latitude, position.coords.longitude])
      })
    }

    const fetchUserAddress = async () => {
      if (!email) return

      try {
        const response = await axios.get("http://localhost:8000/cart/address", {
          params: { email },
        })

        // Here you would typically geocode the address to get coordinates
        // For now, we'll keep using the default coordinates
      } catch (error) {
        console.error("Error fetching user address:", error)
      }
    }

    fetchUserAddress()
  }, [email])

  // Add order to database if not already added
  useEffect(() => {
    const addOrderToDatabase = async () => {
      if (!email || !foodData.length || localStorage.getItem("userOrderAdded")) return

      try {
        await axios.post("http://localhost:8000/cart/ordered", { email })
        localStorage.setItem("userOrderAdded", "true")
      } catch (error) {
        console.error("Error adding ordered items:", error)
      }
    }

    addOrderToDatabase()

    if (foodData.length > 0 && !localStorage.getItem("orderAdded")) {
      const sendOrderToDatabase = async () => {
        const orderDetails = {
          id: Math.floor(Math.random() * (1000000000 - 1 + 1)) + 1,
          date: new Date(),
          total: foodData.reduce((acc, item) => acc + item.price * item.quantity, 0),
          items: foodData.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          phase: "received",
        }

        localStorage.setItem("orderId", orderDetails.id)
        localStorage.setItem("orderAdded", "true")

        try {
          await axios.post("http://localhost:8000/orders", orderDetails)
        } catch (error) {
          console.error("Error sending order to database:", error)
        }
      }

      sendOrderToDatabase()
    }
  }, [foodData, email])

  // Poll for order updates instead of reloading the page
  useEffect(() => {
    const fetchOrderStatus = async () => {
      const orderId = localStorage.getItem("orderId")
      if (!orderId) return

      try {
        const response = await axios.get("http://localhost:8000/getOrders")
        const currentOrder = response.data.orders.find((o) => o.id === Number.parseInt(orderId))

        if (currentOrder) {
          setOrder(currentOrder)

          // Only update if the phase has changed
          if (currentOrder.phase !== orderPhase) {
            setPreviousPhase(orderPhase)
            setOrderPhase(currentOrder.phase)
          }
        }
      } catch (error) {
        console.error("Error fetching order status:", error)
      }
    }

    // Set up polling interval (every 5 seconds)
    const interval = setInterval(fetchOrderStatus, 5000)
    setPollingInterval(interval)

    // Initial fetch
    fetchOrderStatus()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [orderPhase])

  // Handle order delivered state
  useEffect(() => {
    if (orderPhase === "delivered" && previousPhase !== "delivered") {
      setIsDelivered(true)

      // Show feedback form after a short delay
      setTimeout(() => {
        setShowFeedbackForm(true)
      }, 1000)

      // Clean up localStorage
      const cleanupLocalStorage = async () => {
        localStorage.removeItem("orderAdded")
        localStorage.removeItem("userOrderAdded")

        // Remove all numeric keys (order items)
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key && key.match(/^[0-9]+$/)) {
            localStorage.removeItem(key)
          }
        }

        try {
          await axios.post("http://localhost:8000/deleteCartItems", { email })
        } catch (error) {
          console.error("Error deleting cart items:", error)
        }
      }

      cleanupLocalStorage()

      // Stop polling for updates
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [orderPhase, previousPhase, email, pollingInterval])

  // Calculate route between restaurant and user
  useEffect(() => {
    const calculateRoute = async () => {
      // In a real app, you would use a routing API like Mapbox or Google Maps
      // For this example, we'll just simulate a random duration
      setDuration(Math.floor(Math.random() * 20) + 10) // Random time between 10-30 minutes
    }

    calculateRoute()
  }, [currentPosition, userAddress])

  // Handle feedback submission
  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
  
    if (feedback.rating === 0) {
      alert("Please select a rating before submitting");
      return;
    }
  
    setFeedbackSubmitting(true);
  
    try {
      // Send feedback to the backend
      const response = await axios.post("http://localhost:8000/feedback", {
        orderId: order.id,
        email,
        ...feedback,
      });
  
      console.log(response.data.message); // Log success message
      setFeedbackSubmitted(true);
      setFeedbackSubmitting(false);
      alert("Feedback submitted successfully. Thank you!");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setFeedbackSubmitting(false);
      alert("Failed to submit feedback. Please try again.");
    }
  };

  // Format date and time
  const formatTime = (dateString) => {
    if (!dateString) return "..."
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (dateString) => {
    if (!dateString) return "..."
    const date = new Date(dateString)
    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  // Get the appropriate icon for the current order phase
  const getPhaseIcon = (phase) => {
    switch (phase) {
      case "received":
        return <Receipt className="w-6 h-6 text-blue-500" />
      case "processing":
        return <Package className="w-6 h-6 text-yellow-500" />
      case "cooking":
        return <ChefHat className="w-6 h-6 text-orange-500" />
      case "out for delivery":
        return <Truck className="w-6 h-6 text-purple-500" />
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />
      default:
        return <AlertCircle className="w-6 h-6 text-gray-500" />
    }
  }

  // Get color for the current phase
  const getPhaseColor = (phase) => {
    switch (phase) {
      case "received":
        return "bg-blue-500"
      case "processing":
        return "bg-yellow-500"
      case "cooking":
        return "bg-orange-500"
      case "out for delivery":
        return "bg-purple-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  // Render star rating component
  const StarRating = ({ rating, setRating }) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
            <Star
              className={`w-8 h-8 ${star <= feedback.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Render feedback option buttons
  const FeedbackOption = ({ name, value, options, onChange }) => {
    return (
      <div className="mt-4">
        <p className="text-sm font-medium text-gray-700 mb-2">{name}</p>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => onChange(true)}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${
              value === true
                ? "bg-green-100 text-green-800 border border-green-300"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            <ThumbsUp className={`w-4 h-4 mr-1 ${value === true ? "text-green-600" : "text-gray-500"}`} />
            {options[0]}
          </button>
          <button
            type="button"
            onClick={() => onChange(false)}
            className={`px-4 py-2 rounded-full text-sm flex items-center ${
              value === false
                ? "bg-red-100 text-red-800 border border-red-300"
                : "bg-gray-100 text-gray-700 border border-gray-200"
            }`}
          >
            <ThumbsDown className={`w-4 h-4 mr-1 ${value === false ? "text-red-600" : "text-gray-500"}`} />
            {options[1]}
          </button>
        </div>
      </div>
    )
  }

  const filteredOrders = orders
    .filter((order) => {
      // Apply search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        return (
          order.orderId.toLowerCase().includes(searchLower) ||
          order.restaurant.name.toLowerCase().includes(searchLower) ||
          order.items.some((item) => item.name.toLowerCase().includes(searchLower))
        )
      }
      return true
    })
    .filter((order) => {
      // Apply status filter
      if (filterStatus === "all") return true
      return order.status.toLowerCase() === filterStatus.toLowerCase()
    })
    .sort((a, b) => {
      // Apply sorting
      const dateA = new Date(a.orderDate)
      const dateB = new Date(b.orderDate)
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB
    })

  // Mock data for preview - in production, use the actual orders data from API
  const mockOrders =
    filteredOrders.length > 0
      ? filteredOrders
      : [
          {
            orderId: "ORD123456789",
            orderDate: "2023-04-15T12:30:00Z",
            status: "Delivered",
            restaurant: {
              name: "Spice Garden Restaurant",
              image: "/placeholder.svg",
            },
            items: [
              { name: "Butter Chicken", quantity: 2 },
              { name: "Garlic Naan", quantity: 4 },
            ],
            total: 1281,
          },
          {
            orderId: "ORD987654321",
            orderDate: "2023-04-10T18:45:00Z",
            status: "In Transit",
            restaurant: {
              name: "Pizza Paradise",
              image: "/placeholder.svg",
            },
            items: [
              { name: "Margherita Pizza", quantity: 1 },
              { name: "Pepperoni Pizza", quantity: 1 },
            ],
            total: 850,
          },
          {
            orderId: "ORD456789123",
            orderDate: "2023-04-05T20:15:00Z",
            status: "Cancelled",
            restaurant: {
              name: "Burger Bliss",
              image: "/placeholder.svg",
            },
            items: [
              { name: "Cheese Burger", quantity: 2 },
              { name: "French Fries", quantity: 1 },
            ],
            total: 450,
          },
        ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error && !email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.replace("/login")}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  const gst = Math.round(order.total * 0.12 || 0); // Default to 0 if order.total is undefined
  const discount = 20; // Assuming a fixed discount
  const deliveryFee = 20; // Assuming a fixed delivery fee
  const totalAmount = (order.total || 0) + gst - discount + deliveryFee; // Avoid NaN by defaulting to 0
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-12 -mr-10">
      <div className="max-w-7xl mx-auto">
        {isDelivered ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <button
              onClick={() => window.location.replace("/")}
              className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mb-4"
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Back to Home
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <CheckCircle className="mr-3 h-8 w-8 text-green-500" />
                Order Delivered
              </h1>

              <button
                onClick={() => window.location.replace(`/invoice?id=${order.id}`)}
                className="mt-4 md:mt-0 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 font-medium transition-colors duration-200 flex items-center shadow-sm"
              >
                <FileText className="mr-2 h-5 w-5" /> View Invoice
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">Order Tracking</h1>
            <p className="mt-2 text-gray-600">Track your order in real-time</p>
          </div>
        )}

        {/* Order Progress Bar - Show even when delivered */}
        <div className="mb-10 px-4">
          <div className="relative">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${getPhaseColor(orderPhase)}`}
                style={{
                  width: `${((orderPhases.indexOf(orderPhase) + 1) * 100) / orderPhases.length}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between">
              {orderPhases.map((phase, index) => (
                <div
                  key={phase}
                  className={`flex flex-col items-center ${
                    orderPhases.indexOf(orderPhase) >= index ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`rounded-full transition-all duration-500 flex items-center justify-center w-10 h-10 ${
                      orderPhases.indexOf(orderPhase) >= index ? getPhaseColor(phase) : "bg-gray-200"
                    }`}
                  >
                    {orderPhases.indexOf(orderPhase) > index ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : orderPhases.indexOf(orderPhase) === index ? (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    ) : (
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs font-medium mt-2 hidden sm:block capitalize">{phase}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Form - Only show when delivered and feedback not submitted */}
        <AnimatePresence>
          {showFeedbackForm && !feedbackSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-amber-50">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5 text-amber-500" />
                  How was your experience?
                </h2>
                <p className="text-gray-600 mt-1">Your feedback helps us improve our service</p>
              </div>

              <form onSubmit={handleFeedbackSubmit} className="p-6">
                <div className="mb-6 text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Rate your overall experience</label>
                  <StarRating rating={feedback.rating} setRating={(rating) => setFeedback({ ...feedback, rating })} />
                </div>

                <FeedbackOption
                  name="Food Quality"
                  value={feedback.foodQuality}
                  options={["Good", "Could be better"]}
                  onChange={(value) => setFeedback({ ...feedback, foodQuality: value })}
                />

                <FeedbackOption
                  name="Delivery Time"
                  value={feedback.deliveryTime}
                  options={["On time", "Delayed"]}
                  onChange={(value) => setFeedback({ ...feedback, deliveryTime: value })}
                />

                <FeedbackOption
                  name="Packaging"
                  value={feedback.packaging}
                  options={["Good", "Poor"]}
                  onChange={(value) => setFeedback({ ...feedback, packaging: value })}
                />

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Comments</label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-amber-500 focus:border-amber-500"
                    rows="3"
                    placeholder="Tell us more about your experience..."
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                  ></textarea>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowFeedbackForm(false)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
                  >
                    Skip
                  </button>
                  <button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 flex items-center"
                  >
                    {feedbackSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Submit Feedback
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Feedback Submitted Message */}
        <AnimatePresence>
          {feedbackSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 bg-green-50 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-6 flex items-start">
                <div className="flex-shrink-0 bg-green-100 rounded-full p-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-green-800">Thank you for your feedback!</h3>
                  <p className="mt-1 text-sm text-green-700">
                    We appreciate you taking the time to share your experience with us.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isDelivered ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Order Details Card */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">Order Details</h2>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPhaseColor(orderPhase)} text-white`}
                  >
                    {orderPhase}
                  </div>
                </div>

                {order && (
                  <>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Order ID</div>
                      <div className="font-medium">#{order.id}</div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Date & Time</div>
                      <div className="font-medium">
                        {order.date ? (
                          <>
                            {formatDate(order.date)} <br />
                            <span className="text-sm text-gray-500">{formatTime(order.date)}</span>
                          </>
                        ) : (
                          "..."
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                      <div className="text-sm text-gray-600">Items</div>
                      <div className="font-medium">{order.items ? order.items.length : 0}</div>
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-lg font-bold">₹{totalAmount}</div>
                    </div>

                    {/* Current Status */}
                    <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                      {getPhaseIcon(orderPhase)}
                      <div className="ml-3">
                        <div className="font-medium">
                          Status: <span className="capitalize">{orderPhase}</span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {orderPhase === "received" && "We've received your order!"}
                          {orderPhase === "processing" && "Your order is being processed."}
                          {orderPhase === "cooking" && "Your food is being prepared."}
                          {orderPhase === "out for delivery" && "Your food is on the way!"}
                          {orderPhase === "delivered" && "Your order has been delivered."}
                        </div>
                      </div>
                    </div>

                    {/* Estimated Delivery */}
                    {orderPhase === "out for delivery" && (
                      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <Clock className="w-5 h-5 text-blue-500" />
                          <div className="ml-3">
                            <div className="font-medium text-blue-800">Estimated Delivery</div>
                            <div className="text-sm text-blue-600">
                              {duration ? `${Math.ceil(duration)} minutes` : "Calculating..."}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Map Card */}
            <div className="lg:col-span-3 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-[500px] relative">
                {typeof window !== "undefined" && restaurantIcon && homeIcon && (
                  <MapContainer
                    center={currentPosition}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-full w-full z-0"
                    ref={mapRef}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={currentPosition} icon={restaurantIcon}>
                      <Popup>Restaurant Location</Popup>
                    </Marker>
                    <Marker position={userAddress} icon={homeIcon}>
                      <Popup>Delivery Address</Popup>
                    </Marker>
                    <Polyline
                      positions={[currentPosition, userAddress]}
                      color="#4F46E5"
                      weight={4}
                      opacity={0.7}
                      dashArray={orderPhase === "out for delivery" ? "" : "10, 10"}
                    />
                  </MapContainer>
                )}

                {/* Map Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    <div>
                      <div className="text-sm opacity-80">Estimated Delivery Time</div>
                      <div className="text-xl font-bold">
                        {duration ? `${Math.ceil(duration)} minutes` : "Calculating..."}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center">
              <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>

              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Delivered Successfully!</h2>
                <p className="text-gray-600 mb-4">Your food has been delivered. We hope you enjoy your meal!</p>

                {order && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 inline-block">
                    <p className="text-sm text-gray-500 mb-1">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 mb-1">Date: {order.date ? formatDate(order.date) : "..."}</p>
                    <p className="text-sm text-gray-500 mb-1">Time: {order.date ? formatTime(order.date) : "..."}</p>
                    <p className="text-sm text-gray-500">Total: ₹{totalAmount}</p>
                  </div>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <button
                    onClick={() => window.location.replace("/")}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Home className="mr-2 h-4 w-4" /> Return to Home
                  </button>

                  <button
                    onClick={() => window.location.replace(`/invoice?id=${order.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700"
                  >
                    <FileText className="mr-2 h-4 w-4" /> View Invoice
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Items */}
        {order && order.items && order.items.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Utensils className="mr-2 h-5 w-5 text-amber-500" /> Order Items
              </h2>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, index) => (
                  <div key={index} className="py-4 flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-gray-500">₹{item.price} each</div>
                      </div>
                    </div>
                    <div className="font-bold">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                <div className="font-medium">Total</div>
                <div className="text-xl font-bold">₹{totalAmount}</div>
              </div>
            </div>
          </div>
        )}
      </div>
      <a href="/invoice" className="">
        <button className="fixed bottom-4 right-4 bg-amber-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-amber-700 transition duration-200 flex items-center">
          <FileText className="mr-2 h-5 w-5" /> View Invoice
        </button>
      </a>
    </div>
  )
}

export default OrderStatus
