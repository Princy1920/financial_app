import React, { useEffect, useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import './TransactionList.css';

const TRANSACTIONS_QUERY = gql`
  query Transactions($userId: ID!) {
    transactions(userId: $userId) {
      id
      description
      category
      amount
      date
    }
  }
`;

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const { loading, error, data } = useQuery(TRANSACTIONS_QUERY, {
    variables: { userId: user.id }
  });

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="transaction-list-container">
      <h2>Transaction List</h2>
      <ul className="transaction-list">
        {transactions.map(transaction => (
          <li key={transaction.id}>
            <div>Description: {transaction.description}</div>
            <div>Category: {transaction.category}</div>
            <div>Amount: ${transaction.amount}</div>
            <div>Date: {transaction.date}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
