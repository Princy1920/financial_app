import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';


const ADD_TRANSACTION_MUTATION = gql`
  mutation AddTransaction($userId: ID!, $description: String!, $category: String!, $amount: Float!, $date: String!) {
    addTransaction(userId: $userId, description: $description, category: $category, amount: $amount, date: $date) {
      id
      description
      category
      amount
      date
    }
  }
`;

const AddEditTransaction = () => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');
  const navigate = useNavigate();
  const [addTransaction, { error }] = useMutation(ADD_TRANSACTION_MUTATION);

  const handleAddTransaction = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await addTransaction({ variables: { userId: user.id, description, category, amount, date } });
      navigate('/transactions');
    } catch (err) {
      console.error('Error adding transaction:', err);
    }
  };

  return (
    <div className="add-edit-transaction-container">
      <h2>Add/Edit Transaction</h2>
      <form className="add-edit-transaction-form">
        <div>
          <label>Description:</label>
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label>Category:</label>
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </div>
        <div>
          <label>Amount:</label>
          <input type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="button" onClick={handleAddTransaction}>Save</button>
      </form>
      {error && <p className="error-message">Error adding transaction. Please try again.</p>}
    </div>
  );
};

export default AddEditTransaction;
