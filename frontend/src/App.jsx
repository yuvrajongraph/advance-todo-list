import { useContext, useEffect, useState } from "react";
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
import RegisterVerification from "./components/RegisterVerification/RegisterVerification";
import ResetPassword from "./components/ResetPassword/ResetPassword";
import AppLayout from "./components/Applayout/Applayout";
import BigCalendar from "./components/BigCalendar/BigCalendar";
import UpdateEventScreen from "./components/EventCard/UpdateEventScreen";
import io from "socket.io-client";

function App() {
  const [authenticated, cookie] = useAuth();

  useEffect(() => {
    const socket = io(`${import.meta.env.VITE_BACKEND_URL_TWO}`,{
      withCredentials: true 
    });

    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("reloadPage", () => {
      window.location.reload();
    });

    window.process = {
      ...window.process,
    };

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
      <ToastContainer />
      <Routes>
        {authenticated ? (
          <Route path="/" element={<AppLayout />}>
            <Route path="/" element={<BigCalendar />} />
            <Route path="/update/:type" element={<UpdateEventScreen />} />
          </Route>
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
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default withCookies(App);
