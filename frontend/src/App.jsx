import {  useEffect,  Suspense, lazy } from "react";
import "./App.css";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//import PageNotFound from "./components/PageNotFound/PageNotFound";
import AuthBackground from "./components/AuthBackground/AuthBackground";
import { withCookies } from "react-cookie";
import useAuth from "./hooks/useAuth";
//import RegisterVerification from "./components/RegisterVerification/RegisterVerification";
//import ResetPassword from "./components/ResetPassword/ResetPassword";
import AppLayout from "./components/AppLayout/AppLayout";
import BigCalendar from "./components/BigCalendar/BigCalendar";
//import UpdateEventScreen from "./components/EventCard/UpdateEventScreen";
//import Profile from "./components/Profile/Profile";
import io from "socket.io-client";
import GoogleRedirect from "./components/Google/GoogleRedirect";
//import GoogleContact from "./components/Google/GoogleContact";
import ErrorFallback from "./components/ErrorFallback/ErrorFallback";
import { ErrorBoundary } from "react-error-boundary";
const Profile = lazy(() => import("./components/Profile/Profile"));
const UpdateEventScreen = lazy(() =>
  import("./components/EventCard/UpdateEventScreen")
);
const GoogleContact = lazy(() => import("./components/Google/GoogleContact"));
const PageNotFound = lazy(() =>
  import("./components/PageNotFound/PageNotFound")
);
const RegisterVerification = lazy(() =>
  import("./components/RegisterVerification/RegisterVerification")
);
const ResetPassword = lazy(() =>
  import("./components/ResetPassword/ResetPassword")
);

function App() {
  const [authenticated, cookie] = useAuth();
  useEffect(() => {
    // create the web socket connection on the frontend side
    const socket = io(`${import.meta.env.VITE_BACKEND_URL_TWO}`, {
      withCredentials: true,
    });

    // for connecting the socket to server
    socket.on("connect", () => {
      // eslint-disable-next-line no-console
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
            <Route
              path="/update/:type"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={<div>Loading....</div>}>
                  <UpdateEventScreen />
                </Suspense>
                </ErrorBoundary>
              }
            />

            <Route
              path="/profile"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={<div>Loading....</div>}>
                  <Profile userDetail={cookie.userData.details} />
                </Suspense>
                </ErrorBoundary>
              }
            />

            <Route
              path="/contact"
              element={
                <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
                <Suspense fallback={<div>Loading....</div>}>
                  <GoogleContact />{" "}
                </Suspense>
                </ErrorBoundary>
              }
            />
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

        <Route
          path="/auth/signup"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
            <Suspense fallback={<div>Loading....</div>}>
              <RegisterVerification />
            </Suspense>
            </ErrorBoundary>
          }
        />

        <Route
          path="/auth/reset-password"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
            <Suspense fallback={<div>Loading....</div>}>
              <ResetPassword />
            </Suspense>
            </ErrorBoundary>
          }
        />

        <Route
          path="*"
          element={
            <ErrorBoundary FallbackComponent={ErrorFallback} onReset={()=>{}}>
            <Suspense fallback={<div>Loading....</div>}>
              <PageNotFound />
            </Suspense>
            </ErrorBoundary>
          }
        />
      </Routes>
    </>
  );
}

export default withCookies(App);
