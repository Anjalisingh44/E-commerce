import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {authAction} from "../store/auth";
import {useDispatch} from "react-redux";
import {  AiOutlineMail, AiOutlineLock,AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Signin = () => {
  const [Values, setValues] = useState({
  
    email: "",
    password: "",
    
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate(); 
const dispatch = useDispatch();



  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault(); 
    try {
      if (
        
        Values.email === "" ||
        Values.password === "" 
        
      ) {
        alert("All fields are mandatory");
      } else {
      
        const response = await  axios.post("http://localhost:5000/api/users/signin",Values);
        
      
dispatch(authAction.Signin());
dispatch(authAction.changeRole( response.data.role));
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('role', response.data.role);
        localStorage.setItem('accessToken', response.data.accessToken);

        if (response.data.role === "admin") {
            navigate('/admin-Profile');
          } else {
            navigate('/');
          }
          
      }
      

    } catch (error) {
      
      if (error.response) {
    
        const statusCode = error.response.status;
        const statusText = error.response.statusText;
        const errorData = error.response.data;
  
    
        if (typeof errorData === 'string' && errorData.includes('<pre>Error:')) {
          const errorMessage = errorData.match(/<pre>(.*?)<\/pre>/)[1];
          alert(`Error ${statusCode}: ${statusText}\n${errorMessage}`);
        } else {
          alert(`Error ${statusCode}: ${statusText}`);
        }
      } else if (error.request) {

        alert("No response received from the server.");
      } else {
        
        alert(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className='bg-gray-100 min-h-screen flex items-center justify-center '>
      <div className='bg-white rounded-lg shadow-lg  p-4 w-full max-w-md'>
        <h2 className='text-2xl font-semibold text-black mb-0 p-4 '>SignIn</h2>
        <form className='space-y-6 p-5'>
         
          <div>
            <label htmlFor="email" className='block text-black mb-2'>Email</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
            < AiOutlineMail style={{ marginRight: '8px'}} className='text-2xl text-gray-500'/>
            <input
              type="email"
              name="email"
             
              placeholder="Enter your email"
              
              className='w-full outline-none'
              required
              value={Values.email}
              onChange={change}
            />
          </div>
          </div>
          <div>
            <label htmlFor="password" className='block text-black mb-2'>Password</label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2 relative">
            <AiOutlineLock className='mr-2 text-2xl text-gray-500'/>
            <input
               type={passwordVisible ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              className='w-full outline-none pr-10'
              required
              value={Values.password}
              onChange={change}
            />
             <span
                onClick={() => setPasswordVisible(!passwordVisible)} // Toggle the password visibility
                className=' absolute right-3 cursor-pointer '>
                {passwordVisible ? <AiOutlineEyeInvisible className='text-2xl text-gray-500' /> : <AiOutlineEye className='text-2xl text-gray-500' />}
              </span>
          </div>
          </div>
         
          <button
            
            className= 'w-full  bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-800 transition '
          onClick={submit}>
            SignIn
          </button>
        </form>
        <p className='text-center m-6 text-white text-xl'>
          Don't have an account?{' '}
          <Link to="/SignUp" className='text-blue-500 hover:underline'>SignUp</Link>
        </p>
      </div>
    </div>
  
  )
}

export default Signin