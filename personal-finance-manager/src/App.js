import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddEditTransaction from './components/AddEditTransaction';
import TransactionList from './components/TransactionList';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import EditTransaction from './components/EditTransaction'; // Add this line
import './App.css';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/transactions" element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />
        <Route path="/transaction/new" element={<ProtectedRoute><AddEditTransaction /></ProtectedRoute>} />
        <Route path="/transaction/edit/:id" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} /> {/* Add this line */}
      </Routes>
    </div>
  );
};

export default App;