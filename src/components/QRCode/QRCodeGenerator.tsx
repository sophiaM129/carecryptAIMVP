import React from 'react';
import QRCode from 'qrcode.react';

interface QRCodeGeneratorProps {
    medicalData?: string;
    size?: number;
    showTitle?: boolean;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
    medicalData = "Sample medical data", 
    size = 256,
    showTitle = true 
}) => {
    return (
        <div className="qr-container">
            {showTitle && (
                <>
                    <h2>Your Medical QR Code</h2>
                    <p>This QR code contains your medical information for emergency access.</p>
                </>
            )}
            <QRCode value={medicalData} size={size} />
            {showTitle && (
                <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
                    Scan this QR code to access your medical information
                </p>
            )}
        </div>
    );
};

export default QRCodeGenerator;