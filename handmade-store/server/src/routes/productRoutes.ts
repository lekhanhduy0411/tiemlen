import { Router } from 'express';
import {
  getProducts,
  getFeaturedProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllProductsAdmin,
} from '../controllers/productController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Public routes (order matters: static paths before params)
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);

// Admin/Staff routes (must be BEFORE /:id)
router.get('/admin/all', authenticate, authorize('admin', 'staff'), getAllProductsAdmin);
router.post('/', authenticate, authorize('admin', 'staff'), createProduct);
router.put('/:id', authenticate, authorize('admin', 'staff'), updateProduct);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteProduct);

// Dynamic param route last
router.get('/:id', getProductById);

export default router;
