import { useEffect } from 'react'
import {  useNavigate } from 'react-router-dom'

const GoogleRedirect = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const oauth2Client = searchParams.get("oauth2Client");
    const navigate = useNavigate();
    const getParams = ()=>{
         localStorage.setItem("oauth2Client",oauth2Client)
         navigate("/")
         window.location.reload();

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