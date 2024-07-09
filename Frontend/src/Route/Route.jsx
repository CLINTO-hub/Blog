import React from "react";
import {Routes, Route} from 'react-router-dom'
import Login from "../Components/Pages/Login.jsx";
import Home from "../Components/Pages/Home.jsx";
import NewBlog from "../Components/Pages/NewBlog.jsx";
import EditBlog from "../Components/Pages/EditBlog.jsx";
import PostPage from "../Components/Pages/PostPage.jsx";
import Register from "../Components/Pages/Register.jsx";
import Otp from "../Components/Pages/Otp.jsx";
import ForgotPassword from "../Components/ForgetPassword.jsx";
import ResetPassword from "../Components/ResetPassword.jsx";
import Error from "../Components/Pages/Error.jsx";

const Routers = ()=>{
    return (
        <Routes>
            <Route path = "/login" element ={<Login/>}/>
            <Route path = "/" element = {<Home/>}/>
            <Route path = "/Otp" element = {<Otp/>}/>
            <Route path = "/home" element = {<Home/>}/>
            <Route path = "/create" element = {<NewBlog/>}/>
            <Route path = "/create/:id" element = {<PostPage/>}/>
            <Route path = "/editBlog/:id" element = {<EditBlog/>}/>
            <Route path = "/Register" element ={<Register/>}/>
            <Route path ="/ForgetPassword" element ={<ForgotPassword/>}/>
            <Route path = "/ResetPassword" element ={<ResetPassword/>}/>
            <Route path ="*" element ={<Error/>}/>
        </Routes>
    )
}

export default Routers