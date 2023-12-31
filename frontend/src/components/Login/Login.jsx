import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLoginUserMutation } from "../../redux/auth/authApi";
import { toast } from "react-toastify";
import { loginSuccess, loginFailure } from "../../redux/auth/authSlice";
import "react-toastify/dist/ReactToastify.css";
import { useCookies, Cookies } from "react-cookie";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser] = useLoginUserMutation();
  const cookie = new Cookies();
  const [cookies, setCookie] = useCookies(["userData"]);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  // redirect to google oAuth consent screen
  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    if(JSON.parse(localStorage.getItem("isSync")) === null){
      localStorage.setItem("isSync",false);
    }
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, "_self");
   };

  const handleEvent = (e) => {
    e.preventDefault();

    const name = e.target.name;
    const value = e.target.value;

    setInput(() => {
      return { ...input, [name]: value };
    });
  };

  // use the login API in frontend using rtk query
  const handleLogin = async (e) => {
    e.preventDefault();
    const body = {
      email: input.email,
      password: input.password,
    };
    const response = await loginUser(body);
    if (response?.data) {
      dispatch(loginSuccess(response?.data?.data));
      cookie.remove("userData");
      setCookie("userData", JSON.stringify(response?.data?.data));
      
      toast.success(response?.data?.message);

      setInput({
        email: "",
        password: "",
      });
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 1000);
    } else {
      dispatch(loginFailure(response?.error?.data));
      toast.error(response?.error?.data?.error);
    }
  };

  return (
    <>
      <div>
        <div className="bg-slate-800 border  border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm  bg-opacity-30 relative">
          <h1 className="text-4xl text-white font-bold text-center mb-6">
            Login
          </h1>
          <form action="">
            <div className="pt-2">
              <div className="relative my-4 pt-2">
                <input
                  type="email"
                  className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer "
                  onChange={handleEvent}
                  value={input.email}
                  name="email"
                  id="email"
                />
                <label
                  htmlFor=""
                  className=" absolute text-m left-0 text-white duration-300  transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 "
                >
                  Your Email
                </label>
              </div>
              <div className="relative my-4 pt-2">
                <input
                  type="password"
                  className="block w-72 py-2.3 px-0 text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:text-white focus:border-blue-600 peer "
                  onChange={handleEvent}
                  value={input.password}
                  name="password"
                  id="password"
                />
                <label
                  htmlFor=""
                  className="absolute text-m left-0 text-white duration-300 transform -translate-y-7 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-400 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0  peer-focus:scale-75 peer-focus:-translate-y-6 "
                >
                  Your Password
                </label>
              </div>
            </div>
            <div className="mb-2">
              <button
                className="w-full mb-4 text-[18px] mt-6 rounded-full bg-white text-emerald-800 hover:bg-emerald-600 hover:text-white py-2 transition-colors duration-300 "
                type="submit"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div className="mb-2 text-center text-gray-600">OR</div>
            <div className="mb-2">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none w-full"
                onClick={handleGoogleLogin}
              >
                Sign in with Google
              </button>
            </div>
            <div>
              <span className="mt-4 text-white">
                New Here?{" "}
                <Link to="/auth/register" className="text-blue-500 m-1 ">
                  Create new account
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
