
import React, { useState } from 'react';
import { XIcon } from './icons';
import { useRegistrationSettings } from '../hooks/useRegistrationSettings';
import { CustomFieldData, CustomFieldType } from '../types';

interface NewCustomerModalProps {
  onClose: () => void;
  onAddCustomer: (firstName: string, lastName: string, phone: string, customFieldData: CustomFieldData) => void;
}

const NewCustomerModal: React.FC<NewCustomerModalProps> = ({ onClose, onAddCustomer }) => {
  const { settings } = useRegistrationSettings();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [customFieldData, setCustomFieldData] = useState<CustomFieldData>(() => {
    const initialState: CustomFieldData = {};
    settings.customFields.forEach(field => {
      initialState[field.id] = field.type === CustomFieldType.CHECKBOX ? false : '';
    });
    return initialState;
  });

  const handleCustomFieldChange = (fieldId: string, value: string | boolean) => {
    setCustomFieldData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('กรุณากรอกข้อมูลหลักให้ครบทุกช่อง');
      return;
    }

    // Validate custom fields
    for (const field of settings.customFields) {
        if (field.required) {
            const value = customFieldData[field.id];
            if (field.type === CustomFieldType.TEXT && !value) {
                setError(`กรุณากรอกข้อมูล: ${field.label}`);
                return;
            }
            if (field.type === CustomFieldType.CHECKBOX && !value) {
                 setError(`กรุณายืนยัน: ${field.label}`);
                return;
            }
        }
    }
    
    setError('');
    onAddCustomer(firstName, lastName, phone, customFieldData);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md m-4 border border-gray-700 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-gray-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">เพิ่มลูกค้าใหม่ (Add New Customer)</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">ชื่อ (First Name)</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">นามสกุล (Last Name)</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300">เบอร์โทรศัพท์ (Phone Number)</label>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          {settings.customFields.length > 0 && <hr className="border-gray-700" />}
                
          {settings.customFields.map((field) => (
              <div key={field.id}>
                  {field.type === CustomFieldType.TEXT && (
                        <div>
                          <label htmlFor={field.id} className="block text-sm font-medium text-gray-300">
                              {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                          <input
                              type="text"
                              id={field.id}
                              value={customFieldData[field.id] as string}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.value)}
                              required={field.required}
                              className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500"
                          />
                      </div>
                  )}
                  {field.type === CustomFieldType.CHECKBOX && (
                      <div className="flex items-center pt-2">
                          <input
                              id={field.id}
                              type="checkbox"
                              checked={customFieldData[field.id] as boolean}
                              onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                              className="h-4 w-4 rounded border-gray-600 bg-gray-900 text-sky-600 focus:ring-sky-500"
                          />
                          <label htmlFor={field.id} className="ml-3 block text-sm font-medium text-gray-300">
                              {field.label} {field.required && <span className="text-red-400">*</span>}
                          </label>
                      </div>
                  )}
              </div>
          ))}

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 transition-colors"
            >
              รับบัตรคิว (Get Queue Ticket)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewCustomerModal;
