
import { Station } from './types';

export const STATIONS: { id: Station; title: string; color: string; textColor: string }[] = [
  { id: Station.TRADE_IN, title: 'สเตชั่นเทรดอิน (Trade-in)', color: 'bg-sky-800', textColor: 'text-sky-300' },
  { id: Station.PAYMENT, title: 'สเตชั่นคิดเงิน (Payment)', color: 'bg-teal-800', textColor: 'text-teal-300' },
  { id: Station.DEVICE_CHECK, title: 'สเตชั่นเช็คเครื่อง (Device Check)', color: 'bg-amber-800', textColor: 'text-amber-300' },
  { id: Station.DATA_TRANSFER, title: 'สเตชั่นย้าย/เช็คข้อมูล (Data Transfer)', color: 'bg-indigo-800', textColor: 'text-indigo-300' },
];

export const STATION_ORDER: Station[] = STATIONS.map(s => s.id);
