import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

const mockMessagesCreate = jest.fn();
jest.mock('@anthropic-ai/sdk', () => {
  class MockAnthropic {
    messages = { create: mockMessagesCreate };
  }
  return { __esModule: true, default: MockAnthropic };
});

import { AuthProvider } from './context/AuthContext';

beforeEach(() => {
  localStorage.clear();
});
import { MedicalDataProvider } from './context/MedicalDataContext';
import { VaultProvider } from './context/VaultContext';
import { AppointmentsProvider } from './context/AppointmentsContext';
import Navbar from './components/Navbar';
import App from './App';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Dashboard from './pages/Dashboard';
import MedicalHistory from './pages/MedicalHistory';
import QRCodePage from './pages/QRCode';
import TimelinePage from './pages/Timeline';
import VaultPage from './pages/Vault';
import PulseAIPage from './pages/PulseAI';
import Home from './pages/Home';
import Footer from './components/Footer';
import Profile from './pages/Profile';
import Insurance from './pages/Insurance';
import About from './pages/About';
import Appointments from './pages/Appointments';
import SharePage from './pages/Share';
import { encodeShareData } from './utils/shareLink';

test('App mounts on the home route without crashing and shows the navbar', () => {
  render(<App />);
  expect(screen.getAllByText('CareCrypt AI').length).toBeGreaterThan(0);
});

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <MedicalDataProvider>
          <VaultProvider>
            <AppointmentsProvider>{ui}</AppointmentsProvider>
          </VaultProvider>
        </MedicalDataProvider>
      </AuthProvider>
    </MemoryRouter>
  );

test('Login rejects empty submission with an error, not a crash', () => {
  renderWithProviders(<Login />);
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(screen.getByText('Please fill in all fields')).toBeInTheDocument();
});

test('Login with valid fields signs the user in', () => {
  localStorage.clear();
  renderWithProviders(<Login />);
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jordan@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter2' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  expect(localStorage.getItem('cc_auth')).toBe('true');
  localStorage.clear();
});

test('Signup rejects incomplete submission with an error, not a crash', () => {
  renderWithProviders(<Signup />);
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jordan Doe' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
});

test('Signup with all fields signs the user in under their name', () => {
  localStorage.clear();
  renderWithProviders(<Signup />);
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jordan Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jordan@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter2' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));
  expect(localStorage.getItem('cc_auth')).toBe('true');
  expect(localStorage.getItem('cc_user_name')).toBe('Jordan Doe');
  localStorage.clear();
});

test('Dashboard shows the exact prototype greeting and stats', () => {
  renderWithProviders(<Dashboard />);
  expect(screen.getByText('Good morning, John 👋')).toBeInTheDocument();
  expect(screen.getByText('Blood Type')).toBeInTheDocument();
  expect(screen.getByText('Allergies')).toBeInTheDocument();
  expect(screen.getByText('67%')).toBeInTheDocument();
});

test('Dashboard renders all module cards, and clicking one navigates to the real page', () => {
  localStorage.setItem('cc_auth', 'true');
  window.history.pushState({}, '', '/dashboard');
  render(<App />);

  expect(screen.getAllByText('Medical History').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Insurance').length).toBeGreaterThan(0);
  expect(screen.getByText('Appointments')).toBeInTheDocument();
  expect(screen.getAllByText('Document Vault').length).toBeGreaterThan(0);
  expect(screen.getByText('Emergency mode')).toBeInTheDocument();
  expect(screen.getByText('Medical Timeline')).toBeInTheDocument();

  fireEvent.click(screen.getByText('View Records'));
  expect(screen.getByText('Fill once. Use forever. Your complete health profile.')).toBeInTheDocument();
  localStorage.clear();
});

test('Dashboard has a working Pulse AI promo that navigates to chat', () => {
  localStorage.setItem('cc_auth', 'true');
  window.history.pushState({}, '', '/dashboard');
  render(<App />);

  fireEvent.click(screen.getByText('Start a Conversation'));
  expect(screen.getByText('● Live')).toBeInTheDocument();
  expect(screen.getByText(/I'm Pulse AI/)).toBeInTheDocument();
  localStorage.clear();
});

test('End-to-end: signing up from the real App reaches the profile page and unlocks Dashboard nav', () => {
  localStorage.clear();
  window.history.pushState({}, '', '/signup');
  render(<App />);

  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'Jordan Doe' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'jordan@example.com' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'hunter2' } });
  fireEvent.click(screen.getByRole('button', { name: /create account/i }));

  // Post-signup redirect target, and Dashboard now visible in the navbar
  expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  localStorage.clear();
});

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    </MemoryRouter>
  );

test('Navbar renders brand, Home, and About Us when logged out, without Dashboard/Pulse AI', () => {
  renderNavbar();
  expect(screen.getByText('CareCrypt AI')).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('About Us')).toBeInTheDocument();
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  expect(screen.queryByText('Pulse AI')).not.toBeInTheDocument();
});

test('Navbar shows Dashboard and Pulse AI only when logged in', () => {
  localStorage.setItem('cc_auth', 'true');
  renderNavbar();
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('Pulse AI')).toBeInTheDocument();
  localStorage.clear();
});

test('Navbar shows Sign Up / Login when logged out', () => {
  renderNavbar();
  expect(screen.getByText('Sign Up')).toBeInTheDocument();
  expect(screen.getByText('Login')).toBeInTheDocument();
});

test('Navbar dropdown opens and logout works', () => {
  localStorage.setItem('cc_auth', 'true');
  localStorage.setItem('cc_user_name', 'Jordan Doe');
  renderNavbar();

  // Logged-in chip should show instead of Sign Up / Login
  expect(screen.queryByText('Sign Up')).not.toBeInTheDocument();
  const chip = screen.getByText('Jordan Doe');
  expect(chip).toBeInTheDocument();

  fireEvent.click(chip);
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Logout'));
  expect(screen.getByText('Login')).toBeInTheDocument();

  localStorage.clear();
});

test('Medical History renders all six tabs and switches between them', () => {
  localStorage.clear();
  renderWithProviders(<MedicalHistory />);
  expect(screen.getByText('Personal Information')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Vitals' }));
  expect(screen.getByText('Blood & Vital Information')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Allergies' }));
  expect(document.querySelector('.mh-section-title')?.textContent).toBe('Allergies');

  fireEvent.click(screen.getByRole('button', { name: 'Conditions' }));
  expect(screen.getByText('Chronic & Past Conditions')).toBeInTheDocument();
  expect(screen.getByText('Share Mental Health History')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Medications' }));
  expect(screen.getByText('Current Medications')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Immunizations' }));
  expect(screen.getByText('Immunization Records')).toBeInTheDocument();

  fireEvent.click(screen.getByText('Dashboard'));
});

test('Height and Weight inputs accept real numeric input on the Vitals tab', () => {
  localStorage.clear();
  renderWithProviders(<MedicalHistory />);
  fireEvent.click(screen.getByRole('button', { name: 'Vitals' }));

  const heightInput = screen.getByLabelText(/Height/) as HTMLInputElement;
  const weightInput = screen.getByLabelText(/Weight/) as HTMLInputElement;

  fireEvent.change(heightInput, { target: { value: '178' } });
  fireEvent.change(weightInput, { target: { value: '72' } });

  expect(heightInput.value).toBe('178');
  expect(weightInput.value).toBe('72');

  // Unit dropdowns are also interactive
  const unitSelects = document.querySelectorAll('.mh-unit-select') as NodeListOf<HTMLSelectElement>;
  fireEvent.change(unitSelects[0], { target: { value: 'ft' } });
  fireEvent.change(unitSelects[1], { target: { value: 'lbs' } });
  expect(unitSelects[0].value).toBe('ft');
  expect(unitSelects[1].value).toBe('lbs');
});

test('Submitting required fields saves data into the shared MedicalDataContext', async () => {
  localStorage.clear();
  renderWithProviders(<MedicalHistory />);

  fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Jordan Doe' } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/), { target: { value: '1990-05-12' } });
  fireEvent.change(screen.getByLabelText(/Gender/), { target: { value: 'Female' } });
  fireEvent.change(screen.getByLabelText(/Contact Number/), { target: { value: '+91 90000 00000' } });

  for (let i = 0; i < 5; i++) {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Save All Records' }));

  await screen.findByText('✓ Medical information saved successfully!');

  const stored = JSON.parse(localStorage.getItem('cc_medical_data') || '{}');
  expect(stored.fullName).toBe('Jordan Doe');
  expect(stored.gender).toBe('Female');
  expect(stored.updatedAt).not.toBeNull();
  localStorage.clear();
}, 10000);

test('MedicalDataProvider persists saved data across a remount (simulating navigating to another page and back)', async () => {
  localStorage.clear();
  const { unmount } = renderWithProviders(<MedicalHistory />);

  fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: 'Priya Shah' } });
  fireEvent.change(screen.getByLabelText(/Date of Birth/), { target: { value: '1995-02-02' } });
  fireEvent.change(screen.getByLabelText(/Gender/), { target: { value: 'Female' } });
  fireEvent.change(screen.getByLabelText(/Contact Number/), { target: { value: '+91 90000 11111' } });
  for (let i = 0; i < 5; i++) {
    fireEvent.click(screen.getByRole('button', { name: /Next/ }));
  }
  fireEvent.click(screen.getByRole('button', { name: 'Save All Records' }));
  await screen.findByText('✓ Medical information saved successfully!');
  unmount();

  // Remount fresh — MedicalDataProvider re-reads from localStorage
  renderWithProviders(<MedicalHistory />);
  expect(screen.getByLabelText(/Full Name/)).toHaveValue('Priya Shah');
  localStorage.clear();
}, 10000);

test('QR Code page prompts to fill Medical History first when no data is saved', () => {
  localStorage.clear();
  const { unmount } = renderWithProviders(<QRCodePage />);
  expect(screen.getByText('No medical information on file yet')).toBeInTheDocument();
  const fillLink = screen.getByText('Fill Medical History').closest('a');
  expect(fillLink).toHaveAttribute('href', '/medical-history');
  unmount();
});

test('QR Code page (Emergency Mode) shows name, vitals, emergency contact, and an Edit link', () => {
  localStorage.clear();
  localStorage.setItem('cc_medical_data', JSON.stringify({
    fullName: 'Jordan Doe', bloodGroup: 'O-', height: '178', heightUnit: 'cm', weight: '72', weightUnit: 'kg',
    emergencyContactName: 'Alex Doe', emergencyContactRelation: 'Spouse', emergencyContactPhone: '+91 90000 00000',
    allergens: ['Peanuts', 'Penicillin'], medicalConditions: ['Hypertension'],
    updatedAt: new Date().toISOString(),
  }));
  const { unmount } = renderWithProviders(<QRCodePage />);

  expect(screen.queryByText('No medical information on file yet')).not.toBeInTheDocument();
  expect(screen.getByText('Jordan Doe')).toBeInTheDocument();
  expect(screen.getByText('O-')).toBeInTheDocument();
  expect(screen.getByText('178 cm')).toBeInTheDocument();
  expect(screen.getByText('72 kg')).toBeInTheDocument();
  expect(screen.getByText(/Alex Doe \(Spouse\)/)).toBeInTheDocument();
  expect(screen.getByText('Edit').closest('a')).toHaveAttribute('href', '/medical-history');

  // A real <canvas> QR code should be rendered (not a screenshot/placeholder)
  const canvas = document.querySelector('.qr-code-wrap canvas');
  expect(canvas).toBeInTheDocument();
  unmount();
  localStorage.clear();
});

test('QR Code Refresh button resets the countdown timer', () => {
  jest.useFakeTimers();
  localStorage.clear();
  localStorage.setItem('cc_medical_data', JSON.stringify({
    fullName: 'Jordan Doe', bloodGroup: 'O-', allergens: [], medicalConditions: [],
    updatedAt: new Date().toISOString(),
  }));
  const { unmount } = renderWithProviders(<QRCodePage />);

  const timerEl = () => document.querySelector('.qr-timer-val');
  expect(timerEl()?.textContent).toBe('60:00');

  fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
  // Advance 10 seconds — should still read close to a fresh countdown, not accumulate
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(timerEl()?.textContent).toBe('59:50');

  unmount();
  jest.useRealTimers();
  localStorage.clear();
});

test('QR Code Download PNG triggers a real canvas image download', () => {
  localStorage.clear();
  localStorage.setItem('cc_medical_data', JSON.stringify({
    fullName: 'Jordan Doe', bloodGroup: 'O-', allergens: [], medicalConditions: [],
    updatedAt: new Date().toISOString(),
  }));
  const { unmount } = renderWithProviders(<QRCodePage />);

  const toDataURLSpy = jest
    .spyOn(HTMLCanvasElement.prototype, 'toDataURL')
    .mockReturnValue('data:image/png;base64,FAKE');
  const clickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});

  fireEvent.click(screen.getByRole('button', { name: /download png/i }));

  expect(toDataURLSpy).toHaveBeenCalledWith('image/png');
  expect(clickSpy).toHaveBeenCalled();

  toDataURLSpy.mockRestore();
  clickSpy.mockRestore();
  unmount();
  localStorage.clear();
});

test('Timeline renders the exact prototype events and filter categories', () => {
  renderWithProviders(<TimelinePage />);
  expect(screen.getByText('Complete Blood Count')).toBeInTheDocument();
  expect(screen.getByText('Cardiology Consultation')).toBeInTheDocument();
  expect(screen.getByText('Appendectomy')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Surgery' })).toBeInTheDocument();
});

test('Timeline filter chips narrow events by category, and cards expand for detail', () => {
  renderWithProviders(<TimelinePage />);

  // Detail text hidden until expanded
  expect(screen.queryByText(/Laparoscopic appendectomy/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByText('Appendectomy'));
  expect(screen.getByText(/Laparoscopic appendectomy/)).toBeInTheDocument();

  // Filtering to Lab hides the surgery event
  fireEvent.click(screen.getByRole('button', { name: 'Lab' }));
  expect(screen.getByText('Complete Blood Count')).toBeInTheDocument();
  expect(screen.queryByText('Appendectomy')).not.toBeInTheDocument();
});

describe('Pulse AI', () => {
  const ORIGINAL_ENV = process.env.REACT_APP_ANTHROPIC_API_KEY;

  beforeEach(() => {
    mockMessagesCreate.mockReset();
  });

  afterEach(() => {
    if (ORIGINAL_ENV === undefined) {
      delete process.env.REACT_APP_ANTHROPIC_API_KEY;
    } else {
      process.env.REACT_APP_ANTHROPIC_API_KEY = ORIGINAL_ENV;
    }
  });

  test('works fully with an honest placeholder response when no API key is configured, instead of blocking the page', async () => {
    delete process.env.REACT_APP_ANTHROPIC_API_KEY;
    renderWithProviders(<PulseAIPage />);
    expect(screen.getByText('● Live')).toBeInTheDocument();

    fireEvent.click(screen.getByText('How may I help you?'));
    await screen.findByText(/running in preview mode/);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });

  test('sends a message and renders the real AI reply when configured', async () => {
    process.env.REACT_APP_ANTHROPIC_API_KEY = 'test-key';
    mockMessagesCreate.mockResolvedValueOnce({
      content: [{ type: 'text', text: 'Mocked Pulse AI reply' }],
    });
    renderWithProviders(<PulseAIPage />);

    expect(screen.getByText('● Live')).toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText(/Type your question/), { target: { value: 'What is my blood group?' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await screen.findByText('Mocked Pulse AI reply');
    expect(screen.getByText('What is my blood group?')).toBeInTheDocument();
    expect(mockMessagesCreate).toHaveBeenCalledTimes(1);
  });

  test('shows an inline error bubble, not a crash, when the API call fails', async () => {
    process.env.REACT_APP_ANTHROPIC_API_KEY = 'test-key';
    mockMessagesCreate.mockRejectedValueOnce(new Error('Network error'));
    renderWithProviders(<PulseAIPage />);

    fireEvent.change(screen.getByPlaceholderText(/Type your question/), { target: { value: 'Hi' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    await screen.findByText('Network error');
  });

  test('quick prompts change based on whether Medical History has been filled in', () => {
    process.env.REACT_APP_ANTHROPIC_API_KEY = 'test-key';
    localStorage.clear();
    const { unmount } = renderWithProviders(<PulseAIPage />);
    expect(screen.getByText('How may I help you?')).toBeInTheDocument();
    unmount();

    localStorage.setItem('cc_medical_data', JSON.stringify({
      bloodGroup: 'O-', allergens: ['Peanuts'], medicalConditions: [], medications: [],
      immunizations: [], updatedAt: new Date().toISOString(),
    }));
    renderWithProviders(<PulseAIPage />);
    expect(screen.getByText('Summarize my health profile')).toBeInTheDocument();
    localStorage.clear();
  });

  test('"Please upload your prescription" gets an honest placeholder reply, not a real API call', async () => {
    process.env.REACT_APP_ANTHROPIC_API_KEY = 'test-key';
    localStorage.clear();
    renderWithProviders(<PulseAIPage />);

    fireEvent.click(screen.getByText('Please upload your prescription'));

    await screen.findByText(/File uploads aren't supported in this chat yet/);
    expect(mockMessagesCreate).not.toHaveBeenCalled();
  });
});

test('Home shows a working Get Started CTA when logged out', () => {
  renderWithProviders(<Home />);
  const ctas = screen.getAllByText('Get Started Free');
  expect(ctas.length).toBeGreaterThan(0);
  ctas.forEach(cta => expect(cta.closest('a')).toHaveAttribute('href', '/signup'));
});

test('Home CTA switches to the dashboard once logged in', () => {
  localStorage.setItem('cc_auth', 'true');
  renderWithProviders(<Home />);
  const cta = screen.getByText('Go to Dashboard');
  expect(cta.closest('a')).toHaveAttribute('href', '/dashboard');
  localStorage.clear();
});

test('Footer only shows Dashboard/Pulse AI links once logged in', () => {
  const { unmount } = renderWithProviders(<Footer />);
  expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  expect(screen.queryByText('Pulse AI')).not.toBeInTheDocument();
  unmount();

  localStorage.setItem('cc_auth', 'true');
  renderWithProviders(<Footer />);
  expect(screen.getByText('Dashboard').closest('a')).toHaveAttribute('href', '/dashboard');
  expect(screen.getByText('Pulse AI').closest('a')).toHaveAttribute('href', '/chat');
  localStorage.clear();
});

test('Profile shows the real logged-in name, not hardcoded fake data', () => {
  localStorage.setItem('cc_auth', 'true');
  localStorage.setItem('cc_user_name', 'Priya Sharma');
  renderWithProviders(<Profile />);
  expect(screen.getAllByText('Priya Sharma').length).toBeGreaterThan(0);
  expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
  localStorage.clear();
});

test('Profile reflects real saved Medical History data, and no longer shows Emergency Contact', () => {
  localStorage.setItem('cc_auth', 'true');
  localStorage.setItem('cc_user_name', 'Priya Sharma');
  localStorage.setItem('cc_medical_data', JSON.stringify({
    fullName: 'Priya Sharma', bloodGroup: 'B+', contactNumber: '9876543210',
    emergencyContactName: 'Raj Sharma', emergencyContactRelation: 'Spouse', emergencyContactPhone: '9123456780',
    allergens: [], medicalConditions: [], medications: [], immunizations: [],
    updatedAt: new Date().toISOString(),
  }));
  renderWithProviders(<Profile />);
  expect(screen.getAllByText('B+').length).toBeGreaterThan(0);
  expect(screen.getByText('9876543210')).toBeInTheDocument();
  expect(screen.queryByText(/Raj Sharma/)).not.toBeInTheDocument();
  expect(screen.queryByText('Contact & Emergency')).not.toBeInTheDocument();
  localStorage.clear();
});

test('Insurance page shows the two prototype policy cards', () => {
  renderWithProviders(<Insurance />);
  expect(screen.getByText('Primary Insurance')).toBeInTheDocument();
  expect(screen.getByText('Secondary Insurance')).toBeInTheDocument();
  expect(screen.getByText('Star Health Insurance')).toBeInTheDocument();
  expect(screen.getByText('HDFC ERGO Health')).toBeInTheDocument();
  expect(screen.getAllByText('Edit Details').length).toBe(2);
});

test('About page renders the real mission content', () => {
  renderWithProviders(<About />);
  expect(screen.getByText('Mission')).toBeInTheDocument();
  expect(screen.getByText('Emergency-Ready')).toBeInTheDocument();
});

test('Booking an appointment persists it via AppointmentsContext, for real QR sharing later', async () => {
  localStorage.clear();
  renderWithProviders(<Appointments />);

  fireEvent.change(screen.getByLabelText('Select Specialty *'), { target: { value: 'Cardiologist' } });
  fireEvent.change(screen.getByLabelText('Doctor Name *'), { target: { value: 'Dr. Robert Wilson' } });
  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  fireEvent.change(screen.getByLabelText('Preferred Date *'), { target: { value: futureDate } });
  fireEvent.change(screen.getByLabelText('Preferred Time Slot *'), { target: { value: '10:00 AM' } });
  fireEvent.click(screen.getByRole('radio', { name: /In-person Consultation/ }));

  fireEvent.click(screen.getByRole('button', { name: 'Book Appointment' }));
  await screen.findByText('Appointment booked successfully!', {}, { timeout: 3000 });

  const stored = JSON.parse(localStorage.getItem('cc_appointments') || '[]');
  expect(stored.length).toBe(1);
  expect(stored[0].doctorName).toBe('Dr. Robert Wilson');
  expect(stored[0].preferredDate).toBe(futureDate);
  localStorage.clear();
}, 10000);

test('Share page decodes a real link and shows vitals, allergies, medications, immunizations, surgeries, and the appointment — no login required', () => {
  const encoded = encodeShareData({
    name: 'Priya Sharma',
    bloodGroup: 'B+',
    bloodPressure: '120/80',
    height: '165', heightUnit: 'cm', weight: '58', weightUnit: 'kg',
    allergens: ['Peanuts', 'Penicillin'],
    medicalConditions: ['Hypertension'],
    medications: [{ name: 'Amlodipine', dosage: '5mg once daily' }],
    immunizations: ['Tetanus', 'COVID-19'],
    surgeries: [{ name: 'Appendectomy', date: '2022-03-14', hospital: 'Apollo Hospital' }],
    emergencyContactName: 'Raj Sharma',
    emergencyContactPhone: '9123456780',
    appointment: {
      specialty: 'Cardiologist', doctorName: 'Dr. Robert Wilson',
      preferredDate: '2026-10-01', preferredTime: '10:00 AM', appointmentType: 'In-person Consultation',
    },
  });
  window.location.hash = encoded;
  renderWithProviders(<SharePage />);

  expect(screen.getByText('Priya Sharma')).toBeInTheDocument();
  expect(screen.getByText('B+')).toBeInTheDocument();
  expect(screen.getByText('120/80')).toBeInTheDocument();
  expect(screen.getByText('Height:')).toBeInTheDocument();
  expect(screen.getByText('165 cm')).toBeInTheDocument();
  expect(screen.getByText('58 kg')).toBeInTheDocument();
  expect(screen.getByText('Peanuts')).toBeInTheDocument();
  expect(screen.getByText('Amlodipine · 5mg once daily')).toBeInTheDocument();
  expect(screen.getByText('Tetanus')).toBeInTheDocument();
  expect(screen.getByText('Appendectomy')).toBeInTheDocument();
  expect(screen.getByText(/2022-03-14 · Apollo Hospital/)).toBeInTheDocument();
  expect(screen.getByText(/Cardiologist · Dr. Robert Wilson/)).toBeInTheDocument();
  window.location.hash = '';
});

test('Share page shows a friendly message for a link with no data, instead of crashing', () => {
  window.location.hash = '';
  renderWithProviders(<SharePage />);
  expect(screen.getByText("This link doesn't contain any shared health data.")).toBeInTheDocument();
});

test('Profile avatar hover shows a mini QR, and clicking opens a full-screen scannable modal', () => {
  localStorage.setItem('cc_auth', 'true');
  localStorage.setItem('cc_user_name', 'Priya Sharma');
  renderWithProviders(<Profile />);

  expect(screen.queryByText('Health Card QR')).not.toBeInTheDocument();
  const avatar = screen.getByText('P');
  fireEvent.mouseEnter(avatar.parentElement!);
  expect(screen.getByText('Health Card QR')).toBeInTheDocument();

  fireEvent.click(avatar.parentElement!);
  expect(screen.getByText('Share My Health Card')).toBeInTheDocument();

  fireEvent.click(screen.getByText('✕'));
  expect(screen.queryByText('Share My Health Card')).not.toBeInTheDocument();
  localStorage.clear();
});
