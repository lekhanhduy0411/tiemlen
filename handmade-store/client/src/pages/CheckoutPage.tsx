import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Loading, EmptyState } from '../components/common/UIComponents';

export default function CheckoutPage() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({ street: '', city: '', district: '', ward: '' });
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [promoMsg, setPromoMsg] = useState('');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState icon="🛒" title="Giỏ hàng trống" description="Không có gì để thanh toán" />
      </div>
    );
  }

  const handleApplyPromo = async () => {
    if (!promoCode) return;
    try {
      const res = await api.post('/promotions/apply', { code: promoCode, orderTotal: cart.totalAmount });
      setDiscount(res.data.discount);
      setPromoMsg(`Giảm ${res.data.discount.toLocaleString('vi-VN')}₫`);
    } catch (err: any) {
      setPromoMsg(err.response?.data?.message || 'Mã không hợp lệ');
      setDiscount(0);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.street || !shippingAddress.city) {
      setError('Vui lòng nhập đầy đủ địa chỉ');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/orders', {
        shippingAddress,
        paymentMethod,
        promotionCode: promoCode || undefined,
        note: note || undefined,
      });
      await fetchCart();
      navigate(`/orders/${res.data._id}`, { state: { success: true } });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đặt hàng thất bại');
    } finally {
      setLoading(false);
    }
  };

  const finalTotal = Math.max(0, (cart.totalAmount || 0) - discount);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-8">Thanh toán</h1>

      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-6">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping */}
            <div className="card p-6">
              <h2 className="text-lg font-serif font-semibold text-olive-800 mb-4">Địa chỉ giao hàng</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-olive-700 mb-1">Địa chỉ</label>
                  <input type="text" value={shippingAddress.street} onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })} className="input-field" placeholder="Số nhà, tên đường" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-1">Phường/Xã</label>
                  <input type="text" value={shippingAddress.ward} onChange={(e) => setShippingAddress({ ...shippingAddress, ward: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-olive-700 mb-1">Quận/Huyện</label>
                  <input type="text" value={shippingAddress.district} onChange={(e) => setShippingAddress({ ...shippingAddress, district: e.target.value })} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-olive-700 mb-1">Tỉnh/Thành phố</label>
                  <input type="text" value={shippingAddress.city} onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })} className="input-field" placeholder="Hà Nội" required />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="card p-6">
              <h2 className="text-lg font-serif font-semibold text-olive-800 mb-4">Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label className={`flex items-center p-3 rounded-lg border cursor-pointer ${paymentMethod === 'cod' ? 'border-warm-500 bg-warm-50' : 'border-cream-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-3 text-warm-500" />
                  <span className="mr-2">💵</span>
                  <span className="text-olive-700 text-sm">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className={`flex items-center p-3 rounded-lg border cursor-pointer ${paymentMethod === 'banking' ? 'border-warm-500 bg-warm-50' : 'border-cream-300'}`}>
                  <input type="radio" name="payment" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="mr-3 text-warm-500" />
                  <span className="mr-2">🏦</span>
                  <span className="text-olive-700 text-sm">Chuyển khoản ngân hàng</span>
                </label>
              </div>
            </div>

            {/* Note */}
            <div className="card p-6">
              <label className="block text-sm font-medium text-olive-700 mb-1">Ghi chú</label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)} className="input-field" rows={3} placeholder="Ghi chú cho đơn hàng (tùy chọn)" />
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="text-lg font-serif font-semibold text-olive-800 mb-4">Tóm tắt đơn hàng</h2>
            <div className="space-y-2 text-sm mb-4">
              {cart.items.map((item) => (
                <div key={item._id} className="flex justify-between text-olive-600">
                  <span className="truncate mr-2">{(item.product as any).name} x{item.quantity}</span>
                  <span>{((item.price || 0) * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>

            {/* Promo */}
            <div className="flex gap-2 mb-4">
              <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="input-field flex-1 text-sm" placeholder="Mã giảm giá" />
              <button type="button" onClick={handleApplyPromo} className="btn-secondary text-sm px-3">Áp dụng</button>
            </div>
            {promoMsg && <p className={`text-xs mb-3 ${discount > 0 ? 'text-sage-600' : 'text-red-500'}`}>{promoMsg}</p>}

            <div className="border-t border-cream-200 pt-3 space-y-2">
              <div className="flex justify-between text-sm text-olive-600">
                <span>Tạm tính:</span>
                <span>{cart.totalAmount?.toLocaleString('vi-VN')}₫</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-sage-600">
                  <span>Giảm giá:</span>
                  <span>-{discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-olive-800 pt-2">
                <span>Tổng:</span>
                <span className="text-warm-600">{finalTotal.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-6">
              {loading ? 'Đang xử lý...' : 'Xác nhận đặt hàng'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
