import axios from "axios";
import React, { useEffect, useState } from "react";
import { CreditCard, ChevronDown, CheckCircle, AlertCircle, Wallet, CreditCardIcon as CardIcon, Smartphone } from 'lucide-react';

function PaymentGateway() {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [statusType, setStatusType] = useState(""); // success or error
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOther, setIsOther] = useState(false);
  const email = localStorage.getItem("userEmail");

  const payment = {
    upi: paymentMethod === "upi" ? upiId : null,
    creditCard: paymentMethod === "creditCard" ? cardNumber : null,
    debitCard: paymentMethod === "debitCard" ? cardNumber : null,
  };

  const handleSendPayment = async () => {
    try {
      const response = await axios.post("http://localhost:8000/savepayment", {
        email,
        payment,
      });
      console.log(payment);
      return response.data;
    } catch (error) {
      console.error("Not set: ", error);
      setStatusType("error");
      setPaymentStatus("Payment Failed. Please try again.");
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setPaymentStatus("Processing payment...");
    
    // Simulate payment processing
    setTimeout(() => {
      setIsLoading(false);
      setStatusType("success");
      setPaymentStatus("Payment Successful!");
      handleSendPayment();
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = "/order-status";
      }, 1500);
    }, 2000);
  };
  
  useEffect(() => {
    const handlePaymentData = async () => {
      setIsLoading(true);
      try {
        const fetchData = async () => {
          const response = await axios.get("http://localhost:8000/getpayment", {
            params: { email },
          });
          if(response.data !== null)
            setPaymentData(response.data);
          else
            setPaymentData([]);
          setIsLoading(false);
        };
        
        fetchData();
        const interval = setInterval(fetchData, 1000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    
    handlePaymentData();
  }, [email]);

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date
  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <div className="flex flex-col mt-10 items-center justify-center min-h-screen py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Payment Gateway</h1>
          <p className="text-gray-600 mt-2">Complete your purchase securely</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <form className="p-6">
            {isLoading && !paymentStatus ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {paymentData && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-3">
                      Previous Payment Methods
                    </h2>
                    
                    {paymentData.upi && (
                      <div className="flex justify-between items-center p-3 border rounded-lg mb-2 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <Smartphone className="h-5 w-5 text-indigo-500 mr-3" />
                          <span className="text-gray-700">{paymentData.upi}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOther(true);
                            setPaymentMethod("upi");
                            setUpiId(`${paymentData.upi}`);
                          }} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          Use
                        </button>
                      </div>
                    )}
                    
                    {paymentData.creditCard && (
                      <div className="flex justify-between items-center p-3 border rounded-lg mb-2 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <CreditCard className="h-5 w-5 text-indigo-500 mr-3" />
                          <span className="text-gray-700">
                            •••• •••• •••• {paymentData.creditCard.slice(-4)}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOther(true);
                            setPaymentMethod("creditCard");
                            setCardNumber(`${paymentData.creditCard}`);
                          }} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          Use
                        </button>
                      </div>
                    )}
                    
                    {paymentData.debitCard && (
                      <div className="flex justify-between items-center p-3 border rounded-lg mb-2 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center">
                          <CardIcon className="h-5 w-5 text-indigo-500 mr-3" />
                          <span className="text-gray-700">
                            •••• •••• •••• {paymentData.debitCard.slice(-4)}
                          </span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setIsOther(true);
                            setPaymentMethod("debitCard");
                            setCardNumber(`${paymentData.debitCard}`);
                          }} 
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          Use
                        </button>
                      </div>
                    )}
                    
                    {!paymentData.upi && !paymentData.creditCard && !paymentData.debitCard && (
                      <div className="text-sm text-gray-500 italic p-3 border rounded-lg border-dashed">
                        No previous payment methods found
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t border-gray-200 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsOther(!isOther)}
                    className="flex w-full justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <Wallet className="h-5 w-5 text-indigo-500 mr-2" />
                      <span className="font-medium text-gray-700">
                        {isOther ? "Hide payment options" : "Add new payment method"}
                      </span>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isOther ? 'transform rotate-180' : ''}`} />
                  </button>
                  
                  {isOther && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          className="block text-gray-700 text-sm font-medium mb-2"
                          htmlFor="paymentMethod"
                        >
                          Payment Method
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("creditCard")}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                              paymentMethod === "creditCard" 
                                ? "border-indigo-500 bg-indigo-50" 
                                : "border-gray-200 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <CreditCard className={`h-6 w-6 ${paymentMethod === "creditCard" ? "text-indigo-600" : "text-gray-500"}`} />
                            <span className={`text-sm mt-1 ${paymentMethod === "creditCard" ? "text-indigo-600 font-medium" : "text-gray-700"}`}>
                              Credit Card
                            </span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("debitCard")}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                              paymentMethod === "debitCard" 
                                ? "border-indigo-500 bg-indigo-50" 
                                : "border-gray-200 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <CardIcon className={`h-6 w-6 ${paymentMethod === "debitCard" ? "text-indigo-600" : "text-gray-500"}`} />
                            <span className={`text-sm mt-1 ${paymentMethod === "debitCard" ? "text-indigo-600 font-medium" : "text-gray-700"}`}>
                              Debit Card
                            </span>
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setPaymentMethod("upi")}
                            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
                              paymentMethod === "upi" 
                                ? "border-indigo-500 bg-indigo-50" 
                                : "border-gray-200 hover:bg-gray-50"
                            } transition-colors`}
                          >
                            <Smartphone className={`h-6 w-6 ${paymentMethod === "upi" ? "text-indigo-600" : "text-gray-500"}`} />
                            <span className={`text-sm mt-1 ${paymentMethod === "upi" ? "text-indigo-600 font-medium" : "text-gray-700"}`}>
                              UPI
                            </span>
                          </button>
                        </div>
                      </div>
                      
                      {(paymentMethod === "creditCard" || paymentMethod === "debitCard") ? (
                        <div className="space-y-4">
                          <div>
                            <label
                              className="block text-gray-700 text-sm font-medium mb-2"
                              htmlFor="cardNumber"
                            >
                              Card Number
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                id="cardNumber"
                                className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={cardNumber}
                                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                placeholder="1234 5678 9012 3456"
                                maxLength="19"
                                required
                              />
                              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="expiryDate"
                              >
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                id="expiryDate"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                                placeholder="MM/YY"
                                maxLength="5"
                                required
                              />
                            </div>
                            
                            <div>
                              <label
                                className="block text-gray-700 text-sm font-medium mb-2"
                                htmlFor="cvv"
                              >
                                CVV
                              </label>
                              <input
                                type="text"
                                id="cvv"
                                className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                placeholder="123"
                                maxLength="3"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label
                            className="block text-gray-700 text-sm font-medium mb-2"
                            htmlFor="upiId"
                          >
                            UPI ID
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              id="upiId"
                              className="pl-10 shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              value={upiId}
                              onChange={(e) => setUpiId(e.target.value)}
                              placeholder="name@upi"
                              required
                            />
                            <Smartphone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {paymentStatus && (
                  <div className={`mt-4 p-3 rounded-lg flex items-center ${
                    statusType === "success" ? "bg-green-50 text-green-700" : 
                    statusType === "error" ? "bg-red-50 text-red-700" : 
                    "bg-blue-50 text-blue-700"
                  }`}>
                    {statusType === "success" ? (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    ) : statusType === "error" ? (
                      <AlertCircle className="h-5 w-5 mr-2" />
                    ) : (
                      <div className="h-5 w-5 mr-2 rounded-full border-2 border-t-transparent border-blue-600 animate-spin"></div>
                    )}
                    {paymentStatus}
                  </div>
                )}
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className={`w-full flex justify-center items-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                      isLoading ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-5 w-5 mr-2 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Secured by SSL encryption. We do not store your card details.</p>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway;