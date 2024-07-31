import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';
import Header from './Header';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <Header />
      <div className="card-container">
        <div className="nav-card" onClick={() => handleNavigation('/transactions')}>
          <img src="image5.png" alt="Transaction List Icon" />
          <span>Transaction List</span>
          <button onClick={() => handleNavigation('/transactions')}>Go!</button>
        </div>
        <div className="nav-card" onClick={() => handleNavigation('/transaction/new')}>
          <img src="image5.png" alt="Add Transaction Icon" />
          <span>Add Transaction</span>
          <button onClick={() => handleNavigation('/transaction/new')}>Go!</button>
        </div>
        <div className="nav-card" onClick={() => handleNavigation('/report')}>
          <img src="image5.png" alt="Report Icon" />
          <span>Report</span>
          <button onClick={() => handleNavigation('/report')}>Go!</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
