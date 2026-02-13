export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  avatar: string;
  role: 'admin' | 'staff' | 'customer';
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  category: Category;
  images: string[];
  stock: number;
  sold: number;
  rating: number;
  numReviews: number;
  isActive: boolean;
  featured: boolean;
  tags: string[];
  createdAt: string;
}

export interface CartItem {
  _id?: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalAmount: number;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  user: User;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  shippingAddress: {
    street: string;
    city: string;
    district?: string;
    ward?: string;
  };
  phone: string;
  note: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'banking';
  isPaid: boolean;
  paidAt: string;
  deliveredAt: string;
  createdAt: string;
}

export interface Review {
  _id: string;
  user: User;
  product: Product;
  order: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Promotion {
  _id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderAmount: number;
  maxDiscount: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
}

export interface RevenueStats {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalProducts: number;
  monthlyRevenue: Array<{
    _id: { year: number; month: number };
    revenue: number;
    orders: number;
  }>;
  topProducts: Product[];
  recentOrders: Order[];
}
