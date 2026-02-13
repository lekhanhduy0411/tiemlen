import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Order } from '../types';
import { Loading, EmptyState } from '../components/common/UIComponents';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700' },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700' },
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}`)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!order) return <EmptyState icon="😕" title="Không tìm thấy đơn hàng" />;

  const status = statusLabels[order.status] || statusLabels.pending;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-olive-800">Đơn hàng #{order._id.slice(-8).toUpperCase()}</h1>
          <p className="text-sm text-olive-500 mt-1">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
        </div>
        <span className={`text-sm font-medium px-4 py-2 rounded-full ${status.color}`}>{status.label}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-5">
            <h2 className="text-lg font-serif font-semibold text-olive-800 mb-4">Sản phẩm</h2>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-cream-100 last:border-0">
                  <div>
                    <p className="font-medium text-olive-800 text-sm">{(item.product as any)?.name || 'Sản phẩm'}</p>
                    <p className="text-xs text-olive-500">Số lượng: {item.quantity} × {item.price.toLocaleString('vi-VN')}₫</p>
                  </div>
                  <span className="font-medium text-olive-800 text-sm">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-serif font-semibold text-olive-800 mb-3">Tổng cộng</h3>
            <div className="space-y-2 text-sm">
              {order.discount > 0 && (
                <div className="flex justify-between text-sage-600">
                  <span>Giảm giá:</span>
                  <span>-{order.discount.toLocaleString('vi-VN')}₫</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg text-olive-800 pt-2 border-t border-cream-200">
                <span>Tổng:</span>
                <span className="text-warm-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
              </div>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-serif font-semibold text-olive-800 mb-3">Địa chỉ giao hàng</h3>
            <p className="text-sm text-olive-600">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.ward && `${order.shippingAddress.ward}, `}
              {order.shippingAddress.district && `${order.shippingAddress.district}, `}
              {order.shippingAddress.city}
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-serif font-semibold text-olive-800 mb-3">Thanh toán</h3>
            <p className="text-sm text-olive-600">{order.paymentMethod === 'cod' ? '💵 Thanh toán khi nhận hàng' : '🏦 Chuyển khoản ngân hàng'}</p>
          </div>

          {order.note && (
            <div className="card p-5">
              <h3 className="font-serif font-semibold text-olive-800 mb-3">Ghi chú</h3>
              <p className="text-sm text-olive-600">{order.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
