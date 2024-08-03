import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import TransactionListView, { TRANSACTIONS_QUERY, DELETE_TRANSACTION_MUTATION } from './TransactionList';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const user = { id: '1' };
localStorage.setItem('user', JSON.stringify(user));

const transactionsMock = {
  request: {
    query: TRANSACTIONS_QUERY,
    variables: { userId: '1' }
  },
  result: {
    data: {
      transactions: [
        { id: '1', description: 'Salary', category: 'Income', amount: 5000, date: '2023-08-01' },
        { id: '2', description: 'Groceries', category: 'Expense', amount: 200, date: '2023-08-02' },
      ]
    }
  }
};

const deleteTransactionMock = {
  request: {
    query: DELETE_TRANSACTION_MUTATION,
    variables: { id: '2' }
  },
  result: {
    data: {
      deleteTransaction: '2'
    }
  }
};

describe('TransactionListView', () => {
  it('renders the Transaction List correctly', async () => {
    render(
      <MockedProvider mocks={[transactionsMock]} addTypename={false}>
        <BrowserRouter>
          <TransactionListView />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(/transaction list/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/income/i)).toBeInTheDocument();
    expect(screen.getByText(/expenses/i)).toBeInTheDocument();
    
    // Check for Salary (Income) in the initial view
    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    
    // Switch to Expenses view
    fireEvent.click(screen.getByText(/expenses/i));
    
    // Check for Groceries (Expense) after switching view
    await waitFor(() => {
      expect(screen.getByText(/groceries/i)).toBeInTheDocument();
    });
  });

  it('handles deletion and navigation correctly', async () => {
    render(
      <MockedProvider mocks={[transactionsMock, deleteTransactionMock]} addTypename={false}>
        <BrowserRouter>
          <TransactionListView />
        </BrowserRouter>
      </MockedProvider>
    );

    // Check for Salary (Income) in the initial view
    await waitFor(() => {
      expect(screen.getByText(/salary/i)).toBeInTheDocument();
    });

    // Switch to Expenses view
    fireEvent.click(screen.getByText(/expenses/i));

    // Check for Groceries (Expense) after switching view
    await waitFor(() => {
      expect(screen.getByText(/groceries/i)).toBeInTheDocument();
    });

    const groceryRow = screen.getByText(/groceries/i).closest('tr');
    const deleteButton = within(groceryRow).getByLabelText('delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/groceries/i)).not.toBeInTheDocument();
    });

    // Switch back to Income view
    fireEvent.click(screen.getByText(/income/i));

    await waitFor(() => {
      expect(screen.getByText(/salary/i)).toBeInTheDocument();
    });

    const salaryRow = screen.getByText(/salary/i).closest('tr');
    const editButton = within(salaryRow).getByLabelText('edit');
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/transaction/edit/1');
  });
});