import { Request, Response } from 'express';
import Promotion from '../models/Promotion';

export const getPromotions = async (_req: Request, res: Response) => {
  try {
    const promotions = await Promotion.find().sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getActivePromotions = async (_req: Request, res: Response) => {
  try {
    const now = new Date();
    const promotions = await Promotion.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });
    res.json(promotions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createPromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.create(req.body);
    res.status(201).json(promotion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePromotion = async (req: Request, res: Response) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!promotion) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
    res.json(promotion);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePromotion = async (req: Request, res: Response) => {
  try {
    await Promotion.findByIdAndDelete(req.params.id);
    res.json({ message: 'Đã xóa khuyến mãi' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Kiểm tra & áp dụng mã giảm giá
export const applyPromotion = async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body;
    const now = new Date();

    const promotion = await Promotion.findOne({
      code: code.toUpperCase(),
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    });

    if (!promotion) {
      return res.status(404).json({ message: 'Mã giảm giá không hợp lệ hoặc đã hết hạn' });
    }

    if (promotion.usageLimit > 0 && promotion.usedCount >= promotion.usageLimit) {
      return res.status(400).json({ message: 'Mã giảm giá đã hết lượt sử dụng' });
    }

    if (orderAmount < promotion.minOrderAmount) {
      return res.status(400).json({
        message: `Đơn hàng tối thiểu ${promotion.minOrderAmount.toLocaleString('vi-VN')}đ`,
      });
    }

    let discount = 0;
    if (promotion.type === 'percentage') {
      discount = (orderAmount * promotion.value) / 100;
      if (promotion.maxDiscount > 0) discount = Math.min(discount, promotion.maxDiscount);
    } else {
      discount = promotion.value;
    }

    res.json({ discount, promotion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
