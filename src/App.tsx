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
import Contacts from './pages/contacts/Contacts';
import Leads from './pages/leads/Leads';
import Opportunities from './pages/opportunities/Opportunities';
import Accounts from './pages/accounts/Accounts';
import Company from './pages/company/Company';
import Users from './pages/users/Users';
import Cases from './pages/cases/Cases';

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
        <Route path="/app/*" element={<ProtectedRoutes />}>
          <Route path="contacts" element={<Contacts />} />
          <Route path="leads" element={<Leads />} />
          <Route path="opportunities" element={<Opportunities />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="companies" element={<Company />} />
          <Route path="users" element={<Users />} />
          <Route path="cases" element={<Cases />} />
        </Route>
        <Route path="/organization" element={<OrgRoute />} />
        <Route path="*" element={<DefaultRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
