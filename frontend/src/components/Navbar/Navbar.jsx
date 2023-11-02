import React, { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  useResetPasswordMailMutation,
  useGoogleAuthMutation,
  useLogoutUserMutation
} from "../../redux/auth/authApi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { logoutSuccess } from "../../redux/auth/authSlice";
import { Cookies } from 'react-cookie';

const Navbar = () => {
  const [authenticated, cookie] = useAuth();
  const navigate = useNavigate();
  const cookies = new Cookies(); 
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [resetPasswordMail, { data, isError, isSuccess }] =
    useResetPasswordMailMutation();
    const [logoutUser] = useLogoutUserMutation();
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };
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

  const handleLogout = async(e) =>{
    e.preventDefault();
    toggleDropdown();
    const response = await logoutUser();
    if (response?.data) {
      toast.success(response?.data?.message);
      setTimeout(()=>{
      dispatch(logoutSuccess());
      cookies.remove('userData');
      window.location.reload();
      },1000)
    } else {
      toast.error(response?.error?.data?.error);
    }
  }

  const userName = cookie?.userData?.details?.name.trim()?.replace(/ +/g, " ");
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
    <div className="bg-blue-500 p-4 flex items-center justify-between">
      <div className="text-white text-2xl font-semibold m-[auto]">
        Advance Todo App
      </div>
      <div className="relative inline-block text-left">
        <button
          type="button"
          onClick={toggleDropdown}
          className="bg-blue-800 w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xl"
          aria-haspopup="listbox"
          aria-expanded="true"
        >
          {result}
        </button>

        {isOpen && (
          <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 " style={{zIndex:"1"}}>
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
