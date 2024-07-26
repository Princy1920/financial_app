import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
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

const DELETE_TRANSACTION_MUTATION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));
  const { loading, error, data } = useQuery(TRANSACTIONS_QUERY, {
    variables: { userId: user.id }
  });
  const [deleteTransaction] = useMutation(DELETE_TRANSACTION_MUTATION, {
    refetchQueries: [{ query: TRANSACTIONS_QUERY, variables: { userId: user.id } }]
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setTransactions(data.transactions);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await deleteTransaction({ variables: { id } });
    } catch (err) {
      console.error('Error deleting transaction:', err);
    }
  };

  const handleEdit = (id) => {
    navigate(`/transaction/edit/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const incomeTransactions = transactions.filter(t => t.category === 'Income');
  const expenseTransactions = transactions.filter(t => t.category === 'Expense');

  return (
    <div className="transaction-list-container">
      <h2>Transaction List</h2>
      <div className="transaction-tables">
        <div className="transaction-table">
          <h3>Income</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(transaction.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="transaction-table">
          <h3>Expenses</h3>
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenseTransactions.map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(transaction.id)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(transaction.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;
