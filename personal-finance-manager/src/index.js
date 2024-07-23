import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import client from './apolloClient';
import App from './App';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css'; // Import the global styles

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<ProtectedRoute><App /></ProtectedRoute>} />
        </Routes>
      </Router>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
