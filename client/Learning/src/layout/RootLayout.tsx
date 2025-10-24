
import { Outlet } from 'react-router-dom' 
import Header from "../Components/header"
import Navbar from "../Components/Navbar"
const RootLayout = () => {
  return (
    <>
     <Header/>
     <Navbar/>
    <Outlet />
    </>
  )
}

export default RootLayout