import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import Register, { REGISTER_MUTATION } from './Register';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const registerMock = {
  request: {
    query: REGISTER_MUTATION,
    variables: {
      username: 'testuser',
      email: 'testuser@example.com',
      password: 'testpassword',
    },
  },
  result: {
    data: {
      register: {
        id: '1',
        username: 'testuser',
        email: 'testuser@example.com',
        token: 'fake-token',
      },
    },
  },
};

describe('Register Component', () => {
  test('should render Register component', () => {
    render(
      <MockedProvider mocks={[]} addTypename={false}>
        <Router>
          <Register />
        </Router>
      </MockedProvider>
    );

    expect(screen.getByText('Register', { selector: 'div.register-header' })).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  test('should handle registration', async () => {
    render(
      <MockedProvider mocks={[registerMock]} addTypename={false}>
        <Router>
          <Register />
        </Router>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });

    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(JSON.parse(localStorage.getItem('user'))).toEqual({
      id: '1',
      username: 'testuser',
      email: 'testuser@example.com',
      token: 'fake-token',
    });
  });

  test('should show loading and error messages', async () => {
    const errorMock = {
      request: {
        query: REGISTER_MUTATION,
        variables: {
          username: 'testuser',
          email: 'testuser@example.com',
          password: 'testpassword',
        },
      },
      error: new Error('Registration failed'),
    };

    render(
      <MockedProvider mocks={[errorMock]} addTypename={false}>
        <Router>
          <Register />
        </Router>
      </MockedProvider>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'testuser@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpassword' } });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Registration failed: Registration failed')).toBeInTheDocument();
    });
  });
});
