import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter } from 'react-router-dom';
import AddTransaction, { ADD_TRANSACTION_MUTATION } from './AddTransaction';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('AddTransaction', () => {
  it('renders Add Transaction form and submits correctly', async () => {
    const mockUser = { id: '1' };
    localStorage.setItem('user', JSON.stringify(mockUser));

    const mocks = [
      {
        request: {
          query: ADD_TRANSACTION_MUTATION,
          variables: {
            userId: '1',
            description: 'Test Description',
            category: 'Income',
            amount: 100.5,
            date: '2023-08-02',
          },
        },
        result: {
          data: {
            addTransaction: {
              id: '1',
              description: 'Test Description',
              category: 'Income',
              amount: 100.5,
              date: '2023-08-02',
            },
          },
        },
      },
    ];

    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <BrowserRouter>
          <AddTransaction />
        </BrowserRouter>
      </MockedProvider>
    );

    // Check if form elements are rendered
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();

    // Fill out the form
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Test Description' } });
    fireEvent.mouseDown(screen.getByLabelText(/category/i));
    const categoryListbox = screen.getByRole('listbox');
    fireEvent.click(within(categoryListbox).getByText('Income'));
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '100.5' } });
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2023-08-02' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    // Wait for the mutation to be called and navigate to be called
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/transactions');
    });
  });
});
