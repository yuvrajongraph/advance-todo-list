import React, { useState } from "react";
import { useResetPasswordMutation } from "../../redux/auth/authApi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetPassword, { data, isError, isSuccess }] =
    useResetPasswordMutation();
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const body = {
      token,
      oldPassword,
      newPassword,
    };
    const response = await resetPassword(body);
    if (response?.data) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
  };
  return (
    <>
      <div className="flex justify-center items-center h-screen">
        <form className="bg-[lightgray] shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="oldPassword"
            >
              Old Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="oldPassword"
              type="password"
              name="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              placeholder="Enter old password"
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="newPassword"
              type="password"
              name="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              placeholder="Enter new password"
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ResetPassword;
