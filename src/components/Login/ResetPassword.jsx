"use client"

import { useState } from "react"
import { Link, useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import "boxicons/css/boxicons.min.css"

function ResetPassword() {
  const { token } = useParams()
  const [password, setPassword] = useState("")
  const [cpassword, setCPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== cpassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await axios.post(`http://localhost:8000/resetpassword/${token}`, {
        password,
        cpassword,
      })

      setMessage(response.data)

      if (response.data === "Password has been reset successfully") {
        setTimeout(() => {
          navigate("/login")
        }, 2000)
      }
    } catch (error) {
      setError(error.response?.data || "An error occurred. Please try again")
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  const toggleConfirmPasswordVisibility = () => {
    setIsCPasswordVisible(!isCPasswordVisible)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col items-center justify-center p-4">
      {/* Back to login button */}
      <div className="absolute top-4 left-4 z-10">
        <Link
          to="/login"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-200 text-gray-700"
        >
          <i className="bx bx-arrow-back text-green-500"></i>
          <span className="hidden sm:inline">Back to Login</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center relative">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <i className="bx bxs-lock-alt text-3xl text-green-500"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Reset Password</h1>
            <p className="text-green-100">Create a new secure password</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <p className="text-gray-600 mb-6">
              Please enter your new password below. Make sure it's secure and easy to remember.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <i className="bx bx-lock-alt mr-2 text-green-500"></i>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    id="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      error && password !== cpassword ? "border-red-300 bg-red-50" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={12}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`bx ${isPasswordVisible ? "bx-hide" : "bx-show"} text-xl`}></i>
                  </button>
                </div>
                <p className="text-xs text-gray-500">Password must be 8-12 characters</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
                  <i className="bx bx-check-shield mr-2 text-green-500"></i>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={isCPasswordVisible ? "text" : "password"}
                    id="confirmPassword"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      error && password !== cpassword ? "border-red-300 bg-red-50" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Confirm your new password"
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <i className={`bx ${isCPasswordVisible ? "bx-hide" : "bx-show"} text-xl`}></i>
                  </button>
                </div>
              </div>

              {/* Error and Success Messages */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="bx bx-error-circle text-xl text-red-500"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="bx bx-check-circle text-xl text-green-500"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin mr-2"></i>
                    Resetting...
                  </>
                ) : (
                  <>
                    <i className="bx bx-check-shield mr-2"></i>
                    Reset Password
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{" "}
                <Link to="/login" className="text-green-600 font-medium hover:text-green-800 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Help text */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Need help?{" "}
            <a href="#" className="text-green-600 hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="hidden md:block absolute bottom-10 left-10 opacity-10">
        <i className="bx bxs-lock-open-alt text-9xl text-green-500"></i>
      </div>
      <div className="hidden md:block absolute top-10 right-10 opacity-10">
        <i className="bx bxs-shield text-9xl text-green-500"></i>
      </div>
    </div>
  )
}

export default ResetPassword

