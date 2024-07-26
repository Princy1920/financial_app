import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Finance Dashboard</div>
      <div className="navbar">
        <Link to="/transactions" className="active">Transaction List</Link>
        <Link to="/transaction/new">Add/Edit Transaction</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className="welcome-message">
        Welcome to your finance dashboard
      </div>
    </div>
  );
};

export default Dashboard;
