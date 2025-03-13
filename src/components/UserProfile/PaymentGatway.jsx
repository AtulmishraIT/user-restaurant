import axios from "axios";
import React, { useEffect, useState } from "react";

function PaymentGateway() {
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [upiId, setUpiId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
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
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("Payment Successful!");
      handleSendPayment();
      window.location.href = "/order-status";
    }, 2000);
  };
  useEffect(() => {
    const handlePaymentData = async () => {
      setIsLoading(true);
      try {
        setInterval(async () => {
          const response = await axios.get("http://localhost:8000/getpayment", {
            params: { email },
          });
          if(response.data !== null)
            setPaymentData(response.data);
          else
            setPaymentData([]);
          setIsLoading(false);
        }, [1000]);
      } catch (error) {
        console.error(error);
      }
    };
    handlePaymentData();
  }, [email]);

  return (
    <div className="flex flex-col items-center justify-center h-screen mt-10 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Payment Gateway</h1>
      <form
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        {paymentData && (
          <div className="">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Previous Payment Methods
            </label>
            <div>
              <div>
                {paymentData.upi !== null ? (
                  <div className="flex justify-between items-center p-2 border">
                    {paymentData.upi}
                    <button onClick={(e)=>{e.preventDefault(); setIsOther(true); setPaymentMethod("upi"); setUpiId(`${paymentData.upi}`);}} className=" text-orange-500">use</button>
                  </div>
                ) : null}
              </div>
              <div>
                {paymentData.creditCard !== null ? (
                  <div className="flex justify-between items-center p-4">
                    <div className="flex justify-center items-center gap-1 ">
                      <box-icon type='solid' name='credit-card'></box-icon>
                      {paymentData.creditCard}
                    </div>
                    <button onClick={()=>{setIsOther(true); setPaymentMethod("creditCard"); setCardNumber(`${paymentData.creditCard}`)}} className="text-orange-500">use</button>
                  </div>
                ) : null}
              </div>
              <div>
                {paymentData.debitCard !== null ? (
                  <div className="flex justify-between items-center p-2">
                    {paymentData.debitCard}
                    <button onClick={()=>{setIsOther(true); setPaymentMethod("debitCard"); setCardNumber(`${paymentData.debitCard}`)}} className="text-orange-500">use</button>
                  </div>
                ) : <div className="mb-2 text-sm">No Previous Payment Methods</div>}
              </div>
            </div>
          </div>
        )}
        <hr className="py-2" />
        {paymentData!==null && 
        <div className="p-2 border mb-10">
          <div className="flex justify-between items-center p-2">
            Others{" "}
            <p className="cursor-pointer" onClick={() => setIsOther(!isOther)}>
              <box-icon name="chevron-down"></box-icon>
            </p>
          </div>
          <div>
            {isOther ? (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="paymentMethod"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    className="shadow appearance border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="creditCard">Credit Card</option>
                    <option value="debitCard">Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  {paymentMethod === "creditCard" ||
                  paymentMethod === "debitCard" ? (
                    <>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="cardNumber"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="expiryDate"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="cvv"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="upiId"
                      >
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
 ||
 <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="paymentMethod"
                  >
                    Payment Method
                  </label>
                  <select
                    id="paymentMethod"
                    className="shadow appearance border rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="creditCard">Credit Card</option>
                    <option value="debitCard">Debit Card</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  {paymentMethod === "creditCard" ||
                  paymentMethod === "debitCard" ? (
                    <>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="cardNumber"
                        >
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="cardNumber"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="expiryDate"
                        >
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2"
                          htmlFor="cvv"
                        >
                          CVV
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                          required
                        />
                      </div>
                    </>
                  ) : (
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="upiId"
                      >
                        UPI ID
                      </label>
                      <input
                        type="text"
                        id="upiId"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                    </div>
                  )}
                </div>
              </> }
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handlePayment}
          >
            Pay Now
          </button>
        </div>
      </form>
      {paymentStatus && <p className="mt-4 text-green-500">{paymentStatus}</p>}
    </div>
  );
}

export default PaymentGateway;
