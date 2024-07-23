import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';

const TRANSACTION_QUERY = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      id
      userId
      description
      category
      amount
      date
    }
  }
`;

const TransactionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, loading, error } = useQuery(TRANSACTION_QUERY, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const transaction = data.transaction;

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
