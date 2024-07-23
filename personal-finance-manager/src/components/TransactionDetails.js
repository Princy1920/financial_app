import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';


const TRANSACTION_QUERY = gql`
  query Transaction($id: ID!) {
    transaction(id: $id) {
      id
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
  const { loading, error, data } = useQuery(TRANSACTION_QUERY, {
    variables: { id },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data || !data.transaction) return <p>No transaction found</p>;

  const { description, category, amount, date } = data.transaction;

  return (
    <div className="transaction-details-container">
      <div className="transaction-details-header">
        <button onClick={() => navigate('/transactions')}>Back to List</button>
      </div>
      <h2>Transaction Details</h2>
      <div>
        <strong>Description:</strong> {description}
      </div>
      <div>
        <strong>Category:</strong> {category}
      </div>
      <div>
        <strong>Amount:</strong> ${amount}
      </div>
      <div>
        <strong>Date:</strong> {date}
      </div>
      <div className="transaction-details-buttons">
        <button onClick={() => navigate(`/transaction/edit/${id}`)}>Edit</button>
        <button onClick={() => {/* Add delete functionality here */}}>Delete</button>
      </div>
    </div>
  );
};

export default TransactionDetails;
