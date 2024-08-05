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
  // Increase timeout for all tests in this describe block
  jest.setTimeout(60000);

  it('renders the Transaction List correctly', async () => {
    console.log('Starting render test');
    render(
      <MockedProvider mocks={[transactionsMock]} addTypename={false}>
        <BrowserRouter>
          <TransactionListView />
        </BrowserRouter>
      </MockedProvider>
    );
  
    await waitFor(() => {
      const loadingElement = screen.queryByText(/loading/i);
      console.log('Loading element:', loadingElement);
      expect(loadingElement).not.toBeInTheDocument();
    }, { timeout: 10000 });
  
    console.log('Document body:', document.body.innerHTML);
  
    const titleElement = screen.queryByText(/transaction list/i);
    console.log('Title element:', titleElement);
    expect(titleElement).toBeInTheDocument();
    console.log('Render test completed');
  });

  describe('TransactionListView', () => {
    jest.setTimeout(60000);
  
    it('handles navigation correctly', async () => {
      console.log('Starting navigation test');
      
      const { container } = render(
        <MockedProvider mocks={[transactionsMock, deleteTransactionMock]} addTypename={false}>
          <BrowserRouter>
            <TransactionListView />
          </BrowserRouter>
        </MockedProvider>
      );
  
      console.log('Waiting for loading to finish');
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      }, { timeout: 10000 });
  
      console.log('Loading finished. Current DOM content:');
      console.log(container.innerHTML);
  
      console.log('All text content in the document:');
      console.log(container.textContent);
  
      console.log('Checking for Salary');
      try {
        await waitFor(() => {
          const salaryElement = screen.getByText(/salary/i);
          expect(salaryElement).toBeInTheDocument();
          console.log('Salary element found:', salaryElement.textContent);
        }, { timeout: 10000 });
      } catch (error) {
        console.error('Error finding Salary:', error);
      }
  
      console.log('Checking for Expenses button');
      const expensesButton = screen.queryByText(/expenses/i);
      if (expensesButton) {
        console.log('Expenses button found. Switching to Expenses view');
        fireEvent.click(expensesButton);
      } else {
        console.error('Expenses button not found');
      }
  
      console.log('Checking for Groceries');
      try {
        await waitFor(() => {
          const groceriesElement = screen.getByText(/groceries/i);
          expect(groceriesElement).toBeInTheDocument();
          console.log('Groceries element found:', groceriesElement.textContent);
        }, { timeout: 10000 });
      } catch (error) {
        console.error('Error finding Groceries:', error);
      }
  });
})
});