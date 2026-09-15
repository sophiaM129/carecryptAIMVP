import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { isLoggedIn, userName, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const initials = (userName || 'JD')
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/images/logo.png" alt="CareCrypt AI" className="navbar-logo" />
          <span className="navbar-brand-name">CareCrypt AI</span>
        </Link>

        <div className="navbar-menu">
          <NavLink to="/" end className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>Home</NavLink>
          <NavLink to="/about" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>About Us</NavLink>
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>Dashboard</NavLink>
              <NavLink to="/chat" className={({ isActive }) => 'navbar-link' + (isActive ? ' active' : '')}>Pulse AI</NavLink>
            </>
          )}

          <div className="navbar-divider" />

          {isLoggedIn ? (
            <div className="navbar-user" ref={dropdownRef}>
              <button className="navbar-chip" onClick={() => setDropdownOpen(o => !o)}>
                <span className="navbar-avatar">{initials}</span>
                <span className="navbar-chip-name">{userName || 'Account'}</span>
                <span className="navbar-caret">{dropdownOpen ? '▲' : '▼'}</span>
              </button>
              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <Link to="/profile" className="navbar-drop-item" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  <button className="navbar-drop-item navbar-drop-logout" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/signup" className="navbar-btn-signup">Sign Up</Link>
              <Link to="/login" className="navbar-btn-login">Login</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
