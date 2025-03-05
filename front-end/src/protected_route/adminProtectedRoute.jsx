// import React from 'react'
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";;

export default function AdminProtectedRoute({ children }) {
  const accessToken = localStorage.getItem('accessToken');

  const decodeToken = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        console.error(e);
        return null;
    }
  };
  const claims = decodeToken(accessToken)

  if (!accessToken || claims?.role !== 'admin') {
    return <Navigate to='/login' />;
  }
  return children;
}

AdminProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
};
