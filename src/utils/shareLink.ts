// Encodes a read-only health snapshot directly into a URL fragment, so the
// /share page can decode and display it with no backend and no login —
// anyone who opens the link (e.g. by scanning the QR) sees it immediately.

export interface ShareAppointment {
  specialty: string;
  doctorName: string;
  preferredDate: string;
  preferredTime: string;
  appointmentType: string;
}

export interface ShareMedication {
  name: string;
  dosage: string;
}

export interface ShareSurgery {
  name: string;
  date: string;
  hospital: string;
}

export interface ShareData {
  name: string;
  bloodGroup: string;
  bloodPressure: string;
  height: string;
  heightUnit: string;
  weight: string;
  weightUnit: string;
  allergens: string[];
  medicalConditions: string[];
  medications: ShareMedication[];
  immunizations: string[];
  surgeries: ShareSurgery[];
  emergencyContactName: string;
  emergencyContactPhone: string;
  appointment: ShareAppointment | null;
  generatedAt?: string;
}

export const encodeShareData = (data: ShareData): string => {
  const json = JSON.stringify({ ...data, generatedAt: data.generatedAt || new Date().toISOString() });
  return btoa(unescape(encodeURIComponent(json)));
};

export const decodeShareData = (encoded: string): ShareData | null => {
  try {
    const json = decodeURIComponent(escape(atob(encoded)));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const buildShareUrl = (data: ShareData): string => {
  return `${window.location.origin}/share#${encodeShareData(data)}`;
};
