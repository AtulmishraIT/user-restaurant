"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

function Order() {
  const [order, setOrder] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const email = localStorage.getItem("userEmail")

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true)
      try {
        const intervalId = setInterval(async () => {
          const response = await axios.get("http://localhost:8000/Order", {
            params: { email },
          })
          setOrder(response.data)
          setIsLoading(false)
        }, 1000)

        // Clean up interval on component unmount
        return () => clearInterval(intervalId)
      } catch (error) {
        console.error("Error fetching orders:", error)
        setIsLoading(false)
      }
    }
    fetchOrder()
  }, [])

  // Function to format price with currency symbol
  const formatPrice = (price) => {
    return `₹${Number.parseFloat(price).toLocaleString("en-IN")}`
  }

  // Function to determine order status (for demo purposes)
  const getOrderStatus = (index) => {
    const statuses = ["Delivered", "Shipped", "Processing", "Confirmed"]
    return statuses[index % statuses.length]
  }

  // Function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Processing":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
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
          <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
          <path
            fillRule="evenodd"
            d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="flex p-4">
                  <Skeleton height={120} width={120} className="rounded-md" />
                  <div className="ml-4 flex flex-col justify-between w-full">
                    <div>
                      <Skeleton height={24} width={140} className="mb-2" />
                      <Skeleton height={18} width={100} className="mb-2" />
                      <Skeleton height={18} width={80} className="mb-2" />
                    </div>
                    <Skeleton height={24} width={90} />
                  </div>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div>
          {order && order.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.map((item, index) => {
                const status = getOrderStatus(index)
                const statusColor = getStatusColor(status)

                return (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100"
                  >
                    <div className="p-4">
                      <div className="flex">
                        <div className="h-32 w-32 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null
                              e.target.src = "https://via.placeholder.com/150?text=No+Image"
                            }}
                          />
                        </div>
                        <div className="ml-4 flex flex-col justify-between">
                          <div>
                            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h2>
                            <div className="mt-2 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-500 mr-1"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="text-gray-600">Qty: {item.quantity}</span>
                            </div>
                            <div className="mt-1 text-lg font-medium text-orange-600">{formatPrice(item.price)}</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>{status}</span>
                        <span className="text-sm text-gray-500">
                          Order #{(1000 + index).toString().padStart(4, "0")}
                        </span>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                              fillRule="evenodd"
                              d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <a href="/order-status">Track Order</a>
                        </button>
                        <button className="text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 mr-1"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <a href="/order-status">Details</a>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400 mb-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Found</h2>
              <p className="text-gray-500 text-center max-w-md mb-6">
                You haven't placed any orders yet. Start shopping to see your orders here.
              </p>
              <button className="px-6 py-2.5 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                <a href="/home" >Start Shopping</a>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Order

