import React, { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import { motion } from "framer-motion";

function Dinein() {
  const [dineData, setDineData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancel, setIsCancel] = useState(null);
  const email = localStorage.getItem("userEmail");

  useEffect(() => {
    const fetchDineData = async () => {
      setIsLoading(true);
      setInterval(async () => {
        const response = await axios.get("http://localhost:8000/Dine/chairs");
        //userEmail === email than only show the data
        setDineData(response.data.filter((item) => item.userEmail === email));
        setIsLoading(false);
      }, [1000]);
    };
    fetchDineData();
  }, []);

  const handleCancel = async (id) => {
    const response = await axios.patch(
      `http://localhost:8000/Dine/chairs/${id}`,
      {
        occupied: false,
        userEmail: null,
        userName: null,
        userPhone: null,
        time: null,
      }
    );
    alert("Booking cancelled successfully");
    setDineData(dineData.filter((item) => item.chairs !== id));
  };

  return (
    <>
      <div className=" -z-20 m-10 flex flex-col justify-start items-start ml-32 h-full w-full ">
        <h1 className="text-2xl font-bold text-gray-800 mb-10">Dine-in</h1>
        <div className="flex gap-10 flex-wrap">
          {isLoading ? (
            Array(4)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-5 items-start justify-center border-2 border-gray-300 p-5 rounded-lg w-80"
                >
                  <Skeleton height={30} width={200} />
                  <Skeleton height={20} width={150} />
                  <div className="flex gap-5 items-center justify-center">
                    <Skeleton height={40} width={100} />
                    <Skeleton height={40} width={100} />
                  </div>
                </div>
              ))
          ) : (
            <div className="flex gap-10 flex-wrap">
              {dineData.map((item) => (
                <div className="grid grid-flow-row grid-cols-subgrid max-sm:grid-cols-1 gap-5 items-start justify-start flex-wrap">
                  <div className="flex flex-col gap-5 items-center justify-center border-2 border-gray-300 p-5 rounded-lg w-80">
                    <div className="flex flex-col gap-5 items-start justify-center w-full">
                      <p className="text-lg">
                        Booked Chair:{" "}
                        <span className="font-bold text-3xl">
                          {item.chairs}
                        </span>
                      </p>
                      <div className="flex items-center">
                        <p className="mr-2">
                          Timing: <span>{item.time}</span>
                        </p>
                        <button
                          title="Here 'T' defines the Time"
                          className="w-4 h-4 flex items-center justify-center rounded-full"
                        >
                          <box-icon name="info-circle" size="15px"></box-icon>
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-5 items-center justify-center">
                      <button
                        className="bg-orange-500 p-2 text-white"
                        onClick={() => setIsCancel(item.chairs)}
                      >
                        Cancel
                      </button>
                      <button className="bg-green-500 p-2 text-white">
                        Dine done
                      </button>
                    </div>
                  </div>
                </div>
              ))}
                {isCancel && (
              <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-black/25">
              <div className="fixed mr-80 flex flex-col gap-5 items-start justify-center">
                  <motion.div initial={{opacity:1,x:0}} animate={{opacity:1,y:-120}} className="fixed flex flex-col justify-center items-center gap-5 bottom-20 bg-white border shadow-xl h-fit w-fit p-5">
                    <p>Are you sure you want to cancel the booking?</p>
                    <div className="flex justify-center items-center gap-5">
                    <button
                      className="bg-red-500 px-5 py-1 text-white"
                      onClick={() => handleCancel(isCancel)}
                    >
                      Yes
                    </button>
                    <button
                      className="bg-green-500 px-5 py-1  text-white"
                      onClick={() => setIsCancel(null)}
                    >
                      No
                    </button>
                    </div>
                  </motion.div>
              </div>
              </div>
                )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Dinein;
