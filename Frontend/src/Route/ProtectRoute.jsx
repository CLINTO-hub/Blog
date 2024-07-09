// ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth); // Select the entire auth state object
    const isLoggedIn = !!token;

    return isLoggedIn ? children : <Navigate to="/login" replace={true} />;
};

export default ProtectedRoute;
