// Cross-tab/window synchronization utility

export class SyncManager {
  // Broadcast change to all tabs/windows (including current)
  static broadcastChange(key: string, value: any) {
    // Save to localStorage
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
    
    // Trigger storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', {
      key,
      newValue: typeof value === 'string' ? value : JSON.stringify(value),
      oldValue: localStorage.getItem(key),
      storageArea: localStorage,
      url: window.location.href
    }));
    
    // Trigger custom event for current tab
    window.dispatchEvent(new CustomEvent('local-storage-change', {
      detail: { key, value }
    }));
  }

  // Listen for changes (works in all tabs including current)
  static onChange(key: string, callback: (value: any) => void) {
    // Listen for storage event (other tabs)
    const storageHandler = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          const value = JSON.parse(e.newValue);
          callback(value);
        } catch {
          callback(e.newValue);
        }
      }
    };

    // Listen for custom event (current tab)
    const customHandler = (e: CustomEvent) => {
      if (e.detail.key === key) {
        callback(e.detail.value);
      }
    };

    window.addEventListener('storage', storageHandler as EventListener);
    window.addEventListener('local-storage-change', customHandler as EventListener);

    // Return cleanup function
    return () => {
      window.removeEventListener('storage', storageHandler as EventListener);
      window.removeEventListener('local-storage-change', customHandler as EventListener);
    };
  }

  // Get value from localStorage
  static get(key: string): any {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        return JSON.parse(value);
      }
    } catch {
      return localStorage.getItem(key);
    }
    return null;
  }
}
