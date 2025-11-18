
import React from 'react';
import { XIcon } from './icons';

interface QRCodeModalProps {
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose }) => {
  // Use hash-based URL for robust client-side routing
  const registrationUrl = window.location.origin + '/#/register';
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(registrationUrl)}`;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-sm m-4 border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">รับคิวผ่าน QR Code</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>
        <div className="p-8 flex flex-col items-center justify-center text-center">
            <p className="text-gray-300 mb-4">
                ลูกค้าสามารถสแกน QR Code นี้เพื่อลงทะเบียนรับคิวได้ด้วยตนเอง
            </p>
            <div className="bg-white p-4 rounded-lg shadow-lg">
                <img src={qrCodeApiUrl} alt="Queue Registration QR Code" width="256" height="256" />
            </div>
            <p className="mt-4 text-sky-400 font-mono break-all text-sm">{registrationUrl}</p>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end">
            <button onClick={onClose} className="w-full px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
                ปิด
            </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;
