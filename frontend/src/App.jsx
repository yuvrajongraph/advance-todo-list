import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import AuthBackground from "./components/AuthBackground/AuthBackground";
import { withCookies } from "react-cookie";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar/Navbar";
import RegisterVerification from "./components/RegisterVerification/RegisterVerification";

function App() {
  const [authenticated, cookie] = useAuth();

  useEffect(() => {
    window.process = {
      ...window.process,
    };
  }, []);
  return (
    <>
      <ToastContainer />
      <Routes>
        {authenticated === true ? (
          <Route path="/" element={<Navbar />} />
        ) : (
          <Route path="/" element={<Navigate to={"/auth/login"} />} />
        )}
        <Route path="/auth" element={<AuthBackground />}>
          {authenticated ? (
            <Route path="login" element={<Navigate to={"/"} />} />
          ) : (
            <Route path="login" element={<Login />} />
          )}
          {authenticated ? (
            <Route path="register" element={<Navigate to={"/"} />} />
          ) : (
            <Route path="register" element={<Register />} />
          )}
        </Route>
        <Route path="/auth/signup" element={<RegisterVerification />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default withCookies(App);
