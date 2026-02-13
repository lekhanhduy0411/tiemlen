import jwt from 'jsonwebtoken';

export const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
};

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const generateOrderId = (): string => {
    return 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const calculateDiscountedPrice = (price: number, discount: number): number => {
    return price - (price * (discount / 100));
};

export const generateToken = (userId: any): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
};