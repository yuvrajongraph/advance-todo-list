import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes,Route } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div
        className="text-black fixed top-0 left-0 w-screen h-screen  flex justify-center items-center bg-cover"
        style={{ backgroundImage: "url('../../../src/assets/bg9.jpg')",  backgroundSize: "100vw auto",opacity:"0.9" }}
      >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      </div>
    </>
  );
}

export default App;
