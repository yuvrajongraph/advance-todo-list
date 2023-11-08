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
            onClick={() => handleNavClick("todo")}
            className={`${
              activeLink === "todo" ? "border-b-2 border-white" : ""
            } focus:outline-none hover:text-blue-500`}
          >
            Todo
          </button>
          <button
            onClick={() => handleNavClick("appointment")}
            className={`${
              activeLink === "appointment" ? "border-b-2 border-white" : ""
            } focus:outline-none hover:text-blue-500`}
          >
            Appointment
          </button>
        </nav>
      </div>
    </>
  );
};

export default ModalNavbar;
