
import React, { useState, useCallback, useEffect } from 'react';
import { useQueue } from './hooks/useQueue';
import { Customer, Station, CustomFieldData } from './types';
import { STATIONS } from './constants';
import Header from './components/Header';
import StationColumn from './components/StationColumn';
import NewCustomerModal from './components/NewCustomerModal';
import PrintModal from './components/PrintModal';
import AnalysisModal from './components/AnalysisModal';
import RegistrationPage from './pages/RegistrationPage';
import QRCodeModal from './components/QRCodeModal';
import StationSelectionPage from './pages/StationSelectionPage';
import CustomizationModal from './components/CustomizationModal';
import StatisticsModal from './components/StatisticsModal';
import DataManagementModal from './components/DataManagementModal';
import DisplayBoardPage from './pages/DisplayBoardPage';
import Toast from './components/Toast';
import { NotificationManager } from './utils/notifications';

const STATION_ID_KEY = 'smartq_station_id';

function App() {
  // Change from pathname to hash for robust SPA routing
  const isRegisterPage = window.location.hash === '#/register';
  const isDisplayBoardPage = window.location.hash === '#/display';

  const [selectedStationId, setSelectedStationId] = useState<Station | null>(
    () => localStorage.getItem(STATION_ID_KEY) as Station | null
  );
  
  const { customers, addCustomer, moveCustomer, completeCustomer, setCustomerStatus } = useQueue();
  const [isNewCustomerModalOpen, setNewCustomerModalOpen] = useState(false);
  const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
  const [isQrModalOpen, setQrModalOpen] = useState(false);
  const [isCustomizationModalOpen, setCustomizationModalOpen] = useState(false);
  const [isStatisticsModalOpen, setStatisticsModalOpen] = useState(false);
  const [isDataManagementModalOpen, setDataManagementModalOpen] = useState(false);
  const [customerToPrint, setCustomerToPrint] = useState<Customer | null>(null);
  const [previousCustomerCount, setPreviousCustomerCount] = useState(customers.length);

  // Initialize notification system
  useEffect(() => {
    NotificationManager.init();
  }, []);

  // Play sound when new customer is added
  useEffect(() => {
    if (customers.length > previousCustomerCount) {
      NotificationManager.playSound('info');
      NotificationManager.showToast('มีลูกค้าใหม่เข้าคิว', 'info');
    }
    setPreviousCustomerCount(customers.length);
  }, [customers.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + N: New customer
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        setNewCustomerModalOpen(true);
      }
      // Ctrl/Cmd + S: Statistics
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setStatisticsModalOpen(true);
      }
      // Escape: Close all modals
      if (e.key === 'Escape') {
        setNewCustomerModalOpen(false);
        setAnalysisModalOpen(false);
        setQrModalOpen(false);
        setCustomizationModalOpen(false);
        setStatisticsModalOpen(false);
        setDataManagementModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const handleAddCustomer = (firstName: string, lastName: string, phone: string, customFieldData: CustomFieldData) => {
    const newCustomer = addCustomer(firstName, lastName, phone, customFieldData);
    setNewCustomerModalOpen(false);
    setCustomerToPrint(newCustomer);
    NotificationManager.playSound('success');
    NotificationManager.showToast(`เพิ่มลูกค้า ${newCustomer.queueNumber} สำเร็จ`, 'success');
  };

  const handleOpenDisplayBoard = () => {
    window.open('#/display', '_blank');
  };

  const handleSelectStation = useCallback((stationId: Station) => {
    localStorage.setItem(STATION_ID_KEY, stationId);
    setSelectedStationId(stationId);
  }, []);

  const handleClearStation = useCallback(() => {
    localStorage.removeItem(STATION_ID_KEY);
    setSelectedStationId(null);
  }, []);

  if (isRegisterPage) {
    return <RegistrationPage />;
  }

  if (isDisplayBoardPage) {
    return <DisplayBoardPage />;
  }

  if (!selectedStationId) {
    return <StationSelectionPage onSelectStation={handleSelectStation} />;
  }
  
  const currentStation = STATIONS.find(s => s.id === selectedStationId);
  if (!currentStation) {
    // This case should ideally not happen if logic is correct
    handleClearStation();
    return <p>Error: Station not found. Resetting...</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 font-sans">
      <Toast />
      <Header 
        onAddCustomerClick={() => setNewCustomerModalOpen(true)} 
        onAnalysisClick={() => setAnalysisModalOpen(true)}
        onShowQrClick={() => setQrModalOpen(true)}
        onClearStation={handleClearStation}
        currentStationName={currentStation.title}
        onOpenSettingsClick={() => setCustomizationModalOpen(true)}
        onStatisticsClick={() => setStatisticsModalOpen(true)}
        onDataManagementClick={() => setDataManagementModalOpen(true)}
        onDisplayBoardClick={handleOpenDisplayBoard}
      />
      
      <main className="flex-grow p-4 md:p-6 lg:p-8 flex items-start justify-center">
        <div className="w-full max-w-5xl h-full">
          <StationColumn
            key={currentStation.id}
            station={currentStation}
            customers={customers.filter(c => c.station === currentStation.id)}
            moveCustomer={moveCustomer}
            completeCustomer={completeCustomer}
            setCustomerStatus={setCustomerStatus}
            isFocusedView={true}
          />
        </div>
      </main>

      {isNewCustomerModalOpen && (
        <NewCustomerModal
          onClose={() => setNewCustomerModalOpen(false)}
          onAddCustomer={handleAddCustomer}
        />
      )}

      {customerToPrint && (
        <PrintModal
          customer={customerToPrint}
          onClose={() => setCustomerToPrint(null)}
        />
      )}

      {isAnalysisModalOpen && (
        <AnalysisModal 
          isOpen={isAnalysisModalOpen}
          onClose={() => setAnalysisModalOpen(false)}
          customers={customers}
        />
      )}

      {isQrModalOpen && (
        <QRCodeModal
          onClose={() => setQrModalOpen(false)}
        />
      )}

      {isCustomizationModalOpen && (
        <CustomizationModal 
          onClose={() => setCustomizationModalOpen(false)}
        />
      )}

      {isStatisticsModalOpen && (
        <StatisticsModal
          isOpen={isStatisticsModalOpen}
          onClose={() => setStatisticsModalOpen(false)}
          customers={customers}
        />
      )}

      {isDataManagementModalOpen && (
        <DataManagementModal
          isOpen={isDataManagementModalOpen}
          onClose={() => setDataManagementModalOpen(false)}
          customers={customers}
        />
      )}
    </div>
  );
}

export default App;
