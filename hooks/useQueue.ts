import { useState, useCallback, useEffect } from 'react';
import { Customer, Station, CustomFieldData } from '../types';
import { STATION_ORDER } from '../constants';
import { SyncManager } from '../utils/sync';

const CUSTOMERS_KEY = 'smartq_customers';
const COUNTER_KEY = 'smartq_counter';

export const useQueue = () => {
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOMERS_KEY);
      if (stored) {
        // Re-hydrate Date objects and ensure status exists
        return JSON.parse(stored).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          status: c.status || 'WAITING', // Add for backward compatibility
        }));
      }
    } catch (e) {
      console.error("Failed to parse customers from localStorage", e);
    }
    return []; // Start with an empty queue
  });
  
  const [queueCounter, setQueueCounter] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(COUNTER_KEY);
      return stored ? parseInt(stored, 10) : 1;
    } catch (e) {
      console.error("Failed to parse queue counter from localStorage", e);
    }
    return 1;
  });

  // Effect to save state to localStorage whenever it changes
  useEffect(() => {
    try {
      // Save directly to localStorage (don't broadcast here to avoid loops)
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
      localStorage.setItem(COUNTER_KEY, String(queueCounter));
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }, [customers, queueCounter]);

  // Effect to listen for storage changes from other tabs/windows AND current tab
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === CUSTOMERS_KEY) {
        try {
          const stored = localStorage.getItem(CUSTOMERS_KEY);
           if (stored) {
            setCustomers(JSON.parse(stored).map((c: any) => ({
              ...c,
              createdAt: new Date(c.createdAt),
              status: c.status || 'WAITING',
            })));
           }
        } catch (e) {
           console.error("Failed to sync customers from storage change", e);
        }
      }
      if (event.key === COUNTER_KEY) {
         try {
          const stored = localStorage.getItem(COUNTER_KEY);
          if (stored) {
            setQueueCounter(parseInt(stored, 10));
          }
        } catch (e) {
           console.error("Failed to sync counter from storage change", e);
        }
      }
    };

    // Listen for custom event (same tab)
    const handleLocalStorageChange = (event: CustomEvent) => {
      const { key, value } = event.detail;
      
      if (key === CUSTOMERS_KEY) {
        try {
          const customers = Array.isArray(value) ? value : JSON.parse(value);
          setCustomers(customers.map((c: any) => ({
            ...c,
            createdAt: new Date(c.createdAt),
            status: c.status || 'WAITING',
          })));
        } catch (e) {
          console.error("Failed to sync customers from local change", e);
        }
      }
      
      if (key === COUNTER_KEY) {
        try {
          const counter = typeof value === 'number' ? value : parseInt(value, 10);
          setQueueCounter(counter);
        } catch (e) {
          console.error("Failed to sync counter from local change", e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('local-storage-change', handleLocalStorageChange as EventListener);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('local-storage-change', handleLocalStorageChange as EventListener);
    };
  }, []);


  const addCustomer = useCallback((firstName: string, lastName: string, phone: string, customFieldData: CustomFieldData): Customer => {
    const newCustomer: Customer = {
      id: Date.now(),
      queueNumber: `A${String(queueCounter).padStart(3, '0')}`,
      firstName,
      lastName,
      phone,
      station: STATION_ORDER[0], // Start at the first station
      createdAt: new Date(),
      customFieldData: customFieldData,
      status: 'WAITING',
    };
    
    const updatedCustomers = [...customers, newCustomer];
    const updatedCounter = queueCounter + 1;
    
    // Broadcast changes to all tabs
    SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
    SyncManager.broadcastChange(COUNTER_KEY, updatedCounter);
    
    setCustomers(updatedCustomers);
    setQueueCounter(updatedCounter);
    
    return newCustomer;
  }, [queueCounter, customers]);

  const moveCustomer = useCallback((customerId: number, direction: 'next' | 'previous') => {
    const updatedCustomers = customers.map(customer => {
      if (customer.id === customerId) {
        const currentStationIndex = STATION_ORDER.indexOf(customer.station);
        let nextStationIndex: number;
        if (direction === 'next') {
          nextStationIndex = Math.min(currentStationIndex + 1, STATION_ORDER.length - 1);
        } else {
          nextStationIndex = Math.max(currentStationIndex - 1, 0);
        }
        // Reset status when moving to a new station
        return { ...customer, station: STATION_ORDER[nextStationIndex], status: 'WAITING' };
      }
      return customer;
    });
    
    // Broadcast changes
    SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
    setCustomers(updatedCustomers);
  }, [customers]);

  const completeCustomer = useCallback((customerId: number) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      // Store completed customer for statistics (keep last 100)
      try {
        const completedKey = 'smartq_completed_customers';
        const stored = localStorage.getItem(completedKey);
        const completed = stored ? JSON.parse(stored) : [];
        completed.push({ ...customer, completedAt: new Date().toISOString() });
        
        // Keep only last 100 completed customers
        const trimmed = completed.slice(-100);
        localStorage.setItem(completedKey, JSON.stringify(trimmed));
      } catch (e) {
        console.error('Failed to store completed customer:', e);
      }
    }
    
    const updatedCustomers = customers.filter(c => c.id !== customerId);
    
    // Broadcast changes
    SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
    setCustomers(updatedCustomers);
  }, [customers]);

  const setCustomerStatus = useCallback((customerId: number, status: 'WAITING' | 'IN_PROGRESS') => {
    const updatedCustomers = customers.map(customer =>
      customer.id === customerId ? { ...customer, status } : customer
    );
    
    // Broadcast changes
    SyncManager.broadcastChange(CUSTOMERS_KEY, updatedCustomers);
    setCustomers(updatedCustomers);
  }, [customers]);

  return { customers, addCustomer, moveCustomer, completeCustomer, setCustomerStatus };
};