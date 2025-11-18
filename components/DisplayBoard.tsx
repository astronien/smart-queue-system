// Display Board - Customer-facing queue display

import React, { useState, useEffect } from 'react';
import { Customer, Station } from '../types';
import { STATIONS } from '../constants';

interface DisplayBoardProps {
  customers: Customer[];
}

const DisplayBoard: React.FC<DisplayBoardProps> = ({ customers }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get currently serving customers (IN_PROGRESS)
  const servingCustomers = customers.filter(c => c.status === 'IN_PROGRESS');
  
  // Get next 3 waiting customers per station
  const waitingByStation = STATIONS.map(station => ({
    station,
    customers: customers
      .filter(c => c.station === station.id && c.status === 'WAITING')
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
      .slice(0, 3),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 font-sans">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold mb-4">
          Smart <span className="text-sky-400">Queue</span>
        </h1>
        <p className="text-3xl text-gray-300">
          {currentTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </p>
      </div>

      {/* Currently Serving */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold text-center mb-6 text-green-400">
          🔔 กำลังให้บริการ (Now Serving)
        </h2>
        {servingCustomers.length === 0 ? (
          <div className="text-center text-gray-400 text-2xl py-12">
            ไม่มีคิวที่กำลังให้บริการ
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servingCustomers.map(customer => {
              const station = STATIONS.find(s => s.id === customer.station);
              return (
                <div
                  key={customer.id}
                  className={`${station?.color} rounded-2xl p-8 shadow-2xl border-4 border-green-400 animate-pulse-slow`}
                >
                  <p className="text-sm opacity-90 mb-2">{station?.title}</p>
                  <p className="text-7xl font-bold text-white mb-2">{customer.queueNumber}</p>
                  <p className="text-2xl font-semibold text-white/90">
                    {customer.firstName} {customer.lastName}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Waiting Queue by Station */}
      <div>
        <h2 className="text-4xl font-bold text-center mb-6 text-amber-400">
          ⏳ คิวที่รอ (Waiting Queue)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {waitingByStation.map(({ station, customers: stationCustomers }) => (
            <div key={station.id} className={`${station.color} rounded-2xl p-6 shadow-xl`}>
              <h3 className={`text-2xl font-bold ${station.textColor} mb-4 text-center`}>
                {station.title}
              </h3>
              {stationCustomers.length === 0 ? (
                <p className="text-center text-white/60 py-8">ไม่มีคิวรอ</p>
              ) : (
                <div className="space-y-3">
                  {stationCustomers.map((customer, index) => (
                    <div
                      key={customer.id}
                      className="bg-black/20 rounded-lg p-4 backdrop-blur-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/70">#{index + 1}</span>
                        <span className="text-3xl font-bold text-white">{customer.queueNumber}</span>
                      </div>
                      <p className="text-lg text-white/90 mt-1">
                        {customer.firstName} {customer.lastName.charAt(0)}.
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-gray-400 text-xl">
        <p>กรุณารอสักครู่ เจ้าหน้าที่จะเรียกคิวของท่านตามลำดับ</p>
        <p className="mt-2">Please wait, we will call your number soon</p>
      </div>
    </div>
  );
};

export default DisplayBoard;
