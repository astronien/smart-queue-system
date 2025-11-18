// Application Settings Manager

export interface AppSettings {
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  autoRefreshInterval: number; // seconds
  theme: 'dark' | 'light';
  language: 'th' | 'en';
}

const SETTINGS_KEY = 'smartq_app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  notificationsEnabled: true,
  autoRefreshInterval: 2,
  theme: 'dark',
  language: 'th',
};

export class SettingsManager {
  static getSettings(): AppSettings {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    return DEFAULT_SETTINGS;
  }

  static updateSettings(settings: Partial<AppSettings>): void {
    try {
      const current = this.getSettings();
      const updated = { ...current, ...settings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      
      // Trigger event for other components
      window.dispatchEvent(new CustomEvent('settings-changed', { detail: updated }));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }

  static resetSettings(): void {
    localStorage.removeItem(SETTINGS_KEY);
    window.dispatchEvent(new CustomEvent('settings-changed', { detail: DEFAULT_SETTINGS }));
  }
}
