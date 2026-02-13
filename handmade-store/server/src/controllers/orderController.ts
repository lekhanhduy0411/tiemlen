import { Response } from 'express';
import Order from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Tạo đơn hàng từ giỏ hàng
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { shippingAddress, phone, notes, paymentMethod } = req.body;
    const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    const orderItems = cart.items.map((item: any) => ({
      product: item.product._id,
      name: item.product.name,
      image: item.product.images?.[0] || '',
      price: item.price,
      quantity: item.quantity,
    }));

    const order = await Order.create({
      user: req.user!._id,
      items: orderItems,
      totalAmount: cart.totalAmount,
      shippingAddress,
      phone,
      notes,
      paymentMethod: paymentMethod || 'cod',
    });

    // Cập nhật stock và sold
    for (const item of cart.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, sold: item.quantity },
      });
    }

    // Xóa giỏ hàng
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.status(201).json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy đơn hàng của user
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user!._id })
      .populate('items.product', 'name images slug')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả đơn hàng cho admin/staff
export const getAllOrders = async (req: AuthRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (req.query.status) filter.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'fullName email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, page, totalPages: Math.ceil(total / limit), total });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật trạng thái đơn hàng (Admin/Staff)
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });

    order.status = status;
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      order.isPaid = true;
      order.paidAt = new Date();
    }
    if (status === 'cancelled') {
      // Hoàn lại stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity, sold: -item.quantity },
        });
      }
    }
    await order.save();
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'fullName email phone')
      .populate('items.product', 'name images slug');
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
