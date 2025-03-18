import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "boxicons/css/boxicons.min.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [mobno, setMobno] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailExist, setEmailExist] = useState("");
  const [passnotmatch, setPassnotmatch] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);
  
  // Form validation states
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const newuser = {
    name,
    email,
    password,
    mobno,
    cpassword,
    isLogin: true,
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    
    // Reset errors
    setNameError("");
    setEmailError("");
    setPhoneError("");
    setPasswordError("");
    setPassnotmatch("");
    
    // Name validation
    if (!name.trim()) {
      setNameError("Name is required");
      isValid = false;
    }
    
    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      isValid = false;
    }
    
    // Phone validation
    if (!mobno.trim()) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!/^\d{10}$/.test(mobno.replace(/[^0-9]/g, ''))) {
      setPhoneError("Phone number should be 10 digits");
      isValid = false;
    }
    
    // Password validation
    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }
    
    // Confirm password validation
    if (password !== cpassword) {
      setPassnotmatch("Passwords do not match");
      isValid = false;
    }
    
    return isValid;
  };

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      setIsLogin(true);
      const response = await axios.post("http://localhost:8000/Signup", newuser);
      
      if (response.data === "Password not matched*") {
        setPassnotmatch("Password not matched*");
      } else if (response.data === "exist") {
        setEmailExist("User already exists");
      } else if (response.data === "notexist") {
        localStorage.setItem("userEmail", email);
        
        // Show success animation before redirecting
        const successMessage = document.getElementById("success-message");
        if (successMessage) {
          successMessage.classList.remove("hidden");
        }
        
        setTimeout(() => {
          navigate("/home");
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Signup error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Toggle confirm password visibility
  const toggleCPasswordVisibility = () => {
    setIsCPasswordVisible(!isCPasswordVisible);
  };

  return (
    <div className="min-h-screen -mr-10 bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Signup Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with logo */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white relative">
            <div className="absolute top-0 right-0 p-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
                <i className="bx bxs-restaurant text-4xl text-green-500">AB</i>
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
            <p className="text-green-100">Join us for delicious meals and exclusive offers</p>
          </div>

          {/* Form Section */}
          <div className="p-6 sm:p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center">
                    <i className="bx bx-user mr-2 text-green-500"></i>
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        nameError ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {nameError && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i>
                        {nameError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center">
                    <i className="bx bx-phone mr-2 text-green-500"></i>
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      id="phone"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        phoneError ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Enter your phone number"
                      value={mobno}
                      onChange={(e) => setMobno(e.target.value)}
                    />
                    {phoneError && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i>
                        {phoneError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                      emailError || emailExist ? "border-red-300 bg-red-50" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailExist("");
                    }}
                  />
                  {(emailError || emailExist) && (
                    <div className="text-red-500 text-xs mt-1 flex items-center">
                      <i className="bx bx-error-circle mr-1"></i>
                      {emailError || emailExist}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Password Field */}
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
                    <i className="bx bx-lock-alt mr-2 text-green-500"></i>
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={isPasswordVisible ? "text" : "password"}
                      id="password"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        passwordError ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Create a password"
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
                      <i className={`bx ${isPasswordVisible ? "bx-hide" : "bx-show"} text-xl`}></i>
                    </button>
                    {passwordError && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i>
                        {passwordError}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">Must be at least 8 characters</p>
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <label htmlFor="cpassword" className="text-sm font-medium text-gray-700 flex items-center">
                    <i className="bx bx-check-shield mr-2 text-green-500"></i>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={isCPasswordVisible ? "text" : "password"}
                      id="cpassword"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        passnotmatch ? "border-red-300 bg-red-50" : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                      placeholder="Confirm your password"
                      value={cpassword}
                      onChange={(e) => setCPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      onClick={toggleCPasswordVisibility}
                    >
                      <i className={`bx ${isCPasswordVisible ? "bx-hide" : "bx-show"} text-xl`}></i>
                    </button>
                    {passnotmatch && (
                      <div className="text-red-500 text-xs mt-1 flex items-center">
                        <i className="bx bx-error-circle mr-1"></i>
                        {passnotmatch}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    type="checkbox"
                    className="w-4 h-4 text-green-500 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                </div>
                <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Terms and Conditions
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    <i className="bx bx-user-plus mr-2"></i>
                    Create Account
                  </>
                )}
              </button>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-green-600 font-medium hover:text-green-800 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Food decoration elements */}
        <div className="hidden md:block absolute -bottom-16 -left-16 opacity-10">
          <i className="bx bxs-pizza text-9xl text-green-500 rotate-12"></i>
        </div>
        <div className="hidden md:block absolute -top-20 -right-20 opacity-10">
          <i className="bx bxs-bowl-hot text-9xl text-green-500 -rotate-12"></i>
        </div>
      </div>

      {/* Success Message Overlay */}
      <div id="success-message" className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 hidden">
        <div className="bg-white rounded-xl p-8 max-w-sm w-full mx-4 shadow-2xl transform transition-all animate-fadeIn">
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-4">
              <i className="bx bx-check text-5xl text-green-500"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Created!</h3>
            <p className="text-gray-500 mb-6">Your account has been created successfully. Redirecting to home page...</p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;