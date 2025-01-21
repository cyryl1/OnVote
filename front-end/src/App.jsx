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
import ProfileSettings from './pages/profileSettings.jsx';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/election/create" element={<CreateElection />} />
        <Route path="/election/:id/overview" element={<Overview />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/ballots" element={<Ballots />} />
        <Route path="/voters" element={<Voters />} />
        <Route path="/ballot/" element={<Ballot />} />
        <Route path="/profile_settings" element={<ProfileSettings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
