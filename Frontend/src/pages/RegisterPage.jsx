import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';
import axios from 'axios';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/register',
        form,
        { withCredentials: true }
      );
      console.log('Registration successful:', res.data);
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <main className="auth-wrapper">
      <h1>Register Account</h1>
      <form onSubmit={handleSubmit} className="auth-form">
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

      <p className="auth-footer">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </main>
  );
};

export default RegisterPage;
