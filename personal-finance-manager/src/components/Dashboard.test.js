import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Dashboard', () => {
  it('renders the Dashboard correctly', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Check if the Dashboard elements are rendered
    expect(screen.getByText(/FinTracker/i)).toBeInTheDocument();
    expect(screen.getByText(/transaction list/i)).toBeInTheDocument();
    expect(screen.getByText(/add transaction/i)).toBeInTheDocument();
    expect(screen.getByText(/report/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/logout/i)).toBeInTheDocument();
  });

  it('handles navigation and logout correctly', () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    // Test navigation buttons
    fireEvent.click(screen.getByLabelText(/go to transaction list/i));
    expect(mockNavigate).toHaveBeenCalledWith('/transactions');

    fireEvent.click(screen.getByLabelText(/go to add transaction/i));
    expect(mockNavigate).toHaveBeenCalledWith('/transaction/new');

    fireEvent.click(screen.getByLabelText(/go to report/i));
    expect(mockNavigate).toHaveBeenCalledWith('/report');

    // Test logout
    fireEvent.click(screen.getByLabelText(/logout/i));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(localStorage.getItem('user')).toBeNull();
    expect(localStorage.getItem('token')).toBeNull();
  });
});
