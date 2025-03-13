import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/resetpassword/${token}`, { password,cpassword });
      setMessage(response.data);
      console.log(password,cpassword)
      if (response.data === "Password has been reset successfully") {
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError("An error occurred. Please try again*");
      console.error(error);
    }
  };
  const showpass = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const showcpass = () => {
    setIsCPasswordVisible(!isCPasswordVisible);
  };
  
  return (
    <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center p-10 border-2 rounded-xl w-full md:w-1/2 sm:w-1/2 lg:w-96 h-fit shadow-2xl "
      >
        <h1 className="text-2xl mb-5 font-bold font-mono leading-tight">Reset Password</h1>
        <div className="relative flex z-0 w-full mb-5 group">
          <input
            type={isPasswordVisible ? "text":"password"}
            name="floating_password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            maxLength={12} minLength={8}
            onChange={(e) => {
              setPassword(e.target.value);
            }} //for getting user input value
            required
          />
          <label
            for="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Enter New Password
          </label>
          <img
            className="mt-2 object-bottom size-10 pb-4 object-contain text-sm border-b-2 border-b-black opacity-60 hover:opacity-80 cursor-pointer"
            onClick={showpass}
            src={
              isPasswordVisible
                ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAwRJREFUSEudV4GR4yAMXFXy/kouqeScSpKrxOkkuUreXwnPgmQEBif3zCTxYZC0q5XgBD8aAiAA6Uef036BIPDNm0MgfnvZ1Z/d3qvj4uzF+l04DDQH7BFMANZ+6DXKhL4zXoPZI54geCDIPUbylW16GkeU/gCxZavZYhCI+B69JudlTcfB4ZTXhLeTn7cZAeYALDq1BufceX9Bbs1QEWO9LTuuxwxg0bSvDe0nIHzo8pP+roCsgvBXAz1WtiNBF1bCmQVhUd5J+zMKbm7LpsOyrWWKBgI15bTxFYXPECytcJ0zGuaHVcCPHysEdwR8jWTX5tj7eUSkiU63mcgvHTR0zLVMA1NlJboC4feo5Gqqs5fNqUPFdVntec2sAXGO1DIoDgaxQHDSJkeRNs6tjms+HoCctCuxpIhQaR/W8RMIngk6/4xR3DQYs7OBdKpO3kkX0VozWxFwVqRJ7QPJ0oE2nIpAVgdLlBYvgnC3RtGW0x+lKosmM7EKcA6Z5pFzrvnSc4PoLPIplh+BTCw5n2+PeAaCIkrR/YrRJapi1MxTg7xLO4Nz+VQWUxtOdi5W6x6xR8N8MfIr81SaSYf2uisaVp+R2m4uM22ZRY1KS6LVIr9G2zfXTGrkteO75tKXZbCUFZv700mjS9ZYHmdN1jVuvrnyGNHeqNeXpZzV5iYBf0jwYrEgCPPNBUmtCirRrhySkexcMCNsavenWuoFuldBWAbsIqAxaO3mBqBdS0tJEco1rlHak0p7pWY9mkp2zB0fi5abXvexA4DvclvMJUbnHGTE5q2Y2VjsvRNchdgLMUXKOv6MkRi9ddcuf9lB0bkE5lRly3X59c7j6maAgEmAa8i5PB4Cnt9PQdBupb297WrqoTY2PsemaJQXAa7/AIRdic92OHy7Z3+kboIrJ26P6pFjy1q+Wb8zfOOo7nCZePv23dvu7J3c7Nb3Jyww79yVVIP4EGzn5QtyTCt0TsVXZ3L+T6J8vZfvgUr3dvZKHh2LY8f/hXgsheNyekdCr/nuWvkHvS5ROKOavLsAAAAASUVORK5CYII=" // Hidden password icon
                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAuRJREFUSEuNl71x20AQhb+twQWIHhXgEkQGdmJHVgEiI6kA5yRjN2BHpAqwIitRIip0FaRrcAFnLHAH7P0BuBkNINzP7r59+/Yo9EMQHG74AAL6wT/ameE9nmz/K6y3x0W27KH25FFjiQvG99bROUPPnxyZc35H7XuGYmGh1CKueZNBPel2ssCkY57/0+H15wxcqW/KIx5N9IR1S64Jos3KscnZGtwVsPAMXzi40P29+ae+14enf2S4Eo8a2TaHrmey99hU3R7h0tdX5oaWblycab7V4M7u886FKHWqjd48w3Ld9+hRyMyYiDMBeQWWxugR5A2cRlSi6hLhDsdSQFOg4wRsgnFbEbUcd0a7lSObg9JFcrNseHBAWHioo/3B41KObaQa5SaR0muEB5x8APcPeAF+FlJm06Sw71M1tLCtEQ5e9tTTVYypXAvuj4N3CTWegS82Gg/1tjG28+8KeZ+mlFxBaZU87ws18V3gW0WOH/rI443njnhyAbfq2N41m8DkbZPQwODIO7PmBdzHgkP66QnhNi6hFtwecoGN81GbiEXF4eAP3TTMPIbITG5+AV8jSIfJJ+A2SYH+qyR99VEq7PuwZogZzo1HWpcKteY3VaF7gR851K31Cajbs3z6hFSrMyYWYP0NfE6+18hlylJ2zVVBFa2/XCTEbVkd5DFTH7/4Hvjk34dysjXVVUc4J6uQXEA6ET83ChWkMBeAWpPq9i48V5b+onRCWPU3k2o/HibOblAfjUVrMGjvpXAhUw24MVHqDe3UllBhmBwXmikoy1WvF9GNb2iFcYOIkWjVqlx6oTtls9EJKvp3LjhQqJck+oCMpsiMuAlV2mLtSttGf+OVSHMZyk2ff7t01AiQujEWgWVp0LeuGkaHv2SMXLSji0DcO2xHGo3BUmPCoRj4ycWFXxiF6OcBPBirXQTynyqjUFvn6hBU+nFhQ7qymtwaKuNo2SZRIE4dxIFEFo45oAv/AXy5HTZYjBAWAAAAAElFTkSuQmCC" // Visible password icon
            }
            alt="toggle visibility"
          />
        </div>
        <div className="relative flex z-0 w-full mb-5 group">
          <input
            type= {isCPasswordVisible? "type": "password"}
            name="repeat_password"
            id="confirmpass"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
            onChange={(e) => {
              setCPassword(e.target.value);
            }}
          />
          <label
            for="floating_repeat_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Confirm New password
          </label>
          <img
            className="mt-2 object-bottom size-10 pb-4 object-contain text-sm border-b-2 border-b-black opacity-60 hover:opacity-80 cursor-pointer"
            onClick={showcpass}
            src={
              isCPasswordVisible
                ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAwRJREFUSEudV4GR4yAMXFXy/kouqeScSpKrxOkkuUreXwnPgmQEBif3zCTxYZC0q5XgBD8aAiAA6Uef036BIPDNm0MgfnvZ1Z/d3qvj4uzF+l04DDQH7BFMANZ+6DXKhL4zXoPZI54geCDIPUbylW16GkeU/gCxZavZYhCI+B69JudlTcfB4ZTXhLeTn7cZAeYALDq1BufceX9Bbs1QEWO9LTuuxwxg0bSvDe0nIHzo8pP+roCsgvBXAz1WtiNBF1bCmQVhUd5J+zMKbm7LpsOyrWWKBgI15bTxFYXPECytcJ0zGuaHVcCPHysEdwR8jWTX5tj7eUSkiU63mcgvHTR0zLVMA1NlJboC4feo5Gqqs5fNqUPFdVntec2sAXGO1DIoDgaxQHDSJkeRNs6tjms+HoCctCuxpIhQaR/W8RMIngk6/4xR3DQYs7OBdKpO3kkX0VozWxFwVqRJ7QPJ0oE2nIpAVgdLlBYvgnC3RtGW0x+lKosmM7EKcA6Z5pFzrvnSc4PoLPIplh+BTCw5n2+PeAaCIkrR/YrRJapi1MxTg7xLO4Nz+VQWUxtOdi5W6x6xR8N8MfIr81SaSYf2uisaVp+R2m4uM22ZRY1KS6LVIr9G2zfXTGrkteO75tKXZbCUFZv700mjS9ZYHmdN1jVuvrnyGNHeqNeXpZzV5iYBf0jwYrEgCPPNBUmtCirRrhySkexcMCNsavenWuoFuldBWAbsIqAxaO3mBqBdS0tJEco1rlHak0p7pWY9mkp2zB0fi5abXvexA4DvclvMJUbnHGTE5q2Y2VjsvRNchdgLMUXKOv6MkRi9ddcuf9lB0bkE5lRly3X59c7j6maAgEmAa8i5PB4Cnt9PQdBupb297WrqoTY2PsemaJQXAa7/AIRdic92OHy7Z3+kboIrJ26P6pFjy1q+Wb8zfOOo7nCZePv23dvu7J3c7Nb3Jyww79yVVIP4EGzn5QtyTCt0TsVXZ3L+T6J8vZfvgUr3dvZKHh2LY8f/hXgsheNyekdCr/nuWvkHvS5ROKOavLsAAAAASUVORK5CYII=" // Hidden password icon
                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAuRJREFUSEuNl71x20AQhb+twQWIHhXgEkQGdmJHVgEiI6kA5yRjN2BHpAqwIitRIip0FaRrcAFnLHAH7P0BuBkNINzP7r59+/Yo9EMQHG74AAL6wT/ameE9nmz/K6y3x0W27KH25FFjiQvG99bROUPPnxyZc35H7XuGYmGh1CKueZNBPel2ssCkY57/0+H15wxcqW/KIx5N9IR1S64Jos3KscnZGtwVsPAMXzi40P29+ae+14enf2S4Eo8a2TaHrmey99hU3R7h0tdX5oaWblycab7V4M7u886FKHWqjd48w3Ld9+hRyMyYiDMBeQWWxugR5A2cRlSi6hLhDsdSQFOg4wRsgnFbEbUcd0a7lSObg9JFcrNseHBAWHioo/3B41KObaQa5SaR0muEB5x8APcPeAF+FlJm06Sw71M1tLCtEQ5e9tTTVYypXAvuj4N3CTWegS82Gg/1tjG28+8KeZ+mlFxBaZU87ws18V3gW0WOH/rI443njnhyAbfq2N41m8DkbZPQwODIO7PmBdzHgkP66QnhNi6hFtwecoGN81GbiEXF4eAP3TTMPIbITG5+AV8jSIfJJ+A2SYH+qyR99VEq7PuwZogZzo1HWpcKteY3VaF7gR851K31Cajbs3z6hFSrMyYWYP0NfE6+18hlylJ2zVVBFa2/XCTEbVkd5DFTH7/4Hvjk34dysjXVVUc4J6uQXEA6ET83ChWkMBeAWpPq9i48V5b+onRCWPU3k2o/HibOblAfjUVrMGjvpXAhUw24MVHqDe3UllBhmBwXmikoy1WvF9GNb2iFcYOIkWjVqlx6oTtls9EJKvp3LjhQqJck+oCMpsiMuAlV2mLtSttGf+OVSHMZyk2ff7t01AiQujEWgWVp0LeuGkaHv2SMXLSji0DcO2xHGo3BUmPCoRj4ycWFXxiF6OcBPBirXQTynyqjUFvn6hBU+nFhQ7qymtwaKuNo2SZRIE4dxIFEFo45oAv/AXy5HTZYjBAWAAAAAElFTkSuQmCC" // Visible password icon
            }
            alt="toggle visibility"
          />
        </div>
        <div className="text-red-600 text-xs mb-3 -mt-3">{error}</div>
        <div className="text-green-600 text-xs mb-3 -mt-3">{message}</div>
        <button
          type="submit"
          className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-primary-100"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
