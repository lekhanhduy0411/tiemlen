import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then((res) => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState icon="📦" title="Chưa có đơn hàng" description="Bạn chưa đặt đơn hàng nào">
          <Link to="/products" className="btn-primary inline-block mt-4">Mua sắm ngay</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-8">Đơn hàng của tôi</h1>
      <div className="space-y-4">
        {orders.map((order) => {
          const status = statusLabels[order.status] || statusLabels.pending;
          return (
            <Link to={`/orders/${order._id}`} key={order._id} className="card p-5 block hover:shadow-lg transition-shadow">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <p className="text-sm text-olive-500">Đơn hàng #{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-olive-400">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${status.color}`}>
                    {status.label}
                  </span>
                  <span className="font-bold text-warm-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {order.items.slice(0, 3).map((item, i) => (
                  <span key={i} className="text-xs text-olive-500 bg-cream-100 px-2 py-1 rounded">
                    {(item.product as any)?.name || 'Sản phẩm'} x{item.quantity}
                  </span>
                ))}
                {order.items.length > 3 && <span className="text-xs text-olive-400">+{order.items.length - 3} sản phẩm khác</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
