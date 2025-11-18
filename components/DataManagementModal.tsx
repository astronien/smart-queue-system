// Data Management Modal - Backup, Restore, Export

import React, { useRef } from 'react';
import { Customer } from '../types';
import { StorageManager, BackupData } from '../utils/storage';
import { NotificationManager } from '../utils/notifications';
import { XIcon } from './icons';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const DataManagementModal: React.FC<DataManagementModalProps> = ({ isOpen, onClose, customers }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportBackup = () => {
    StorageManager.downloadBackup();
    NotificationManager.showToast('ส่งออกข้อมูลสำเร็จ', 'success');
    NotificationManager.playSound('success');
  };

  const handleExportCSV = () => {
    StorageManager.downloadCSV(customers);
    NotificationManager.showToast('ส่งออก CSV สำเร็จ', 'success');
    NotificationManager.playSound('success');
  };

  const handleImportBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data: BackupData = JSON.parse(event.target?.result as string);
        const success = StorageManager.importData(data);
        
        if (success) {
          NotificationManager.showToast('นำเข้าข้อมูลสำเร็จ', 'success');
          NotificationManager.playSound('success');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          NotificationManager.showToast('นำเข้าข้อมูลล้มเหลว', 'error');
          NotificationManager.playSound('warning');
        }
      } catch (e) {
        NotificationManager.showToast('ไฟล์ไม่ถูกต้อง', 'error');
        NotificationManager.playSound('warning');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      StorageManager.clearAllData();
      NotificationManager.showToast('ลบข้อมูลทั้งหมดแล้ว', 'info');
      NotificationManager.playSound('info');
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const storageUsage = StorageManager.getStorageUsage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">💾 จัดการข้อมูล</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Storage Usage */}
          <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">พื้นที่จัดเก็บข้อมูล</h3>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full transition-all"
                style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-2">
              ใช้ไป {(storageUsage.used / 1024).toFixed(2)} KB / {(storageUsage.total / 1024).toFixed(0)} KB
              ({storageUsage.percentage.toFixed(1)}%)
            </p>
          </div>

          {/* Export Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">ส่งออกข้อมูล (Export)</h3>
            <button
              onClick={handleExportBackup}
              className="w-full px-4 py-3 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors"
            >
              📦 ส่งออกข้อมูลสำรอง (JSON)
            </button>
            <button
              onClick={handleExportCSV}
              className="w-full px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-colors"
            >
              📊 ส่งออกรายงาน (CSV)
            </button>
          </div>

          {/* Import Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white">นำเข้าข้อมูล (Import)</h3>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={handleImportBackup}
              className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-500 transition-colors"
            >
              📥 นำเข้าข้อมูลสำรอง
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-red-400 mb-2">⚠️ Danger Zone</h3>
            <p className="text-sm text-gray-300 mb-3">
              การลบข้อมูลทั้งหมดจะไม่สามารถกู้คืนได้ กรุณาสำรองข้อมูลก่อน
            </p>
            <button
              onClick={handleClearData}
              className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors"
            >
              🗑️ ลบข้อมูลทั้งหมด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataManagementModal;
