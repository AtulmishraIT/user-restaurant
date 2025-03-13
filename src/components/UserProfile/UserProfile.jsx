import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import UserNav from "./userNav";
import { motion, useScroll } from "framer-motion";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [isEmailChange, setIsEmailChange] = useState(false);
  const [isMobChange, setIsMobChange] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [email1, setEmail] = useState("");
  const [mobno1, setMobno] = useState("");
  const [isScroll, setIsScroll] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [otp, setOtp] = useState("");
  const { scrollY } = useScroll();
  const email = localStorage.getItem("userEmail");

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with the logged-in user's email (e.g., from localStorage or context)
        const email = localStorage.getItem("userEmail"); // Example: Get email from localStorage
        if (!email) {
          throw new Error("User email not found");
        }
        const response = await axios.get(`http://localhost:8000/user/${email}`);
        setUserData(response.data);
        setEmail(response.data.email);
        setMobno(response.data.mobno);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      if (latest < 140) {
        setIsScroll(true);
      } else {
        setIsScroll(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY]);

  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  
  const handleEditProfile = () => {
    setIsChanged(!isChanged);
    setIsEmailChange(false);
    setIsMobChange(false);
    setIsVerify(false);
  };
  const handleCloseModal = (e) => {
    if (e.target.id === "modal-overlay") {
      setIsChanged(false);
      setIsEmailChange(false);
      setIsMobChange(false);
      setIsVerify(false);
    }
  };

  const handleVerify = async () => {
    setIsVerify(!isVerify);
    try {
      const response = await axios.post("http://localhost:8000/send-otp", {
        email: userData.email,
      });
      setMessage(response.data.message);
    } catch (error) {
      setError(error.response.data.message || "Failed to send OTP");
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8000/verify-otp", {
        email: userData.email,
        otp,
        newMobNo: isMobChange ? mobno1 : null,
        newEmail: isEmailChange ? email1 : null,
      });
      if(email1 !== null){
        alert("You need to login again");
        window.location.reload();
        window.location.href = "/"
      }
      setMessage(response.data.message);
      setIsChanged(false);
      setIsEmailChange(false);
      setIsMobChange(false);
      setIsVerify(false);
    } catch (error) {
      setError(error.response.data.message || "Failed to verify OTP");
      console.log(error)
    }
  };
  
  const handleEmailChange = () => {
    setIsEmailChange(!isEmailChange);
    setIsMobChange(false);
  };
  const handleMobChange = () => {
    setIsMobChange(!isMobChange);
    setIsEmailChange(false);
  };

 
  
  return (
    <div className="bg-slate-600 overflow-hidden text-white w-full absolute p-10 -mr-20 scroll-md">
    <div className="max-w-[1320px] max-h-full mx-auto mt-20 visited:bg-gray-100 ">
      {userData ? (
        <div className="flex flex-col md:flex-row ml-4 transition ease-in-out duration-500 justify-between items-center w-full h-fit-content p-10 bg-transparent rounded-md">
          <div className="mb-4 md:mb-0">
            <p className="text-3xl font-bold font-sans">{userData.name}</p>
            <div className="flex gap-3 flex-wrap">
              <p>{userData.mobno}</p>
              <strong>.</strong>
              <p>{userData.email}</p>
            </div>
          </div>
          <div>
            <button
              onClick={handleEditProfile}
              type="button"
              className="bg-transparent border-2 px-5 py-3 font-sans font-bold text-sm mr-5 hover:bg-green-500 hover:text-white"
            >
              EDIT PROFILE
            </button>
            {(isChanged && (
              <div
                id="modal-overlay"
                className="fixed inset-0 z-50 text-black bg-black bg-opacity-50 flex justify-center items-center mx-auto  transition-opacity duration-1000 ease-in-out"
                onClick={handleCloseModal}
              >
                <motion.div
                initial={{opacity:1, x:600}}
                animate={{opacity:1, x:0}}
                exit={{y:-600}}
                transition={{duration:0.3,delay:0.1}}
                className="max-sm:relative max-sm:max-h-fit max-sm:pb-5 max-sm:max-w-full absolute h-screen w-[580px] top-0 right-0 bg-white p-2 mx-auto">
                  <div className="flex justify-between items-center -mt-2">
                  <button
                    onClick={handleEditProfile}
                    className="text-center flex justify-center items-center m-5 gap-1 font-bold text-lg focus:opacity-40"
                  >
                    <img
                      className="h-4 w-4 m-3 max-sm:absolute font-extralight   max-sm:right-0 max-sm:top-0"
                      src="https://cdn-icons-png.flaticon.com/128/1828/1828778.png"
                      alt=""
                    />
                    <p className="text-lg font-sans">Edit Profile</p>
                  </button>
                  </div>
                  <div className="max-w-[380px] max-sm:max-w-auto max-sm:mx-auto overflow-hidden ">
                  <p className="text-green-500 text-center bg-black">{message}</p>
                    <div className="mt-5 ml-8 max-sm:ml-auto flex flex-col gap-3 ">
                      <h1 className="text-xl">Phone Number</h1>
                      {isMobChange ? (
                        <div className="mb-20 h-10 w-full">
                          {(isVerify && (
                            <div className="mt-2 my-20 flex flex-col gap-2">
                              <input
                                type="text"
                                value={mobno1}
                                onChange={(e) => setMobno(e.target.value)}
                                className="w-full h-full px-2 p-3 text-xl"
                              />
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full h-full p-3 px-2 text-xl"
                              />
                              <button onClick={handleSendOtp} className="text-white text-xl px-4 py-2 w-full bg-orange-500 mt-2 shadow-md hover:shadow-xl">
                                CONFIRM
                              </button>
                            </div>
                          )) || (
                            <div className="mt-2 flex flex-col gap-2">
                              <input
                                type="text"
                                value={mobno1}
                                onChange={(e) => setMobno(e.target.value)}
                                className="w-full h-full px-2 p-4 text-xl"
                              />
                              <button
                                onClick={handleVerify}
                                className="text-white h-full mb-20 text-xl px-4 py-2 w-full bg-orange-500 mt-2 shadow-md hover:shadow-xl"
                              >
                                Send OTP
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="flex justify-between overflow-hidden">
                          <h3 className="opacity-100 font-extralight text-lg">
                            {userData.mobno}
                          </h3>
                          <button
                            onClick={handleMobChange}
                            className="text-orange-600 font-bold text-sm"
                          >
                            CHANGE
                          </button>
                        </span>
                      )}
                    </div>
                    <hr className="h-px my-5 mx-9 bg-gray-200 border-0 dark:bg-gray-300" />
                    <div className="mt-5 ml-8 flex flex-col gap-3 max-sm:ml-auto">
                      <h1 className="text-xl">Email id</h1>
                      {isEmailChange ? (
                        <div className="mb-20 h-full w-full">
                          {(isVerify && (
                            <div className="mt-2 my-20 flex flex-col gap-2">
                              <input
                                type="text"
                                value={email1}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-full px-2 p-3 text-xl"
                              />
                              <input
                                type="text"
                                placeholder="Enter OTP"
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full h-full p-3 px-2 text-xl"
                              />
                              <button onClick={handleSendOtp} className="text-white text-xl px-4 py-2 w-full bg-orange-500 mt-2 shadow-md hover:shadow-xl">
                                CONFIRM
                              </button>
                            </div>
                          )) || (
                            <div className="mt-2 flex flex-col gap-2">
                              <input
                                type="text"
                                value={email1}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-full px-2 p-4 text-xl"
                              />
                              <button
                                onClick={handleVerify}
                                className="text-white h-full mb-20 text-xl px-4 py-2 w-full bg-orange-500 mt-2 shadow-md hover:shadow-xl"
                              >
                                Send OTP
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="flex justify-between overflow-hidden">
                          <h3 className="opacity-100 font-extralight text-lg">
                            {userData.email}
                          </h3>
                          <button
                            onClick={handleEmailChange}
                            className="text-orange-600 font-bold text-sm"
                          >
                            CHANGE
                          </button>
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>{" "}
              </div>
            )) ||
              null}
          </div>
        </div>
      ) : (
        <p>No user data found.</p>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p className="bg-black">{message}</p>}
    </div>
    <motion.div
      className="w-screen -ml-14 h-full flex justify-center items-center"
      initial={{opacity:1, x:0}}
      animate={{
        backgroundColor: isScroll ? "transparent" : "white", // Animate width based on scroll
        opacity: isScroll ? 0.9 : 1.5,
      }}
      transition={{ type: "tween", // Linear animation
        duration: 1, // Duration of the animation in seconds
        delay: 0,  }} // Smooth transition
    >
      <div className="w-fit bg-white p-10">
      <div
        className="bg-white text-black w-fit overflow-hidden flex gap-y-32 items-center justify-center"
      >
        <UserNav />
      </div>
      </div>
    </motion.div>
    </div>
  );
};

export default UserProfile;
