import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter, MemoryRouter, Route, Routes } from 'react-router-dom';
import EditTransaction, { EDIT_TRANSACTION_MUTATION, TRANSACTION_QUERY } from './EditTransaction';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => ({ id: '1' })
}));

const transactionMock = {
  request: {
    query: TRANSACTION_QUERY,
    variables: { id: '1' }
  },
  result: {
    data: {
      transaction: {
        id: '1',
        description: 'Test Description',
        category: 'Income',
        amount: 100.5,
        date: '2023-08-02'
      }
    }
  }
};

const editTransactionMock = {
  request: {
    query: EDIT_TRANSACTION_MUTATION,
    variables: {
      id: '1',
      description: 'Updated Description',
      category: 'Expense',
      amount: 200.75,
      date: '2023-08-03'
    }
  },
  result: {
    data: {
      editTransaction: {
        id: '1',
        description: 'Updated Description',
        category: 'Expense',
        amount: 200.75,
        date: '2023-08-03'
      }
    }
  }
};

describe('EditTransaction', () => {
  it('renders Edit Transaction form correctly', async () => {
    render(
      <MockedProvider mocks={[transactionMock]} addTypename={false}>
        <BrowserRouter>
          <EditTransaction />
        </BrowserRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
      expect(screen.getByLabelText(/category/i)).toHaveTextContent('Income');
      expect(screen.getByLabelText(/amount/i)).toHaveValue(100.5);
      expect(screen.getByLabelText(/date/i)).toHaveValue('2023-08-02');
    });
  });

  it('handles form submission correctly', async () => {
    render(
      <MockedProvider mocks={[transactionMock, editTransactionMock]} addTypename={false}>
        <MemoryRouter initialEntries={['/edit-transaction/1']}>
          <Routes>
            <Route path="/edit-transaction/:id" element={<EditTransaction />} />
          </Routes>
        </MemoryRouter>
      </MockedProvider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/description/i)).toHaveValue('Test Description');
      expect(screen.getByLabelText(/category/i)).toHaveTextContent('Income');
      expect(screen.getByLabelText(/amount/i)).toHaveValue(100.5);
      expect(screen.getByLabelText(/date/i)).toHaveValue('2023-08-02');
    });

    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Updated Description' } });
    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    const categoryListbox = screen.getByRole('listbox');
    fireEvent.click(within(categoryListbox).getByText('Expense'));
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '200.75' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-08-03' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });
  });
});
