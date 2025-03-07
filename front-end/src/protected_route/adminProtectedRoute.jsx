// import React from 'react'
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

// Decode the JWT payload
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default function AdminProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken');

  const claims = decodeToken(accessToken);

  // If token is invalid or missing expiration claim, redirect to login
  if (!claims || !claims.exp) {
    return <Navigate to='/login' replace />;
  }

  if (Date.now() >= claims.exp * 1000) {
    return <Navigate to="/token_refresh" replace state={{ 
      froM: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
    }} 
    />
  }

  if (claims.role !== "admin") {
    return <Navigate to='/login' replace />;
  }
  return children;
}

AdminProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
