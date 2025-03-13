import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

function Order() {
  const [order, setOrder] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setInterval(async () => {
        const response = await axios.get("http://localhost:8000/Order", {
          params: { email },
        });
        setOrder(response.data);
        setIsLoading(false);
      }, [1000]);
    };
    fetchOrder();
  }, []);

  return (
    <div className=" -z-20 m-10 flex flex-col justify-start items-start ml-32 h-full w-full ">
      <h1 className="text-xl font-bold mb-5">Orders</h1>
      {isLoading ? (
        <div className="flex gap-10 flex-wrap">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex gap-5 items-start justify-center border-2 border-gray-300 p-5 rounded-lg w-80"
              >
                <Skeleton height={100} width={170} />
                <div className="flex flex-col gap-5 items-center justify-center">
                  <Skeleton height={20} width={100} />
                  <Skeleton height={20} width={100} />
                  <Skeleton height={20} width={100} />
                </div>
              </div>
            ))}
        </div>
      ) : (
        <div className="flex gap-5 flex-wrap">
          <div className="flex gap-5 flex-wrap">
            {order.length > 0 ? (
              <div className="grid grid-cols-2 max-sm:grid-cols-1 gap-5">
                {order.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-0 items-start justify-center border border-gray-300 p-5 rounded-lg w-fit h-40"
                  >
                    <h1 className="h-40 w-40">
                      <img src={item.image} alt="Found" className="object-cover h-28 w-32" />
                    </h1>
                    <div className="flex flex-col gap-2 -ml-5 items-start justify-center">
                      <h1 className="text-[18px]">{item.name}</h1>
                      <h1>
                        <span>Total Quantity: </span>
                        {item.quantity}
                      </h1>
                      <h1>
                        <span>Total Price: </span>
                        {item.price}
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>Can't see any orders</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
