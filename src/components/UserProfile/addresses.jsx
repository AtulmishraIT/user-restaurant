"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

function Addresses() {
  const [saveadd, setSaveadd] = useState([])
  const [isDelete, setIsDelete] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchAddresses = async () => {
      const email = localStorage.getItem("userEmail")
      setIsLoading(true)
      try {
        const intervalId = setInterval(async () => {
          try {
            const response = await axios.get("http://localhost:8000/cart/address", {
              params: { email },
            })
            setSaveadd(response.data.address || [])
            setIsLoading(false)
          } catch (err) {
            console.error("Error fetching addresses:", err.response ? err.response.data : err.message)
            setIsLoading(false)
          }
        }, 1000)

        // Clean up interval on component unmount
        return () => clearInterval(intervalId)
      } catch (err) {
        console.error("Error setting up address fetching:", err)
        setIsLoading(false)
      }
    }
    fetchAddresses()
  }, [])

  const handleDelete = async (address) => {
    const email = localStorage.getItem("userEmail")
    try {
      const response = await axios.post("http://localhost:8000/cart/DeleteAdd", {
        email,
        address,
      })
      if (response.status === 200) {
        setSaveadd(saveadd.filter((addr) => addr !== address) || [])
        setIsDelete(null)
      }
    } catch (err) {
      console.error("Error deleting address:", err.response ? err.response.data : err.message)
    }
  }

  // Function to format address for better display
  const formatAddress = (address) => {
    const parts = address.split(",")
    return {
      title: parts[0].trim(),
      fullAddress: address,
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8 text-orange-500 mr-3"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Manage Addresses</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
                <Skeleton height={28} width={150} className="mb-4" />
                <div className="space-y-2 mb-4">
                  <Skeleton height={16} width="90%" />
                  <Skeleton height={16} width="80%" />
                  <Skeleton height={16} width="70%" />
                </div>
                <Skeleton height={36} width={100} />
              </div>
            ))}
        </div>
      ) : (
        <div>
          {saveadd && saveadd.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saveadd.map((addr, index) => {
                const { title, fullAddress } = formatAddress(addr)
                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-orange-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-gray-700 whitespace-pre-wrap break-words">{fullAddress}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <button
                          className="text-gray-600 hover:text-gray-800 flex items-center text-sm font-medium"
                          onClick={() => {
                            /* Edit functionality would go here */
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 flex items-center text-sm font-medium"
                          onClick={() => setIsDelete(addr)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400 mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Addresses Found</h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You haven't added any delivery addresses yet. Add an address to make checkout faster.
              </p>
              <button className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Address
              </button>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDelete && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
            >
              <div className="text-center mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-red-500 mx-auto mb-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Confirm Deletion</h2>
                <p className="text-gray-600 mt-2">
                  Are you sure you want to delete this address? This action cannot be undone.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  className="py-2.5 px-5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 font-medium"
                  onClick={() => setIsDelete(null)}
                >
                  Cancel
                </button>
                <button
                  className="py-2.5 px-5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 font-medium"
                  onClick={() => handleDelete(isDelete)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add New Address Button (Fixed at bottom) */}
      <div className="fixed bottom-6 right-6">
        <button className="w-14 h-14 bg-orange-500 hover:bg-orange-600 rounded-full shadow-lg flex items-center justify-center text-white transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Addresses

