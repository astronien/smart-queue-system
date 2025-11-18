// Statistics and Analytics

import { Customer, Station } from '../types';

export interface QueueStatistics {
  totalCustomers: number;
  activeCustomers: number;
  completedToday: number;
  averageWaitTime: number;
  stationStats: {
    [key in Station]: {
      count: number;
      averageWaitTime: number;
      inProgress: number;
    };
  };
  peakHours: { hour: number; count: number }[];
  currentWaitTime: number;
}

export class StatisticsCalculator {
  static calculate(customers: Customer[], completedCustomers: Customer[] = []): QueueStatistics {
    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Calculate wait times
    const waitTimes = customers.map(c => 
      (now - new Date(c.createdAt).getTime()) / (1000 * 60)
    );
    const averageWaitTime = waitTimes.length > 0 
      ? waitTimes.reduce((a, b) => a + b, 0) / waitTimes.length 
      : 0;

    // Station statistics
    const stationStats = {} as QueueStatistics['stationStats'];
    Object.values(Station).forEach(station => {
      const stationCustomers = customers.filter(c => c.station === station);
      const stationWaitTimes = stationCustomers.map(c => 
        (now - new Date(c.createdAt).getTime()) / (1000 * 60)
      );
      
      stationStats[station] = {
        count: stationCustomers.length,
        averageWaitTime: stationWaitTimes.length > 0
          ? stationWaitTimes.reduce((a, b) => a + b, 0) / stationWaitTimes.length
          : 0,
        inProgress: stationCustomers.filter(c => c.status === 'IN_PROGRESS').length,
      };
    });

    // Peak hours analysis
    const hourCounts = new Map<number, number>();
    [...customers, ...completedCustomers].forEach(c => {
      const hour = new Date(c.createdAt).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
    });
    
    const peakHours = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Completed today
    const completedToday = completedCustomers.filter(c => 
      new Date(c.createdAt).getTime() >= todayStart.getTime()
    ).length;

    return {
      totalCustomers: customers.length + completedToday,
      activeCustomers: customers.length,
      completedToday,
      averageWaitTime: Math.round(averageWaitTime),
      stationStats,
      peakHours,
      currentWaitTime: waitTimes.length > 0 ? Math.round(Math.max(...waitTimes)) : 0,
    };
  }

  static predictWaitTime(customers: Customer[], station: Station): number {
    const stationCustomers = customers.filter(c => c.station === station);
    const inProgress = stationCustomers.filter(c => c.status === 'IN_PROGRESS').length;
    const waiting = stationCustomers.filter(c => c.status === 'WAITING').length;

    // Simple prediction: 5 minutes per customer if someone is being served, 0 if station is free
    if (inProgress > 0) {
      return (waiting + 1) * 5;
    }
    return waiting * 5;
  }
}
