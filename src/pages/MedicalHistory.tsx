import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMedicalData } from '../context/MedicalDataContext';
import './MedicalHistory.css';

const TABS = ['Personal', 'Vitals', 'Allergies', 'Conditions', 'Medications', 'Immunizations'];

const allergenOptions = ['Peanuts', 'Tree Nuts', 'Shellfish', 'Fish', 'Eggs', 'Milk', 'Soy', 'Wheat', 'Latex', 'Penicillin', 'Dust', 'Pollen'];
const medicalConditionOptions = ['Diabetes Type 1', 'Diabetes Type 2', 'Hypertension', 'Asthma', 'Heart Disease', 'Kidney Disease'];
const mentalHealthOptions = ['Depression', 'Anxiety Disorder', 'Bipolar Disorder', 'Schizophrenia'];
const immunizationOptions = ['Tetanus', 'COVID-19', 'Influenza', 'Hepatitis B'];

const ToggleSwitch: React.FC<{ isActive: boolean; onToggle: () => void; label: string }> = ({ isActive, onToggle, label }) => (
  <div className="mh-toggle-row">
    <div className={`mh-toggle-btn ${isActive ? 'active' : ''}`} onClick={onToggle} />
    <span className="mh-toggle-label">{label}</span>
  </div>
);

const CheckGrid: React.FC<{ options: string[]; selected: string[]; onToggle: (v: string) => void }> = ({ options, selected, onToggle }) => (
  <div className="mh-check-grid">
    {options.map(o => (
      <label key={o} className="mh-check-item" onClick={() => onToggle(o)}>
        <div className={`mh-checkbox ${selected.includes(o) ? 'checked' : ''}`} />
        {o}
      </label>
    ))}
  </div>
);

const MedicalHistory: React.FC = () => {
  const { medicalData, saveMedicalData } = useMedicalData();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // Personal Information
  const [fullName, setFullName] = useState(medicalData.fullName);
  const [dateOfBirth, setDateOfBirth] = useState(medicalData.dateOfBirth);
  const [gender, setGender] = useState(medicalData.gender);
  const [contactNumber, setContactNumber] = useState(medicalData.contactNumber);
  const [emailAddress, setEmailAddress] = useState(medicalData.emailAddress);
  const [emergencyContactName, setEmergencyContactName] = useState(medicalData.emergencyContactName);
  const [emergencyContactRelation, setEmergencyContactRelation] = useState(medicalData.emergencyContactRelation);
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(medicalData.emergencyContactPhone);

  // Blood & Vital Information
  const [bloodGroup, setBloodGroup] = useState(medicalData.bloodGroup);
  const [bloodPressure, setBloodPressure] = useState(medicalData.bloodPressure);
  const [height, setHeight] = useState(medicalData.height);
  const [heightUnit, setHeightUnit] = useState(medicalData.heightUnit);
  const [weight, setWeight] = useState(medicalData.weight);
  const [weightUnit, setWeightUnit] = useState(medicalData.weightUnit);

  // Allergies
  const [hasAllergies, setHasAllergies] = useState(medicalData.hasAllergies);
  const [allergens, setAllergens] = useState<string[]>(medicalData.allergens);
  const [otherAllergens, setOtherAllergens] = useState(medicalData.otherAllergens);

  // Chronic & Past Medical Conditions
  const [medicalConditions, setMedicalConditions] = useState<string[]>(medicalData.medicalConditions);
  const [otherConditions, setOtherConditions] = useState(medicalData.otherConditions);

  // Medications
  const [takingMedications, setTakingMedications] = useState(medicalData.takingMedications);
  const [medications, setMedications] = useState(
    medicalData.medications.length ? medicalData.medications : [{ name: '', dosage: '' }]
  );

  // Surgeries & Hospitalizations
  const [hasSurgeries, setHasSurgeries] = useState(medicalData.hasSurgeries);
  const [surgeries, setSurgeries] = useState(
    medicalData.surgeries.length ? medicalData.surgeries : [{ name: '', date: '', hospital: '' }]
  );

  // Mental Health History (with toggle)
  const [mentalHealthPermission, setMentalHealthPermission] = useState(medicalData.mentalHealthPermission);
  const [hasMentalHealthCondition, setHasMentalHealthCondition] = useState(medicalData.hasMentalHealthCondition);
  const [mentalHealthConditions, setMentalHealthConditions] = useState<string[]>(medicalData.mentalHealthConditions);
  const [otherMentalHealth, setOtherMentalHealth] = useState(medicalData.otherMentalHealth);

  // Infectious Diseases (with toggle)
  const [infectiousPermission, setInfectiousPermission] = useState(medicalData.infectiousPermission);
  const [hivStatus, setHivStatus] = useState(medicalData.hivStatus);
  const [hepatitis, setHepatitis] = useState(medicalData.hepatitis);
  const [tuberculosis, setTuberculosis] = useState(medicalData.tuberculosis);
  const [otherInfectious, setOtherInfectious] = useState(medicalData.otherInfectious);

  // Immunization Records
  const [immunizations, setImmunizations] = useState<string[]>(medicalData.immunizations);
  const [otherImmunizations, setOtherImmunizations] = useState(medicalData.otherImmunizations);

  const [saved, setSaved] = useState(false);

  const toggleArr = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (v: string) =>
    setter(prev => (prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]));

  const addMedication = () => setMedications([...medications, { name: '', dosage: '' }]);
  const removeMedication = (index: number) => setMedications(medications.filter((_, i) => i !== index));
  const updateMedication = (index: number, field: 'name' | 'dosage', value: string) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const addSurgery = () => setSurgeries([...surgeries, { name: '', date: '', hospital: '' }]);
  const removeSurgery = (index: number) => setSurgeries(surgeries.filter((_, i) => i !== index));
  const updateSurgery = (index: number, field: 'name' | 'date' | 'hospital', value: string) => {
    const updated = [...surgeries];
    updated[index][field] = value;
    setSurgeries(updated);
  };

  const handleSave = () => {
    saveMedicalData({
      fullName, dateOfBirth, gender, contactNumber, emailAddress,
      emergencyContactName, emergencyContactRelation, emergencyContactPhone,
      bloodGroup, bloodPressure, height, heightUnit, weight, weightUnit,
      hasAllergies, allergens, otherAllergens,
      medicalConditions, otherConditions,
      takingMedications, medications,
      hasSurgeries, surgeries,
      mentalHealthPermission, hasMentalHealthCondition,
      mentalHealthConditions, otherMentalHealth,
      infectiousPermission, hivStatus, hepatitis, tuberculosis, otherInfectious,
      immunizations, otherImmunizations,
    });
    setSaved(true);
  };

  const renderTab = () => {
    switch (tab) {
      case 0:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon">👤</div><div className="mh-section-title">Personal Information</div></div>
            <div className="mh-grid2">
              <div className="mh-field"><label className="cc-field-label" htmlFor="fullName">Full Name *</label><input className="cc-field-input" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} /></div>
              <div className="mh-field"><label className="cc-field-label" htmlFor="dob">Date of Birth *</label><input className="cc-field-input" id="dob" type="date" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} /></div>
              <div className="mh-field">
                <label className="cc-field-label" htmlFor="gender">Gender *</label>
                <select className="cc-field-select" id="gender" value={gender} onChange={e => setGender(e.target.value)}>
                  <option value="">Select</option>
                  {['Female', 'Male', 'Other', 'Prefer not to say'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="mh-field"><label className="cc-field-label" htmlFor="contact">Contact Number *</label><input className="cc-field-input" id="contact" value={contactNumber} onChange={e => setContactNumber(e.target.value)} /></div>
              <div className="mh-field"><label className="cc-field-label" htmlFor="email">Email Address</label><input className="cc-field-input" id="email" type="email" value={emailAddress} onChange={e => setEmailAddress(e.target.value)} /></div>
            </div>
            <div className="mh-section-head" style={{ marginTop: 20 }}><div className="mh-section-icon mh-icon-amber">🚨</div><div className="mh-section-title">Emergency Contact</div></div>
            <div className="mh-grid3">
              <div className="mh-field"><label className="cc-field-label" htmlFor="ecName">Name *</label><input className="cc-field-input" id="ecName" placeholder="Contact name" value={emergencyContactName} onChange={e => setEmergencyContactName(e.target.value)} /></div>
              <div className="mh-field"><label className="cc-field-label" htmlFor="ecRel">Relation *</label><input className="cc-field-input" id="ecRel" placeholder="e.g. Spouse, Parent" value={emergencyContactRelation} onChange={e => setEmergencyContactRelation(e.target.value)} /></div>
              <div className="mh-field"><label className="cc-field-label" htmlFor="ecPhone">Phone *</label><input className="cc-field-input" id="ecPhone" placeholder="+91 00000 00000" value={emergencyContactPhone} onChange={e => setEmergencyContactPhone(e.target.value)} /></div>
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon">🩸</div><div className="mh-section-title">Blood & Vital Information</div></div>
            <div className="mh-grid3 mh-grid4">
              <div className="mh-field">
                <label className="cc-field-label" htmlFor="bloodGroup">Blood Group *</label>
                <select className="cc-field-select" id="bloodGroup" value={bloodGroup} onChange={e => setBloodGroup(e.target.value)}>
                  <option value="">Select</option>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="mh-field">
                <label className="cc-field-label" htmlFor="bloodPressure">Blood Pressure</label>
                <input className="cc-field-input" id="bloodPressure" value={bloodPressure} onChange={e => setBloodPressure(e.target.value)} placeholder="e.g. 120/80" />
              </div>
              <div className="mh-field">
                <label className="cc-field-label" htmlFor="height">Height *</label>
                <div className="mh-input-with-unit">
                  <input className="cc-field-input" id="height" type="number" value={height} onChange={e => setHeight(e.target.value)} />
                  <select className="cc-field-select mh-unit-select" value={heightUnit} onChange={e => setHeightUnit(e.target.value)}>
                    <option value="cm">cm</option>
                    <option value="ft">ft</option>
                  </select>
                </div>
              </div>
              <div className="mh-field">
                <label className="cc-field-label" htmlFor="weight">Weight *</label>
                <div className="mh-input-with-unit">
                  <input className="cc-field-input" id="weight" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
                  <select className="cc-field-select mh-unit-select" value={weightUnit} onChange={e => setWeightUnit(e.target.value)}>
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon mh-icon-orange">⚠️</div><div className="mh-section-title">Allergies</div></div>
            <div className="mh-radio-group">
              {['Yes', 'No'].map(v => (
                <label key={v} className="mh-radio-item">
                  <input type="radio" checked={hasAllergies === v} onChange={() => setHasAllergies(v)} /> {v}
                </label>
              ))}
            </div>
            {hasAllergies === 'Yes' && (
              <>
                <div className="cc-field-label" style={{ marginBottom: 10 }}>Select Allergens:</div>
                <CheckGrid options={allergenOptions} selected={allergens} onToggle={toggleArr(setAllergens)} />
                <div className="mh-field"><label className="cc-field-label" htmlFor="otherAllergens">Other Allergens</label><input className="cc-field-input" id="otherAllergens" value={otherAllergens} onChange={e => setOtherAllergens(e.target.value)} /></div>
              </>
            )}
          </div>
        );
      case 3:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon">🏥</div><div className="mh-section-title">Chronic & Past Conditions</div></div>
            <CheckGrid options={medicalConditionOptions} selected={medicalConditions} onToggle={toggleArr(setMedicalConditions)} />
            <div className="mh-field" style={{ marginTop: 12 }}><label className="cc-field-label" htmlFor="otherConditions">Other Conditions</label><input className="cc-field-input" id="otherConditions" value={otherConditions} onChange={e => setOtherConditions(e.target.value)} /></div>

            <div style={{ marginTop: 20 }}>
              <ToggleSwitch isActive={mentalHealthPermission} onToggle={() => setMentalHealthPermission(!mentalHealthPermission)} label="Share Mental Health History" />
              {mentalHealthPermission && (
                <div className="mh-nested">
                  <div className="mh-radio-group">
                    {['Yes', 'No'].map(v => (
                      <label key={v} className="mh-radio-item"><input type="radio" checked={hasMentalHealthCondition === v} onChange={() => setHasMentalHealthCondition(v)} /> {v}</label>
                    ))}
                  </div>
                  {hasMentalHealthCondition === 'Yes' && (
                    <>
                      <CheckGrid options={mentalHealthOptions} selected={mentalHealthConditions} onToggle={toggleArr(setMentalHealthConditions)} />
                      <div className="mh-field"><label className="cc-field-label" htmlFor="otherMentalHealth">Other</label><input className="cc-field-input" id="otherMentalHealth" value={otherMentalHealth} onChange={e => setOtherMentalHealth(e.target.value)} /></div>
                    </>
                  )}
                </div>
              )}

              <ToggleSwitch isActive={infectiousPermission} onToggle={() => setInfectiousPermission(!infectiousPermission)} label="Share Infectious Disease History" />
              {infectiousPermission && (
                <div className="mh-nested">
                  <div className="mh-grid3">
                    <div className="mh-field"><label className="cc-field-label" htmlFor="hivStatus">HIV Status</label><input className="cc-field-input" id="hivStatus" value={hivStatus} onChange={e => setHivStatus(e.target.value)} /></div>
                    <div className="mh-field"><label className="cc-field-label" htmlFor="hepatitis">Hepatitis</label><input className="cc-field-input" id="hepatitis" value={hepatitis} onChange={e => setHepatitis(e.target.value)} /></div>
                    <div className="mh-field"><label className="cc-field-label" htmlFor="tuberculosis">Tuberculosis</label><input className="cc-field-input" id="tuberculosis" value={tuberculosis} onChange={e => setTuberculosis(e.target.value)} /></div>
                  </div>
                  <div className="mh-field"><label className="cc-field-label" htmlFor="otherInfectious">Other</label><input className="cc-field-input" id="otherInfectious" value={otherInfectious} onChange={e => setOtherInfectious(e.target.value)} /></div>
                </div>
              )}
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon">💊</div><div className="mh-section-title">Current Medications</div></div>
            <div className="mh-radio-group">
              {['Yes', 'No'].map(v => (
                <label key={v} className="mh-radio-item"><input type="radio" checked={takingMedications === v} onChange={() => setTakingMedications(v)} /> {v}</label>
              ))}
            </div>
            {takingMedications === 'Yes' && (
              <>
                {medications.map((med, index) => (
                  <div key={index} className="mh-med-row">
                    <div className="mh-field"><label className="cc-field-label">Medication Name</label><input className="cc-field-input" value={med.name} onChange={e => updateMedication(index, 'name', e.target.value)} /></div>
                    <div className="mh-field"><label className="cc-field-label">Dosage</label><input className="cc-field-input" value={med.dosage} onChange={e => updateMedication(index, 'dosage', e.target.value)} placeholder="e.g. 10mg twice daily" /></div>
                    {medications.length > 1 && <button type="button" className="mh-remove-btn" onClick={() => removeMedication(index)}>Remove</button>}
                  </div>
                ))}
                <button type="button" className="mh-add-btn" onClick={addMedication}>+ Add Medication</button>
              </>
            )}

            <div className="mh-section-head" style={{ marginTop: 24 }}><div className="mh-section-icon">🏨</div><div className="mh-section-title">Surgeries & Hospitalizations</div></div>
            <div className="mh-radio-group">
              {['Yes', 'No'].map(v => (
                <label key={v} className="mh-radio-item"><input type="radio" checked={hasSurgeries === v} onChange={() => setHasSurgeries(v)} /> {v}</label>
              ))}
            </div>
            {hasSurgeries === 'Yes' && (
              <>
                {surgeries.map((s, index) => (
                  <div key={index} className="mh-med-row">
                    <div className="mh-field"><label className="cc-field-label">Procedure</label><input className="cc-field-input" value={s.name} onChange={e => updateSurgery(index, 'name', e.target.value)} /></div>
                    <div className="mh-field"><label className="cc-field-label">Date</label><input className="cc-field-input" type="date" value={s.date} onChange={e => updateSurgery(index, 'date', e.target.value)} /></div>
                    <div className="mh-field"><label className="cc-field-label">Hospital</label><input className="cc-field-input" value={s.hospital} onChange={e => updateSurgery(index, 'hospital', e.target.value)} /></div>
                    {surgeries.length > 1 && <button type="button" className="mh-remove-btn" onClick={() => removeSurgery(index)}>Remove</button>}
                  </div>
                ))}
                <button type="button" className="mh-add-btn" onClick={addSurgery}>+ Add Surgery</button>
              </>
            )}
          </div>
        );
      case 5:
        return (
          <div>
            <div className="mh-section-head"><div className="mh-section-icon">💉</div><div className="mh-section-title">Immunization Records</div></div>
            <CheckGrid options={immunizationOptions} selected={immunizations} onToggle={toggleArr(setImmunizations)} />
            <div className="mh-field" style={{ marginTop: 12 }}><label className="cc-field-label" htmlFor="otherImmunizations">Other</label><input className="cc-field-input" id="otherImmunizations" value={otherImmunizations} onChange={e => setOtherImmunizations(e.target.value)} /></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="medical-history-page">
      <div className="cc-page-header">
        <div className="cc-page-eyebrow">Health Records</div>
        <div className="cc-page-title">Medical Information</div>
        <div className="cc-page-sub">Fill once. Use forever. Your complete health profile.</div>
      </div>
      <div className="mh-wrap">
        {saved && <div className="mh-success-banner">✓ Medical information saved successfully!</div>}
        <div className="mh-tabs">
          {TABS.map((sec, i) => (
            <button key={sec} className={`mh-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{sec}</button>
          ))}
        </div>
        <div className="mh-card">
          {renderTab()}
          <div className="mh-nav-row">
            <div style={{ display: 'flex', gap: 10 }}>
              {tab > 0 && <button className="mh-btn-prev" onClick={() => setTab(t => t - 1)}>← Back</button>}
              <button className="mh-btn-prev" onClick={() => navigate('/dashboard')}>Dashboard</button>
            </div>
            {tab < TABS.length - 1 ? (
              <button className="mh-btn-next" onClick={() => setTab(t => t + 1)}>Next →</button>
            ) : (
              <button className="mh-btn-save" onClick={handleSave}>Save All Records</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;
