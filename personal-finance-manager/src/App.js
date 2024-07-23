import React from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AddEditTransaction from './components/AddEditTransaction';
import TransactionDetails from './components/TransactionDetails';
import './App.css'; // Import global styles

const App = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <nav>
        <ul>
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/transactions">Transaction List</Link></li>
          <li><Link to="/transaction/new">Add/Edit Transaction</Link></li>
          <li><Link to="/transaction/details/:id">Transaction Details</Link></li>
          <li><button onClick={handleLogout}>Logout</button></li>
        </ul>
      </nav>
      <div>Welcome, {user.username}</div>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionList />} />
        <Route path="/transaction/new" element={<AddEditTransaction />} />
        <Route path="/transaction/details/:id" element={<TransactionDetails />} />
      </Routes>
    </div>
  );
};

export default App;
