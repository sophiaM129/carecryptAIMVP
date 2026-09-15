import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useMedicalData } from '../context/MedicalDataContext';
import { useAppointments } from '../context/AppointmentsContext';
import { buildShareUrl } from '../utils/shareLink';
import './QRCode.css';

const START_SECONDS = 3600; // 60:00, matches the "refreshes hourly" copy below

const QRCodePage: React.FC = () => {
  const { userName } = useAuth();
  const { medicalData, hasSavedData } = useMedicalData();
  const { latestUpcoming } = useAppointments();
  const [timeLeft, setTimeLeft] = useState(START_SECONDS);
  const qrWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setTimeLeft(x => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const secs = String(timeLeft % 60).padStart(2, '0');
  const isExpiring = timeLeft < 300;
  const isExpired = timeLeft === 0;
  const timerColor = isExpired ? '#ff4f4f' : isExpiring ? 'var(--cc-gold)' : 'var(--cc-accent)';

  const name = userName || medicalData.fullName || 'Your Name';
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'JD';

  const qrPayload = useMemo(() => {
    return buildShareUrl({
      name,
      bloodGroup: medicalData.bloodGroup,
      bloodPressure: medicalData.bloodPressure,
      height: medicalData.height,
      heightUnit: medicalData.heightUnit,
      weight: medicalData.weight,
      weightUnit: medicalData.weightUnit,
      allergens: medicalData.allergens,
      medicalConditions: medicalData.medicalConditions,
      medications: medicalData.medications,
      immunizations: medicalData.immunizations,
      surgeries: medicalData.surgeries,
      emergencyContactName: medicalData.emergencyContactName,
      emergencyContactPhone: medicalData.emergencyContactPhone,
      appointment: latestUpcoming
        ? {
            specialty: latestUpcoming.specialty,
            doctorName: latestUpcoming.doctorName,
            preferredDate: latestUpcoming.preferredDate,
            preferredTime: latestUpcoming.preferredTime,
            appointmentType: latestUpcoming.appointmentType,
          }
        : null,
    });
  }, [name, medicalData, latestUpcoming]);

  const handleRefresh = () => setTimeLeft(START_SECONDS);

  const handleDownload = () => {
    const canvas = qrWrapRef.current?.querySelector('canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carecrypt-emergency-qr.png';
    a.click();
  };

  const handlePrint = () => window.print();

  return (
    <div className="qr-page">
      <div className="qr-page-header">
        <div className="qr-page-eyebrow">Emergency Access</div>
        <div className="qr-page-title">Emergency Mode</div>
        <div className="qr-page-sub">Basic vitals and emergency contact, ready for instant first-responder access</div>
      </div>

      <div className="qr-wrap">
        <div className="qr-card">
          <div className="qr-top-accent"></div>

          <div className="qr-profile-card">
            <div className="qr-avatar">{initials}</div>
            <div className="qr-profile-main">
              <div className="qr-profile-top-row">
                <div className="qr-profile-name">{name}</div>
                <Link to="/medical-history" className="qr-edit-link">Edit</Link>
              </div>
              <div className="qr-profile-stats">
                <span className="qr-stat">Blood: <span className="qr-stat-val">{medicalData.bloodGroup || '—'}</span></span>
                <span className="qr-stat">Height: <span className="qr-stat-val">{medicalData.height ? `${medicalData.height} ${medicalData.heightUnit}` : '—'}</span></span>
                <span className="qr-stat">Weight: <span className="qr-stat-val">{medicalData.weight ? `${medicalData.weight} ${medicalData.weightUnit}` : '—'}</span></span>
              </div>
              <div className="qr-emergency-row">
                <span className="qr-emergency-label">Emergency Contact</span>
                <span className="qr-emergency-val">
                  {medicalData.emergencyContactName
                    ? `${medicalData.emergencyContactName} (${medicalData.emergencyContactRelation}) · ${medicalData.emergencyContactPhone}`
                    : '—'}
                </span>
              </div>
            </div>
          </div>

          {!hasSavedData ? (
            <div className="qr-empty-state">
              <div className="qr-empty-icon">📋</div>
              <div className="qr-empty-title">No medical information on file yet</div>
              <div className="qr-empty-body">
                We'll still generate a code, but it won't have much to show hospital staff.
                Fill in your Medical History for a QR that's actually useful in an emergency.
              </div>
              <Link to="/medical-history" className="qr-btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>
                Fill Medical History
              </Link>
            </div>
          ) : isExpired ? (
            <div className="qr-empty-state">
              <div className="qr-expired-icon">⏱️</div>
              <div className="qr-expired-title">QR Code Expired</div>
              <div className="qr-expired-body">Generate a new code to continue emergency access.</div>
              <button className="qr-btn-primary" onClick={handleRefresh}>Generate New QR Code</button>
            </div>
          ) : (
            <>
              <div className="qr-code-wrap" ref={qrWrapRef}>
                <QRCodeCanvas value={qrPayload} size={220} level="M" includeMargin />
              </div>
              <div className="qr-timer-row">
                <span className="qr-timer-label">Expires in</span>
                <span className="qr-timer-val" style={{ color: timerColor }}>{mins}:{secs}</span>
              </div>
              <div className="qr-actions">
                <button className="qr-btn-primary" onClick={handleRefresh}>↻ Refresh</button>
                <button className="qr-btn-secondary" onClick={handleDownload}>⬇ Download PNG</button>
                <button className="qr-btn-secondary" onClick={handlePrint}>🖨 Print</button>
              </div>
            </>
          )}

          <div className="qr-info-box">
            <strong>How it works:</strong> Scanning this QR opens a read-only page showing your blood type,
            allergies, emergency contact, and next appointment — encoded directly into the link, no login required.
            Refresh to update it with your latest saved information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodePage;
