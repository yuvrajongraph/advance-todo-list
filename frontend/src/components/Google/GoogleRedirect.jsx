import { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'
import {  useGoogleAuthMutation } from '../../redux/auth/authApi';
import { useCookies, Cookies } from "react-cookie";
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/auth/authSlice';

const GoogleRedirect = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const oauth2Client = searchParams.get("oauth2Client");
    const cookie = new Cookies();
    const dispatch = useDispatch();
    const [googleAuth] =  useGoogleAuthMutation();
    const [cookies, setCookie] = useCookies(["userData"]);
    const navigate = useNavigate();
    const getParams = async()=>{
      // isSync key is true when we do manual syncing and false for login with google part
      if (JSON.parse(localStorage.getItem("isSync")) === true){
       
        // set oauthClient in local storage
         localStorage.setItem("oauth2Client",oauth2Client)
         navigate("/")
         window.location.reload();
      }else{
        // when it is not manual syncing for the login with google part
        const response = await googleAuth();
        if(response.data){
          dispatch(loginSuccess(response?.data?.data));
          cookie.remove("userData");
          setCookie("userData", JSON.stringify(response?.data?.data));
          navigate("/");
          window.location.reload();
        }
      }
    }

    useEffect(()=>{
        getParams();
    },[])
  return (
    <>
    <div className='mt-[1000px]'>Calendar Redirect</div>
    </>
  )
}

export default GoogleRedirect