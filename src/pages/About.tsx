import React from 'react';
import './About.css';

const features = [
  {
    icon: '🏥',
    title: 'Mission',
    body: "CareCrypt is building India's first interoperable health record platform, unifying patient data across hospitals. We partner with hospitals to connect their EHRs to our platform via APIs, so your entire medical history — from any hospital — lives on one timeline.",
  },
  {
    icon: '⚙️',
    title: 'Our Technology',
    body: 'CareCrypt puts patients in control: a unified health profile that shares critical data instantly in emergencies, while letting you decide exactly what doctors see — and eliminating insurance delays.',
  },
  {
    icon: '🚨',
    title: 'Emergency-Ready',
    body: "Instantly access blood group, allergies, and life-saving history via a QR code — even when families can't communicate in critical moments.",
  },
  {
    icon: '🔒',
    title: 'Your Data, Your Rules',
    body: 'Redact sensitive records (mental health, HIV status) or limit visibility to specific hospitals. All permissions stay with you, always.',
  },
];

const About: React.FC = () => {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-bg"></div>
        <div className="about-hero-content">
          <div className="about-eyebrow">About CareCrypt AI</div>
          <h1 className="about-hero-title">India's First Interoperable Health Record Platform</h1>
          <p className="about-hero-sub">Secure, unified, and patient-controlled. Your medical history, always with you.</p>
        </div>
        <div className="about-hero-img-wrap">
          <img src="/images/about1.png" alt="CareCrypt team" className="about-hero-img" />
        </div>
      </section>

      <div className="about-features">
        <h2 className="about-features-title">What We Stand For</h2>
        <div className="about-grid">
          {features.map(f => (
            <div key={f.title} className="about-card">
              <span className="about-card-icon">{f.icon}</span>
              <h3 className="about-card-title">{f.title}</h3>
              <p className="about-card-body">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default About;
