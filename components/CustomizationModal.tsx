
import React, { useState, useEffect } from 'react';
import { useRegistrationSettings } from '../hooks/useRegistrationSettings';
import { XIcon, CogIcon, PlusIcon, TrashIcon } from './icons';
import { RegistrationSettings, CustomField, CustomFieldType } from '../types';

interface CustomizationModalProps {
  onClose: () => void;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ onClose }) => {
  const { settings, updateSettings } = useRegistrationSettings();
  const [localSettings, setLocalSettings] = useState<RegistrationSettings>(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSettings(prev => ({ ...prev, themeColor: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalSettings(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    updateSettings(localSettings);
    onClose();
  };

  // Custom Fields Handlers
  const addCustomField = () => {
    const newField: CustomField = {
      id: `field_${Date.now()}`,
      label: '',
      type: CustomFieldType.TEXT,
      required: false,
    };
    setLocalSettings(prev => ({
      ...prev,
      customFields: [...prev.customFields, newField],
    }));
  };

  const updateCustomField = (index: number, updatedField: Partial<CustomField>) => {
    setLocalSettings(prev => {
      const newFields = [...prev.customFields];
      newFields[index] = { ...newFields[index], ...updatedField };
      return { ...prev, customFields: newFields };
    });
  };

  const removeCustomField = (index: number) => {
    setLocalSettings(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index),
    }));
  };


  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl m-4 border border-gray-700 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2"><CogIcon /> ปรับแต่งหน้าลงทะเบียน</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><XIcon /></button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          {/* General Settings */}
          <fieldset className="p-4 border border-gray-700 rounded-lg">
            <legend className="px-2 text-lg font-semibold text-sky-400">การตั้งค่าทั่วไป</legend>
            <div className="space-y-4">
                <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-gray-300">โลโก้ (Logo)</label>
                    <div className="mt-1 flex items-center gap-4">
                        {localSettings.logoUrl && <img src={localSettings.logoUrl} alt="Logo Preview" className="h-16 w-16 object-contain rounded-md bg-gray-700 p-1" />}
                        <input
                            type="file"
                            id="logo"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-sky-600 file:text-white hover:file:bg-sky-500"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300">หัวข้อหลัก (Title)</label>
                    <input type="text" id="title" name="title" value={localSettings.title} onChange={handleInputChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div>
                    <label htmlFor="subtitle" className="block text-sm font-medium text-gray-300">คำอธิบาย (Subtitle)</label>
                    <input type="text" id="subtitle" name="subtitle" value={localSettings.subtitle} onChange={handleInputChange} className="mt-1 block w-full bg-gray-900 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500" />
                </div>
                <div>
                    <label htmlFor="themeColor" className="block text-sm font-medium text-gray-300">สีธีม (Theme Color)</label>
                    <div className="mt-1 flex items-center gap-2">
                        <input type="color" id="themeColor" name="themeColor" value={localSettings.themeColor} onChange={handleColorChange} className="p-1 h-10 w-10 block bg-gray-900 border-gray-600 cursor-pointer rounded-lg" />
                        <span className="font-mono text-gray-400">{localSettings.themeColor}</span>
                    </div>
                </div>
            </div>
          </fieldset>

          {/* Custom Fields Settings */}
          <fieldset className="p-4 border border-gray-700 rounded-lg">
            <legend className="px-2 text-lg font-semibold text-sky-400">ฟิลด์เพิ่มเติม (Custom Fields)</legend>
            <div className="space-y-4">
                {localSettings.customFields.map((field, index) => (
                    <div key={field.id} className="p-3 bg-gray-900/50 rounded-md border border-gray-600 space-y-3">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-400">ชื่อฟิลด์ (Label)</label>
                                <input type="text" value={field.label} onChange={(e) => updateCustomField(index, { label: e.target.value })} className="mt-1 block w-full bg-gray-700 border-gray-500 rounded-md py-1 px-2 text-sm text-white focus:ring-sky-500 focus:border-sky-500"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400">ประเภท (Type)</label>
                                <select value={field.type} onChange={(e) => updateCustomField(index, { type: e.target.value as CustomFieldType })} className="mt-1 block w-full bg-gray-700 border-gray-500 rounded-md py-1 px-2 text-sm text-white focus:ring-sky-500 focus:border-sky-500">
                                    <option value={CustomFieldType.TEXT}>Text</option>
                                    <option value={CustomFieldType.CHECKBOX}>Checkbox</option>
                                </select>
                            </div>
                         </div>
                         <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <input id={`required-${field.id}`} type="checkbox" checked={field.required} onChange={(e) => updateCustomField(index, { required: e.target.checked })} className="h-4 w-4 rounded bg-gray-700 border-gray-500 text-sky-600 focus:ring-sky-500"/>
                                <label htmlFor={`required-${field.id}`} className="text-sm text-gray-300">จำเป็นต้องกรอก (Required)</label>
                            </div>
                             <button onClick={() => removeCustomField(index)} className="p-1 text-red-400 hover:text-red-300 hover:bg-red-900/50 rounded-full transition-colors"><TrashIcon /></button>
                         </div>
                    </div>
                ))}

                 <button onClick={addCustomField} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border-2 border-dashed border-gray-600 text-gray-400 rounded-lg hover:bg-gray-700 hover:text-white hover:border-gray-500 transition-colors">
                    <PlusIcon />
                    เพิ่มฟิลด์ (Add Field)
                </button>
            </div>
          </fieldset>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-b-xl flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-500 transition-colors">
            ยกเลิก
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-500 transition-colors">
            บันทึก
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
