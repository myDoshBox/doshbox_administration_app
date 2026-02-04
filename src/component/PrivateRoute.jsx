// src/component/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const { adminInfo } = useSelector((state) => state.adminAuth);
  console.log(adminInfo?.role);

  // Check if admin is authenticated
  const isAuthenticated = adminInfo?.token;

  return children;
};

export default PrivateRoute;
