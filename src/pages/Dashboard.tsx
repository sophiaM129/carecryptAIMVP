import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const icons = {
  history: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  insurance: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  appointments: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  vault: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  qr: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3zM17 17h3v3h-3zM14 20h3"/></svg>,
  timeline: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  profile: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  arrow: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>,
  blood: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a9.96 9.96 0 0 1 6.29 2.226 1 1 0 0 1-.18 1.69l-6.29 2.85a1 1 0 0 1-.82 0L5.89 5.916a1 1 0 0 1-.18-1.69A9.96 9.96 0 0 1 12 2Z"/><path d="M3.076 8.816a1 1 0 0 1 1.3-.581l6.29 2.85a1 1 0 0 1 .59.91v8.005a1 1 0 0 1-1.29.96C6.5 19.85 3 16.256 3 12c0-1.107.195-2.168.552-3.155a.994.994 0 0 1 .524-.029Z"/><path d="M20.924 8.816a1 1 0 0 0-1.3-.581l-6.29 2.85a1 1 0 0 0-.59.91v8.005a1 1 0 0 0 1.29.96C17.5 19.85 21 16.256 21 12c0-1.107-.195-2.168-.552-3.155a.994.994 0 0 0-.524-.029Z"/></svg>,
  allergy: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  condition: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  updated: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const stats = [
  { label: 'Blood Type', value: 'O-', sub: 'On record', color: '#f43f5e', icon: icons.blood },
  { label: 'Allergies', value: '3', sub: 'Active alerts', color: '#f59e0b', icon: icons.allergy },
  { label: 'Conditions', value: '2', sub: 'Chronic', color: '#e6b84a', icon: icons.condition },
  { label: 'Last Updated', value: 'Jan 15', sub: '2024', color: '#c8f135', icon: icons.updated },
];

const cards = [
  { key: 'history', icon: icons.history, title: 'Medical History', desc: 'Conditions, allergies & blood group', badge: 'complete', cta: 'View Records', color: '#c8f135', to: '/medical-history' },
  { key: 'insurance', icon: icons.insurance, title: 'Insurance', desc: 'Provider details & coverage', badge: 'incomplete', cta: 'Add Insurance', color: '#e6b84a', to: '/insurance' },
  { key: 'appointments', icon: icons.appointments, title: 'Appointments', desc: 'Upcoming & past appointments', badge: null, cta: 'View Calendar', color: '#c8f135', to: '/appointments' },
  { key: 'vault', icon: icons.vault, title: 'Document Vault', desc: 'Secure medical document storage', badge: null, cta: 'Open Vault', color: '#c8f135', to: '/vault' },
  { key: 'qr', icon: icons.qr, title: 'Emergency mode', desc: 'Instant first-responder access', badge: null, cta: 'Generate QR', color: '#ff7c45', to: '/qr-code' },
  { key: 'timeline', icon: icons.timeline, title: 'Medical Timeline', desc: 'Chronological health event history', badge: null, cta: 'View Timeline', color: '#c8f135', to: '/timeline' },
  { key: 'profile', icon: icons.profile, title: 'Profile', desc: 'Personal information & settings', badge: 'complete', cta: 'Edit Profile', color: '#c8f135', to: '/profile' },
];

const upcoming = [
  { date: 'Feb 14', day: 'Wed', title: 'Dr. Priya Nair', sub: 'Cardiology · Apollo Hospital', dot: '#c8f135' },
  { date: 'Feb 22', day: 'Thu', title: 'Lab Results', sub: 'HbA1c Panel · Thyrocare', dot: '#e6b84a' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<number | null>(null);
  const pct = 67;

  return (
    <div className="dash-page">
      <div className="dash-topbar">
        <div>
          <div className="dash-greeting">Good morning, John 👋</div>
          <div className="dash-greeting-sub">Sunday, 15 January 2024 · CareCrypt AI Dashboard</div>
        </div>
        <div className="dash-progress-wrap">
          <span className="dash-progress-label">Profile complete</span>
          <div className="dash-progress-track"><div className="dash-progress-fill" style={{ width: `${pct}%` }} /></div>
          <span className="dash-progress-pct">{pct}%</span>
        </div>
      </div>

      <div className="dash-body">
        <div className="dash-main">
          <div>
            <div className="dash-section-label">Health Overview</div>
            <div className="dash-stats-row">
              {stats.map(s => (
                <div key={s.label} className="dash-stat-card">
                  <div className="dash-stat-top">
                    <div className="dash-stat-icon" style={{ background: `${s.color}18`, color: s.color }}>{s.icon}</div>
                  </div>
                  <div>
                    <div className="dash-stat-val">{s.value}</div>
                    <div className="dash-stat-label">{s.label}</div>
                    <div className="dash-stat-sub">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="dash-section-label">Manage Your Health</div>
            <div className="dash-grid">
              {cards.map((c, i) => (
                <div
                  key={c.key}
                  className="dash-card"
                  style={hovered === i ? { borderColor: `${c.color}35`, boxShadow: `0 8px 28px rgba(0,0,0,0.45), 0 0 16px ${c.color}15`, transform: 'translateY(-2px)' } : undefined}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="dash-card-accent" style={{ background: `linear-gradient(90deg,${c.color},transparent)`, opacity: hovered === i ? 1 : 0 }} />
                  <div className="dash-card-icon-wrap" style={{ background: `${c.color}12`, color: c.color }}>{c.icon}</div>
                  <div className="dash-card-title">{c.title}</div>
                  <div className="dash-card-desc">{c.desc}</div>
                  <div className="dash-card-footer">
                    {c.badge === 'complete' && <span className="dash-badge-ok"><svg width="7" height="7" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#c8f135" /></svg>Complete</span>}
                    {c.badge === 'incomplete' && <span className="dash-badge-warn"><svg width="7" height="7" viewBox="0 0 10 10"><circle cx="5" cy="5" r="5" fill="#f59e0b" /></svg>Pending</span>}
                    {!c.badge && <span />}
                    <button className="dash-card-link" style={{ color: c.color }} onClick={() => navigate(c.to)}>
                      {c.cta} {icons.arrow}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-sidebar">
          <div className="dash-side-card">
            <div className="dash-side-title">Upcoming</div>
            {upcoming.map((a, i) => (
              <div key={i} className="dash-appt-item" style={i === upcoming.length - 1 ? { borderBottom: 'none', marginBottom: 0, paddingBottom: 0 } : undefined}>
                <div className="dash-appt-date">
                  <div className="dash-appt-day">{a.day}</div>
                  <div className="dash-appt-num">{a.date.split(' ')[1]}</div>
                  <div className="dash-appt-month">{a.date.split(' ')[0]}</div>
                </div>
                <div className="dash-appt-body" style={{ borderLeft: `2px solid ${a.dot}` }}>
                  <div className="dash-appt-title">{a.title}</div>
                  <div className="dash-appt-sub">{a.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="dash-pulse-card" onClick={() => navigate('/chat')}>
            <div className="dash-pulse-logo">P</div>
            <div className="dash-pulse-title">Pulse AI</div>
            <div className="dash-pulse-desc">Ask about your prescriptions, symptoms, or get a quick health summary.</div>
            <button className="dash-pulse-btn">Start a Conversation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
