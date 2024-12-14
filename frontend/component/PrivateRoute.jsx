import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// This function checks if the user is signed in and if they are an admin
const PrivateRoute = ({ children }) => {
  const { isSignedIn, role } = useSelector((state) => state.auth); // Get the state from Redux

  // Check if user is signed in and has the admin role
  return isSignedIn && role === 'admin' ? children : <Navigate to="/" />;
};

export default PrivateRoute;
