export interface User {
    id: string;
    username: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface MedicalData {
    medicalHistory: string;
    allergies: string[];
    bloodGroup: string;
    insuranceDetails: string;
}

export interface FormData {
    medicalHistory: string;
    allergies: string[];
    bloodGroup: string;
    insuranceDetails: string;
}