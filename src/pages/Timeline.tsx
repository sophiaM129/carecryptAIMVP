import React, { useState } from 'react';
import './Timeline.css';

interface TimelineEvent {
  id: number;
  date: string;
  title: string;
  type: string;
  hospital: string;
  doctor: string;
  cat: string;
  color: string;
  detail: string;
}

const events: TimelineEvent[] = [
  { id: 1, date: 'Jan 15, 2024', title: 'Complete Blood Count', type: 'Lab Report', hospital: 'Apollo Hospital', doctor: 'Dr. Priya Nair', cat: 'Lab', color: '#c8f135', detail: 'Haemoglobin: 13.2 g/dL · WBC: 7,400 · Platelets: 2.1L — All within normal range' },
  { id: 2, date: 'Dec 20, 2023', title: 'Cardiology Consultation', type: 'Appointment', hospital: 'Fortis Healthcare', doctor: 'Dr. Ravi Krishnan', cat: 'Visit', color: '#e6b84a', detail: 'Routine checkup. BP: 122/78. No concerns. Follow-up in 6 months.' },
  { id: 3, date: 'Nov 5, 2023', title: 'Chest X-Ray', type: 'Imaging', hospital: 'Manipal Hospital', doctor: 'Dr. Anand Menon', cat: 'Imaging', color: '#ff7c45', detail: 'PA view — Lungs clear. No infiltrates or consolidation. Heart size normal.' },
  { id: 4, date: 'Sep 12, 2023', title: 'Appendectomy', type: 'Surgery', hospital: 'Apollo Hospital', doctor: 'Dr. Suresh Pillai', cat: 'Surgery', color: '#f43f5e', detail: 'Laparoscopic appendectomy performed successfully. Discharged in 48 hours. Full recovery.' },
  { id: 5, date: 'Aug 3, 2023', title: 'Amlodipine Prescription', type: 'Prescription', hospital: 'Fortis Healthcare', doctor: 'Dr. Ravi Krishnan', cat: 'Prescription', color: '#c8f135', detail: '5mg once daily for hypertension. Refill every 30 days.' },
  { id: 6, date: 'Jun 18, 2023', title: 'Thyroid Function Test', type: 'Lab Report', hospital: 'Thyrocare', doctor: 'Dr. Deepa Iyer', cat: 'Lab', color: '#c8f135', detail: 'TSH: 2.4 mIU/L · T3: 1.1 ng/mL · T4: 8.2 μg/dL — Normal thyroid function.' },
  { id: 7, date: 'Mar 22, 2023', title: 'COVID-19 Booster', type: 'Immunization', hospital: 'PHC Koramangala', doctor: '—', cat: 'Immunization', color: '#e6b84a', detail: 'Covishield booster dose administered. Certificate updated.' },
];

const cats = ['All', 'Lab', 'Visit', 'Imaging', 'Surgery', 'Prescription', 'Immunization'];
const catColors: Record<string, string> = { Lab: '#c8f135', Visit: '#e6b84a', Imaging: '#ff7c45', Surgery: '#f43f5e', Prescription: '#c8f135', Immunization: '#e6b84a' };

const Timeline: React.FC = () => {
  const [filter, setFilter] = useState('All');
  const [expanded, setExpanded] = useState<number | null>(null);
  const filtered = filter === 'All' ? events : events.filter(e => e.cat === filter);

  return (
    <div className="timeline-page">
      <div className="cc-page-header">
        <div className="cc-page-eyebrow">Your Health Story</div>
        <div className="cc-page-title">Medical Timeline</div>
        <div className="cc-page-sub">Every visit, test, and procedure — in one chronological view</div>
      </div>
      <div className="tl-wrap">
        <div className="tl-filter-row">
          {cats.map(c => (
            <button
              key={c}
              className="tl-filter-btn"
              style={{
                background: filter === c ? (catColors[c] || '#c8f135') : 'transparent',
                color: filter === c ? '#060504' : 'rgba(245,237,224,0.5)',
                borderColor: filter === c ? (catColors[c] || '#c8f135') : 'rgba(245,237,224,0.12)',
              }}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="tl-timeline">
          <div className="tl-line" />
          {filtered.map(ev => (
            <div key={ev.id} className="tl-event-wrap">
              <div className="tl-dot" style={{ background: `${ev.color}20`, borderColor: ev.color }} />
              <div
                className="tl-card"
                style={expanded === ev.id ? { borderColor: `${ev.color}28`, boxShadow: `0 8px 28px rgba(0,0,0,0.4), 0 0 16px ${ev.color}10` } : undefined}
                onClick={() => setExpanded(expanded === ev.id ? null : ev.id)}
              >
                <div className="tl-card-top">
                  <span className="tl-date-str">{ev.date}</span>
                  <span className="tl-cat-tag" style={{ background: `${ev.color}10`, borderColor: `${ev.color}25`, color: ev.color }}>{ev.cat}</span>
                </div>
                <div className="tl-event-title">{ev.title}</div>
                <div className="tl-event-meta">
                  <span>🏥 {ev.hospital}</span>
                  {ev.doctor !== '—' && <span>👨‍⚕️ {ev.doctor}</span>}
                  <span>📋 {ev.type}</span>
                </div>
                {expanded === ev.id && <div className="tl-detail">{ev.detail}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
