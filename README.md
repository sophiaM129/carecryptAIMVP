# Medical Website Frontend

This project is a medical website that allows individuals to store their medical data securely. It includes features for user authentication, medical history input, and the generation of a unique QR code for each user.

## Features

- User Sign Up and Login
- Medical History Form
- Allergies Input Form
- Blood Group Selection
- Insurance Details Form
- Unique QR Code Generation for Medical Data

## Project Structure

```
medical-website-frontend
├── public
│   └── index.html
├── src
│   ├── components
│   │   ├── Auth
│   │   │   ├── Login.tsx
│   │   │   └── Signup.tsx
│   │   ├── MedicalForm
│   │   │   ├── MedicalHistoryForm.tsx
│   │   │   ├── AllergiesForm.tsx
│   │   │   ├── BloodGroupForm.tsx
│   │   │   └── InsuranceForm.tsx
│   │   └── QRCode
│   │       └── QRCodeGenerator.tsx
│   ├── pages
│   │   ├── Home.tsx
│   │   ├── Dashboard.tsx
│   │   └── Profile.tsx
│   ├── services
│   │   └── api.ts
│   ├── types
│   │   └── index.ts
│   ├── App.tsx
│   └── index.tsx
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd medical-website-frontend
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.