import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { MedicalDataProvider } from './context/MedicalDataContext';
import { VaultProvider } from './context/VaultContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './theme.css';
import Home from './pages/Home';
import About from './pages/About';
import Dashboard from './pages/Dashboard';
import MedicalHistory from './pages/MedicalHistory';
import Appointments from './pages/Appointments';
import Insurance from './pages/Insurance';
import Profile from './pages/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import QRCodePage from './pages/QRCode';
import TimelinePage from './pages/Timeline';
import VaultPage from './pages/Vault';
import PulseAIPage from './pages/PulseAI';
import SharePage from './pages/Share';

const App: React.FC = () => {
  return (
    <AuthProvider>
    <MedicalDataProvider>
    <VaultProvider>
    <AppointmentsProvider>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/medical-history" element={<MedicalHistory />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/qr-code" element={<QRCodePage />} />
        <Route path="/vault" element={<VaultPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/chat" element={<PulseAIPage />} />
        <Route path="/share" element={<SharePage />} />
      </Routes>
      <Footer />
    </Router>
    </AppointmentsProvider>
    </VaultProvider>
    </MedicalDataProvider>
    </AuthProvider>
  );
};

export default App;