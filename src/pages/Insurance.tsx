import React, { useState } from 'react';
import './Insurance.css';

interface InsuranceInfo {
  provider: string;
  policy: string;
  group: string;
  effective: string;
  expiry: string;
  coverage: string;
  premium: string;
  sumInsured: string;
}

const InsCard: React.FC<{ data: InsuranceInfo; title: string; accent: string }> = ({ data, title, accent }) => (
  <div className="ins-card">
    <div className="ins-card-head">
      <div className="ins-card-title">
        <div className="ins-card-icon" style={{ background: `${accent}12`, color: accent }}>🛡️</div>
        {title}
      </div>
      <span className="ins-status-badge" style={accent === '#e6b84a' ? { background: 'rgba(230,184,74,0.1)', borderColor: 'rgba(230,184,74,0.28)', color: '#e6b84a' } : undefined}>
        <span className="ins-status-dot" />
        Active
      </span>
    </div>
    <div className="ins-info-grid">
      {([
        ['Provider', data.provider, true], ['Policy No.', data.policy, false], ['Group No.', data.group, false],
        ['Coverage', data.coverage, false], ['Effective', data.effective, false], ['Expiry', data.expiry, false],
        ['Sum Insured', data.sumInsured, true], ['Premium', data.premium, true],
      ] as [string, string, boolean][]).map(([l, v, gold]) => (
        <div key={l} className="ins-info-item">
          <span className="ins-info-label">{l}</span>
          <span className={gold ? 'ins-info-val-gold' : 'ins-info-val'}>{v}</span>
        </div>
      ))}
    </div>
    <div className="ins-card-footer">
      <button className="ins-btn-primary">Edit Details</button>
      <button className="ins-btn-secondary">View Card</button>
      <button className="ins-btn-secondary">Claim History</button>
    </div>
  </div>
);

const Insurance: React.FC = () => {
  const [ins] = useState<InsuranceInfo>({
    provider: 'Star Health Insurance', policy: 'SHI-2024-98765432',
    group: 'GRP-CC-2024', effective: '2024-01-01', expiry: '2024-12-31',
    coverage: 'Family Floater', premium: '₹18,500/year', sumInsured: '₹10,00,000',
  });
  const [ins2] = useState<InsuranceInfo>({
    provider: 'HDFC ERGO Health', policy: 'HE-2024-11223344',
    group: 'GRP-IND-887', effective: '2024-03-01', expiry: '2025-02-28',
    coverage: 'Individual', premium: '₹9,200/year', sumInsured: '₹5,00,000',
  });

  const tips = [
    'Always carry a digital copy of your insurance card',
    'Keep policy numbers handy for hospital visits',
    'Know your deductible and copay amounts',
    'Link your Aadhaar for faster claims processing',
  ];

  return (
    <div className="insurance-page">
      <div className="cc-page-header">
        <div className="cc-page-eyebrow">Coverage</div>
        <div className="cc-page-title">Insurance Management</div>
        <div className="cc-page-sub">Manage your insurance policies and coverage details</div>
      </div>
      <div className="ins-wrap">
        <div className="ins-grid">
          <InsCard data={ins} title="Primary Insurance" accent="#c8f135" />
          <InsCard data={ins2} title="Secondary Insurance" accent="#e6b84a" />
        </div>
        <div className="ins-bottom-grid">
          <div className="ins-add-card">
            <div className="ins-add-icon">➕</div>
            <div className="ins-add-txt">Add another insurance policy</div>
          </div>
          <div className="ins-tips-card">
            <div className="ins-tips-title">💡 Tips</div>
            <ul className="ins-tips-list">
              {tips.map(t => (
                <li key={t} className="ins-tip-item"><span className="ins-tip-arrow">→</span>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
