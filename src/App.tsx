import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import Login from './pages/auth/Login';
import { Home } from './pages/home/Home';
import Organization from './pages/organization/Organization';

function ProtectedRoutes() {
  const token = localStorage.getItem('accessToken');
  const org = localStorage.getItem('org');

  if (!token) return <Navigate to="/login" />;
  if (!org) return <Navigate to="/organization" />;
  return <Home />;
}

function OrgRoute() {
  const token = localStorage.getItem('accessToken');
  return token ? <Organization /> : <Navigate to="/login" />;
}

function DefaultRedirect() {
  const token = localStorage.getItem('accessToken');
  const org = localStorage.getItem('org');

  if (!token) return <Navigate to="/login" />;
  if (!org) return <Navigate to="/organization" />;
  return <Navigate to="/app" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/app" element={<ProtectedRoutes />} />
        <Route path="/organization" element={<OrgRoute />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
