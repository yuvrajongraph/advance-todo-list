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
import AppLayout from "./components/AppLayout/AppLayout";
import BigCalendar from "./components/BigCalendar/BigCalendar";
import UpdateEventScreen from "./components/EventCard/UpdateEventScreen";
import Profile from "./components/Profile/Profile";
import io from "socket.io-client";
import GoogleRedirect from "./components/Google/GoogleRedirect";
import GoogleContact from "./components/Google/GoogleContact";

function App() {
  const [authenticated, cookie] = useAuth();
    useEffect(() => {

    // create the web socket connection on the frontend side
    const socket = io(`${import.meta.env.VITE_BACKEND_URL_TWO}`,{
      withCredentials: true 
    });

    // for connecting the socket to server
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    // message for automatic reloading of the page from backend
    socket.on("reloadPage", () => {
      window.location.reload();
    });

    window.process = {
      ...window.process,
    };

    // socket get disconnected when this component get unmounted
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
            <Route path="/profile" element={<Profile userDetail = {cookie.userData.details}/>} />
            <Route path="/contact" element={<GoogleContact />} />
            
          </Route>
        ) : (
          <Route path="/" element={<Navigate to={"/auth/login"} />} />
        )}
       <Route path="/google" element={<GoogleRedirect />} />
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
