import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../apiConfig';
import './AdminLogin.css';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    const token = localStorage.getItem('swara_admin_token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('swara_admin_token', data.token);
        localStorage.setItem('swara_admin_username', data.username);
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Invalid username or password');
      }
    } catch (err) {
      console.error(err);
      setError('Connection to backend failed. Make sure server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card animate-fade-in">
        <div className="login-header">
          <h2 className="serif-title">Admin Portal</h2>
          <p>Login to manage products and brand settings</p>
        </div>

        {error && (
          <div className="login-error-banner">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter admin password"
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-accent login-submit-btn" 
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>

        <div className="login-footer">
          <p>Default credentials check required for sandbox run.</p>
        </div>
      </div>
    </div>
  );
}
