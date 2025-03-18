import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "boxicons/css/boxicons.min.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setMessage("");
    setError("");
    setLoading(true);
    
    try {
      const response = await axios.post(
        "http://localhost:8000/forgot-password",
        { email }
      );
      setMessage(response.data);
      setEmailSent(true);
    } catch (error) {
      console.error("Error during password reset:", error);
      if (error.response) {
        // If the error has a response, display that
        setError(error.response.data);
      } else {
        // If no response (network issues, etc.)
        setError("An error occurred. Please try again.");
      }
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

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
                <i className="bx bxs-key text-3xl text-green-500"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Forgot Password?</h1>
            <p className="text-green-100">We'll help you reset it</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            {!emailSent ? (
              <div>
                <p className="text-gray-600 mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
                      <i className="bx bx-envelope mr-2 text-green-500"></i>
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          error ? "border-red-300 bg-red-50" : "border-gray-300"
                        } focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200`}
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {error && (
                        <div className="text-red-500 text-xs mt-1 flex items-center">
                          <i className="bx bx-error-circle mr-1"></i>
                          {error}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <i className="bx bx-loader-alt bx-spin mr-2"></i>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bx bx-mail-send mr-2"></i>
                        Send Reset Link
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
            ) : (
              <div className="text-center py-6">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                  <i className="bx bx-check text-4xl text-green-500"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Sent!</h3>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to <span className="font-medium">{email}</span>. 
                  Please check your inbox and follow the instructions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setEmailSent(false)}
                    className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-amber-50 transition-colors"
                  >
                    <i className="bx bx-revision mr-2"></i>
                    Try Another Email
                  </button>
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <i className="bx bx-log-in mr-2"></i>
                    Back to Login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Help text */}
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>
            Need help? <a href="#" className="text-green-600 hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="hidden md:block absolute bottom-10 left-10 opacity-10">
        <i className="bx bxs-lock-open-alt text-9xl text-green-500"></i>
      </div>
      <div className="hidden md:block absolute top-10 right-10 opacity-10">
        <i className="bx bxs-envelope text-9xl text-green-500"></i>
      </div>
    </div>
  );
}

export default ForgotPassword;