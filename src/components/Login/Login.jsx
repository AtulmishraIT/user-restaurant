import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "boxicons/css/boxicons.min.css";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Reset error messages
    setEmailError("");
    setPasswordError("");
    
    // Basic validation
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }
    
    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("http://localhost:8000/login", {
        email,
        password,
      });
      
      if (response.data === "exist") {
        localStorage.setItem("userEmail", email);
        setMessage("Login successful! Redirecting...");
        
        setTimeout(() => {
          navigate("/home");
          window.location.reload();
        }, 2000);
      } else if (response.data === "notexist") {
        setEmailError("User not found. Please sign up");
      } else if (response.data === "Password not match") {
        setPasswordError("Invalid password");
      } else {
        setEmailError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setEmailError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen bg-white ml-10 max-sm:ml-0 max-sm:-mr-8 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white text-center relative">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg -z-50">
                <i className="bx bxs-restaurant text-4xl text-green-500"></i>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Welcome Back!</h1>
            <p className="text-green-100">Sign in to continue to your account</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email Field */}
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
                      emailError ? "border-red-300 bg-red-50" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {emailError && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <i className="bx bx-error-circle mr-1"></i>
                      {emailError}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                  <i className="bx bx-lock-alt mr-2 text-green-500"></i>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      passwordError ? "border-red-300 bg-red-50" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    maxLength={12}
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={togglePasswordVisibility}
                  >
                    <i className={`bx ${showPassword ? "bx-hide" : "bx-show"} text-xl`}></i>
                  </button>
                  {passwordError && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <i className="bx bx-error-circle mr-1"></i>
                      {passwordError}
                    </div>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin mr-2"></i>
                    Signing in...
                  </>
                ) : (
                  <>
                    <i className="bx bx-log-in-circle mr-2"></i>
                    Sign in
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/signup" className="text-green-600 font-medium hover:text-green-800 transition-colors">
                    Sign up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Food decoration elements */}
        <div className="hidden md:block absolute opacity-10">
          <i className="bx bxs-pizza text-9xl text-green-500 rotate-12"></i>
        </div>
        <div className="hidden md:block absolute opacity-10">
          <i className="bx bxs-bowl-hot text-9xl text-green-500 -rotate-12"></i>
        </div>
      </div>

      {/* Success Message Overlay */}
      {message && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all animate-fadeIn">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <i className="bx bx-check text-5xl text-green-500"></i>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Login Successful!</h3>
              <p className="text-gray-500 mb-6">Redirecting you to the dashboard...</p>
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;