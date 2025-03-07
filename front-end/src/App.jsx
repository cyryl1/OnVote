// import { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import CreateElection from './pages/createElection.jsx';
import Overview from './pages/overview.jsx';
import Settings from './pages/settings';
import Ballots from './pages/ballots.jsx';
import Voters from './pages/voters';
import Ballot from './pages/ballot.jsx';
import VoterAuth from './pages/voterAuth.jsx';
import VotePage from './pages/votePage.jsx';
import LastPage from './pages/lastPage.jsx';
import ProfileSettings from './pages/profileSettings.jsx';
import TokenRefresh from './pages/tokenRefresh.jsx';
import PreviewPage from './pages/previewPage.jsx';
import AdminProtectedRoute from './protected_route/adminProtectedRoute.jsx';
import VoterProtectedRoute from './protected_route/voterProtectedRoute.jsx';

function App() {

  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <AdminProtectedRoute>
              <Dashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/create" 
          element={
            <AdminProtectedRoute>
              <CreateElection />
            </AdminProtectedRoute>
          }
        />
        <Route 
          path="/election/:id/overview" 
            element={
            <AdminProtectedRoute>
              <Overview />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/:id/settings" 
          element={
            <AdminProtectedRoute>
              <Settings />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/:id/ballots" 
          element={
            <AdminProtectedRoute>
              <Ballots />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/:id/voters" 
          element={
            <AdminProtectedRoute>
              <Voters />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/:id/ballot/" 
          element={
            <AdminProtectedRoute>
              <Ballot />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/profile_settings" 
          element={
            <AdminProtectedRoute>
              <ProfileSettings />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/election/:id/preview" 
          element={
            <AdminProtectedRoute>
              <PreviewPage />
            </AdminProtectedRoute>
          } 
        />
        {/* <Route 
          path="/token_refresh"
          element={
            <AdminProtectedRoute>
              <TokenRefresh />
            </AdminProtectedRoute>
          } 
        /> */}
        <Route 
          path='/token_refresh'
          element={<TokenRefresh />}
        />

        {/* Voter Routes */}
        <Route path="/election/:id/voter_auth" element={<VoterAuth />} />
        <Route 
          path="/election/:id/vote_page"
          element={
            <VoterProtectedRoute>
              <VotePage />
            </VoterProtectedRoute>
          }
        />
        <Route 
          path="/election/:id/lastPage"
          element={
            <VoterProtectedRoute>
              <LastPage />
            </VoterProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>

    </>
  )
}

export default App
