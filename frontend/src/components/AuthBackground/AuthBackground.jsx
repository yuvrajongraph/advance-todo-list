import React from "react";
import { Outlet } from "react-router-dom";

const AuthBackground = () => {
  return (
    <>
      <div
        className="text-black fixed top-0 left-0 w-screen h-screen  flex justify-center items-center bg-cover"
        style={{
          backgroundImage: "url('../../../src/assets/bg9.jpg')",
          backgroundSize: "100vw auto",
          opacity: "0.9",
        }}
      >
        <Outlet />
      </div>
    </>
  );
};

export default AuthBackground;
