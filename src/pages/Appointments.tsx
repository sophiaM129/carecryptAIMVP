import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppointments } from '../context/AppointmentsContext';
import './Appointments.css';

const Appointments: React.FC = () => {
  const { addAppointment } = useAppointments();
  const [specialty, setSpecialty] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('');
  const [otherSpecialty, setOtherSpecialty] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const specialtyOptions = [
    'General Physician',
    'Cardiologist',
    'Neurologist',
    'Dermatologist',
    'Psychiatrist',
    'Dentist',
    'Other'
  ];

  const doctorsBySpecialty: { [key: string]: string[] } = {
    'General Physician': ['Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Emily Davis'],
    'Cardiologist': ['Dr. Robert Wilson', 'Dr. Lisa Thompson', 'Dr. James Brown'],
    'Neurologist': ['Dr. Amanda Garcia', 'Dr. David Lee', 'Dr. Jennifer White'],
    'Dermatologist': ['Dr. Christopher Martinez', 'Dr. Rachel Green', 'Dr. Kevin Adams'],
    'Psychiatrist': ['Dr. Maria Rodriguez', 'Dr. Thomas Anderson', 'Dr. Nicole Taylor'],
    'Dentist': ['Dr. Steven Clark', 'Dr. Jessica Lewis', 'Dr. Daniel Hall'],
    'Other': []
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!specialty || !doctorName || !preferredDate || !preferredTime || !appointmentType) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      // Simulate API call (no real booking backend exists)
      await new Promise(resolve => setTimeout(resolve, 1000));
      addAppointment({
        specialty: specialty === 'Other' ? otherSpecialty : specialty,
        doctorName,
        preferredDate,
        preferredTime,
        appointmentType,
      });
      setSuccess('Appointment booked successfully!');
    } catch (error: any) {
      setError(error.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="appointments-page">
      
      <div className="page-header">
        <h1>Book an Appointment</h1>
        <p>Schedule your medical consultation with our experienced healthcare professionals</p>
      </div>
        
      <div className="appointments-container">
        <div className="appointments-card">
          <form onSubmit={handleSubmit}>
            {/* Specialty Selection */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">🏥</div>
                <h3>Appointment Details</h3>
              </div>
              
              <div className="form-group">
                <label htmlFor="specialty">Select Specialty *</label>
                <select
                  id="specialty"
                  value={specialty}
                  onChange={(e) => {
                    setSpecialty(e.target.value);
                    setDoctorName(''); // Reset doctor when specialty changes
                  }}
                  required
                  disabled={loading}
                >
                  <option value="">--Select Specialty--</option>
                  {specialtyOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>

              {specialty === 'Other' && (
                <div className="form-group">
                  <label htmlFor="otherSpecialty">Specify Specialty *</label>
                  <input
                    type="text"
                    id="otherSpecialty"
                    value={otherSpecialty}
                    onChange={(e) => setOtherSpecialty(e.target.value)}
                    placeholder="Enter specialty..."
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {/* Doctor Selection */}
              <div className="form-group">
                <label htmlFor="doctorName">Doctor Name *</label>
                <select
                  id="doctorName"
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  required
                  disabled={loading || !specialty || specialty === 'Other'}
                >
                  <option value="">--Select Doctor--</option>
                  {specialty && specialty !== 'Other' && doctorsBySpecialty[specialty]?.map(doctor => (
                    <option key={doctor} value={doctor}>{doctor}</option>
                  ))}
                </select>
                {specialty === 'Other' && (
                  <p className="info-text">Please contact us directly to book an appointment for this specialty.</p>
                )}
              </div>

              {/* Date and Time Selection */}
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="preferredDate">Preferred Date *</label>
                  <input
                    type="date"
                    id="preferredDate"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    min={getMinDate()}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="preferredTime">Preferred Time Slot *</label>
                  <select
                    id="preferredTime"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                    disabled={loading}
                  >
                    <option value="">--Select Time--</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Appointment Type */}
              <div className="form-group">
                <label>Appointment Type *</label>
                <div className="radio-group">
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="In-person Consultation"
                      checked={appointmentType === 'In-person Consultation'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      disabled={loading}
                    />
                    <span className="radio-label">
                      <div className="radio-icon">👥</div>
                      <div className="radio-content">
                        <strong>In-person Consultation</strong>
                        <small>Visit our clinic for a face-to-face consultation</small>
                      </div>
                    </span>
                  </label>
                  <label className="radio-item">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="Video/Tele Consultation"
                      checked={appointmentType === 'Video/Tele Consultation'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      disabled={loading}
                    />
                    <span className="radio-label">
                      <div className="radio-icon">📹</div>
                      <div className="radio-content">
                        <strong>Video/Tele Consultation</strong>
                        <small>Connect with your doctor remotely via video call</small>
                      </div>
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">ℹ️</div>
                <h3>Important Information</h3>
              </div>
              <div className="info-box">
                <ul>
                  <li>Please arrive 15 minutes before your scheduled appointment time</li>
                  <li>Cancellations must be made at least 24 hours in advance</li>
                  <li>Emergency appointments are available for urgent medical needs</li>
                </ul>
              </div>
            </div>

            {error && <p className="error">{error}</p>}
            {success && <p className="success">{success}</p>}

            <div className="form-actions">
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
              <Link to="/dashboard" className="back-btn">Back to Dashboard</Link>
            </div>
          </form>
        </div>

        {/* Quick Contact */}
        <div className="quick-contact">
          <h3>Need Immediate Assistance?</h3>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <strong>Emergency</strong>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <div>
                <strong>Email</strong>
                <p>appointments@carecrypt.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">💬</span>
              <div>
                <strong>Live Chat</strong>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
