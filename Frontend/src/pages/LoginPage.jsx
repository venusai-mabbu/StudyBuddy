import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth'; // ✅ updated path
import axios from 'axios';
import './Auth.css';

const LoginPage = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const { login,auth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:3000/auth/login',
        {
          username: form.username,
          password: form.password
        },
        {
          withCredentials: true 
        }
      );


      // ✅ Destructure token, userId, and sections from response
      const { token, userID, sections } = res.data;
      console.log("here1"+JSON.stringify(auth));
      // ✅ Pass sections into login context
      login(token, userID, sections);
      console.log("here2"+JSON.stringify(auth));

      // ✅ Redirect to home
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed: ' + (err.response?.data?.message || 'Invalid credentials'));
    }
  };

  return (
    <div className="auth-wrapper">
      <h1>Login to Your Account</h1>

      <form onSubmit={handleSubmit}>
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

      <h3 className="auth-footer">
        Don't have an account? <Link to="/register">Register here</Link>
      </h3>
    </div>
  );
};

export default LoginPage;
