import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Customer } from '../types';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3001';

interface UseWebSocketOptions {
  branchId: string;
  station?: string;
  onCustomerAdded?: (customer: Customer) => void;
  onCustomerUpdated?: (customer: Customer) => void;
  onCustomerMoved?: (data: { customerId: number; fromStation: string; toStation: string }) => void;
  onCustomerCompleted?: (customerId: number) => void;
  onStatusChanged?: (data: { customerId: number; status: string }) => void;
  onQueueData?: (customers: Customer[]) => void;
}

export function useWebSocket(options: UseWebSocketOptions) {
  const socketRef = useRef<Socket | null>(null);
  const {
    branchId,
    station,
    onCustomerAdded,
    onCustomerUpdated,
    onCustomerMoved,
    onCustomerCompleted,
    onStatusChanged,
    onQueueData,
  } = options;

  useEffect(() => {
    // Connect to WebSocket server
    const socket = io(WS_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('WebSocket connected');
      
      // Join branch room
      socket.emit('join-branch', branchId);
      
      // Join station room if specified
      if (station) {
        socket.emit('join-station', { branchId, station });
      }

      // Request current queue data
      socket.emit('request-queue', branchId);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Listen for events
    if (onCustomerAdded) {
      socket.on('customer-added', onCustomerAdded);
    }

    if (onCustomerUpdated) {
      socket.on('customer-updated', onCustomerUpdated);
    }

    if (onCustomerMoved) {
      socket.on('customer-moved', onCustomerMoved);
    }

    if (onCustomerCompleted) {
      socket.on('customer-completed', onCustomerCompleted);
    }

    if (onStatusChanged) {
      socket.on('status-changed', onStatusChanged);
    }

    if (onQueueData) {
      socket.on('queue-data', onQueueData);
    }

    // Cleanup
    return () => {
      socket.disconnect();
    };
  }, [branchId, station, onCustomerAdded, onCustomerUpdated, onCustomerMoved, onCustomerCompleted, onStatusChanged, onQueueData]);

  // Emit events
  const emitCustomerAdded = useCallback((customer: Customer) => {
    socketRef.current?.emit('customer-added', customer);
  }, []);

  const emitCustomerUpdated = useCallback((customer: Customer) => {
    socketRef.current?.emit('customer-updated', customer);
  }, []);

  const emitCustomerMoved = useCallback((data: { customerId: number; fromStation: string; toStation: string }) => {
    socketRef.current?.emit('customer-moved', data);
  }, []);

  const emitCustomerCompleted = useCallback((customerId: number) => {
    socketRef.current?.emit('customer-completed', customerId);
  }, []);

  const emitStatusChanged = useCallback((data: { customerId: number; status: string }) => {
    socketRef.current?.emit('status-changed', data);
  }, []);

  const requestQueue = useCallback(() => {
    socketRef.current?.emit('request-queue', branchId);
  }, [branchId]);

  return {
    socket: socketRef.current,
    emitCustomerAdded,
    emitCustomerUpdated,
    emitCustomerMoved,
    emitCustomerCompleted,
    emitStatusChanged,
    requestQueue,
  };
}
