import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Loading, EmptyState, ConfirmModal } from '../components/common/UIComponents';

export default function CartPage() {
  const { cart, updateQuantity, removeItem, clearCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [showClear, setShowClear] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart().finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState icon="🛒" title="Giỏ hàng trống" description="Bạn chưa thêm sản phẩm nào vào giỏ hàng">
          <Link to="/products" className="btn-primary inline-block mt-4">Mua sắm ngay</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-olive-800">Giỏ hàng</h1>
        <button onClick={() => setShowClear(true)} className="text-sm text-red-500 hover:text-red-600">
          Xóa tất cả
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => {
          const product = item.product as any;
          return (
            <div key={item._id || product._id} className="card p-4 flex flex-col sm:flex-row gap-4">
              <img
                src={product.images?.[0] || 'https://placehold.co/120x120/f5f0e8/8b7355?text=SP'}
                alt={product.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
              <div className="flex-1">
                <Link to={`/products/${product.slug}`} className="font-serif font-semibold text-olive-800 hover:text-warm-600">
                  {product.name}
                </Link>
                <p className="text-warm-600 font-bold mt-1">{item.price?.toLocaleString('vi-VN')}₫</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-cream-300 rounded-lg">
                  <button onClick={() => updateQuantity(product._id, Math.max(1, item.quantity - 1))} className="px-3 py-1 text-olive-600 hover:bg-cream-100">-</button>
                  <span className="px-3 py-1 text-olive-800 font-medium text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(product._id, item.quantity + 1)} className="px-3 py-1 text-olive-600 hover:bg-cream-100">+</button>
                </div>
                <span className="font-bold text-olive-800 text-sm whitespace-nowrap">
                  {((item.price || 0) * item.quantity).toLocaleString('vi-VN')}₫
                </span>
                <button onClick={() => removeItem(product._id)} className="text-red-400 hover:text-red-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="card p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-olive-600">Tổng cộng:</span>
          <span className="text-2xl font-bold text-warm-600">{cart.totalAmount?.toLocaleString('vi-VN')}₫</span>
        </div>
        <button onClick={() => navigate('/checkout')} className="btn-primary w-full text-lg py-3">
          Đặt hàng
        </button>
        <Link to="/products" className="block text-center text-sm text-olive-500 hover:text-olive-700 mt-3">
          ← Tiếp tục mua sắm
        </Link>
      </div>

      <ConfirmModal
        open={showClear}
        title="Xóa giỏ hàng"
        message="Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?"
        confirmText="Xóa tất cả"
        variant="danger"
        onConfirm={() => { clearCart(); setShowClear(false); }}
        onCancel={() => setShowClear(false)}
      />
    </div>
  );
}
