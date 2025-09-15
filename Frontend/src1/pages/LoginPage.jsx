import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import axios from 'axios';
import './Auth.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/login',
        { username: form.username, password: form.password },
        { withCredentials: true }
      );

      const { token, userID, sections } = res.data;
      login(token, userID, sections);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed: ' + (err.response?.data?.message || 'Invalid credentials'));
    }
  };

  return (
    <main className="auth-wrapper">
      <h1>Login to Your Account</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit">Login</button>
      </form>

      <p className="auth-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </main>
  );
};

export default LoginPage;
