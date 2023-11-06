import React from "react";
import { Outlet } from "react-router-dom";
import "./AuthBackground.css"

const AuthBackground = () => {
  return (
    <>
      <div
        className="text-black fixed top-0 left-0 w-screen h-screen  flex justify-center items-center bg-cover background-image"
      >
        <Outlet />
      </div>
    </>
  );
};

export default AuthBackground;
