"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import UserNav from "./userNav"
import { motion, useScroll, AnimatePresence } from "framer-motion"
import { User, Phone, Mail, Edit, X, CheckCircle, AlertCircle, Send, Lock, ArrowLeft, Loader } from "lucide-react"

const UserProfile = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isChanged, setIsChanged] = useState(false)
  const [isEmailChange, setIsEmailChange] = useState(false)
  const [isMobChange, setIsMobChange] = useState(false)
  const [isVerify, setIsVerify] = useState(false)
  const [email1, setEmail] = useState("")
  const [mobno1, setMobno] = useState("")
  const [isScroll, setIsScroll] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)
  const [otp, setOtp] = useState("")
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const { scrollY } = useScroll()

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail")
        if (!email) {
          throw new Error("User email not found")
        }
        const response = await axios.get(`http://localhost:8000/user/${email}`)
        setUserData(response.data)
        setEmail(response.data.email)
        setMobno(response.data.mobno)
      } catch (err) {
        setError(err.message || "Failed to fetch user data")
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      setIsScroll(latest < 140)
    })

    return () => unsubscribe()
  }, [scrollY])

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="w-12 h-12 text-green-600 animate-spin" />
          <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle className="w-16 h-16" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Error Loading Profile</h2>
          <p className="text-gray-600 text-center mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const handleEditProfile = () => {
    setIsChanged(!isChanged)
    setIsEmailChange(false)
    setIsMobChange(false)
    setIsVerify(false)
    setError(null)
    setMessage(null)
  }

  const handleCloseModal = (e) => {
    if (e.target.id === "modal-overlay") {
      setIsChanged(false)
      setIsEmailChange(false)
      setIsMobChange(false)
      setIsVerify(false)
    }
  }

  const handleVerify = async () => {
    setIsVerify(!isVerify)
    setSendingOtp(true)
    setError(null)
    setMessage(null)

    try {
      const response = await axios.post("http://localhost:8000/send-otp", {
        email: userData.email,
      })
      setMessage(response.data.message)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleSendOtp = async () => {
    setVerifyingOtp(true)
    setError(null)
    setMessage(null)

    try {
      const response = await axios.post("http://localhost:8000/verify-otp", {
        email: userData.email,
        otp,
        newMobNo: isMobChange ? mobno1 : null,
        newEmail: isEmailChange ? email1 : null,
      })

      if (isEmailChange && email1 !== userData.email) {
        setMessage("Email updated successfully. Please login again.")
        setTimeout(() => {
          window.location.href = "/"
        }, 2000)
      } else {
        setMessage(response.data.message)
        setTimeout(() => {
          setIsChanged(false)
          setIsEmailChange(false)
          setIsMobChange(false)
          setIsVerify(false)
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      setError(error.response?.data?.message || "Failed to verify OTP")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleEmailChange = () => {
    setIsEmailChange(!isEmailChange)
    setIsMobChange(false)
    setError(null)
    setMessage(null)
  }

  const handleMobChange = () => {
    setIsMobChange(!isMobChange)
    setIsEmailChange(false)
    setError(null)
    setMessage(null)
  }

  return (
    <div className="min-h-screen -mr-8 bg-gradient-to-b from-slate-700 to-slate-900 text-white">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {userData ? (
          <div className="bg-slate-800 rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-gradient-to-br from-green-400 to-blue-500 p-1 rounded-full">
                    <div className="bg-slate-800 rounded-full p-2">
                      <User className="w-16 h-16 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{userData.name}</h1>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-slate-300">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{userData.mobno}</span>
                      </div>
                      <div className="flex items-center text-slate-300">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>{userData.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleEditProfile}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/20"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800 rounded-xl shadow-xl p-8 text-center">
            <p className="text-xl text-slate-300">No user data found.</p>
          </div>
        )}

        {/* Error and Success Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg flex items-center"
            >
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-3 rounded-lg flex items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* User Navigation Section */}
      <motion.div
        className="bg-white rounded-t-3xl shadow-2xl"
        initial={{ opacity: 0.9 }}
        animate={{
          opacity: isScroll ? 0.95 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <UserNav />
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isChanged && (
          <div
            id="modal-overlay"
            className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm flex justify-end items-start"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="h-screen w-full max-w-md bg-white text-gray-800 shadow-2xl overflow-y-auto"
            >
              <div className="sticky top-0 bg-white z-10 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-5 h-5 cursor-pointer" onClick={handleEditProfile} />
                  <h2 className="text-xl font-semibold">Edit Profile</h2>
                </div>
                <button onClick={handleEditProfile} className="text-gray-500 hover:text-gray-700 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Success/Error Messages */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center"
                    >
                      <CheckCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{message}</p>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center"
                    >
                      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
                      <p>{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Phone Number Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-medium">Phone Number</h3>
                  </div>

                  {isMobChange ? (
                    <div className="space-y-4">
                      {isVerify ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                            <input
                              type="text"
                              value={mobno1}
                              onChange={(e) => setMobno(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              placeholder="Enter new phone number"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                maxLength={6}
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                          </div>

                          <button
                            onClick={handleSendOtp}
                            disabled={verifyingOtp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                          >
                            {verifyingOtp ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Verify & Update
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">New Phone Number</label>
                            <input
                              type="text"
                              value={mobno1}
                              onChange={(e) => setMobno(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              placeholder="Enter new phone number"
                            />
                          </div>

                          <button
                            onClick={handleVerify}
                            disabled={sendingOtp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                          >
                            {sendingOtp ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Sending OTP...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Send Verification Code
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">{userData.mobno}</span>
                      <button
                        onClick={handleMobChange}
                        className="text-green-600 font-medium hover:text-green-700 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 my-6"></div>

                {/* Email Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-medium">Email Address</h3>
                  </div>

                  {isEmailChange ? (
                    <div className="space-y-4">
                      {isVerify ? (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">New Email Address</label>
                            <input
                              type="email"
                              value={email1}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              placeholder="Enter new email address"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                                maxLength={6}
                              />
                              <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            </div>
                          </div>

                          <button
                            onClick={handleSendOtp}
                            disabled={verifyingOtp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                          >
                            {verifyingOtp ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-5 h-5" />
                                Verify & Update
                              </>
                            )}
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-700">New Email Address</label>
                            <input
                              type="email"
                              value={email1}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                              placeholder="Enter new email address"
                            />
                          </div>

                          <button
                            onClick={handleVerify}
                            disabled={sendingOtp}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
                          >
                            {sendingOtp ? (
                              <>
                                <Loader className="w-5 h-5 animate-spin" />
                                Sending OTP...
                              </>
                            ) : (
                              <>
                                <Send className="w-5 h-5" />
                                Send Verification Code
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <span className="text-gray-700">{userData.email}</span>
                      <button
                        onClick={handleEmailChange}
                        className="text-green-600 font-medium hover:text-green-700 transition-colors"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default UserProfile

