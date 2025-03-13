import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "boxicons";
import fadeLoader from "react-spinners/FadeLoader";
import axios from "axios";

function Login() {
  const history = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pe, setPe] = useState("");
  const [ee, setEe] = useState("");
  const [message, setMessage] = useState("");
  //Passing data to and verifying data from the database
  async function submit(e) {
    e.preventDefault();
    console.log(password, email);
    try {
      await axios
        .post("http://localhost:8000/login", {
          email,
          password,
        })
        .then((res) => {
          if (res.data == "exist") {
            localStorage.setItem("userEmail", email);
            setTimeout(() => {
              history("/home");
              window.location.reload();
            }, 2000);
            setMessage(" ");
          } else if (res.data == "notexist") {
            setEe("User not found. Please sign up");
          } else if (res.data == "Password not match") {
            setPe("Inavlid password*");
          } else {
            setEe("Login failed. Please try again.");
          }
        });
    } catch (e) {
      if (res.data == "Password not match") {
        setPe("Password incorrect*");
      }
      console.log(e);
    }
  }

  if (loading) {
    return <div className="mt-52">Loading...</div>;
  }

  //for password
  const showpassword = () => {
    var pass = document.getElementById("password");
    var check = document.getElementById("show");
    if (check.checked == true) pass.type = "text";
    else pass.type = "password";
  };

  return (
    <section className="bg-gray-50 dark:bg-white content-around overflow-hidden mt-32 lg:mt-0">
      <div className="flex flex-col m-5 ml-9 items-center justify-center p-2 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow-lg p-6 relative dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-white dark:border-gray-200">
          <div className=" space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
              Welcome Back!!
            </h1>
            <form className="space-y-5 md:space-y-5 " action="POST">
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
                <div className="text-red-600 text-xs">{ee}</div>
              </div>
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="password"
                  name="floating_password"
                  id="password"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  maxLength={12}
                  minLength={8}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  required
                />
                <label
                  for="floating_password"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Password
                </label>
                <div className="text-red-600 text-xs">{pe}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="show"
                      aria-describedby="remember"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-100 dark:ring-offset-gray-800"
                      required=""
                      onClick={showpassword}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      for="remember"
                      className="text-gray-500 dark:text-gray-900"
                    >
                      Show password
                    </label>
                  </div>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Forgot password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full hover:h-11 cursor-pointer text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-green-700 dark:hover:bg-green-800 dark:focus:ring-primary-100"
                onClick={submit}
              >
                Sign in
              </button>
              <p className="text-sm font-light text-gray-800 dark:text-gray-700">
                Don’t have an account yet?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </form>
            
          </div>
        </div>
      </div>
      {message && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white">
                <p className="text-center p-1 text-green-500 flex justify-center items-center gap-2">
                  {message}

                  <div role="status">
                    <svg
                      aria-hidden="true"
                      class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-100 fill-green-600"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span class="sr-only">Loading...</span>
                  </div>
                </p>
                </div>
              )}
    </section>
  );
}

export default Login;
