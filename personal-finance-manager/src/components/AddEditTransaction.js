import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddEditTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const handleSave = () => {
    // Save the transaction
    navigate('/transactions');
  };

  return (
    <div>
      <h1>Personal Finance Manager</h1>
      <button onClick={() => navigate('/transactions')}>Back to List</button>
      <h2>{isEdit ? 'Edit' : 'Add'} Transaction</h2>
      <form>
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
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label>Date:</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <button type="button" onClick={handleSave}>Save</button>
        <button type="button" onClick={() => navigate('/transactions')}>Cancel</button>
      </form>
    </div>
  );
};

export default AddEditTransaction;
