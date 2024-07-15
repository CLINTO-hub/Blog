import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import login1 from '../../assets/images/login.jpg'
import { toast } from "react-toastify";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { login } from "../../AuthSlice.js";
import { BASE_URL } from "../../../config.js";

const Login = () => {
  const [formData, setFormData] = useState({
    email:'',
    password:'' 
  })
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    const verifyToken = async () => {
      const jwtToken = Cookies.get('jwt');
      console.log('jwt',jwtToken);
      if (jwtToken) {
        try {
          const res = await fetch(`${BASE_URL}/auth/verifyToken`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token: jwtToken })
          });
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message);
          }
          navigate('/home');
        } catch (error) {
          Cookies.remove('jwt');
          navigate('/login');
          toast.error("Session expired, please log in again");
          
        }
      }
    };
    verifyToken();
  }, [navigate]);


  const handleInputChange = e=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const submitHandler = async event =>{
    
    event.preventDefault();
    setLoading(true)

    try {
      const res = await fetch(`${BASE_URL}/auth/login`,{
        method:'post',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(formData)
      })

      const result = await res.json()
      if(!res.ok){
        throw new Error(result.message)
      }
      Cookies.set('jwt', result.token, { expires: 7 });
      if (Cookies.get('jwt')) {
        console.log('Cookie set successfully:', Cookies.get('jwt')); // Debug: Confirm cookie is set
      } else {
        console.error('Failed to set cookie'); // Debug: Log failure to set cookie
      }
      localStorage.setItem('username', result.data.firstname+''+result.data.lastname); 
      dispatch(login({
        userId: result.data._id,
        token: result.token,
        email: result.data.email,
      }));
      console.log(result,"login data");
      
      toast.success(result.message)
      setLoading(false)
      navigate('/home')

      
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
      console.log(error);
      
    }
  }
  
  return (
    <div className="flex items-center justify-center h-screen w-full px-5 sm:px-0">
      <div className="flex bg-white rounded-lg shadow-lg border overflow-hidden max-w-sm lg:max-w-4xl w-full">
        <div
          className="hidden md:block lg:w-1/2 bg-cover bg-blue-700"
          style={{
            backgroundImage: `url(${login1})`,
          }}
        ></div>
        <div className="w-full p-8 lg:w-1/2">
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email Address
            </label>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mt-4 flex flex-col justify-between">
            <div className="flex justify-between">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
            </div>
            <input
              className="text-gray-700 border border-gray-300 rounded py-2 px-4 block w-full focus:outline-2 focus:outline-blue-700"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <Link to = '/ForgetPassword'>
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-900 text-end w-full mt-2"
            >
              Forget Password?
            </a>
            </Link>
          </div>
          <div className="mt-8">
            <button onClick={submitHandler} className="bg-blue-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600">
              Login
            </button>
          </div>
          <a
            href="#"
            className=" flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
          >
          </a>
          <div className="mt-4 flex items-center w-full text-center">
            <a
              href="#"
              className="text-xs text-gray-500 capitalize text-center w-full"
            >
              Don&apos;t have any account yet?
              <Link to={'/Register'}>
              <span className="text-blue-700"> Sign Up</span>
              </Link>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
