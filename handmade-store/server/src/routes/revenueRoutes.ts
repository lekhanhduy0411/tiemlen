import { Router } from 'express';
import { getRevenueStats } from '../controllers/revenueController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, authorize('admin', 'staff'), getRevenueStats);

export default router;
