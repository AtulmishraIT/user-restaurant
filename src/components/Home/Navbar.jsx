import React, { useState, useEffect } from "react";
import Login from "../Login/Login";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import usePageRefresh from "../usePageRefresh";
import foodData from '../../food/food1.json'
import Loading from "../../Loading";

function Navbar(props) {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLogout, setIsLogout] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Replace with the logged-in user's email (e.g., from localStorage or context)
        const email = localStorage.getItem("userEmail"); // Example: Get email from localStorage
        if (!email) {
          throw new Error("User email not found");
        }
        const response = await axios.get(`http://localhost:8000/home/${email}`);
        setUserData(response.data);
      } catch (err) {
        setError(err.message || "Failed to fetch user data");
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCartCount = () => {
      const data = foodData.foodItems
      .map((food) => {
        return localStorage.getItem(food.id);
      })
      .filter((items)=> items!==null)
      setCartCount(data.length);
    };

    fetchCartCount();
  }, []);

  // Handle logout
  const handleLogout = async (e) => {
    if (isLogout === true) {
      try {
        await axios.post("http://localhost:8000/logout");
        setTimeout(() => {
          localStorage.removeItem("userEmail"); // Clear user email from localStorage
          localStorage.removeItem("token"); // Clear token from localStorage (if using token-based auth)
          localStorage.clear();
          setUserData(null); // Reset user data
          navigate("/login"); // Redirect to login page
          setIsLogout(false);
        }, 1000);
      } catch (err) {
        console.error("Logout failed:", err);
      }
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  if (isLoading) {
    return <div className="z-50"><Loading /></div>; // Show loading indicator while fetching data
  }

  
  return (
    <>
      <nav className=" bg-green-700 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between max-sm:justify-evenly max-sm:items-start mx-auto p-4">
          <Link
            to="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              alt=""
              srcSet="../src/food/logo.png"
              className="w-auto h-[40px]"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Restaurant
            </span>
          </Link>

          <button
            onClick={toggleMenu}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-sticky"
            aria-expanded={isMenuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <div
              className="items-center justify-between w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-green-700 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-z dark:bg-green-700 md:dark:bg-green-700 dark:border-gray-700">
                <li>
                  <Link
                    to="/home"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/Dine"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500"
                    aria-current="page"
                  >
                    Dine-in
                  </Link>
                </li>
              </ul>
            </div>
          )}

          <div
            className="items-center hidden justify-between w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-green-700 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 text-white dark:text-black dark:bg-green-700 md:dark:bg-green-700 dark:border-gray-700">
              <li>
                <Link
                  to="/home"
                  className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                  <Link
                    to="/Dine"
                    className="block py-2 px-3 text-white rounded md:bg-transparent md:p-0" 
                    aria-current="page"
                  >
                    Dine-in
                  </Link>
                </li>
              <li>
                <Link
                  to="/search"
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                >
                  <span className="flex justify-center items-center">
                    <box-icon name="search"></box-icon>Search
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            {(userData && (
              <div>
                {userData.isLogin ? (
                  <div  className="flex items-center justify-center md:order-2 space-x-3 rtl:space-x-reverse">
                    <p className="text-white max-sm:hidden">{userData.name}</p>
                    <p onMouseOverCapture={toggleProfileMenu} onMouseOut={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex justify-center items-center bg-gray-200 hover:bg-gray-300 h-9 w-9 p-5 rounded-full ">
                      <Link
                        to="/profile"
                        className="block py-2 px-3 transition delay-300 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        <box-icon name="user"></box-icon>
                      </Link>
                      {isProfileMenuOpen && (
                        <ul className="absolute right-36 max-sm:right-0 transition duration-200 top-20 mr-10 w-56 bg-white border border-gray-200 pl-2 shadow-xl border-t-green-700 border-t-2 border-solid shadow-gray-500 p-1 ">
                          <li>
                            <Link
                              to="/profile"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              <box-icon name="user"></box-icon> Profile
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile/order"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Order
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile/Dine"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Dine-in
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile/favourites"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              favourite
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile/payment"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Payment
                            </Link>
                          </li>
                          
                          <li>
                            <Link
                              to="/profile/addresses"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Address
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/profile/contact"
                              className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                             Contact
                            </Link>
                          </li>
                          <li>
                            <button
                              onClick={() => setIsLogout(!isLogout)}
                              className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </li>
                        </ul>
                      )}
                    </p>
                    <Link to="/cart" className=" bg-gray-300 rounded-full">
                      <p className="flex justify-center items-center w-10 h-10 ">
                        <svg
                          className="w-10 h-10 text-gray-800"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke="currentColor"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                          />
                        </svg>
                        <div className="bg-white rounded-full h-4 w-4 -mt-6 -ml-3 animate-pulse duration-1000 delay-1000 text-[10px] text-center">{cartCount}</div>
                      </p>
                    </Link>
                    <button
                      onClick={() => setIsLogout(!isLogout)}
                      className="text-white max-sm:rounded-full max-sm:p-0 bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm px-4 py-2 text-center"
                    >
                      <span className="max-sm:hidden">Logout</span>
                      <span className="sm:hidden md:hidden hover:opacity-50">
                        <img
                          className="w-10 h-10 object-cover"
                          srcSet="https://cdn-icons-png.flaticon.com/128/10309/10309341.png"
                          alt=""
                        />
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                    <Link
                      to="/Login"
                      className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-700 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Get started
                    </Link>
                  </div>
                )}
              </div>
            )) || (
              <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <Link
                  to="/Login"
                  className="text-white bg-gray-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-gray-700 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>
        </div>
        <div>
          {(isLogout && (
            <div className="absolute h-screen w-full z-50 bg-black bg-opacity-50 flex justify-center items-center content-center ">
              <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col gap-4 -mt-32">
                <h1 className="text-xl">Are you sure, you want to logout?</h1>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => {
                      setIsLogout(false);
                    }}
                    className="text-white bg-green-500 px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white bg-red-500 px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )) ||
            null}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
