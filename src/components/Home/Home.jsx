"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Sugg from "./sugg"
import Cards from "./cards"
import usePageRefresh from "../usePageRefresh"
import { motion, AnimatePresence } from "framer-motion"

function Home() {
  const hasRefreshed = usePageRefresh()
  const [orderId, setOrderId] = useState(null)

  useEffect(() => {
    // Check for orderId in localStorage
    const storedOrderId = localStorage.getItem("orderId")
    if (storedOrderId) {
      setOrderId(storedOrderId)
    }

    // Set up an interval to check for changes in orderId
    const interval = setInterval(() => {
      const currentOrderId = localStorage.getItem("orderId")
      if (currentOrderId !== orderId) {
        setOrderId(currentOrderId)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [orderId])

  if (!hasRefreshed) {
    return null // Render nothing until the page has been refreshed
  }

  return (
    <>
      <Sugg />
      {/* <Image /> */}
      <Cards />

      {/* Order Tracking Label */}
      <AnimatePresence>
        {orderId && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link
              to="/order-status"
              className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-full shadow-lg transition-all duration-300 group"
            >
              <div className="relative">
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="font-medium">Track Your Order #{orderId}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Home
