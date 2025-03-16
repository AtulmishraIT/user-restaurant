import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const email = localStorage.getItem("userEmail");

  return email ? children : <Navigate to="/login" />;
};
//commit
export default PrivateRoute;