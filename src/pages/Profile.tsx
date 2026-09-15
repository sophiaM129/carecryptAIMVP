import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { useAuth } from '../context/AuthContext';
import { useMedicalData } from '../context/MedicalDataContext';
import { useAppointments } from '../context/AppointmentsContext';
import { buildShareUrl } from '../utils/shareLink';
import './Profile.css';

// Fixed placeholder to match the prototype exactly — this app has no real
// ABHA (Ayushman Bharat Health Account) integration, so this is not
// generated per-user; it's the same demo ID shown in the reference design.
const DEMO_ABHA_ID = 'ABHA-7823-4561-0032';

const Profile: React.FC = () => {
  const { userName } = useAuth();
  const { medicalData, hasSavedData } = useMedicalData();
  const { latestUpcoming } = useAppointments();
  const [avatarHovered, setAvatarHovered] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const displayName = medicalData.fullName || userName || 'Your Profile';
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const shareUrl = buildShareUrl({
    name: displayName,
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

  const sections = [
    {
      title: '👤 Personal Details',
      fields: [
        ['Full Name', displayName],
        ['Date of Birth', medicalData.dateOfBirth || '—'],
        ['Gender', medicalData.gender || '—'],
        ['ABHA ID', DEMO_ABHA_ID],
      ],
    },
    {
      title: '🩸 Health Vitals',
      fields: [
        ['Blood Group', medicalData.bloodGroup || '—'],
        ['Height', medicalData.height ? `${medicalData.height} ${medicalData.heightUnit}` : '—'],
        ['Weight', medicalData.weight ? `${medicalData.weight} ${medicalData.weightUnit}` : '—'],
        ['Last Updated', medicalData.updatedAt ? new Date(medicalData.updatedAt).toLocaleDateString() : '—'],
      ],
    },
    {
      title: '📞 Contact',
      fields: [
        ['Phone', medicalData.contactNumber || '—'],
        ['Email', medicalData.emailAddress || '—'],
      ],
    },
  ];

  return (
    <div className="profile-page">
      <div className="cc-page-header">
        <div className="cc-page-eyebrow">Account</div>
        <div className="cc-page-title">My Profile</div>
        <div className="cc-page-sub">Your personal health identity on CareCrypt</div>
      </div>

      <div className="profile-wrap">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div
              className="avatar-hover-wrap"
              onMouseEnter={() => setAvatarHovered(true)}
              onMouseLeave={() => setAvatarHovered(false)}
              onClick={() => setQrModalOpen(true)}
            >
              <div className="avatar-ring">{initial}</div>
              {avatarHovered && (
                <div className="avatar-qr-popup">
                  <div className="avatar-qr-popup-title">Health Card QR</div>
                  <div className="avatar-qr-popup-canvas">
                    <QRCodeCanvas value={shareUrl} size={140} level="M" />
                  </div>
                  <div className="avatar-qr-popup-caption">{displayName} · Click to expand</div>
                </div>
              )}
            </div>
            <div className="profile-name">{displayName}</div>
            <div className="profile-abha">{DEMO_ABHA_ID}</div>
            <div className="profile-quick-stats">
              <div className="qstat"><div className="qstat-val">{medicalData.bloodGroup || '—'}</div><div className="qstat-label">Blood</div></div>
              <div className="qstat"><div className="qstat-val" style={{ color: 'var(--cc-gold)' }}>{medicalData.allergens.length}</div><div className="qstat-label">Allergies</div></div>
              <div className="qstat"><div className="qstat-val">{medicalData.medicalConditions.length}</div><div className="qstat-label">Conditions</div></div>
            </div>
            <Link to="/medical-history" className="profile-edit-btn">Edit Profile</Link>
          </div>

          {!hasSavedData && (
            <div className="profile-empty-note">
              You haven't filled in your Medical History yet — your Health Card QR won't have much to share until you do.
            </div>
          )}
        </div>

        <div className="profile-main">
          {sections.map(sec => (
            <div key={sec.title} className="profile-section">
              <div className="profile-section-head">
                <div className="profile-section-title">{sec.title}</div>
                <Link to="/medical-history" className="profile-edit-sm-btn">Edit</Link>
              </div>
              <div className="profile-info-grid">
                {sec.fields.map(([l, v]) => (
                  <div key={l} className="profile-info-item">
                    <span className="profile-info-label">{l}</span>
                    <span className="profile-info-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {qrModalOpen && (
        <div className="qr-modal-overlay" onClick={() => setQrModalOpen(false)}>
          <div className="qr-modal-card" onClick={e => e.stopPropagation()}>
            <button className="qr-modal-close" onClick={() => setQrModalOpen(false)}>✕</button>
            <div className="qr-modal-title">Share My Health Card</div>
            <div className="qr-modal-sub">Scan to instantly receive appointment details and vitals — like Google Pay</div>
            <div className="qr-modal-canvas">
              <QRCodeCanvas value={shareUrl} size={260} level="M" includeMargin />
            </div>
            <div className="qr-modal-caption">{displayName} · {DEMO_ABHA_ID}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
