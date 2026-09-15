import React from 'react';
import { Link } from 'react-router-dom';
import './ComingSoon.css';

const ComingSoon: React.FC<{ title: string }> = ({ title }) => (
  <div className="coming-soon-page">
    <div className="coming-soon-card">
      <div className="coming-soon-eyebrow">CareCrypt AI</div>
      <h1 className="coming-soon-title">{title}</h1>
      <p className="coming-soon-body">This part of the app is still being built out.</p>
      <Link to="/profile" className="coming-soon-link">← Back to your profile</Link>
    </div>
  </div>
);

export default ComingSoon;
