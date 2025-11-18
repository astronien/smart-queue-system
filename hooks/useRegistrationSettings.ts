
import { useState, useEffect, useCallback } from 'react';
import { RegistrationSettings } from '../types';

const SETTINGS_KEY = 'smartq_registration_settings';

const DEFAULTS: RegistrationSettings = {
  logoUrl: '',
  title: 'Smart Queue',
  subtitle: 'กรอกข้อมูลเพื่อรับบัตรคิว',
  themeColor: '#0ea5e9', // Default is sky-500
  customFields: [],
};

export const useRegistrationSettings = () => {
  const [settings, setSettings] = useState<RegistrationSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        // Merge stored settings with defaults to ensure all keys are present
        return { ...DEFAULTS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error("Failed to parse settings from localStorage", e);
    }
    return DEFAULTS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error("Failed to save settings to localStorage", e);
    }
  }, [settings]);

  // Effect to listen for storage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === SETTINGS_KEY && event.newValue) {
        try {
          setSettings({ ...DEFAULTS, ...JSON.parse(event.newValue) });
        } catch (e) {
           console.error("Failed to sync settings from storage change", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const updateSettings = useCallback((newSettings: Partial<RegistrationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return { settings, updateSettings };
};
