import { Server, Socket } from 'socket.io';
import { prisma } from '../index';

interface ClientData {
  branchId?: string;
  station?: string;
}

export function setupWebSocket(io: Server) {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    const clientData: ClientData = {};

    // Join branch room
    socket.on('join-branch', (branchId: string) => {
      clientData.branchId = branchId;
      socket.join(`branch:${branchId}`);
      console.log(`Client ${socket.id} joined branch: ${branchId}`);
    });

    // Join station room
    socket.on('join-station', (data: { branchId: string; station: string }) => {
      clientData.branchId = data.branchId;
      clientData.station = data.station;
      socket.join(`branch:${data.branchId}:station:${data.station}`);
      console.log(`Client ${socket.id} joined station: ${data.station} in branch: ${data.branchId}`);
    });

    // Customer added
    socket.on('customer-added', async (customer) => {
      if (clientData.branchId) {
        // Broadcast to all clients in the same branch
        io.to(`branch:${clientData.branchId}`).emit('customer-added', customer);
      }
    });

    // Customer updated
    socket.on('customer-updated', async (customer) => {
      if (clientData.branchId) {
        io.to(`branch:${clientData.branchId}`).emit('customer-updated', customer);
      }
    });

    // Customer moved
    socket.on('customer-moved', async (data) => {
      if (clientData.branchId) {
        io.to(`branch:${clientData.branchId}`).emit('customer-moved', data);
      }
    });

    // Customer completed
    socket.on('customer-completed', async (customerId) => {
      if (clientData.branchId) {
        io.to(`branch:${clientData.branchId}`).emit('customer-completed', customerId);
      }
    });

    // Status changed
    socket.on('status-changed', async (data) => {
      if (clientData.branchId) {
        io.to(`branch:${clientData.branchId}`).emit('status-changed', data);
      }
    });

    // Request current queue
    socket.on('request-queue', async (branchId: string) => {
      try {
        const customers = await prisma.customer.findMany({
          where: {
            branchId,
            status: { in: ['WAITING', 'IN_PROGRESS'] }
          },
          orderBy: { createdAt: 'asc' }
        });
        socket.emit('queue-data', customers);
      } catch (error) {
        console.error('Error fetching queue:', error);
        socket.emit('error', { message: 'Failed to fetch queue data' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (error) => {
      console.error(`Socket error for ${socket.id}:`, error);
    });
  });

  return io;
}

// Helper function to broadcast to specific branch
export function broadcastToBranch(io: Server, branchId: string, event: string, data: any) {
  io.to(`branch:${branchId}`).emit(event, data);
}

// Helper function to broadcast to specific station
export function broadcastToStation(io: Server, branchId: string, station: string, event: string, data: any) {
  io.to(`branch:${branchId}:station:${station}`).emit(event, data);
}
