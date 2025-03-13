import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";

function Addresses() {
  const [saveadd, setSaveadd] = useState([]);
  const [isDelete, setIsDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAddresses = async () => {
      const email = localStorage.getItem("userEmail");
      setIsLoading(true);
      setInterval(async() => {
        try {
          const response = await axios.get("http://localhost:8000/cart/address", {
            params: { email },
          });
          setSaveadd(response.data.address || []);
        } catch (err) {
          console.error(
            "Error fetching addresses:",
            err.response ? err.response.data : err.message
          );
        }  
        setIsLoading(false);
      }, [1000]);
    };
    fetchAddresses();
  }, []);

  const handleDelete = async (address) => {
    const email = localStorage.getItem("userEmail");
    try {
      const response = await axios.post(
        "http://localhost:8000/cart/DeleteAdd",
        {
          email,
          address,
        }
      );
      if (response.status === 200) {
        setSaveadd(saveadd.filter((addr) => addr !== address) || []);
        setIsDelete(null);
      }
    } catch (err) {
      console.error(
        "Error deleting address:",
        err.response ? err.response.data : err.message
      );
    }
  };
  return (
    <div className=" -mt-2 -z-20 m-10 flex flex-col justify-start items-start ml-32 h-full ">
      <h1 className="text-2xl py-5 font-bold">Manage Addresses</h1>
      {isLoading ? (
        <div className="flex gap-10 mt-10 ml-10 flex-wrap">
          {Array(4)
            .fill()
            .map((_, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 items-center justify-center border-2 border-gray-300 p-6 rounded-lg w-80"
              >
                <Skeleton height={40} width={120} />
                <div className="flex flex-col gap-2 items-start justify-center">
                <Skeleton height={20} width={200} />
                <Skeleton height={20} width={200} />
                <Skeleton height={20} width={200} />
                </div>
                <Skeleton height={40} width={100} />
              </div>
            ))}
        </div>
      ) : (
        <div>
      {saveadd.length > 0 ? (
        <div>
          <ul className="w-full grid grid-cols-2 max-sm:grid-cols-1 ml-10 mt-10">
            {saveadd.map((addr, index) => (
              <li
                key={index}
                className="mb-2 w-[350px] text-wrap border hover:shadow-xl p-10 flex flex-col justify-center items-center gap-3"
              >
                <span className="">
                  <box-icon type="solid" name="map"></box-icon>
                  {addr.split(",")[0]}
                </span>
                {addr.slice()}
                <button
                  className="text-orange-500 mt-4 -mb-5 "
                  onClick={() => setIsDelete(addr)}
                >
                  DELETE
                </button>
              </li>
            ))}
          </ul>
          <div className="Delete">
            {isDelete && (
              <motion.div
                initial={{ opacity: 0, y: 200 }}
                transition={{ duration: 0.3 }}
                animate={{ opacity: 1, y: -80 }}
                exit={{ opacity: 0, y: 300 }}
                className="fixed bottom-0 bg-white border shadow-xl h-fit w-fit mt-52 p-5 ml-40"
              >
                <h1 className="py-2 px-10">Are you sure?</h1>
                <div className="flex justify-center items-center gap-10 py-5">
                  <button
                    className="border border-orange-500 p-2"
                    onClick={() => setIsDelete(null)}
                  >
                    CANCEL
                  </button>
                  <button
                    className="bg-orange-400 p-2"
                    onClick={() => handleDelete(isDelete)}
                  >
                    DELETE
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-20 text-3xl">can't see any address</div>
      )}
      </div>
      )}
    </div>
  );
}

export default Addresses;
