import React, { useState, useMemo } from 'react';
import { Customer, Station } from '../types';
import CustomerCard from './CustomerCard';

interface StationColumnProps {
  station: { id: Station; title: string; color: string; textColor: string };
  customers: Customer[];
  moveCustomer: (customerId: number, direction: 'next' | 'previous') => void;
  completeCustomer: (customerId: number) => void;
  setCustomerStatus: (customerId: number, status: 'WAITING' | 'IN_PROGRESS') => void;
  isFocusedView?: boolean;
}

const StationColumn: React.FC<StationColumnProps> = ({ station, customers, moveCustomer, completeCustomer, setCustomerStatus, isFocusedView = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const columnWidth = isFocusedView 
    ? 'w-full h-full' 
    : 'w-72 sm:w-80 md:w-96 flex-shrink-0';

  const filteredCustomers = useMemo(() => {
    if (!searchQuery.trim()) return customers;
    
    const query = searchQuery.toLowerCase();
    return customers.filter(c => 
      c.queueNumber.toLowerCase().includes(query) ||
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.phone.includes(query)
    );
  }, [customers, searchQuery]);
    
  return (
    <div className={`${columnWidth} ${station.color} rounded-xl shadow-2xl flex flex-col`}>
      <div className="p-4 border-b border-white/10 flex-shrink-0">
        <div className="flex justify-between items-center mb-3">
          <h2 className={`text-xl font-bold ${station.textColor}`}>{station.title}</h2>
          <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-lg ${station.textColor} bg-black/20`}>
            {customers.length}
          </span>
        </div>
        {customers.length > 0 && (
          <input
            type="text"
            placeholder="ค้นหา..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-black/20 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
          />
        )}
      </div>
      <div className="flex-grow p-4 space-y-4 overflow-y-auto">
        {filteredCustomers.length === 0 && customers.length === 0 && (
          <div className="text-center text-gray-400 pt-10 h-full flex flex-col items-center justify-center">
            <p className="text-2xl">ไม่มีคิวในสเตชั่นนี้</p>
            <p className="mt-2">(No customers here)</p>
          </div>
        )}
        {filteredCustomers.length === 0 && customers.length > 0 && (
          <div className="text-center text-gray-400 pt-10">
            <p className="text-xl">ไม่พบผลการค้นหา</p>
          </div>
        )}
        {filteredCustomers.sort((a,b) => a.createdAt.getTime() - b.createdAt.getTime()).map(customer => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            moveCustomer={moveCustomer}
            completeCustomer={completeCustomer}
            setCustomerStatus={setCustomerStatus}
          />
        ))}
      </div>
    </div>
  );
};

export default StationColumn;