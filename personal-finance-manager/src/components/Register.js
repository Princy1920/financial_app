import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import './Register.css';

export const REGISTER_MUTATION = gql`
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
  const [passwordError, setPasswordError] = useState('');
  const [registrationError, setRegistrationError] = useState('');
  const navigate = useNavigate();
  const [register, { loading }] = useMutation(REGISTER_MUTATION, {
    onError: (err) => {
      setRegistrationError('Registration failed: ' + err.message);
    }
  });

  const handleRegister = async () => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    try {
      const { data } = await register({ variables: { username, email, password } });
      navigate('/login'); // Redirect to login page
    } catch (err) {
      console.error('Error registering:', err);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">Register</div>
        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={handleRegister}
            className="register-button"
          >
            Register
          </button>
        </form>
        {loading && <p>Loading...</p>}
        {passwordError && <p className="error-message">{passwordError}</p>}
        {registrationError && <p className="error-message">{registrationError}</p>}
      </div>
    </div>
  );
};

export default Register;
