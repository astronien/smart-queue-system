import { Request, Response } from 'express';
import { prisma } from '../index';
import { io } from '../index';
import { broadcastToBranch } from '../services/websocket.service';

const STATION_ORDER = ['TRADE_IN', 'PAYMENT', 'DEVICE_CHECK', 'DATA_TRANSFER'];

// Get all customers
export async function getCustomers(req: Request, res: Response) {
  try {
    const { branchId, station, status } = req.query;
    
    const customers = await prisma.customer.findMany({
      where: {
        ...(branchId && { branchId: branchId as string }),
        ...(station && { station: station as any }),
        ...(status && { status: status as any }),
        status: { not: 'COMPLETED' }
      },
      orderBy: { createdAt: 'asc' }
    });

    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
}

// Get customer by ID
export async function getCustomerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'Failed to fetch customer' });
  }
}

// Create new customer
export async function createCustomer(req: Request, res: Response) {
  try {
    const { firstName, lastName, phone, customFieldData, branchId = 'default' } = req.body;

    // Get or create counter for branch
    let counter = await prisma.queueCounter.findUnique({
      where: { branchId }
    });

    if (!counter) {
      counter = await prisma.queueCounter.create({
        data: { branchId, counter: 1 }
      });
    }

    // Generate queue number
    const queueNumber = `A${String(counter.counter).padStart(3, '0')}`;

    // Create customer
    const customer = await prisma.customer.create({
      data: {
        queueNumber,
        firstName,
        lastName,
        phone,
        station: STATION_ORDER[0] as any,
        status: 'WAITING',
        customFieldData: customFieldData || {},
        branchId
      }
    });

    // Update counter
    await prisma.queueCounter.update({
      where: { branchId },
      data: { counter: counter.counter + 1 }
    });

    // Broadcast to WebSocket clients
    broadcastToBranch(io, branchId, 'customer-added', customer);

    res.status(201).json(customer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}

// Update customer
export async function updateCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data
    });

    // Broadcast update
    if (customer.branchId) {
      broadcastToBranch(io, customer.branchId, 'customer-updated', customer);
    }

    res.json(customer);
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'Failed to update customer' });
  }
}

// Move customer to next/previous station
export async function moveCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { direction } = req.body; // 'next' or 'previous'

    const customer = await prisma.customer.findUnique({
      where: { id: parseInt(id) }
    });

    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const currentIndex = STATION_ORDER.indexOf(customer.station);
    let newIndex: number;

    if (direction === 'next') {
      newIndex = Math.min(currentIndex + 1, STATION_ORDER.length - 1);
    } else {
      newIndex = Math.max(currentIndex - 1, 0);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        station: STATION_ORDER[newIndex] as any,
        status: 'WAITING' // Reset status when moving
      }
    });

    // Broadcast move
    if (updatedCustomer.branchId) {
      broadcastToBranch(io, updatedCustomer.branchId, 'customer-moved', {
        customerId: updatedCustomer.id,
        fromStation: customer.station,
        toStation: updatedCustomer.station
      });
    }

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Error moving customer:', error);
    res.status(500).json({ error: 'Failed to move customer' });
  }
}

// Update customer status
export async function updateStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: { status }
    });

    // Broadcast status change
    if (customer.branchId) {
      broadcastToBranch(io, customer.branchId, 'status-changed', {
        customerId: customer.id,
        status: customer.status
      });
    }

    res.json(customer);
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ error: 'Failed to update status' });
  }
}

// Complete customer
export async function completeCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: {
        status: 'COMPLETED',
        completedAt: new Date()
      }
    });

    // Broadcast completion
    if (customer.branchId) {
      broadcastToBranch(io, customer.branchId, 'customer-completed', customer.id);
    }

    res.json(customer);
  } catch (error) {
    console.error('Error completing customer:', error);
    res.status(500).json({ error: 'Failed to complete customer' });
  }
}

// Delete customer
export async function deleteCustomer(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.customer.delete({
      where: { id: parseInt(id) }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'Failed to delete customer' });
  }
}
