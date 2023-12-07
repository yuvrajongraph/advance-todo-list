import React from "react";
import { useRegisterUserVerificationMutation } from "../../redux/auth/authApi";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
const RegisterVerification = () => {
  const [registerUserVerification, { data, isError, isSuccess }] =
    useRegisterUserVerificationMutation();
  const handleClick = async (e) => {
    e.preventDefault();
    // take the token from query and verify that it is the correct user
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get("token");
    const response = await registerUserVerification(token);

    if (response?.data) {
      toast.success(response?.data?.message);
    } else {
      toast.error(response?.error?.data?.error);
    }
  };
  // the registration verification email that you get from email
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            This is the button to complete your verification process
          </h1>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={handleClick}
          >
            Complete registration process
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterVerification;
