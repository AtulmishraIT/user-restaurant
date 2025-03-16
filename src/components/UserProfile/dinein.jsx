"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { motion, AnimatePresence } from "framer-motion";
import 'boxicons/css/boxicons.min.css';

function Dinein() {
  const [dineData, setDineData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(null);
  const [showToast, setShowToast] = useState({ visible: false, message: "", type: "" });
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchDineData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8000/Dine/chairs");
        setDineData(response.data.filter((item) => item.userEmail === email));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dine data:", error);
        setIsLoading(false);
        displayToast("Failed to load bookings", "error");
      }
    };

    fetchDineData();

    // Set up polling interval
    const intervalId = setInterval(fetchDineData, 10000); // Poll every 10 seconds

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [email]);

  const displayToast = (message, type = "success") => {
    setShowToast({ visible: true, message, type });
    setTimeout(() => {
      setShowToast({ visible: false, message: "", type: "" });
    }, 3000);
  };

  const handleCancel = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/Dine/chairs/${id}`, {
        occupied: false,
        userEmail: null,
        userName: null,
        userPhone: null,
        time: null,
      });

      setIsCancel(null);
      // Update local state to remove the cancelled booking
      setDineData(dineData.filter((item) => item.chairs !== id));
      displayToast("Booking cancelled successfully", "success");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      displayToast("Failed to cancel booking", "error");
    }
  };

  const handleDineDone = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/Dine/chairs/${id}`, {
        occupied: false,
        userEmail: null,
        userName: null,
        userPhone: null,
        time: null,
      });

      // Update local state to remove the completed booking
      setDineData(dineData.filter((item) => item.chairs !== id));
      displayToast("Thank you for dining with us!", "success");
    } catch (error) {
      console.error("Error marking dine as done:", error);
      displayToast("Failed to update booking status", "error");
    }
  };

  // Format time for better display
  const formatTime = (timeString) => {
    if (!timeString) return "Not specified";
    
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return timeString; // Return original if parsing fails
    }
  };

  // Get current date in readable format
  const getCurrentDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Toast notification */}
      <AnimatePresence>
        {showToast.visible && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center ${
              showToast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white`}
          >
            <i className={`bx ${showToast.type === "success" ? "bxs-check-circle" : "bxs-x-circle"} mr-2 text-xl`}></i>
            {showToast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-24 h-24 mb-4 bg-amber-100 rounded-full flex items-center justify-center">
            <i className="bx bxs-restaurant text-5xl text-amber-600"></i>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800">Your Dine-in Reservations</h1>
          <p className="text-gray-500 mt-2 text-center max-w-2xl">
            Manage your table reservations and enjoy your dining experience
          </p>
        </div>

        {/* Current date display */}
        <div className="flex items-center justify-center mb-8">
          <div className="bg-white px-6 py-3 rounded-full shadow-md inline-flex items-center">
            <i className="bx bx-calendar text-amber-500 mr-2 text-xl"></i>
            <span className="font-medium text-gray-700">{getCurrentDate()}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(3)
              .fill()
              .map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                  <div className="flex flex-col gap-4">
                    <Skeleton height={30} width="80%" />
                    <Skeleton height={24} width="60%" />
                    <Skeleton height={20} width="40%" />
                    <div className="flex gap-4 mt-2">
                      <Skeleton height={40} width={100} />
                      <Skeleton height={40} width={100} />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : dineData.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-16 text-gray-500 bg-white rounded-xl shadow-sm"
          >
            <div className="w-24 h-24 mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <i className="bx bx-calendar-x text-5xl text-amber-500"></i>
            </div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Reservations Found</h3>
            <p className="text-gray-500 text-center max-w-md mb-6">
              You don't have any active dine-in reservations. Book a table to enjoy our delicious meals!
            </p>
            <a 
              href="/dine" 
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-full transition-colors duration-300 flex items-center"
            >
              <i className="bx bx-plus mr-2"></i>
              Make a Reservation
            </a>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dineData.map((item, index) => (
              <motion.div
                key={item.chairs}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
              >
                {/* Card header with chair number */}
                <div className="relative bg-gradient-to-r from-amber-500 to-amber-600 py-4 px-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-lg">Table Reservation</h3>
                      <p className="text-amber-100 text-sm">Restaurant Dine-in</p>
                    </div>
                    <div className="flex items-center justify-center w-14 h-14 bg-white rounded-full text-amber-600 font-bold text-2xl shadow-md">
                      {item.chairs}
                    </div>
                  </div>
                  
                  {/* Status badge */}
                  <div className="absolute top-2 right-2 bg-green-500 text-xs text-white px-2 py-1 rounded-full">
                    Confirmed
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <div className="flex flex-col gap-4">
                    {/* Time info */}
                    <div className="flex items-center text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <i className="bx bx-time text-amber-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reservation Time</p>
                        <p className="font-medium">{formatTime(item.time)}</p>
                      </div>
                    </div>

                    {/* Date info */}
                    <div className="flex items-center text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <i className="bx bx-calendar text-amber-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reservation Date</p>
                        <p className="font-medium">{item.time.slice("T")}</p>
                      </div>
                    </div>

                    {/* User info */}
                    <div className="flex items-center text-gray-700">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <i className="bx bx-user text-amber-600 text-xl"></i>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Reserved For</p>
                        <p className="font-medium truncate max-w-[200px]">{item.userName || email}</p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => setIsCancel(item.chairs)}
                      >
                        <i className="bx bx-x mr-2"></i>
                        Cancel
                      </button>
                      <button 
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                        onClick={() => handleDineDone(item.chairs)}
                      >
                        <i className="bx bx-check mr-2"></i>
                        Dine Done
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {isCancel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsCancel(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-center mb-6">
                  <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-4">
                    <i className="bx bx-x-circle text-red-500 text-4xl"></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Reservation</h3>
                  <p className="text-gray-600">
                    Are you sure you want to cancel your reservation for table #{isCancel}? This action cannot be undone.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => setIsCancel(null)}
                  >
                    No, Keep It
                  </button>
                  <button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                    onClick={() => handleCancel(isCancel)}
                  >
                    Yes, Cancel
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dinein;