import { Request, Response } from 'express';
import Review from '../models/Review';
import Order from '../models/Order';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Tạo đánh giá (chỉ khi đã mua hàng và đã giao)
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Kiểm tra đơn hàng đã giao chưa
    const order = await Order.findOne({
      _id: orderId,
      user: req.user!._id,
      status: 'delivered',
      'items.product': productId,
    });

    if (!order) {
      return res.status(400).json({
        message: 'Bạn chỉ có thể đánh giá sản phẩm khi đã mua và nhận hàng thành công',
      });
    }

    // Kiểm tra đã đánh giá chưa
    const existingReview = await Review.findOne({
      user: req.user!._id,
      product: productId,
      order: orderId,
    });
    if (existingReview) {
      return res.status(400).json({ message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng này' });
    }

    const review = await Review.create({
      user: req.user!._id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    // Cập nhật rating trung bình của sản phẩm
    const reviews = await Review.find({ product: productId, isApproved: true });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    await review.populate('user', 'fullName avatar');
    res.status(201).json(review);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy đánh giá của sản phẩm
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đánh giá (Admin/Staff)
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find()
        .populate('user', 'fullName email')
        .populate('product', 'name images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Review.countDocuments(),
    ]);

    res.json({ reviews, page, totalPages: Math.ceil(total / limit), total });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa đánh giá (Admin/Staff)
export const deleteReview = async (req: Request, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ message: 'Không tìm thấy đánh giá' });

    // Cập nhật lại rating sản phẩm
    const reviews = await Review.find({ product: review.product, isApproved: true });
    const avgRating = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(avgRating * 10) / 10,
      numReviews: reviews.length,
    });

    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
