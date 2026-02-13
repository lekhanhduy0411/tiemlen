import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken, AuthRequest } from '../middleware/auth';

// Đăng ký
export const register = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password, phone } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }
    const user = await User.create({ fullName, email, password, phone });
    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Đăng nhập
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }
    const token = generateToken(user._id.toString());
    res.json({ token, user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy thông tin user đang đăng nhập
export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    res.json(req.user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật thông tin cá nhân
export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, address, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { fullName, phone, address, avatar },
      { new: true, runValidators: true }
    );
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
