import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useMutation(LOGIN_MUTATION);
  
  const handleLogin = async () => {
    const { data } = await login({ variables: { username, password } });
    localStorage.setItem('token', data.login.token);
    // Redirect to dashboard (for example, use history.push('/dashboard'))
  };

  return (
    <div>
      <h1>Personal Finance Manager</h1>
      <form>
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
      <a href="/register">Register</a>
    </div>
  );
};

export default Login;
