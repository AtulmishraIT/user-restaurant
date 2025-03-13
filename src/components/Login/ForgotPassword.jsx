import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8000/forgot-password",
        { email }
      );
      setMessage(response.data);
    } catch (error) {
      console.error("Error during password reset:", error);
      if (error.response) {
        // If the error has a response, display that
        setError(error.response.data);
      } else {
        // If no response (network issues, etc.)
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="w-screen">
      <div className="max-sm:relative max-sm:m-10">
      <div className="h-10 w-fit p-2 rounded-full bg-blue-100 flex justify-center items-center md:fixed md:m-10 cursor-pointer">
        <Link to="/login" className="flex justify-center items-center">
            <box-icon name='x'></box-icon>
            <span className="max-sm:hidden">Cancel</span>
        </Link>
      </div>
      </div>
      <div className="flex flex-col max-sm:-mt-0 items-center justify-center px-6 py-8 my-52 mx-1 md:my-0 md:h-screen lg:py-0">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center p-10 border-2 rounded-xl w-full md:w-1/2 sm:w-1/2 lg:w-96 h-fit shadow-2xl "
        >
          <h1 className="text-2xl mb-5 font-bold font-mono text-blue-500 leading-tight">
            Forgot Password
          </h1>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="floating_email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => {
                setEmail(e.target.value);
              }} //for getting user input value
              required
            />
            <label
              for="floating_email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
            <div className={message?"text-green-500 text-xs back bg-[url('')]":"text-red-600 text-xs"}>{message?`${message}`:error}</div>
          </div>
          <button
            type="submit"
            className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-primary-100"
          >
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
