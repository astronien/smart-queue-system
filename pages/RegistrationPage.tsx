
import React, { useState } from 'react';
import { Customer, Station, CustomFieldData, CustomFieldType } from '../types';
import { STATION_ORDER } from '../constants';
import { useRegistrationSettings } from '../hooks/useRegistrationSettings';
import { SyncManager } from '../utils/sync';

const CUSTOMERS_KEY = 'smartq_customers';
const COUNTER_KEY = 'smartq_counter';

const RegistrationPage = () => {
  const { settings } = useRegistrationSettings();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [customFieldData, setCustomFieldData] = useState<CustomFieldData>(() => {
    const initialState: CustomFieldData = {};
    settings.customFields.forEach(field => {
      initialState[field.id] = field.type === CustomFieldType.CHECKBOX ? false : '';
    });
    return initialState;
  });
  const [error, setError] = useState('');
  const [submittedCustomer, setSubmittedCustomer] = useState<Customer | null>(null);

  const handleCustomFieldChange = (fieldId: string, value: string | boolean) => {
    setCustomFieldData(prev => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !phone.trim()) {
      setError('กรุณากรอกข้อมูลให้ครบทุกช่อง');
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

    try {
        // --- Start Transaction ---
        const storedCustomers = localStorage.getItem(CUSTOMERS_KEY);
        const storedCounter = localStorage.getItem(COUNTER_KEY);

        const customers: Customer[] = storedCustomers ? JSON.parse(storedCustomers) : [];
        const queueCounter = storedCounter ? parseInt(storedCounter, 10) : 1;

        const newCustomer: Customer = {
            id: Date.now(),
            queueNumber: `A${String(queueCounter).padStart(3, '0')}`,
            firstName,
            lastName,
            phone,
            station: STATION_ORDER[0],
            createdAt: new Date(),
            customFieldData: customFieldData,
            status: 'WAITING',
        };

        const updatedCustomers = [...customers, newCustomer];
        const updatedCounter = queueCounter + 1;

        // Use SyncManager to broadcast changes to all tabs
        SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
        SyncManager.broadcastChange(COUNTER_KEY, updatedCounter);
        
        // --- End Transaction ---

        setSubmittedCustomer(newCustomer);

    } catch (err) {
        console.error("Failed to register customer:", err);
        setError('เกิดข้อผิดพลาดในการลงทะเบียน โปรดลองใหม่อีกครั้ง');
    }
  };

  const dynamicStyles = {
    '--theme-color': settings.themeColor,
    '--theme-color-contrast': '#ffffff', // Assuming white text on the theme color is fine
  };

  if (submittedCustomer) {
    return (
       <div style={dynamicStyles as React.CSSProperties} className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
            <div className="w-full max-w-md text-center bg-gray-800 p-8 rounded-xl shadow-2xl border border-gray-700 animate-fade-in">
                <h1 className="text-2xl font-bold text-green-400 mb-2">ลงทะเบียนสำเร็จ!</h1>
                <p className="text-gray-300 mb-6">คุณได้รับบัตรคิวเรียบร้อยแล้ว</p>
                <div className="bg-gray-900 p-8 rounded-lg border-2 border-dashed" style={{ borderColor: 'var(--theme-color)'}}>
                    <p className="text-lg text-gray-400">หมายเลขคิวของคุณคือ</p>
                    <p className="text-7xl font-bold my-2" style={{ color: 'var(--theme-color)'}}>{submittedCustomer.queueNumber}</p>
                    <p className="text-lg text-gray-200">{submittedCustomer.firstName} {submittedCustomer.lastName}</p>
                </div>
                <p className="mt-6 text-gray-400">กรุณารอสักครู่ เจ้าหน้าที่จะเรียกคิวของท่านตามลำดับ</p>
            </div>
       </div>
    );
  }


  return (
    <div style={dynamicStyles as React.CSSProperties} className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="mx-auto h-24 w-auto mb-4" />}
                <h1 className="text-3xl font-bold">
                  <span style={{ color: 'var(--theme-color)' }}>{settings.title}</span>
                </h1>
                <p className="text-gray-400 mt-2">{settings.subtitle}</p>
            </div>
            <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">ชื่อ (First Name)</label>
                    <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': 'var(--theme-color)'} as React.CSSProperties}
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
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': 'var(--theme-color)'} as React.CSSProperties}
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
                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2"
                    style={{'--tw-ring-color': 'var(--theme-color)'} as React.CSSProperties}
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
                                    className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-3 px-4 text-white focus:outline-none focus:ring-2"
                                    style={{'--tw-ring-color': 'var(--theme-color)'} as React.CSSProperties}
                                />
                            </div>
                        )}
                        {field.type === CustomFieldType.CHECKBOX && (
                            <div className="flex items-center">
                                <input
                                    id={field.id}
                                    type="checkbox"
                                    checked={customFieldData[field.id] as boolean}
                                    onChange={(e) => handleCustomFieldChange(field.id, e.target.checked)}
                                    className="h-5 w-5 rounded border-gray-600 bg-gray-900 focus:ring-2"
                                    style={{'--tw-ring-color': 'var(--theme-color)'} as React.CSSProperties}
                                />
                                <label htmlFor={field.id} className="ml-3 block text-sm font-medium text-gray-300">
                                    {field.label} {field.required && <span className="text-red-400">*</span>}
                                </label>
                            </div>
                        )}
                    </div>
                ))}


                {error && <p className="text-sm text-red-400 text-center">{error}</p>}

                <div className="pt-2">
                    <button
                    type="submit"
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800"
                    style={{ 
                        backgroundColor: 'var(--theme-color)', 
                        color: 'var(--theme-color-contrast)',
                        '--tw-ring-color': 'var(--theme-color)' 
                    } as React.CSSProperties}
                    >
                    รับบัตรคิว
                    </button>
                </div>
                </form>
            </div>
        </div>
    </div>
  );
};

export default RegistrationPage;