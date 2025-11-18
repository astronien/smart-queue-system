import React from 'react';
import { Station } from '../types';
import { STATIONS } from '../constants';

interface StationSelectionPageProps {
  onSelectStation: (stationId: Station) => void;
}

const StationSelectionPage: React.FC<StationSelectionPageProps> = ({ onSelectStation }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-2">
          ตั้งค่าเครื่องประจำจุด
        </h1>
        <p className="text-lg text-gray-400 mb-10">
          กรุณาเลือกสเตชั่นสำหรับอุปกรณ์เครื่องนี้ (Please select the station for this device)
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {STATIONS.map((station) => (
            <button
              key={station.id}
              onClick={() => onSelectStation(station.id)}
              className={`p-8 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 ${station.color} hover:shadow-2xl focus:${station.color.replace('bg','ring')}-500`}
            >
              <h2 className={`text-2xl font-bold ${station.textColor}`}>{station.title}</h2>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StationSelectionPage;