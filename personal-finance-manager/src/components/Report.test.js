import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import Report, { TRANSACTIONS_QUERY, DELETE_TRANSACTION_MUTATION } from './Report';

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
      deleteTransaction: {
        id: '2'
      }
    }
  }
};

describe('Report', () => {
  it('renders the Report correctly', async () => {
    render(
      <MockedProvider mocks={[transactionsMock]} addTypename={false}>
        <BrowserRouter>
          <Report />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(await screen.findByText(/monthly report/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/select year/i)).toBeInTheDocument();
    expect(screen.getByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByText(/groceries/i)).toBeInTheDocument();
  });

  it('handles deletion and navigation correctly', async () => {
    render(
      <MockedProvider mocks={[transactionsMock, deleteTransactionMock]} addTypename={false}>
        <BrowserRouter>
          <Report />
        </BrowserRouter>
      </MockedProvider>
    );

    expect(await screen.findByText(/salary/i)).toBeInTheDocument();
    expect(screen.getByText(/groceries/i)).toBeInTheDocument();

    const groceryRow = screen.getByText(/groceries/i).closest('tr');
    const deleteButton = within(groceryRow).getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText(/groceries/i)).not.toBeInTheDocument();
    });

    const salaryRow = screen.getByText(/salary/i).closest('tr');
    const editButton = within(salaryRow).getByRole('button', { name: /edit/i });
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith('/transaction/edit/1');
  });
});
