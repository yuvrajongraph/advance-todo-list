import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  useResetPasswordMailMutation,
  useGoogleAuthMutation,
  useLogoutUserMutation,
} from "../../redux/auth/authApi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../redux/auth/authSlice";
import { Cookies } from "react-cookie";
import { useContext } from "react";
import DarkThemeContext from "../../Context/DarkTheme/DarkThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ContactsIcon from "@mui/icons-material/Contacts";
import SyncIcon from "@mui/icons-material/Sync";

const Navbar = () => {
  const [authenticated, cookie] = useAuth();
  const navigate = useNavigate();
  const cookies = new Cookies();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const { dark, toggleTheme } = useContext(DarkThemeContext);
  const dynamicClass = !dark ? "bg-blue-500" : "bg-[#282828]";
  const dynamicClassTwo = !dark ? "bg-blue-800" : "bg-[#E6E6E6]";
  const [resetPasswordMail, { data, isError, isSuccess }] =
    useResetPasswordMailMutation();
  const [logoutUser] = useLogoutUserMutation();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // redirect to google consent screen 
  const handleGoogleSync = async (e) => {
    //const response = await googleContact.refetch();
    //console.log(response);
    if(JSON.parse(localStorage.getItem("isSync")) === null){
      localStorage.setItem("isSync",true);
    }
    localStorage.setItem("isSync",true);
    window.open(`${import.meta.env.VITE_BACKEND_URL}/auth/google`, "_self");
  };

  // redirect to the screen where the contact list is display on frontend
  const handleContact = (e) => {
    e.preventDefault();
    navigate("/contact");
  };

  // send the link for reset password to the mail
  const handleMailFunctionality = async (e) => {
    e.preventDefault();
    toggleDropdown();
    const response = await resetPasswordMail();
    if (response?.data) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
  };

  // handle the Logout functionality through frontend
  const handleLogout = async (e) => {
    e.preventDefault();
    toggleDropdown();
    const response = await logoutUser();
    if (response?.data) {
      toast.success(response?.data?.message);
      setTimeout(() => {
        dispatch(logoutSuccess());
        cookies.remove("userData");
        if(JSON.parse(localStorage.getItem("isSync")) === null){
          localStorage.setItem("isSync",false);
        }
        localStorage.setItem("isSync",false);
        navigate("/");
        window.location.reload();
      }, 1000);
    } else {
      toast.error(response?.error?.data?.error);
    }
  };

  const userName = cookie?.userData?.details?.name.toLowerCase().trim()?.replace(/ +/g, " ");
  const userArray = userName?.split(" ");
  const firstCharacters = userArray?.map((str, index) => {
    if (index < 2) {
      return str.charAt(0);
    } else {
      return "";
    }
  });
  const result = firstCharacters?.reduce((accumulator, currentCharacter) => {
    return accumulator + currentCharacter;
  }, "");

  return (
    <div
      className={`absolute  p-4 flex items-center justify-between w-[1530px] ml-[-158px] top-[1px] ${dynamicClass}`}
    >
      <div
        className="text-white text-2xl font-semibold ml-[650px] cursor-pointer"
        onClick={() => {
          setIsOpen(false);
          navigate("/");
        }}
      >
        Advance Todo App
      </div>
      <div className="ml-[450px]">
        <button
          type="button"
          onClick={handleGoogleSync}
          id= "syncButton"
          className={` w-10 h-10 rounded-s flex items-center justify-center text-white font-semibold text-xl mr-[10px] ${dynamicClass}`}
          aria-haspopup="listbox"
          aria-expanded="true"
        >
          {dark ? (
            <SyncIcon
              fontSize="medium"
              className="text-white transform hover:scale-150 transition-transform duration-300"
            />
          ) : (
            <SyncIcon
              fontSize="medium"
              className="text-black transform hover:scale-150 transition-transform duration-300"
            />
          )}
        </button>
      </div>
      <button
        type="button"
        onClick={handleContact}
        className={` w-10 h-10 rounded-s flex items-center justify-center text-white font-semibold text-xl mr-[10px] ${dynamicClass} `}
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        {dark ? (
          <ContactsIcon
            fontSize="medium"
            className="text-white transform hover:scale-150 transition-transform duration-300"
          />
        ) : (
          <ContactsIcon
            fontSize="medium"
            className="text-black transform hover:scale-150 transition-transform duration-300"
          />
        )}
      </button>
      <button
        type="button"
        onClick={toggleTheme}
        className={` w-10 h-10 rounded-s flex items-center justify-center text-white font-semibold text-xl mr-[10px] ${dynamicClass}`}
        aria-haspopup="listbox"
        aria-expanded="true"
      >
        {!dark ? (
          <DarkModeIcon fontSize="medium" className="text-black" />
        ) : (
          <LightModeIcon fontSize="medium" />
        )}
      </button>
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={toggleDropdown}
          className={`${dynamicClassTwo} w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xl`}
          style={{ color: dark ? "#FF0000" : "" }}
          aria-haspopup="listbox"
          aria-expanded="true"
        >
          {result}
        </button>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20">
            <div
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {/* Dropdown items */}
              <div className="py-1" role="none">
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/");
                    //window.location.reload();
                  }}
                >
                  Home
                </button>

                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/profile");
                    //window.location.reload();
                  }}
                >
                  Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={handleMailFunctionality}
                >
                  Reset Password
                </button>
                <button
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  role="menuitem"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
