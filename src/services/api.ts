import axios from 'axios';
import { User, MedicalData } from '../types';

const API_URL = 'https://your-api-url.com/api'; // Replace with your actual API URL

export const signup = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
        const response = await axios.post(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const login = async (credentials: { username: string; password: string }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const submitMedicalData = async (medicalData: MedicalData) => {
    try {
        const response = await axios.post(`${API_URL}/medical-data`, medicalData);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getMedicalData = async (userId: string) => {
    try {
        const response = await axios.get(`${API_URL}/medical-data/${userId}`);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};