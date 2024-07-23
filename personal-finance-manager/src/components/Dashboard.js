import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">Finance Dashboard</div>
      <nav>
        <ul>
          <li><Link to="/transactions">Transaction List</Link></li>
          <li><Link to="/transaction/new">Add/Edit Transaction</Link></li>
          <li><Link to="/transaction/details">Transaction Details</Link></li>
          <li><button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}>Logout</button></li>
        </ul>
      </nav>
      <div className="dashboard-content">
        <h2>Welcome to your finance dashboard</h2>
      </div>
    </div>
  );
};

export default Dashboard;
