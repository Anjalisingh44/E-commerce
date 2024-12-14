import React, { useState } from 'react';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import { AiOutlineUser, AiOutlineMail, AiOutlineLock } from 'react-icons/ai';

const Signup = () => {
  const navigate = useNavigate();

  const [Form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    address: '',
  });

  const [error, setError] = useState({});

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!Form.username) {
      newErrors.username = 'Name is required !!!';
    }
    if (!Form.email) {
      newErrors.email = 'Email is required !!!';
    } else if (!isValidEmail(Form.email)) {
      newErrors.email = 'Invalid email !!';
    }
    if (!Form.password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(Form.password)) {
      newErrors.password = 'Password should be 8 characters long, with one uppercase, one lowercase, and one number';
    }
    if (!Form.address) {
      newErrors.address = 'Address is required';
    }
    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateForm();

    if (isValid) {
      axios
        .post('http://localhost:5000/api/users/signup', Form, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          alert(res.data.message);
          setForm({
            username: '',
            email: '',
            password: '',
            address: '',
          });
          navigate('/signin');
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    } else {
      console.log('Form not submitted due to invalid credentials');
    }
  };

  const handleChange = (e) => {
    setForm({ ...Form, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-black mb-0 p-4">SignUp</h2>
        <form className="space-y-6 p-5" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div>
            <label htmlFor="username" className="block text-black mb-2">
              Username
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <AiOutlineUser style={{ marginRight: '8px' }} className="text-2xl text-gray-500" />
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                className="w-full outline-none"
                required
                value={Form.username}
                onChange={handleChange}
              />
            </div>
            {error.username && <span className="text-red-500">{error.username}</span>}
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-black mb-2">
              Email
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <AiOutlineMail style={{ marginRight: '8px' }} className="text-2xl text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full outline-none"
                required
                value={Form.email}
                onChange={handleChange}
              />
            </div>
            {error.email && <span className="text-red-500">{error.email}</span>}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-black mb-2">
              Password
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <AiOutlineLock className="mr-2 text-2xl text-gray-500" />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full outline-none"
                required
                value={Form.password}
                onChange={handleChange}
              />
            </div>
            {error.password && <span className="text-red-500">{error.password}</span>}
          </div>

          {/* Address Input */}
          <div>
            <label htmlFor="address" className="block text-black mb-2">
              Address
            </label>
            <div className="flex items-center border border-gray-300 rounded-lg p-2">
              <input
                type="text"
                name="address"
                placeholder="Enter your address"
                className="w-full outline-none"
                required
                value={Form.address}
                onChange={handleChange}
              />
            </div>
            {error.address && <span className="text-red-500">{error.address}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-800 transition">
            SignUp
          </button>
        </form>

        <p className="text-center m-6 text-white text-xl">
          Already have an account?{' '}
          <Link to="/signin" className="text-blue-500 hover:underline">
            SignIn
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
