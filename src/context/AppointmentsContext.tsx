import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Appointment {
  specialty: string;
  doctorName: string;
  preferredDate: string;
  preferredTime: string;
  appointmentType: string;
  bookedAt: string;
}

interface AppointmentsContextValue {
  appointments: Appointment[];
  addAppointment: (appt: Omit<Appointment, 'bookedAt'>) => void;
  latestUpcoming: Appointment | null;
}

const AppointmentsContext = createContext<AppointmentsContextValue | undefined>(undefined);

const STORAGE_KEY = 'cc_appointments';

const loadInitial = (): Appointment[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore malformed storage
  }
  return [];
};

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(loadInitial);

  const addAppointment = useCallback((appt: Omit<Appointment, 'bookedAt'>) => {
    setAppointments(prev => {
      const next = [...prev, { ...appt, bookedAt: new Date().toISOString() }];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // The soonest appointment on or after today, by preferredDate; falls back to the most recently booked.
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = appointments
    .filter(a => a.preferredDate >= todayStr)
    .sort((a, b) => a.preferredDate.localeCompare(b.preferredDate));
  const latestUpcoming = upcoming[0] || appointments[appointments.length - 1] || null;

  return (
    <AppointmentsContext.Provider value={{ appointments, addAppointment, latestUpcoming }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = (): AppointmentsContextValue => {
  const ctx = useContext(AppointmentsContext);
  if (!ctx) throw new Error('useAppointments must be used within an AppointmentsProvider');
  return ctx;
};
