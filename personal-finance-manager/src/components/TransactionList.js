import React from 'react';
import { Link } from 'react-router-dom';

const TransactionList = () => {
  const transactions = [
    // Example transactions
    { id: 1, description: 'Salary', category: 'Income', amount: 5000, date: '2024-07-01' },
    { id: 2, description: 'Rent', category: 'Expense', amount: 1000, date: '2024-07-05' },
    { id: 3, description: 'Groceries', category: 'Expense', amount: 200, date: '2024-07-10' },
  ];

  return (
    <div>
      <h1>Personal Finance Manager</h1>
      <div>
        <Link to="/transaction/new">Add New Transaction</Link>
        <button onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}>Logout</button>
      </div>
      <h2>Transaction List</h2>
      <input type="text" placeholder="Search..." />
      <div>
        <select>
          <option value="">Filter by Category</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
          {/* Add other categories as needed */}
        </select>
      </div>
      <ul>
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <div>Description: {transaction.description}</div>
            <div>Category: {transaction.category}</div>
            <div>Amount: ${transaction.amount}</div>
            <div>Date: {transaction.date}</div>
            <div>
              <Link to={`/transaction/details/${transaction.id}`}>View Details</Link>
              <Link to={`/transaction/${transaction.id}`}>Edit</Link>
              <button>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
