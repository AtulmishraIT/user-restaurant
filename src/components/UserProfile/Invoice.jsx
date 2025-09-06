import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom"; // Import react-router-dom hooks
import {
  Receipt,
  Download,
  FileText,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle,
  ArrowLeft,
  Calendar,
  CreditCard,
  Truck,
  Gift,
  Share2,
  Printer,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";

const Invoice = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const navigate = useNavigate(); // Use useNavigate for navigation
  const location = useLocation(); // Use useLocation to access query parameters
  const invoiceRef = useRef(null);

  // Extract query parameters from the URL
  const searchParams = new URLSearchParams(location.search);
  const email = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const orderId = localStorage.getItem("orderId");


  useEffect(() => {
    const fetchInvoice = async () => {
      if (!orderId) {
        setError("Order ID is missing");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:8000/orders/invoice/${orderId}`);
        setInvoice(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching invoice:", err);
        setError("Failed to load invoice details. Please try again later.");
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [orderId, email]);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    documentTitle: `Invoice_${orderId || ""}`,
    onAfterPrint: () => console.log("Printed successfully"),
  });

  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/orders/invoice/download/${orderId}`
      );

      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Invoice_${orderId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading invoice:", err);
      setError("Failed to download invoice. Please try again later.");
    }
  };

  const handleShare = async () => {
    setShowShareOptions(!showShareOptions);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500 mb-4"></div>
          <p className="text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Invoice Not Found
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.replace("/order-status")} // Use navigate for navigation
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Orders
          </button>
        </div>
      </div>
    );
  }

  // Mock data for preview - in production, use the actual invoice data from API
  const mockInvoice = invoice || {
    orderId: "ORD123456789",
    orderDate: new Date().toISOString(),
    status: "Delivered",
    customer: {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "9876543210",
      address: "123 Main St, Apartment 4B, Landmark Building, City, 400001"
    },
    items: [
      { id: 1, name: "Butter Chicken", price: 350, quantity: 2, total: 700 },
      { id: 2, name: "Garlic Naan", price: 60, quantity: 4, total: 240 },
      { id: 3, name: "Paneer Tikka", price: 280, quantity: 1, total: 280 }
    ],
    payment: {
      method: "Credit Card",
      transactionId: "TXN987654321",
      subtotal: 1220,
      deliveryFee: 50,
      discount: 100,
      gst: 61,
      tip: 50,
      total: 1281
    },
    restaurant: {
      name: "Spice Garden Restaurant",
      address: "456 Food Street, Culinary District, City, 400002",
      gstin: "22AAAAA0000A1Z5"
    }
  }

    const orderDate = formatDate(mockInvoice.date);
    const totalAmount = mockInvoice.items.reduce((total, item) => total + item.price * item.quantity, 0); // Adding delivery fee
    const gst = Math.round(totalAmount * 0.12); // Assuming 18% GST
    const discount = 20; // Assuming no discount for simplicity
    const deliveryFee = 20; // Assuming a fixed delivery fee

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 mt-16 -mr-10">
      <div className="max-w-4xl mx-auto">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <button
              onClick={() => window.location.replace("/order-status")}
              className="flex items-center text-gray-600 hover:text-amber-600 transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Orders
            </button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Receipt className="mr-3 h-7 w-7 text-amber-500" /> 
              Invoice
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 font-medium transition-colors duration-200 flex items-center shadow-sm"
            >
              <Printer className="mr-2 h-5 w-5" /> Print
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center shadow-sm"
            >
              <Download className="mr-2 h-5 w-5" /> Download PDF
            </button>
            
            <div className="relative">
              <button
                onClick={handleShare}
                className="bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg border border-gray-200 font-medium transition-colors duration-200 flex items-center shadow-sm"
              >
                <Share2 className="mr-2 h-5 w-5" /> Share
              </button>
              
              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100"
                  >
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`http://localhost:3000/invoice?id=${mockInvoice.orderId}`)
                          setShowShareOptions(false)
                          alert("Link copied to clipboard!")
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => {
                          window.open(`mailto:?subject=Invoice for Order ${mockInvoice.orderId}&body=View your invoice at: http://localhost:3000/invoice?id=${mockInvoice.orderId}`)
                          setShowShareOptions(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Email
                      </button>
                      <button
                        onClick={() => {
                          window.open(`https://wa.me/?text=View your invoice at: http://localhost:3000/invoice?id=${mockInvoice.orderId}`)
                          setShowShareOptions(false)
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        WhatsApp
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        
        {/* Invoice Document */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-lg shadow-md overflow-hidden"
          ref={invoiceRef}
        >
          {/* Invoice Header */}
          <div className="p-6 bg-amber-50 border-b border-amber-100">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                    <Receipt className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Restaurant</h2>
                    <p className="text-gray-500 text-sm">Ulhasnagar 421004</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">GSTIN: GSTIN756123494</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 md:text-right">
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                  {mockInvoice.phase.toUpperCase()}
                </div>
                <h3 className="text-lg font-bold text-gray-800">Invoice #{orderId}</h3>
                <div className="flex items-center mt-1 md:justify-end">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm text-gray-500">{formatDate(mockInvoice.date)}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Body */}
          <div className="p-6">
            {/* Customer Details */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">BILLED TO</h3>
                <div className="space-y-1">
                  <p className="font-medium text-gray-800">{email.split('@',0)}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {email}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    Not Given
                  </p>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3">DELIVERED TO</h3>
                <p className="text-sm text-gray-600 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span>Bk no 1618, UNR 421004</span>
                </p>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mockInvoice.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-4 text-sm text-gray-800">{item.name}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-right">₹{item.price}</td>
                        <td className="px-4 py-4 text-sm text-gray-600 text-right">{item.quantity}</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800 text-right">₹{(item.price)*(item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Payment Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Payment Method</span>
                    <span className="text-sm font-medium text-gray-800 flex items-center">
                      <CreditCard className="h-4 w-4 mr-1 text-gray-400" />
                      UPI
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">Transaction ID</span>
                    <span className="text-sm font-medium text-gray-800">#{orderId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Payment Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" /> Paid
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal</span>
                      <span className="text-sm font-medium text-gray-800">₹{mockInvoice.items.reduce((total, item) => total + item.price * item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Delivery Fee</span>
                      <span className="text-sm font-medium text-gray-800">₹{deliveryFee}</span>
                    </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Discount</span>
                        <span className="text-sm font-medium text-green-600">
                          - ₹{discount}
                        </span>
                      </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">GST (12%)</span>
                      <span className="text-sm font-medium text-gray-800">₹{gst}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="text-base font-medium text-gray-800">Total</span>
                        <span className="text-base font-bold text-gray-800">₹{mockInvoice.items.reduce((total, item) => total + item.price * item.quantity, 0)-discount+gst+deliveryFee}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Invoice Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Thank you for your order!</p>
              <p className="text-xs text-gray-400">This is a computer-generated invoice and does not require a signature.</p>
            </div>
          </div>
        </motion.div>
        
        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() => window.location.replace("/order-status")}
            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-200 font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Back to Orders
          </button>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="flex-1 sm:flex-initial bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg border border-gray-200 font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
            >
              <Printer className="mr-2 h-5 w-5" /> Print
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="flex-1 sm:flex-initial bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center shadow-sm"
            >
              <Download className="mr-2 h-5 w-5" /> Download
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Invoice
