import React, { useState , useEffect} from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export const LOGIN_MUTATION = gql`
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

  useEffect(() => {
    // Check if the user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

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
    <div>
      <div className="login-container">
        <div className="login-header">Login</div>
        <form className="login-form">
          <div>
            <label htmlFor="username">Username:</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="button" className="login-button" onClick={handleLogin}>Login</button>
        </form>
        {loading && <p>Loading...</p>}
        {error && <p className="error-message">Login failed. Please try again.</p>}
        <div className="register-link">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
