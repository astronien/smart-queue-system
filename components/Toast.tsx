// Toast Notification Component

import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';

interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastEvent extends CustomEvent {
  detail: {
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
  };
}

const Toast: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const customEvent = event as ToastEvent;
      const { message, type } = customEvent.detail;
      const id = Date.now();
      
      setToasts(prev => [...prev, { id, message, type }]);

      // Auto remove after 5 seconds
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 5000);
    };

    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const getToastStyles = (type: string) => {
    const styles = {
      success: 'bg-green-600 border-green-500',
      error: 'bg-red-600 border-red-500',
      info: 'bg-blue-600 border-blue-500',
      warning: 'bg-amber-600 border-amber-500',
    };
    return styles[type as keyof typeof styles] || styles.info;
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${getToastStyles(toast.type)} text-white px-4 py-3 rounded-lg shadow-2xl border-l-4 flex items-center gap-3 min-w-[300px] max-w-md animate-slide-in-right pointer-events-auto`}
        >
          <p className="flex-grow">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
