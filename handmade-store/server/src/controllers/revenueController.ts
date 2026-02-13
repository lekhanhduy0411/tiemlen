import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';

export const getRevenueStats = async (_req: Request, res: Response) => {
  try {
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);

    const totalOrders = await Order.countDocuments();
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalProducts = await Product.countDocuments();

    // Doanh thu theo tháng (12 tháng gần nhất)
    const monthlyRevenue = await Order.aggregate([
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 },
    ]);

    // Top sản phẩm bán chạy
    const topProducts = await Product.find({ isActive: true })
      .sort({ sold: -1 })
      .limit(5)
      .select('name sold price images');

    // Đơn hàng gần đây
    const recentOrders = await Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalRevenue: totalRevenue[0]?.total || 0,
      totalOrders,
      deliveredOrders,
      pendingOrders,
      cancelledOrders,
      totalUsers,
      totalProducts,
      monthlyRevenue,
      topProducts,
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
