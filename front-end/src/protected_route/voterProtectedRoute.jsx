// import React from 'react'
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

export default function VoterProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem(`voter_auth_${electionId}`);
    const { id: electionId } = useParams()

    if (!isAuthenticated) {
      return <Navigate to={`/election/${electionId}/voter_auth`} />;
    }
    return children
}

VoterProtectedRoute.propTypes = {
  children: PropTypes.element.isRequired,
  electionId: PropTypes.number.isRequired,
}
