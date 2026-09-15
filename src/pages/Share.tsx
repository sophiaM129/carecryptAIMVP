import React, { useEffect, useState } from 'react';
import { decodeShareData, ShareData } from '../utils/shareLink';
import './Share.css';

const Share: React.FC = () => {
  const [data, setData] = useState<ShareData | null | undefined>(undefined);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      setData(null);
      return;
    }
    setData(decodeShareData(hash));
  }, []);

  if (data === undefined) return null;

  if (data === null) {
    return (
      <div className="share-page">
        <div className="share-card">
          <p className="share-error">This link doesn't contain any shared health data.</p>
        </div>
      </div>
    );
  }

  const initial = data.name.trim().charAt(0).toUpperCase() || '?';
  const generatedLabel = data.generatedAt
    ? new Date(data.generatedAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })
    : null;
  const telHref = data.emergencyContactPhone ? `tel:${data.emergencyContactPhone.replace(/[^\d+]/g, '')}` : null;
  const heightLabel = data.height ? `${data.height} ${data.heightUnit}` : null;
  const weightLabel = data.weight ? `${data.weight} ${data.weightUnit}` : null;

  return (
    <div className="share-page">
      <div className="share-card">
        <div className="share-topbar">
          <div className="share-brand">
            <span className="share-brand-mark">✚</span>
            <span className="share-brand-name">CareCrypt</span>
          </div>
          <div className="share-badge">🔒 Read-only Snapshot</div>
        </div>

        <div className="share-identity">
          <div className="share-avatar">{initial}</div>
          <div>
            <div className="share-name">{data.name}</div>
            {generatedLabel && <div className="share-sub">Generated {generatedLabel}</div>}
          </div>
        </div>

        <div className="share-section share-section-first">
          <div className="share-section-title">Vitals</div>
          <div className="share-vitals-row">
            <div className="share-vital-card danger">
              <div className="share-vital-icon">🩸</div>
              <div>
                <div className="share-vital-label">Blood Type</div>
                <div className="share-vital-val danger">{data.bloodGroup || '—'}</div>
              </div>
            </div>
            <div className="share-vital-card gold">
              <div className="share-vital-icon">💓</div>
              <div>
                <div className="share-vital-label">Blood Pressure</div>
                <div className="share-vital-val gold">{data.bloodPressure || '—'}</div>
              </div>
            </div>
          </div>
          {(heightLabel || weightLabel) && (
            <div className="share-hw-row">
              {heightLabel && <span className="share-hw-item">Height: <strong>{heightLabel}</strong></span>}
              {weightLabel && <span className="share-hw-item">Weight: <strong>{weightLabel}</strong></span>}
            </div>
          )}
        </div>

        <div className="share-section">
          <div className="share-section-title">
            <span className="share-section-icon warn">⚠️</span> Allergies
          </div>
          {data.allergens.length ? (
            <div className="share-tags">
              {data.allergens.map(a => <span key={a} className="share-tag warn">{a}</span>)}
            </div>
          ) : (
            <div className="share-empty">None on file</div>
          )}
        </div>

        <div className="share-section">
          <div className="share-section-title">
            <span className="share-section-icon">💊</span> Medications
          </div>
          {data.medications.length ? (
            <div className="share-tags">
              {data.medications.map((m, i) => (
                <span key={i} className="share-tag">{m.name}{m.dosage ? ` · ${m.dosage}` : ''}</span>
              ))}
            </div>
          ) : (
            <div className="share-empty">None on file</div>
          )}
        </div>

        {data.medicalConditions.length > 0 && (
          <div className="share-section">
            <div className="share-section-title">
              <span className="share-section-icon">🏥</span> Conditions
            </div>
            <div className="share-tags">
              {data.medicalConditions.map(c => <span key={c} className="share-tag">{c}</span>)}
            </div>
          </div>
        )}

        <div className="share-section">
          <div className="share-section-title">
            <span className="share-section-icon">💉</span> Immunizations
          </div>
          {data.immunizations.length ? (
            <div className="share-tags">
              {data.immunizations.map(i => <span key={i} className="share-tag">{i}</span>)}
            </div>
          ) : (
            <div className="share-empty">None on file</div>
          )}
        </div>

        {data.surgeries.length > 0 && (
          <div className="share-section">
            <div className="share-section-title">
              <span className="share-section-icon">🏨</span> Surgeries & Hospitalizations
            </div>
            {data.surgeries.map((s, i) => (
              <div key={i} className="share-surgery-row">
                <span className="share-surgery-name">{s.name}</span>
                <span className="share-surgery-meta">{s.date}{s.hospital ? ` · ${s.hospital}` : ''}</span>
              </div>
            ))}
          </div>
        )}

        <div className="share-section">
          <div className="share-section-title">
            <span className="share-section-icon">📞</span> Emergency Contact
          </div>
          {data.emergencyContactName ? (
            <div className="share-contact-card">
              <div>
                <div className="share-contact-name">{data.emergencyContactName}</div>
                {data.emergencyContactPhone && <div className="share-contact-phone">{data.emergencyContactPhone}</div>}
              </div>
              {telHref && <a href={telHref} className="share-call-btn">Call</a>}
            </div>
          ) : (
            <div className="share-empty">None on file</div>
          )}
        </div>

        <div className="share-section">
          <div className="share-section-title">
            <span className="share-section-icon">🗓️</span> Appointment
          </div>
          {data.appointment ? (
            <div className="share-appt-card">
              <div className="share-appt-title">{data.appointment.specialty} · {data.appointment.doctorName}</div>
              <div className="share-appt-meta">{data.appointment.preferredDate} at {data.appointment.preferredTime} · {data.appointment.appointmentType}</div>
            </div>
          ) : (
            <div className="share-empty">No upcoming appointment on file</div>
          )}
        </div>

        <p className="share-footnote">
          This snapshot was encoded directly into the link at the moment it was generated — it isn't live and won't
          update if the patient's records change later.
        </p>
      </div>
    </div>
  );
};

export default Share;
