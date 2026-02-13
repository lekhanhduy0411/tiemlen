import { Router } from 'express';
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
} from '../controllers/orderController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createOrder);
router.get('/my-orders', authenticate, getMyOrders);
router.get('/', authenticate, authorize('admin', 'staff'), getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id/status', authenticate, authorize('admin', 'staff'), updateOrderStatus);

export default router;
