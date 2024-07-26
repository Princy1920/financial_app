import React, { useState, useEffect } from 'react';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import './EditTransaction.css';

const EDIT_TRANSACTION_MUTATION = gql`
  mutation EditTransaction($id: ID!, $description: String, $category: String, $amount: Float, $date: String) {
    editTransaction(id: $id, description: $description, category: $category, amount: $amount, date: $date) {
      id
      description
      category
      amount
      date
    }
  }
`;

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

const EditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState('');

  const { data } = useQuery(TRANSACTION_QUERY, {
    variables: { id }
  });

  const [editTransaction] = useMutation(EDIT_TRANSACTION_MUTATION);

  useEffect(() => {
    if (data) {
      const { transaction } = data;
      setDescription(transaction.description);
      setCategory(transaction.category);
      setAmount(transaction.amount);
      setDate(transaction.date);
    }
  }, [data]);

  const handleSaveTransaction = async () => {
    await editTransaction({ variables: { id, description, category, amount, date } });
    navigate('/transactions');
  };

  return (
    <div className="edit-transaction-container">
      <h2>Edit Transaction</h2>
      <form className="edit-transaction-form">
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
        <button type="button" onClick={handleSaveTransaction}>Save</button>
      </form>
    </div>
  );
};

export default EditTransaction;