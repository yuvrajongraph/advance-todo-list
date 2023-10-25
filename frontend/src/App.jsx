import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./components/Home/Home";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import AuthBackground from "./components/AuthBackground/AuthBackground";
import { withCookies, useCookies } from "react-cookie";
import useAuth from "./hooks/useAuth";
import Navbar from "./components/Navbar/Navbar";

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
          <Route element={<Navigate to="/auth/login" />} />
        )}
        <Route path="/auth" element={<AuthBackground />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default withCookies(App);
