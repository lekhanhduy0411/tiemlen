import { Response } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// Lấy giỏ hàng
export const getCart = async (req: AuthRequest, res: Response) => {
  try {
    let cart = await Cart.findOne({ user: req.user!._id }).populate(
      'items.product',
      'name images price stock slug'
    );
    if (!cart) {
      cart = await Cart.create({ user: req.user!._id, items: [] });
    }
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Thêm vào giỏ hàng
export const addToCart = async (req: AuthRequest, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    if (product.stock < quantity) return res.status(400).json({ message: 'Sản phẩm hết hàng' });

    let cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      cart = new Cart({ user: req.user!._id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.price = product.price;
    } else {
      cart.items.push({ product: productId, quantity, price: product.price });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price stock slug');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật số lượng
export const updateCartItem = async (req: AuthRequest, res: Response) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    const item = cart.items.find((item) => item.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Sản phẩm không có trong giỏ' });

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images price stock slug');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa khỏi giỏ hàng
export const removeFromCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });

    cart.items = cart.items.filter((item) => item.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate('items.product', 'name images price stock slug');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req: AuthRequest, res: Response) => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id });
    if (cart) {
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
    }
    res.json({ message: 'Đã xóa giỏ hàng' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
