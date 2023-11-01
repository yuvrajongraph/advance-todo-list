import React, { useState } from "react";

const ModalNavbar = ({ activeLink, setActiveLink }) => {
  const handleNavClick = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      <div className=" p-4">
        <nav className="flex justify-center space-x-6">
          <button
            onClick={() => handleNavClick("category")}
            className={`${
              activeLink === "category" ? "border-b-2 border-white" : ""
            } focus:outline-none hover:text-blue-500`}
          >
            Category
          </button>
          <button
            onClick={() => handleNavClick("dateTime")}
            className={`${
              activeLink === "dateTime" ? "border-b-2 border-white" : ""
            } focus:outline-none hover:text-blue-500`}
          >
            Date Time
          </button>
        </nav>
      </div>
    </>
  );
};

export default ModalNavbar;
