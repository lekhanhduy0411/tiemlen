import { Router } from 'express';
import {
  getPromotions,
  getActivePromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  applyPromotion,
} from '../controllers/promotionController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/active', getActivePromotions);
router.post('/apply', authenticate, applyPromotion);
router.get('/', authenticate, authorize('admin', 'staff'), getPromotions);
router.post('/', authenticate, authorize('admin', 'staff'), createPromotion);
router.put('/:id', authenticate, authorize('admin', 'staff'), updatePromotion);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deletePromotion);

export default router;
