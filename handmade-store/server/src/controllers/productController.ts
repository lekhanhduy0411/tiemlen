import { Request, Response } from 'express';
import Product from '../models/Product';

// Lấy tất cả sản phẩm (có phân trang, tìm kiếm, lọc)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 12;
    const skip = (page - 1) * limit;

    const filter: any = { isActive: true };
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { description: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};
      if (req.query.minPrice) filter.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filter.price.$lte = Number(req.query.maxPrice);
    }

    let sort: any = { createdAt: -1 };
    const sortParam = req.query.sort as string;
    if (sortParam) {
      if (sortParam === 'price' || sortParam === 'price_asc') sort = { price: 1 };
      else if (sortParam === '-price' || sortParam === 'price_desc') sort = { price: -1 };
      else if (sortParam === '-rating' || sortParam === 'rating') sort = { rating: -1 };
      else if (sortParam === 'name') sort = { name: 1 };
      else if (sortParam === '-createdAt') sort = { createdAt: -1 };
      else if (sortParam === 'popular') sort = { sold: -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      products,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm nổi bật
export const getFeaturedProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find({ isActive: true, featured: true })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy chi tiết sản phẩm
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo sản phẩm (Admin/Staff)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Cập nhật sản phẩm (Admin/Staff)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy sản phẩm theo slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name slug');
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa sản phẩm (Admin/Staff)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    res.json({ message: 'Đã xóa sản phẩm' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Lấy tất cả sản phẩm cho admin (bao gồm không active)
export const getAllProductsAdmin = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    res.json({ products, page, totalPages: Math.ceil(total / limit), total });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
