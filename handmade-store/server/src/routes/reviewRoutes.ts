import { Router } from 'express';
import { createReview, getProductReviews, getAllReviews, deleteReview } from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, createReview);
router.get('/product/:productId', getProductReviews);
router.get('/all', authenticate, authorize('admin', 'staff'), getAllReviews);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteReview);

export default router;
