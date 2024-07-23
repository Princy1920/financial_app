import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
      email
      token
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [login, { error, loading }] = useMutation(LOGIN_MUTATION);

  const handleLogin = async () => {
    try {
      const { data } = await login({ variables: { username, password } });
      localStorage.setItem('token', data.login.token);
      localStorage.setItem('user', JSON.stringify(data.login));
      navigate('/dashboard');
    } catch (err) {
      console.error('Error logging in:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">Personal Finance Manager</div>
      <form className="login-form">
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" onClick={handleLogin}>Login</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Login failed. Please try again.</p>}
    </div>
  );
};

export default Login;
