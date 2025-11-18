import { Router } from 'express';
import * as settingsController from '../controllers/settings.controller';

const router = Router();

// Get settings for branch
router.get('/:branchId', settingsController.getSettings);

// Update settings
router.put('/:branchId', settingsController.updateSettings);

export default router;
