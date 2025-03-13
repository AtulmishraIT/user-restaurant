import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Signup() {
  const history = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [mobno, setMobno] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const [message, setMessage] = useState("");
  const [emailExist, setEmailExist] = useState("");
  const [passnotmatch, setPassnotmatch] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isCPasswordVisible, setIsCPasswordVisible] = useState(false);
  
  const newuser = {
    name,
    email,
    password,
    mobno,
    cpassword,
    isLogin: true,
  };

  //passing data to and verifying data from the database
  async function submit(e) {
    e.preventDefault();
    console.log("this is email ", email);
    console.log(email, password, isLogin);
    try {
      setisLogin('true');
      await axios
        .post("http://localhost:8000/Signup", newuser)
        .then((res) => {
          if (res.data == "Password not matched*") {
            setPassnotmatch("Password not matched*");
          }
          console.log(res.data);
          if (res.data == "exist") {
            setEmailExist("User already Exists*");
          } else if (res.data == "notexist") {
            localStorage.setItem("userEmail",email);
            history("/home");
            window.location.reload();
          }
        })
        .catch((e) => {
          alert("Wrong details");
          console.log(e);
        });
    } catch (e) {
      console.log(e);
    }
  }

  const onSubmit = (data) => console.log(data);
  const showpass = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  const showcpass = () => {
    setIsCPasswordVisible(!isCPasswordVisible);
  };

  return (
    <div className="bg-gray-50 dark:bg-white content-around overflow-hidden lg:mt-0">
      <form
        className="lg:max-w-md mb-5 lg:mx-auto ml-5 p-8 mt-32 border-2 rounded-lg shadow-lg "
        action="POST"
        onSubmit={submit}
      >
        <h1 className="text-xl font-bold leading-tight mb-3 tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
          Sign Up
        </h1>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
             />
            <p id="error"></p>
            <label
              for="floating_first_name"
              className="peer-focus:font-medium absolute text-sm text-gray-900 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Name
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="tel"
              name="floating_phone"
              id="floating_phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => {
                setMobno(e.target.value);
              }}
              required
            />
            <label
              for="floating_phone"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Phone number
            </label>
          </div>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none  dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
          <div className="text-xs text-red-600">{emailExist}</div>
        </div>
        <div className="relative flex z-0 w-full mb-5 group">
          <input
            type={isPasswordVisible ? "text" : "password"} // Toggle input type
            name="floating_password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            maxLength={12} minLength={8}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
          <img
            className="mt-2 object-bottom size-10 pb-4 object-contain text-sm border-b-2 border-b-black opacity-60 hover:opacity-80 cursor-pointer"
            onClick={showpass}
            src={
              isPasswordVisible
                ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAtJJREFUSEuNVtth4zAMAzdxJ7lkknMm6WWSeJPkJqk7iWpQtEQ9G/00lSWCBEFSAi4BENIfv6W/p8vu/nastB7/q/cmNjoe/o5oJ0oPI7ChCwIDXwDZGwo6AG8HW9pPsXqTC4AngO3g4X46pE68szwh3qtBKr3JE2HP4J24dGscb/OlZ6LaWwE8zJMdgg0B9xHEFN8+avqaiMXEVdJYgpe0L0D4a8cvyUGADH0bS87anJWeqiN4vEejLwArD5oAR8WwA/I68kB98N5wzcrJIh/lWA0zHQsCK6FYTiO+brJMXTl1nfO08wAjv0GwV0InMKn/Q2acq3Tgo2d5BEzAzage5LxTLxGBTlCgXgMKXt+wnbT9BGQRhO3oolrLAqzB1H783oNGrk2GIP/pZKVw7lOE/yxa9oWbj7yO2Oe1PCxYEVKp1ewxBdcOpYycNrkITJsaSgEswJe1TMqZ9GRlRkK82uuySYYdpYsAz2hTbX1EvktgiuJhrct553Oj5WS0N2ofRX2B4GnT7xoELwV21y/mHSMhbTTULDtfqV13U2pG3VCA2xG90u2BB7QMe4BniIdYBbc01zP6lym9KC2XYz2ZIhGAqi6U2CmJpHbL4XbEcnfTjJPOykquQEgs1sC07ZXIcpgPiajaPFhyb38cJbeaEzn/bmDUXPYawPXsVo2kvNqjpbMSzjZaiq4F9rNLOIXq7kMD2izOkqheKb3ePlB6fyyeDNTd59znYGAtxudRVH98rbRNRlNVUNqp41Ht0IFP14HqFstRuOkoNNpdP+hOqaZzjYrWksBH4MXmMadQzKE2hPIR0Ont+oZrh4RHLFJdv7cbaZW++kmhtMvD0pFZsRuxnKrRkqzVLvYem83dwjlfaoXQ6unUiWDUuUqv8qOu8XY9GvwnQvkgaBtIh828NX5zvUOaZzf26hGlI2vj4ZG/TOUwqeOM2YlymvspZcmxH+7POjcJpWX7AAAAAElFTkSuQmCC" // Hidden password icon
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
            Confirm password
          </label>
          <img
            className="mt-2 object-bottom size-10 pb-4 object-contain text-sm border-b-2 border-b-black opacity-60 hover:opacity-80 cursor-pointer"
            onClick={showcpass}
            src={
              isCPasswordVisible
                ? "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAtJJREFUSEuNVtth4zAMAzdxJ7lkknMm6WWSeJPkJqk7iWpQtEQ9G/00lSWCBEFSAi4BENIfv6W/p8vu/nastB7/q/cmNjoe/o5oJ0oPI7ChCwIDXwDZGwo6AG8HW9pPsXqTC4AngO3g4X46pE68szwh3qtBKr3JE2HP4J24dGscb/OlZ6LaWwE8zJMdgg0B9xHEFN8+avqaiMXEVdJYgpe0L0D4a8cvyUGADH0bS87anJWeqiN4vEejLwArD5oAR8WwA/I68kB98N5wzcrJIh/lWA0zHQsCK6FYTiO+brJMXTl1nfO08wAjv0GwV0InMKn/Q2acq3Tgo2d5BEzAzage5LxTLxGBTlCgXgMKXt+wnbT9BGQRhO3oolrLAqzB1H783oNGrk2GIP/pZKVw7lOE/yxa9oWbj7yO2Oe1PCxYEVKp1ewxBdcOpYycNrkITJsaSgEswJe1TMqZ9GRlRkK82uuySYYdpYsAz2hTbX1EvktgiuJhrct553Oj5WS0N2ofRX2B4GnT7xoELwV21y/mHSMhbTTULDtfqV13U2pG3VCA2xG90u2BB7QMe4BniIdYBbc01zP6lym9KC2XYz2ZIhGAqi6U2CmJpHbL4XbEcnfTjJPOykquQEgs1sC07ZXIcpgPiajaPFhyb38cJbeaEzn/bmDUXPYawPXsVo2kvNqjpbMSzjZaiq4F9rNLOIXq7kMD2izOkqheKb3ePlB6fyyeDNTd59znYGAtxudRVH98rbRNRlNVUNqp41Ht0IFP14HqFstRuOkoNNpdP+hOqaZzjYrWksBH4MXmMadQzKE2hPIR0Ont+oZrh4RHLFJdv7cbaZW++kmhtMvD0pFZsRuxnKrRkqzVLvYem83dwjlfaoXQ6unUiWDUuUqv8qOu8XY9GvwnQvkgaBtIh828NX5zvUOaZzf26hGlI2vj4ZG/TOUwqeOM2YlymvspZcmxH+7POjcJpWX7AAAAAElFTkSuQmCC" // Hidden password icon
                : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAuRJREFUSEuNl71x20AQhb+twQWIHhXgEkQGdmJHVgEiI6kA5yRjN2BHpAqwIitRIip0FaRrcAFnLHAH7P0BuBkNINzP7r59+/Yo9EMQHG74AAL6wT/ameE9nmz/K6y3x0W27KH25FFjiQvG99bROUPPnxyZc35H7XuGYmGh1CKueZNBPel2ssCkY57/0+H15wxcqW/KIx5N9IR1S64Jos3KscnZGtwVsPAMXzi40P29+ae+14enf2S4Eo8a2TaHrmey99hU3R7h0tdX5oaWblycab7V4M7u886FKHWqjd48w3Ld9+hRyMyYiDMBeQWWxugR5A2cRlSi6hLhDsdSQFOg4wRsgnFbEbUcd0a7lSObg9JFcrNseHBAWHioo/3B41KObaQa5SaR0muEB5x8APcPeAF+FlJm06Sw71M1tLCtEQ5e9tTTVYypXAvuj4N3CTWegS82Gg/1tjG28+8KeZ+mlFxBaZU87ws18V3gW0WOH/rI443njnhyAbfq2N41m8DkbZPQwODIO7PmBdzHgkP66QnhNi6hFtwecoGN81GbiEXF4eAP3TTMPIbITG5+AV8jSIfJJ+A2SYH+qyR99VEq7PuwZogZzo1HWpcKteY3VaF7gR851K31Cajbs3z6hFSrMyYWYP0NfE6+18hlylJ2zVVBFa2/XCTEbVkd5DFTH7/4Hvjk34dysjXVVUc4J6uQXEA6ET83ChWkMBeAWpPq9i48V5b+onRCWPU3k2o/HibOblAfjUVrMGjvpXAhUw24MVHqDe3UllBhmBwXmikoy1WvF9GNb2iFcYOIkWjVqlx6oTtls9EJKvp3LjhQqJck+oCMpsiMuAlV2mLtSttGf+OVSHMZyk2ff7t01AiQujEWgWVp0LeuGkaHv2SMXLSji0DcO2xHGo3BUmPCoRj4ycWFXxiF6OcBPBirXQTynyqjUFvn6hBU+nFhQ7qymtwaKuNo2SZRIE4dxIFEFo45oAv/AXy5HTZYjBAWAAAAAElFTkSuQmCC" // Visible password icon
            }
            alt="toggle visibility"
          />
        <div className="text-xs absolute mt-12 text-red-600">{passnotmatch}</div>
        </div>
        <div className="">
        <button
          type="submit"
          className="text-white mt-2 bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-green-800"
        >
          Submit
        </button>
        </div>
        <p className="text-sm font-light mt-5 text-gray-800 dark:text-gray-700">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:underline dark:text-primary-500"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
