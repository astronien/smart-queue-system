
import React, { useRef } from 'react';
import { Customer } from '../types';
import { XIcon, PrinterIcon } from './icons';

interface PrintModalProps {
  customer: Customer;
  onClose: () => void;
}

const QueueTicket: React.FC<{ customer: Customer; copyType: string }> = ({ customer, copyType }) => (
    <div className="bg-white text-black p-4 w-72 font-mono border-2 border-dashed border-gray-400">
      <div className="text-center">
        <h3 className="text-xl font-bold">SMART QUEUE</h3>
        <p className="text-xs">--------------------------------</p>
        <p className="text-6xl font-bold my-4">{customer.queueNumber}</p>
        <p className="text-xs">--------------------------------</p>
      </div>
      <div className="text-sm space-y-1 mt-4">
        <p><strong>Name:</strong> {customer.firstName} {customer.lastName}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Date:</strong> {customer.createdAt.toLocaleDateString('th-TH')}</p>
        <p><strong>Time:</strong> {customer.createdAt.toLocaleTimeString('th-TH')}</p>
      </div>
      <div className="text-center mt-4">
        <p className="text-xs">Please wait to be called.</p>
        <p className="font-bold mt-2 text-lg">** {copyType} **</p>
      </div>
    </div>
);

const PrintModal: React.FC<PrintModalProps> = ({ customer, onClose }) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const printContents = printRef.current?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
      document.body.innerHTML = `
        <html>
          <head>
            <title>Print Ticket</title>
            <style>
              @media print {
                body { margin: 0; }
                .ticket-container { 
                  display: flex;
                  flex-direction: column;
                  gap: 2rem;
                  justify-content: center;
                  align-items: center;
                  width: 100%;
                  height: 100%;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            ${printContents}
          </body>
        </html>
      `;
      window.print();
      document.body.innerHTML = originalContents;
      // We need to reload to re-attach React listeners
      window.location.reload(); 
    }
  };


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg m-4 border border-gray-700">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">ปริ้นบัตรคิว (Print Queue Ticket)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>
        <div className="p-6">
            <p className="text-center text-gray-300 mb-4">
                นี่คือตัวอย่างบัตรคิวที่จะถูกปริ้นสำหรับลูกค้าและเจ้าหน้าที่
            </p>
             <div ref={printRef} className="print-area">
                <div className="ticket-container flex flex-col sm:flex-row justify-center items-center gap-8">
                    <QueueTicket customer={customer} copyType="สำหรับลูกค้า (Customer Copy)" />
                    <QueueTicket customer={customer} copyType="สำหรับเจ้าหน้าที่ (Staff Copy)" />
                </div>
             </div>
        </div>
        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end gap-4">
            <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
                ปิด
            </button>
            <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors">
                <PrinterIcon />
                ปริ้น
            </button>
        </div>
      </div>
    </div>
  );
};

export default PrintModal;
