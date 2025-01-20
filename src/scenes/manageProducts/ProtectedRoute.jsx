import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user"); // Obtener usuario autenticado

  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
