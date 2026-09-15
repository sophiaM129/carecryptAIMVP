import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { isLoggedIn } = useAuth();

  return (
    <footer className="cc-footer">
      <div className="cc-footer-inner">
        <div className="cc-footer-grid">
          <div>
            <div className="cc-footer-brand-row">
              <img src="/images/logo.png" alt="CareCrypt AI" className="cc-footer-logo" />
              <span className="cc-footer-brand-name">CareCrypt AI</span>
            </div>
            <p className="cc-footer-desc">Simplifying medical records management across India.</p>
          </div>
          <div>
            <div className="cc-footer-col-title">Platform</div>
            <Link to="/" className="cc-footer-link">Home</Link>
            <Link to="/about" className="cc-footer-link">About Us</Link>
            {isLoggedIn && <Link to="/dashboard" className="cc-footer-link">Dashboard</Link>}
            {isLoggedIn && <Link to="/chat" className="cc-footer-link">Pulse AI</Link>}
          </div>
          <div>
            <div className="cc-footer-col-title">Records</div>
            <Link to="/medical-history" className="cc-footer-link">Medical History</Link>
            <Link to="/insurance" className="cc-footer-link">Insurance</Link>
            {isLoggedIn && <Link to="/vault" className="cc-footer-link">Document Vault</Link>}
            {isLoggedIn && <Link to="/qr-code" className="cc-footer-link">QR Code</Link>}
          </div>
        </div>
        <div className="cc-footer-bottom">
          <span className="cc-footer-copy">© 2026 CareCrypt. All rights reserved.</span>
          <span className="cc-footer-tagline">Secure · Unified · Patient-Controlled</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
