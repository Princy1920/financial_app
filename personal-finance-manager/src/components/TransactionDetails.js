import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const transaction = {
    // Example transaction details, replace with actual data
    id: 1,
    description: 'Salary',
    category: 'Income',
    amount: 5000,
    date: '2024-07-01'
  };

  return (
    <div>
      <h1>Personal Finance Manager</h1>
      <button onClick={() => navigate('/transactions')}>Back to List</button>
      <h2>Transaction Details</h2>
      <div>Description: {transaction.description}</div>
      <div>Category: {transaction.category}</div>
      <div>Amount: ${transaction.amount}</div>
      <div>Date: {transaction.date}</div>
      <div>
        <button onClick={() => navigate(`/transaction/${transaction.id}`)}>Edit</button>
        <button>Delete</button>
      </div>
    </div>
  );
};

export default TransactionDetails;
