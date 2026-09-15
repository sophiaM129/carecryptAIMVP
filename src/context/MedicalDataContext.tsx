import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Medication {
  name: string;
  dosage: string;
}

export interface Surgery {
  name: string;
  date: string;
  hospital: string;
}

export interface MedicalData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  emailAddress: string;
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactPhone: string;
  bloodGroup: string;
  bloodPressure: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  hasAllergies: string;
  allergens: string[];
  otherAllergens: string;
  medicalConditions: string[];
  otherConditions: string;
  takingMedications: string;
  medications: Medication[];
  hasSurgeries: string;
  surgeries: Surgery[];
  mentalHealthPermission: boolean;
  hasMentalHealthCondition: string;
  mentalHealthConditions: string[];
  otherMentalHealth: string;
  infectiousPermission: boolean;
  hivStatus: string;
  hepatitis: string;
  tuberculosis: string;
  otherInfectious: string;
  immunizations: string[];
  otherImmunizations: string;
  updatedAt: string | null;
}

const EMPTY_MEDICAL_DATA: MedicalData = {
  fullName: '', dateOfBirth: '', gender: '', contactNumber: '', emailAddress: '',
  emergencyContactName: '', emergencyContactRelation: '', emergencyContactPhone: '',
  bloodGroup: '', bloodPressure: '', height: '', heightUnit: 'cm', weight: '', weightUnit: 'kg',
  hasAllergies: '', allergens: [], otherAllergens: '',
  medicalConditions: [], otherConditions: '',
  takingMedications: '', medications: [],
  hasSurgeries: '', surgeries: [],
  mentalHealthPermission: false, hasMentalHealthCondition: '', mentalHealthConditions: [], otherMentalHealth: '',
  infectiousPermission: false, hivStatus: '', hepatitis: '', tuberculosis: '', otherInfectious: '',
  immunizations: [], otherImmunizations: '',
  updatedAt: null,
};

interface MedicalDataContextValue {
  medicalData: MedicalData;
  hasSavedData: boolean;
  saveMedicalData: (data: Omit<MedicalData, 'updatedAt'>) => void;
}

const MedicalDataContext = createContext<MedicalDataContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_medical_data';

const loadInitial = (): MedicalData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_MEDICAL_DATA, ...JSON.parse(raw) };
  } catch {
    // ignore malformed storage, fall back to empty
  }
  return EMPTY_MEDICAL_DATA;
};

export const MedicalDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicalData, setMedicalData] = useState<MedicalData>(loadInitial);

  const saveMedicalData = useCallback((data: Omit<MedicalData, 'updatedAt'>) => {
    const next: MedicalData = { ...data, updatedAt: new Date().toISOString() };
    setMedicalData(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  return (
    <MedicalDataContext.Provider value={{ medicalData, hasSavedData: !!medicalData.updatedAt, saveMedicalData }}>
      {children}
    </MedicalDataContext.Provider>
  );
};

export const useMedicalData = (): MedicalDataContextValue => {
  const ctx = useContext(MedicalDataContext);
  if (!ctx) throw new Error('useMedicalData must be used within a MedicalDataProvider');
  return ctx;
};
