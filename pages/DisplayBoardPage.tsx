// Display Board Page - Full screen customer display

import React, { useState, useEffect } from 'react';
import DisplayBoard from '../components/DisplayBoard';
import { Customer } from '../types';

const CUSTOMERS_KEY = 'smartq_customers';

const DisplayBoardPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const loadCustomers = () => {
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
        console.error('Failed to load customers:', e);
      }
    };

    loadCustomers();

    const handleStorageChange = () => loadCustomers();
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(loadCustomers, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return <DisplayBoard customers={customers} />;
};

export default DisplayBoardPage;
