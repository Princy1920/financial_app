import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div>
      <h1>Personal Finance Manager</h1>
      <div>
        <Link to="/transaction/new">Add New Transaction</Link>
        <button>Logout</button>
      </div>
      <h2>Finance Dashboard</h2>
      <div>Total Balance: $0</div>
      <div>Income: $0</div>
      <div>Expenses: $0</div>
      <div>Categories: Salary, Rent, Groceries, Utilities, Entertainment</div>
      <input type="text" placeholder="Search..." />
      <div>Transaction List:</div>
      <ul>
        <li>Transaction 1</li>
        <li>Transaction 2</li>
        <li>Transaction 3</li>
      </ul>
    </div>
  );
};

export default Dashboard;
