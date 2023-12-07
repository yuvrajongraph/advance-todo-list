import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
import { Outlet } from 'react-router-dom'

// configure whole app layout
const AppLayout = () => {
   
  return (
    <>
    <Navbar />
    <Outlet />
    </>
  )
}

export default AppLayout