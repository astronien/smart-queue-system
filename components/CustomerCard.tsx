
import React, { useMemo } from 'react';
import { Customer } from '../types';
import { STATION_ORDER } from '../constants';
import { useRegistrationSettings } from '../hooks/useRegistrationSettings';
import { PlayIcon } from './icons';

interface CustomerCardProps {
  customer: Customer;
  moveCustomer: (customerId: number, direction: 'next' | 'previous') => void;
  completeCustomer: (customerId: number) => void;
  setCustomerStatus: (customerId: number, status: 'WAITING' | 'IN_PROGRESS') => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, moveCustomer, completeCustomer, setCustomerStatus }) => {
  const { settings } = useRegistrationSettings();
  const currentStationIndex = STATION_ORDER.indexOf(customer.station);
  const isFirstStation = currentStationIndex === 0;
  const isLastStation = currentStationIndex === STATION_ORDER.length - 1;

  const timeWaiting = Math.round((Date.now() - new Date(customer.createdAt).getTime()) / (1000 * 60));

  const customFieldLabels = useMemo(() => {
    const labelsMap = new Map<string, string>();
    settings.customFields.forEach(field => {
      labelsMap.set(field.id, field.label);
    });
    return labelsMap;
  }, [settings.customFields]);

  const hasCustomData = customer.customFieldData && Object.keys(customer.customFieldData).length > 0;
  const isInProgress = customer.status === 'IN_PROGRESS';

  return (
    <div 
      className={`bg-gray-800/50 backdrop-blur-md rounded-lg p-4 shadow-lg border border-gray-700/50 animate-fade-in transition-all hover:border-gray-600 ${isInProgress ? 'ring-2 ring-green-500 shadow-green-500/20' : ''}`}
      tabIndex={0}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xl font-bold text-sky-400">{customer.queueNumber}</p>
          <p className="text-lg font-semibold text-white">{customer.firstName} {customer.lastName}</p>
          <p className="text-sm text-gray-400">{customer.phone}</p>
        </div>
        <div className="text-right">
            {isInProgress ? (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-800 text-green-300">
                กำลังให้บริการ
              </span>
            ) : (
              <>
                <p className="text-xs text-gray-400">Waiting</p>
                <p className="text-lg font-semibold text-amber-400">{timeWaiting} <span className="text-xs">min</span></p>
              </>
            )}
        </div>
      </div>

      {hasCustomData && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 space-y-1 text-sm">
          {Object.entries(customer.customFieldData).map(([fieldId, value]) => {
            const label = customFieldLabels.get(fieldId) || fieldId;
            return (
              <div key={fieldId} className="flex justify-between">
                <span className="text-gray-400">{label}:</span>
                <span className="font-semibold text-white text-right">
                  {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                </span>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-3">
        {!isInProgress && (
            <button
                onClick={() => setCustomerStatus(customer.id, 'IN_PROGRESS')}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-green-600 rounded-md hover:bg-green-500 transition-colors"
            >
                <PlayIcon />
                เริ่มให้บริการ
            </button>
        )}
        <div className="flex justify-between gap-2">
            <button
            onClick={() => moveCustomer(customer.id, 'previous')}
            disabled={isFirstStation || !isInProgress}
            className="px-3 py-1 text-sm font-semibold text-white bg-gray-600 rounded-md hover:bg-gray-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
            &larr; ก่อนหน้า
            </button>
            {isLastStation ? (
            <button
                onClick={() => completeCustomer(customer.id)}
                disabled={!isInProgress}
                className="px-3 py-1 text-sm font-semibold text-white bg-teal-600 rounded-md hover:bg-teal-500 disabled:bg-teal-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                เสร็จสิ้น &rarr;
            </button>
            ) : (
            <button
                onClick={() => moveCustomer(customer.id, 'next')}
                disabled={!isInProgress}
                className="px-3 py-1 text-sm font-semibold text-white bg-sky-600 rounded-md hover:bg-sky-500 disabled:bg-sky-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
                ถัดไป &rarr;
            </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;