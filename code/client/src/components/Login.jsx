// Login.js
import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setAuthType }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:6001/api/login', {
        email,
        password,
      });

      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('usertype', res.data.usertype);
      window.location.reload();
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert('Login Failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="authForm">
      <h2>Login</h2>
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="email"
          className="form-control"
          id="floatingInput"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="floatingInput">Email address</label>
      </div>
      <div className="form-floating mb-3 authFormInputs">
        <input
          type="password"
          className="form-control"
          id="floatingPassword"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label htmlFor="floatingPassword">Password</label>
      </div>
      <button type="submit" className="btn btn-primary">Sign in</button>
      <p>Not registered? <span onClick={() => setAuthType('register')}>Register</span></p>
    </form>
  );
};

export default Login;
