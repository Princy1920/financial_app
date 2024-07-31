import React, { useEffect, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Report.css';

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

const Report = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
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
      calculateBalance(data.transactions);
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

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
    filterTransactions(event.target.value, selectedYear);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
    filterTransactions(selectedMonth, event.target.value);
  };

  const filterTransactions = (month, year) => {
    if (data) {
      const filteredTransactions = data.transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate.getMonth() + 1 === parseInt(month) && transactionDate.getFullYear() === parseInt(year);
      });
      setTransactions(filteredTransactions);
      calculateBalance(filteredTransactions);
    }
  };

  const calculateBalance = (transactions) => {
    const incomeTransactions = transactions.filter(t => t.category === 'Income');
    const expenseTransactions = transactions.filter(t => t.category === 'Expense');

    const totalIncome = incomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalExpenses = expenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

    setIncome(totalIncome);
    setExpenses(totalExpenses);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const months = Array.from({ length: 12 }, (v, k) => k + 1);
  const years = Array.from({ length: 10 }, (v, k) => new Date().getFullYear() - k);

  return (
    <div className="transaction-list-container">
      <h2>Monthly Report</h2>
      <div className="filter-container">
        <label htmlFor="month">Select Month:</label>
        <select id="month" name="month" value={selectedMonth} onChange={handleMonthChange}>
          <option value="">Month</option>
          {months.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
        <label htmlFor="year">Select Year:</label>
        <select id="year" name="year" value={selectedYear} onChange={handleYearChange}>
          <option value="">Year</option>
          {years.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div className="balance-container">
        <div className="balance-card">
          <h3>Total Income: {income.toFixed(2)}</h3>
        </div>
        <div className="balance-card">
          <h3>Total Expenses: {expenses.toFixed(2)}</h3>
        </div>
        <div className="balance-card">
          <h3>Balance: {(income - expenses).toFixed(2)}</h3>
        </div>
      </div>
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
              {transactions.filter(t => t.category === 'Income').map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(transaction.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 0 .708l-14 14a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.658-.658l1-4a.5.5 0 0 1 .131-.233l14-14a.5.5 0 0 1 .708 0zm-13.82 14.136 1.616-.383-1.233-1.233-.383 1.616zM13.854 2.146l-.707-.707L4 10.586v.707h.707l9.146-9.147z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(transaction.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5a.5.5 0 0 1 .5.5v7.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 1 1 0v7.5A1.5 1.5 0 0 1 10.5 15H5.5A1.5 1.5 0 0 1 4 13.5V6a.5.5 0 0 1 .5-.5zm3.5-3.5a2.5 2.5 0 0 0-2.5 2.5v.5h-3A.5.5 0 0 0 3 5h10a.5.5 0 0 0 0-1h-3v-.5A2.5 2.5 0 0 0 8.5 2z"/>
                      </svg>
                    </button>
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
              {transactions.filter(t => t.category === 'Expense').map(transaction => (
                <tr key={transaction.id}>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.amount}</td>
                  <td>{transaction.date}</td>
                  <td>
                    <button className="icon-btn edit-btn" onClick={() => handleEdit(transaction.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 0 .708l-14 14a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.658-.658l1-4a.5.5 0 0 1 .131-.233l14-14a.5.5 0 0 1 .708 0zm-13.82 14.136 1.616-.383-1.233-1.233-.383 1.616zM13.854 2.146l-.707-.707L4 10.586v.707h.707l9.146-9.147z"/>
                      </svg>
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(transaction.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5.5 5.5a.5.5 0 0 1 .5.5v7.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5V6a.5.5 0 0 1 1 0v7.5A1.5 1.5 0 0 1 10.5 15H5.5A1.5 1.5 0 0 1 4 13.5V6a.5.5 0 0 1 .5-.5zm3.5-3.5a2.5 2.5 0 0 0-2.5 2.5v.5h-3A.5.5 0 0 0 3 5h10a.5.5 0 0 0 0-1h-3v-.5A2.5 2.5 0 0 0 8.5 2z"/>
                      </svg>
                    </button>
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

export default Report;
