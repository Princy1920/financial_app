import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const REGISTER_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      id
      username
      email
      token
    }
  }
`;

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [register, { error, loading }] = useMutation(REGISTER_MUTATION);

  const handleRegister = async () => {
    try {
      const { data } = await register({ variables: { username, email, password } });
      localStorage.setItem('token', data.register.token);
      localStorage.setItem('user', JSON.stringify(data.register));
      navigate('/dashboard');
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">Register</div>
      <form className="register-form">
        <div>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="button" onClick={handleRegister}>Register</button>
      </form>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">Registration failed. Please try again.</p>}
    </div>
  );
};

export default Register;