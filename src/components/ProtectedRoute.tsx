
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = () => {
  const location = useLocation();
  const { session, isLoading } = useAuth();
  
  // If auth is still loading, show nothing or a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // If not authenticated, redirect to login
  if (!session) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }
  
  // User is authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
