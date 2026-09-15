import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Auth.css';

const Signup: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    // No backend is wired up yet for this prototype demo — creating an
    // account signs the user in locally so the rest of the app is reachable.
    login(fullName);
    setLoading(false);
    navigate('/profile');
  };

  return (
    <div className="auth-page">
      <div className="auth-glow"></div>
      <div className="auth-card">
        <div className="auth-eyebrow">CareCrypt AI</div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-sub">Start managing your health records today</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="fullName">Full Name</label>
            <input
              className="auth-input"
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              className="auth-input"
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">Password</label>
            <input
              className="auth-input"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account'}
          </button>
        </form>
        <div className="auth-switch">
          Already have one?{' '}
          <Link to="/login" className="auth-switch-link">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
