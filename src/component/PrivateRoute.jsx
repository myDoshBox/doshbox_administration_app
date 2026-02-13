// src/component/PrivateRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress, Box } from "@mui/material";

const PrivateRoute = ({ children, requiredRoles = [] }) => {
  const location = useLocation();
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const [isChecking, setIsChecking] = useState(true);

  // Check authentication and role
  const isAuthenticated = adminInfo?.token;
  const userRole = adminInfo?.role;

  // Check if user has required role (if specified)
  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.includes(userRole) ||
    adminInfo?.isSuperAdmin;

  useEffect(() => {
    // Simulate checking authentication state
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (isChecking) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="background.default"
      >
        <CircularProgress />
        <Box ml={2}>Checking authentication...</Box>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log("No token found, redirecting to login...");
    // Save the attempted URL for redirect after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If authenticated but doesn't have required role
  if (!hasRequiredRole) {
    console.log(`User role ${userRole} doesn't have access to this page`);
    // Redirect to unauthorized page or dashboard
    return <Navigate to="/admin/unauthorized" replace />;
  }

  // If authenticated and has required role, render children
  return children;
};

export default PrivateRoute;
