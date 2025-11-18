// Enhanced Storage Management with Backup/Restore

import { Customer } from '../types';

export interface BackupData {
  version: string;
  timestamp: string;
  customers: Customer[];
  counter: number;
  settings: any;
}

export class StorageManager {
  // Export all data as JSON
  static exportData(): BackupData {
    const customers = localStorage.getItem('smartq_customers');
    const counter = localStorage.getItem('smartq_counter');
    const settings = localStorage.getItem('smartq_registration_settings');

    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      customers: customers ? JSON.parse(customers) : [],
      counter: counter ? parseInt(counter, 10) : 1,
      settings: settings ? JSON.parse(settings) : null,
    };
  }

  // Import data from backup
  static importData(data: BackupData): boolean {
    try {
      if (data.customers) {
        localStorage.setItem('smartq_customers', JSON.stringify(data.customers));
      }
      if (data.counter) {
        localStorage.setItem('smartq_counter', String(data.counter));
      }
      if (data.settings) {
        localStorage.setItem('smartq_registration_settings', JSON.stringify(data.settings));
      }
      
      // Trigger storage event for sync
      window.dispatchEvent(new Event('storage'));
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }

  // Download backup file
  static downloadBackup() {
    const data = this.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartqueue-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Export to CSV
  static exportToCSV(customers: Customer[]): string {
    const headers = ['Queue Number', 'First Name', 'Last Name', 'Phone', 'Station', 'Status', 'Created At', 'Wait Time (min)'];
    const rows = customers.map(c => {
      const waitTime = Math.round((Date.now() - new Date(c.createdAt).getTime()) / (1000 * 60));
      return [
        c.queueNumber,
        c.firstName,
        c.lastName,
        c.phone,
        c.station,
        c.status,
        new Date(c.createdAt).toLocaleString(),
        waitTime.toString(),
      ];
    });

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    return csv;
  }

  static downloadCSV(customers: Customer[]) {
    const csv = this.exportToCSV(customers);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartqueue-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Clear all data
  static clearAllData() {
    const keys = ['smartq_customers', 'smartq_counter', 'smartq_registration_settings', 'smartq_station_id'];
    keys.forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event('storage'));
  }

  // Get storage usage
  static getStorageUsage(): { used: number; total: number; percentage: number } {
    let used = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    
    const total = 5 * 1024 * 1024; // 5MB typical limit
    return {
      used,
      total,
      percentage: (used / total) * 100,
    };
  }
}
