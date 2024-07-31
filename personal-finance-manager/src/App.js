import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddEditTransaction from './components/AddEditTransaction';
import TransactionList from './components/TransactionList';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import EditTransaction from './components/EditTransaction';
import Report from './components/Report';
import './App.css';

const App = () => {
  return (
    <div>
      <GlobalStyles/>
      <Header/>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />
        <Route path="/transaction/new" element={<ProtectedRoute><AddEditTransaction /></ProtectedRoute>} />
        <Route path="/transaction/edit/:id" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
      </Routes>
    </div>
  );
};

export default App;
