"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import {
  Calendar,
  Clock,
  Info,
  Mail,
  MapPin,
  Phone,
  User,
  Check,
  AlertCircle,
  Loader2,
  Utensils,
  Coffee,
  Users,
  BookOpen,
} from "lucide-react"

const initialChairs = [
  { chairs: 1, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 2, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 3, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 4, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 5, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 6, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 7, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 8, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 9, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 10, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 11, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 12, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 13, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 14, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 15, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
  { chairs: 16, occupied: false, userEmail: null, userName: null, userPhone: null, time: null },
]

const Dine = () => {
  const [chairs, setChairs] = useState([])
  const [selectedChair, setSelectedChair] = useState(null)
  const [userName, setName] = useState("")
  const [userPhone, setPhone] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(true)
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [showLegend, setShowLegend] = useState(false)

  const email = localStorage.getItem("userEmail")

  const sendChairs = async () => {
    try {
      const response = await axios.post("http://localhost:8000/Dine/setChairs", { email, chairs: initialChairs })
      return response.data
    } catch (error) {
      console.error("Error setting chairs:", error)
      setError("Failed to initialize seating. Please try again later.")
      return []
    }
  }

  const fetchChairs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/Dine/chairs", { params: { email } })
      return response.data
    } catch (error) {
      console.error("Error fetching chairs:", error)
      setError("Failed to load seating information. Please try again later.")
      return []
    }
  }

  const updateChairStatus = async (id, occupied, email, userName, userPhone, time) => {
    try {
      setLoading(true)
      const response = await axios.patch(`http://localhost:8000/Dine/chairs/${id}`, {
        occupied,
        email,
        userName,
        userPhone,
        time,
      })
      setLoading(false)
      return response.data
    } catch (error) {
      console.error("Error updating chair status:", error)
      setError("Failed to book your table. Please try again later.")
      setLoading(false)
      return null
    }
  }

  useEffect(() => {
    const initializeChairs = async () => {
      setLoading(true)
      const chairsData = await fetchChairs()
      if (chairsData.length === 0) {
        await sendChairs()
        const newChairsData = await fetchChairs()
        setChairs(newChairsData)
      } else {
        setChairs(chairsData)
      }
      setLoading(false)
    }

    // Set min date to today
    const today = new Date()
    const formattedDate = today.toISOString().slice(0, 16)
    setTime(formattedDate)

    initializeChairs()
  }, [])

  const handleChairClick = async (chairId, occupied) => {
    if (!email) {
      setError("Please login to book a table")
      setTimeout(() => {
        window.location.href = "/login"
      }, 2000)
      return
    }

    if (occupied) {
      setError("This table is already reserved")
      setTimeout(() => {
        setError(null)
      }, 3000)
      return
    }

    if (!userName || !userPhone || !time) {
      setError("Please fill in all required fields")
      setTimeout(() => {
        setError(null)
      }, 3000)
      return
    }

    const phoneRegex = /^\d{10}$/
    if (!phoneRegex.test(userPhone)) {
      setError("Please enter a valid 10-digit phone number")
      setTimeout(() => {
        setError(null)
      }, 3000)
      return
    }

    const updatedChair = await updateChairStatus(chairId, true, email, userName, userPhone, time)
    if (updatedChair) {
      setChairs(chairs.map((chair) => (chair.chairs === chairId ? updatedChair : chair)))
      setBookingSuccess(true)
      setTimeout(() => {
        setBookingSuccess(false)
        setSelectedChair(null)
      }, 3000)
    }
  }

  const handleSelectedChair = (chairId) => {
    setSelectedChair(chairId)
  }

  const handleConfirmBooking = () => {
    if (selectedChair) {
      const chair = chairs.find((c) => c.chairs === selectedChair)
      if (chair) {
        handleChairClick(chair.chairs, chair.occupied)
      }
    } else {
      setError("Please select a table first")
      setTimeout(() => {
        setError(null)
      }, 3000)
    }
  }

  // Function to determine table size icon
  const getTableIcon = (tableNumber) => {
    // Tables 1-6: Small (2 people)
    // Tables 7-12: Medium (4 people)
    // Tables 13-16: Large (6 people)
    if (tableNumber <= 6) {
      return <Coffee className="h-6 w-6 mb-1" />
    } else if (tableNumber <= 12) {
      return <Utensils className="h-6 w-6 mb-1" />
    } else {
      return <Users className="h-6 w-6 mb-1" />
    }
  }

  // Function to get table capacity text
  const getTableCapacity = (tableNumber) => {
    if (tableNumber <= 6) {
      return "2 People"
    } else if (tableNumber <= 12) {
      return "4 People"
    } else {
      return "6 People"
    }
  }

  return (
    <div className="min-h-screen mt-12 bg-[#f8f9fa] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-3 font-serif">Elegant Dining</h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-6"></div>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            Reserve your perfect table for an unforgettable dining experience
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 text-amber-500 animate-spin" />
              <p className="text-slate-600">Preparing your dining options...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Seating Layout */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
                <div className="p-5 bg-gradient-to-r from-green-400 to-green-600 text-white flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Utensils className="h-5 w-5 mr-2" />
                    Restaurant Floor Plan
                  </h2>
                  <button
                    onClick={() => setShowLegend(!showLegend)}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded-md text-sm flex items-center transition-colors"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    {showLegend ? "Hide Legend" : "Show Legend"}
                  </button>
                </div>

                <AnimatePresence>
                  {showLegend && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-slate-50 p-4 border-b border-slate-100"
                    >
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-emerald-400 rounded-md mr-2"></div>
                          <span className="text-sm text-slate-700">Available</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-rose-400 rounded-md mr-2"></div>
                          <span className="text-sm text-slate-700">Reserved</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-6 h-6 bg-amber-500 rounded-md mr-2"></div>
                          <span className="text-sm text-slate-700">Selected</span>
                        </div>
                        <div className="flex items-center ml-4">
                          <Coffee className="h-5 w-5 text-slate-700 mr-1" />
                          <span className="text-sm text-slate-700">2 People</span>
                        </div>
                        <div className="flex items-center">
                          <Utensils className="h-5 w-5 text-slate-700 mr-1" />
                          <span className="text-sm text-slate-700">4 People</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-slate-700 mr-1" />
                          <span className="text-sm text-slate-700">6 People</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="p-6">
                  {/* Restaurant layout visualization */}
                  <div className="relative mb-8 p-4 border-2 border-dashed border-slate-200 rounded-lg">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-1 text-slate-500 text-sm font-medium">
                      Entrance
                    </div>

                    {/* Tables grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {chairs.map((chair) => (
                        <motion.div
                          key={chair.chairs}
                          className="flex flex-col items-center"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <motion.div
                            className={`relative w-full aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer shadow-md transition-colors ${
                              selectedChair === chair.chairs
                                ? "bg-amber-500 text-white"
                                : chair.occupied
                                  ? "bg-red-500 text-white"
                                  : "bg-green-500 text-white"
                            }`}
                            onClick={() => !chair.occupied && handleSelectedChair(chair.chairs)}
                            whileTap={{ scale: 0.95 }}
                          >
                            {/* Table top view design */}
                            <div className="absolute inset-2 rounded-md bg-white/20 flex items-center justify-center flex-col">
                              {getTableIcon(chair.chairs)}
                              <span className="text-lg font-bold">Table {chair.chairs}</span>
                              <span className="text-xs mt-1">{getTableCapacity(chair.chairs)}</span>
                            </div>

                            {chair.occupied && (
                              <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                                <span className="text-xs px-2 py-0.5 bg-white/30 rounded-full font-medium">
                                  Reserved
                                </span>
                              </div>
                            )}
                          </motion.div>

                          {selectedChair === chair.chairs && !chair.occupied && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-2 text-center"
                            >
                              <span className="text-sm font-medium text-amber-600">Selected</span>
                            </motion.div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Floor plan legend */}
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 mt-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-200 rounded-full mr-1"></div>
                      <span>Window Seats</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-200 rounded-full mr-1"></div>
                      <span>Bar Area</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-slate-200 rounded-full mr-1"></div>
                      <span>Private Dining</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reservation Form */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-md overflow-hidden h-full border border-slate-100">
                <div className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <h2 className="text-xl font-semibold flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Make a Reservation
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-rose-50 text-rose-600 p-4 rounded-lg flex items-start"
                      >
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}

                    {bookingSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-start"
                      >
                        <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Your table has been reserved successfully!</span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border border-slate-200 py-3 px-4 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 outline-none"
                          value={userName}
                          placeholder="Your Name"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border border-slate-200 py-3 px-4 bg-slate-50 cursor-not-allowed"
                          value={email || ""}
                          readOnly
                        />
                      </div>
                      {!email && <p className="mt-1 text-xs text-rose-600">Please login to make a reservation</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                          type="text"
                          className="pl-10 block w-full rounded-md border border-slate-200 py-3 px-4 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 outline-none"
                          value={userPhone}
                          placeholder="Your Phone Number"
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Date & Time</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-amber-500" />
                        </div>
                        <input
                          type="datetime-local"
                          className="pl-10 block w-full rounded-md border border-slate-200 py-3 px-4 shadow-sm focus:border-amber-500 focus:ring focus:ring-amber-200 focus:ring-opacity-50 outline-none"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                        />
                      </div>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm font-medium text-slate-700">Selected Table</span>
                          {selectedChair && (
                            <p className="text-xs text-slate-500 mt-1">
                              {getTableCapacity(selectedChair)} • Table {selectedChair}
                            </p>
                          )}
                        </div>
                        <div
                          className={`flex items-center justify-center w-12 h-12 rounded-full ${
                            selectedChair ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400"
                          } font-bold text-lg`}
                        >
                          {selectedChair || "-"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleConfirmBooking}
                      disabled={loading || !selectedChair}
                      className={`w-full flex justify-center items-center px-4 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                        loading || !selectedChair
                          ? "bg-slate-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                      }`}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Check className="h-5 w-5 mr-2" />
                          Confirm Reservation
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurant Information */}
        <div className="mt-12 bg-white rounded-xl shadow-md overflow-hidden border border-slate-100">
          <div className="p-5 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <h2 className="text-xl font-semibold flex items-center">
              <Info className="h-5 w-5 mr-2" />
              Restaurant Information
            </h2>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-amber-100 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-800">Opening Hours</h3>
                  <p className="mt-1 text-sm text-slate-600">Monday - Friday: 11:00 AM - 10:00 PM</p>
                  <p className="mt-1 text-sm text-slate-600">Saturday - Sunday: 10:00 AM - 11:00 PM</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-amber-100 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-800">Contact</h3>
                  <p className="mt-1 text-sm text-slate-600">Phone: (123) 456-7890</p>
                  <p className="mt-1 text-sm text-slate-600">Email: reservations@elegantdining.com</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 bg-amber-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-amber-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-slate-800">Location</h3>
                  <p className="mt-1 text-sm text-slate-600">123 Gourmet Avenue</p>
                  <p className="mt-1 text-sm text-slate-600">Culinary District, CD 12345</p>
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="text-lg font-medium text-slate-800">Reservation Policy</h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="flex items-start text-sm text-slate-600">
                    <span className="text-amber-500 mr-2 mt-1">•</span>
                    Reservations can be made up to 30 days in advance.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="flex items-start text-sm text-slate-600">
                    <span className="text-amber-500 mr-2 mt-1">•</span>
                    Please arrive within 15 minutes of your reservation time.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="flex items-start text-sm text-slate-600">
                    <span className="text-amber-500 mr-2 mt-1">•</span>
                    For parties of 6 or more, please call us directly.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <p className="flex items-start text-sm text-slate-600">
                    <span className="text-amber-500 mr-2 mt-1">•</span>
                    Cancellations should be made at least 24 hours in advance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dine

