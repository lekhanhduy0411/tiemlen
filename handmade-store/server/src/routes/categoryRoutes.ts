import { Router } from 'express';
import {
  getCategories,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getCategories);
router.get('/all', authenticate, authorize('admin', 'staff'), getAllCategories);
router.post('/', authenticate, authorize('admin', 'staff'), createCategory);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateCategory);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteCategory);

export default router;
