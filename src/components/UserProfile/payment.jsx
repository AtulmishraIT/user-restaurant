"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

function Payment() {
  const [paymentData, setPaymentData] = useState()
  const [isDelete, setIsDelete] = useState(false)
  const [deleteMethod, setDeleteMethod] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const email = localStorage.getItem("userEmail")

  useEffect(() => {
    const handlePaymentData = async () => {
      setIsLoading(true)
      try {
        const intervalId = setInterval(async () => {
          const response = await axios.get("http://localhost:8000/getpayment", {
            params: { email },
          })
          setPaymentData(response.data)
          setIsLoading(false)
        }, 1000)

        // Clean up interval on component unmount
        return () => clearInterval(intervalId)
      } catch (error) {
        console.error(error)
        setIsLoading(false)
      }
    }
    handlePaymentData()
  }, [email])

  const handlePaymentDelete = async (method) => {
    try {
      const response = await axios.post("http://localhost:8000/deletepayment", {
        email,
        method,
      })
      if (response.status === 200) {
        setPaymentData((prevData) => ({
          ...prevData,
          [method]: null,
        }))
        setIsDelete(false) // Close the delete confirmation dialog
      }
    } catch (error) {
      console.error("Error deleting payment method:", error)
    }
  }

  // Payment method icons
  const paymentIcons = {
    upi: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-purple-600"
      >
        <path d="M10.5 18.75a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" />
        <path
          fillRule="evenodd"
          d="M8.625.75A3.375 3.375 0 005.25 4.125v15.75a3.375 3.375 0 003.375 3.375h6.75a3.375 3.375 0 003.375-3.375V4.125A3.375 3.375 0 0015.375.75h-6.75zM7.5 4.125C7.5 3.504 8.004 3 8.625 3H9.75v.375c0 .621.504 1.125 1.125 1.125h2.25c.621 0 1.125-.504 1.125-1.125V3h1.125c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-6.75A1.125 1.125 0 017.5 19.875V4.125z"
          clipRule="evenodd"
        />
      </svg>
    ),
    creditCard: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-blue-600">
        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
        <path
          fillRule="evenodd"
          d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
    debitCard: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-8 h-8 text-green-600"
      >
        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
        <path
          fillRule="evenodd"
          d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Payment Methods</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                <Skeleton height={40} width={80} className="mb-4" />
                <Skeleton height={24} width={200} className="mb-6" />
                <Skeleton height={40} width={100} />
              </div>
            ))}
        </div>
      ) : (
        <div>
          {paymentData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* UPI Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {paymentIcons.upi}
                      <h2 className="text-xl font-semibold ml-3 text-purple-600">UPI</h2>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      {paymentData.upi ? (
                        <span className="font-medium">{paymentData.upi}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                    {paymentData.upi && (
                      <button
                        className="w-full py-2.5 px-4 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        onClick={() => {
                          setIsDelete(true)
                          setDeleteMethod("upi")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Credit Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {paymentIcons.creditCard}
                      <h2 className="text-xl font-semibold ml-3 text-blue-600">Credit Card</h2>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      {paymentData.creditCard ? (
                        <span className="font-medium">{paymentData.creditCard}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                    {paymentData.creditCard && (
                      <button
                        className="w-full py-2.5 px-4 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        onClick={() => {
                          setIsDelete(true)
                          setDeleteMethod("creditCard")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Debit Card */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      {paymentIcons.debitCard}
                      <h2 className="text-xl font-semibold ml-3 text-green-600">Debit Card</h2>
                    </div>
                    <p className="text-gray-700 mb-6 text-lg">
                      {paymentData.debitCard ? (
                        <span className="font-medium">{paymentData.debitCard}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not added</span>
                      )}
                    </p>
                    {paymentData.debitCard && (
                      <button
                        className="w-full py-2.5 px-4 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        onClick={() => {
                          setIsDelete(true)
                          setDeleteMethod("debitCard")
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Confirmation Modal */}
              {isDelete && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
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
                        Are you sure you want to delete this payment method? This action cannot be undone.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                      <button
                        className="py-2.5 px-5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-300 font-medium"
                        onClick={() => setIsDelete(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="py-2.5 px-5 text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors duration-300 font-medium"
                        onClick={() => handlePaymentDelete(deleteMethod)}
                      >
                        Delete
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="flex flex-col items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <p className="mt-4 text-gray-600 text-lg">Loading payment data...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Payment

