import { Request, Response } from 'express';
import { prisma } from '../index';

// Get statistics
export async function getStatistics(req: Request, res: Response) {
  try {
    const { branchId } = req.params;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Active customers
    const activeCustomers = await prisma.customer.findMany({
      where: {
        branchId,
        status: { in: ['WAITING', 'IN_PROGRESS'] }
      }
    });

    // Completed today
    const completedToday = await prisma.customer.count({
      where: {
        branchId,
        status: 'COMPLETED',
        completedAt: { gte: todayStart }
      }
    });

    // Calculate average wait time
    const customersWithWaitTime = activeCustomers.map(c => ({
      ...c,
      waitTime: (now.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60)
    }));

    const averageWaitTime = customersWithWaitTime.length > 0
      ? customersWithWaitTime.reduce((sum, c) => sum + c.waitTime, 0) / customersWithWaitTime.length
      : 0;

    // Station stats
    const stationStats = {
      TRADE_IN: { count: 0, inProgress: 0, averageWaitTime: 0 },
      PAYMENT: { count: 0, inProgress: 0, averageWaitTime: 0 },
      DEVICE_CHECK: { count: 0, inProgress: 0, averageWaitTime: 0 },
      DATA_TRANSFER: { count: 0, inProgress: 0, averageWaitTime: 0 }
    };

    activeCustomers.forEach(customer => {
      const station = customer.station as keyof typeof stationStats;
      stationStats[station].count++;
      if (customer.status === 'IN_PROGRESS') {
        stationStats[station].inProgress++;
      }
    });

    // Calculate average wait time per station
    Object.keys(stationStats).forEach(station => {
      const stationCustomers = customersWithWaitTime.filter(c => c.station === station);
      if (stationCustomers.length > 0) {
        stationStats[station as keyof typeof stationStats].averageWaitTime = 
          stationCustomers.reduce((sum, c) => sum + c.waitTime, 0) / stationCustomers.length;
      }
    });

    res.json({
      totalCustomers: activeCustomers.length + completedToday,
      activeCustomers: activeCustomers.length,
      completedToday,
      averageWaitTime: Math.round(averageWaitTime),
      stationStats,
      currentWaitTime: customersWithWaitTime.length > 0 
        ? Math.round(Math.max(...customersWithWaitTime.map(c => c.waitTime)))
        : 0
    });  } catc
h (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
}

// Get completed customers
export async function getCompletedCustomers(req: Request, res: Response) {
  try {
    const { branchId } = req.params;
    const { limit = 100 } = req.query;

    const customers = await prisma.customer.findMany({
      where: {
        branchId,
        status: 'COMPLETED'
      },
      orderBy: { completedAt: 'desc' },
      take: parseInt(limit as string)
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching completed customers:', error);
    res.status(500).json({ error: 'Failed to fetch completed customers' });
  }
}
