import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddEditTransaction from './components/AddEditTransaction';
import TransactionDetails from './components/TransactionDetails';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionList />} />
      <Route path="/transaction/:id" element={<AddEditTransaction />} />
      <Route path="/transaction/details/:id" element={<TransactionDetails />} />
      <Route path="/" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
