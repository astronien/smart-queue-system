// Statistics Dashboard Modal

import React, { useMemo } from 'react';
import { Customer } from '../types';
import { StatisticsCalculator } from '../utils/statistics';
import { STATIONS } from '../constants';
import { XIcon } from './icons';

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customers: Customer[];
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({ isOpen, onClose, customers }) => {
  const stats = useMemo(() => StatisticsCalculator.calculate(customers), [customers]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl border border-gray-700 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700 sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-white">📊 สถิติและรายงาน</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-sky-600 to-sky-700 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">ลูกค้าทั้งหมดวันนี้</p>
              <p className="text-3xl font-bold mt-1">{stats.totalCustomers}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">กำลังรอคิว</p>
              <p className="text-3xl font-bold mt-1">{stats.activeCustomers}</p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">เสร็จสิ้นแล้ว</p>
              <p className="text-3xl font-bold mt-1">{stats.completedToday}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-4 text-white">
              <p className="text-sm opacity-90">เวลารอเฉลี่ย</p>
              <p className="text-3xl font-bold mt-1">{stats.averageWaitTime}<span className="text-lg ml-1">นาที</span></p>
            </div>
          </div>

          {/* Station Statistics */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">สถิติแต่ละสเตชั่น</h3>
            <div className="space-y-4">
              {STATIONS.map(station => {
                const stationStat = stats.stationStats[station.id];
                return (
                  <div key={station.id} className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className={`font-semibold ${station.textColor}`}>{station.title}</h4>
                      <span className="text-2xl font-bold text-white">{stationStat.count}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">กำลังให้บริการ</p>
                        <p className="text-lg font-semibold text-green-400">{stationStat.inProgress}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">เวลารอเฉลี่ย</p>
                        <p className="text-lg font-semibold text-amber-400">{Math.round(stationStat.averageWaitTime)} นาที</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Peak Hours */}
          {stats.peakHours.length > 0 && (
            <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4">ช่วงเวลาที่มีคนมากที่สุด</h3>
              <div className="space-y-2">
                {stats.peakHours.map(({ hour, count }) => (
                  <div key={hour} className="flex items-center gap-4">
                    <span className="text-gray-300 w-24">{hour}:00 - {hour + 1}:00</span>
                    <div className="flex-grow bg-gray-800 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-sky-500 to-indigo-500 h-full flex items-center justify-end px-3 text-white font-semibold text-sm"
                        style={{ width: `${(count / stats.peakHours[0].count) * 100}%` }}
                      >
                        {count} คน
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current Status */}
          <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 rounded-lg p-6 border border-indigo-700">
            <h3 className="text-xl font-bold text-white mb-2">สถานะปัจจุบัน</h3>
            <p className="text-gray-300">
              เวลารอนานที่สุดในคิว: <span className="text-2xl font-bold text-amber-400">{stats.currentWaitTime}</span> นาที
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsModal;
