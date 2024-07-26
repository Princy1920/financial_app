import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddEditTransaction from './components/AddEditTransaction';
import TransactionDetails from './components/TransactionDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './components/Register';
import EditTransaction from './components/EditTransaction'; // Import EditTransaction

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/transactions" element={<ProtectedRoute><TransactionList /></ProtectedRoute>} />
          <Route path="/transaction/new" element={<ProtectedRoute><AddEditTransaction /></ProtectedRoute>} />
          <Route path="/transaction/details/:id" element={<ProtectedRoute><TransactionDetails /></ProtectedRoute>} />
          <Route path="/transaction/edit/:id" element={<ProtectedRoute><EditTransaction /></ProtectedRoute>} /> {/* Add route for EditTransaction */}
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);