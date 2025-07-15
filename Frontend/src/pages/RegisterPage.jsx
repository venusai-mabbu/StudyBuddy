import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // TODO: Implement registration logic
    try {
    const res = await axios.post(
  'http://localhost:3000/auth/register',
  {
    username: form.username,
    password: form.password,
    email: form.email
  },
  {
    withCredentials: true 
  }
);

    console.log(res.data);
   

    // Redirect to home
    navigate('/');
  } catch (err) {
    console.error('Login failed:', err);
    alert('Login failed: ' + (err.response?.data?.message || 'Invalid credentials'));
  }

    console.log('Registering with', form);
    navigate('/login');
  };

  return (
    <div className="auth-wrapper">
      <h1>Register Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Register</button>
      </form>
      <h3 className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </h3>
    </div>
  );
};

export default RegisterPage;
