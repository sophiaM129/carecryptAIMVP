import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const trustItems = ['HIPAA Compliant', 'End-to-End Encrypted', '500+ Hospital Partners', 'Aadhaar Linked', 'Available 24/7'];

const features = [
  { icon: '⚡', color: '#c8f135', title: 'Unified Timeline', desc: 'Every hospital visit, every prescription, every diagnosis — one chronological health story.' },
  { icon: '🛡️', color: '#e6b84a', title: 'Privacy First', desc: 'Redact sensitive records. Limit visibility. All permissions stay with you, always.' },
  { icon: '🚨', color: '#ff7c45', title: 'Emergency Ready', desc: 'QR code gives first responders instant access to blood type, allergies, and critical history.' },
  { icon: '🤖', color: '#c8f135', title: 'Pulse AI', desc: 'Ask about medications, symptoms, or get a plain-language summary of your health.' },
];

const steps = [
  { title: 'Sign up in minutes', desc: 'Create your CareCrypt profile with basic health details. No paperwork.' },
  { title: 'Fill in your health record', desc: 'Blood group, allergies, medications, and history — all in one guided form.' },
  { title: 'Access anywhere', desc: 'Your complete health timeline and emergency QR, available on any device, any time.' },
];

const benefitItems = [
  { icon: '📄', title: 'Good for you and the planet', desc: 'Digital, paperless, and hassle-free. No more stacks of files.' },
  { icon: '🔄', title: 'Continuity of care', desc: 'Any doctor, any visit — your full history is instantly available.' },
  { icon: '🔒', title: 'Keeping it simple', desc: 'No need to carry, maintain, or look for records ever again.' },
];

const Home: React.FC = () => {
  const { isLoggedIn, userName } = useAuth();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const initials = (userName || 'JD').split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();

  const primaryCtaTo = isLoggedIn ? '/dashboard' : '/signup';
  const primaryCtaLabel = isLoggedIn ? 'Go to Dashboard' : 'Get Started Free';

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="cc-hero">
        <div className="cc-hero-left">
          <div className="cc-hero-eyebrow">
            <span className="cc-hero-eyebrow-dot"></span>
            India's #1 Health Record Platform
          </div>
          <h1 className="cc-hero-h1">
            Own your health.
            <span className="cc-hero-h1-accent">Share it wisely.</span>
          </h1>
          <p className="cc-hero-sub">
            See your entire medical history from any hospital on one unified timeline.
            Secure, patient-controlled, and always accessible.
          </p>
          <div className="cc-hero-ctas">
            <Link to={primaryCtaTo} className="cc-cta-primary">{primaryCtaLabel}</Link>
            <Link to="/about" className="cc-cta-secondary">How it Works</Link>
          </div>
          <div className="cc-hero-stats">
            <div><span className="cc-stat-num">1M+</span><span className="cc-stat-label">Records</span></div>
            <div className="cc-stat-divider"></div>
            <div><span className="cc-stat-num">500+</span><span className="cc-stat-label">Hospitals</span></div>
            <div className="cc-stat-divider"></div>
            <div><span className="cc-stat-num">99.9%</span><span className="cc-stat-label">Uptime</span></div>
          </div>
        </div>
        <div className="cc-hero-right">
          <img src="/images/doctor.jpg" alt="" className="cc-hero-right-img" />
          <div className="cc-hero-right-overlay"></div>
          <div className="cc-qr-badge">
            <span>📱</span>
            <span className="cc-qr-txt">Emergency QR Ready</span>
          </div>
          <div className="cc-float-card">
            <div className="cc-float-row">
              <div className="cc-float-avatar">{initials}</div>
              <span className="cc-float-name">{userName || 'Your Profile'}</span>
            </div>
            <div className="cc-float-status">
              <span className="cc-float-dot"></span>
              <span className="cc-float-status-txt">Record synced</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <div className="cc-trustbar">
        <div className="cc-trustbar-track">
          {[...trustItems, ...trustItems].map((item, i) => (
            <span key={i} className="cc-trustbar-item">
              <span className="cc-trustbar-dot"></span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Features */}
      <section className="cc-features">
        <div className="cc-features-top">
          <div>
            <div className="cc-eyebrow">Why CareCrypt</div>
            <h2 className="cc-h2">Built for India's<br />healthcare reality</h2>
          </div>
        </div>
        <div className="cc-features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="cc-feature-card"
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
              style={hoveredFeature === i ? { borderColor: `${f.color}44` } : undefined}
            >
              <div className="cc-feature-icon" style={{ background: `${f.color}10`, borderColor: `${f.color}28`, color: f.color }}>{f.icon}</div>
              <div className="cc-feature-num">0{i + 1}</div>
              <div className="cc-feature-title">{f.title}</div>
              <div className="cc-feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="cc-hiw">
        <div className="cc-hiw-inner">
          <div>
            <div className="cc-eyebrow cc-hiw-eyebrow">How it works</div>
            <h2 className="cc-h2" style={{ marginBottom: 24 }}>Three steps to a healthier you</h2>
            <div className="cc-accent-line"></div>
            <p className="cc-hiw-sub">No more carrying files. No more repeating your history. Just seamless, secure healthcare.</p>
          </div>
          <div>
            {steps.map((step, i) => (
              <div key={step.title} className="cc-step">
                <div className="cc-step-num">0{i + 1}</div>
                <div>
                  <div className="cc-step-title">{step.title}</div>
                  <div className="cc-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="cc-benefits">
        <div className="cc-benefits-inner">
          <div className="cc-benefits-left">
            <div>
              <div className="cc-benefits-eyebrow">Benefits</div>
              <h2 className="cc-benefits-title">How does it<br />help you</h2>
            </div>
            <div>
              <p className="cc-benefits-sub">One platform. Every hospital. A lifetime of records — always with you.</p>
              <Link to="/about" className="cc-benefits-cta">Explore features →</Link>
            </div>
          </div>
          <div className="cc-benefits-right">
            <div className="cc-benefit-items">
              {benefitItems.map(item => (
                <div key={item.title} className="cc-benefit-item">
                  <div className="cc-benefit-icon">{item.icon}</div>
                  <div>
                    <div className="cc-benefit-title">{item.title}</div>
                    <div className="cc-benefit-desc">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {!isLoggedIn && (
        <section className="cc-final-cta">
          <div className="cc-final-cta-inner">
            <h2 className="cc-h2">Ready to own your health records?</h2>
            <p className="cc-final-cta-sub">
              Join CareCrypt and get your unified health timeline, emergency QR, and AI health assistant — free.
            </p>
            <Link to="/signup" className="cc-cta-primary">Get Started Free</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
