import { Router } from 'express';
import * as statsController from '../controllers/stats.controller';

const router = Router();

// Get statistics
router.get('/:branchId', statsController.getStatistics);

// Get completed customers
router.get('/:branchId/completed', statsController.getCompletedCustomers);

export default router;
