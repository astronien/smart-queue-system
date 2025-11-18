import { Router } from 'express';
import * as customerController from '../controllers/customer.controller';

const router = Router();

// Get all customers (with filters)
router.get('/', customerController.getCustomers);

// Get customer by ID
router.get('/:id', customerController.getCustomerById);

// Create new customer
router.post('/', customerController.createCustomer);

// Update customer
router.put('/:id', customerController.updateCustomer);

// Move customer to next/previous station
router.patch('/:id/move', customerController.moveCustomer);

// Update customer status
router.patch('/:id/status', customerController.updateStatus);

// Complete customer
router.patch('/:id/complete', customerController.completeCustomer);

// Delete customer
router.delete('/:id', customerController.deleteCustomer);

export default router;
