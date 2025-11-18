
import React from 'react';
import { PlusIcon, BrainIcon, QrCodeIcon, SwitchHorizontalIcon, CogIcon, ChartBarIcon, DatabaseIcon, TvIcon } from './icons';

interface HeaderProps {
  onAddCustomerClick: () => void;
  onAnalysisClick: () => void;
  onShowQrClick: () => void;
  onClearStation: () => void;
  currentStationName: string;
  onOpenSettingsClick: () => void;
  onStatisticsClick: () => void;
  onDataManagementClick: () => void;
  onDisplayBoardClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onAddCustomerClick, 
  onAnalysisClick, 
  onShowQrClick, 
  onClearStation, 
  currentStationName, 
  onOpenSettingsClick,
  onStatisticsClick,
  onDataManagementClick,
  onDisplayBoardClick
}) => {
  return (
    <header className="flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 shadow-lg">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex items-center justify-between h-20">
        <div className="flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Smart <span className="text-sky-400">Queue</span>
          </h1>
          <p className="text-sm text-amber-300 font-semibold">{currentStationName}</p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onDisplayBoardClick}
            className="flex items-center gap-2 p-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-500 transition-all"
            aria-label="Display Board"
            title="Display Board"
          >
            <TvIcon />
          </button>
          <button
            onClick={onStatisticsClick}
            className="flex items-center gap-2 p-2 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-500 transition-all"
            aria-label="Statistics"
            title="Statistics"
          >
            <ChartBarIcon />
          </button>
          <button
            onClick={onDataManagementClick}
            className="flex items-center gap-2 p-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-500 transition-all"
            aria-label="Data Management"
            title="Data Management"
          >
            <DatabaseIcon />
          </button>
          <button
            onClick={onClearStation}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all"
            aria-label="Change Station"
            title="Change Station"
          >
            <SwitchHorizontalIcon />
            <span className="hidden lg:inline">เปลี่ยน</span>
          </button>
          <button
            onClick={onShowQrClick}
            className="flex items-center gap-2 p-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all"
            aria-label="Show QR Code"
            title="QR Code"
          >
            <QrCodeIcon />
          </button>
          <button
            onClick={onOpenSettingsClick}
            className="flex items-center gap-2 p-2 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-500 transition-all"
            aria-label="Settings"
            title="Settings"
          >
            <CogIcon />
          </button>
          <button
            onClick={onAnalysisClick}
            className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 transition-all"
            aria-label="AI Insights"
          >
            <BrainIcon />
            <span className="hidden lg:inline">AI</span>
          </button>
          <button
            onClick={onAddCustomerClick}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white font-semibold rounded-lg shadow-md hover:bg-sky-500 transition-all"
          >
            <PlusIcon />
            <span className="hidden sm:inline">เพิ่มลูกค้า</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
