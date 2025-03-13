import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

function Payment() {
  const [paymentData, setPaymentData] = useState();
  const [isDelete, setIsDelete] = useState(false);
  const [deleteMethod, setDeleteMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const handlePaymentData = async () => {
      setIsLoading(true);
      try {
        setInterval(async () => {
          const response = await axios.get("http://localhost:8000/getpayment", {
            params: { email },
          });
          setPaymentData(response.data);
          setIsLoading(false);
        }, [1000]);
      } catch (error) {
        console.error(error);
      }
    };
    handlePaymentData();
  }, [email]);

  const handlePaymentDelete = async (method) => {
    try {
      const response = await axios.post("http://localhost:8000/deletepayment", {
        email,
        method,
      });
      if (response.status === 200) {
        setPaymentData((prevData) => ({
          ...prevData,
          [method]: null,
        }));
        setIsDelete(false); // Close the delete confirmation dialog
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
    }
  };

  return (
    <div className="-z-20 m-10 flex flex-col justify-start items-start ml-32 h-full w-full">
      <h1 className="text-2xl font-bold mb-10">Payment Details</h1>
      {isLoading ? (
        <div className="flex justify-center items-start gap-8">
          {Array(3)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-start justify-center border-2 border-gray-300 p-5 rounded-lg "
              >
                <Skeleton height={30} width={100} />
                <Skeleton height={20} width={150} />
                <div className="flex gap-5 items-center justify-center">
                  <Skeleton height={40} width={100} />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div>
          {paymentData ? (
            <>
              <div className="flex justify-center items-start gap-8">
                <div className="border-2 p-5 flex flex-col border-gray-200">
                  <strong className="text-orange-500">UPI</strong>{" "}
                  {paymentData.upi || "N/A"}
                  <button
                    className="py-1 px-4 text-white bg-orange-500 mt-5"
                    onClick={() => {
                      setIsDelete(true);
                      setDeleteMethod("upi");
                    }}
                  >
                    DELETE
                  </button>
                </div>
                <div className="border-2 p-5 flex flex-col border-gray-200">
                  <strong className="text-orange-500">Credit Card:</strong>{" "}
                  {paymentData.creditCard || "N/A"}
                  <button
                    className="py-1 text-white bg-orange-500 mt-5"
                    onClick={() => {
                      setIsDelete(true);
                      setDeleteMethod("creditCard");
                    }}
                  >
                    DELETE
                  </button>
                </div>
                <div className="border-2 p-5 flex flex-col border-gray-200">
                  <strong className="text-orange-500">Debit Card:</strong>{" "}
                  {paymentData.debitCard || "N/A"}
                  <button
                    className="py-1 text-white bg-orange-500 mt-5"
                    onClick={() => {
                      setIsDelete(true);
                      setDeleteMethod("debitCard");
                    }}
                  >
                    DELETE
                  </button>
                </div>
              </div>
              <div>
                {isDelete && (
                  <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/25">
                    <motion.div
                      initial={{ opacity: 1, x: 0 }}
                      animate={{ opacity: 1, y: -120 }}
                      className="fixed bottom-0 p-5 bg-white"
                    >
                      <h1>
                        Are you sure you want to delete the payment method?
                      </h1>
                      <div className="flex justify-center items-center gap-5 mt-5">
                        <button
                          className="py-2 px-4 text-white bg-orange-500"
                          onClick={() => setIsDelete(false)}
                        >
                          CANCEL
                        </button>
                        <button
                          className="py-2 px-4 text-white bg-green-500"
                          onClick={() => handlePaymentDelete(deleteMethod)}
                        >
                          DELETE
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div>Loading payment data...</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Payment;
