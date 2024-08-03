// Login.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BrowserRouter as Router } from 'react-router-dom';
import Login, { LOGIN_MUTATION } from './Login';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const loginMock = {
    request: {
        query: LOGIN_MUTATION,
        variables: {
            username: 'testuser',
            password: 'testpassword',
        },
    },
    result: {
        data: {
            login: {
                id: '1',
                username: 'testuser',
                email: 'testuser@example.com',
                token: 'fake-token',
            },
        },
    },
};

const errorMock = {
    request: {
        query: LOGIN_MUTATION,
        variables: {
            username: 'wronguser',
            password: 'wrongpassword',
        },
    },
    error: new Error('Login failed'),
};

describe('Login Component', () => {
    test('should render Login component', () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <Router>
                    <Login />
                </Router>
            </MockedProvider>
        );

        expect(screen.getByText('Login', { selector: 'div.login-header' })).toBeInTheDocument();
        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
    });

    test('should handle login', async () => {
        render(
            <MockedProvider mocks={[loginMock]} addTypename={false}>
                <Router>
                    <Login />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'testpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

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
        render(
            <MockedProvider mocks={[errorMock]} addTypename={false}>
                <Router>
                    <Login />
                </Router>
            </MockedProvider>
        );

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'wronguser' } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'wrongpassword' } });

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        expect(screen.getByText('Loading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Login failed. Please try again.')).toBeInTheDocument();
        });
    });
});
