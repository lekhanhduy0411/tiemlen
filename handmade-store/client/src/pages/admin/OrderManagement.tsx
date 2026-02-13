import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Order } from '../../types';
import {
  Search, Eye, ShoppingCart, Filter, ChevronLeft, ChevronRight,
  Clock, CheckCircle, Truck, XCircle, Package as PackageIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-purple-100 text-purple-700 border-purple-200',
  shipping: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons: Record<string, any> = {
  pending: Clock,
  confirmed: CheckCircle,
  processing: PackageIcon,
  shipping: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

const statusOptions = ['', 'pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'];

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadOrders();
  }, [page, statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/orders', { params });
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(orders.map((o) => (o._id === orderId ? { ...o, status: newStatus as any } : o)));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus as any });
      }
      toast.success(`Đã cập nhật trạng thái: ${statusLabels[newStatus]}`);
    } catch {
      toast.error('Không thể cập nhật trạng thái');
    }
  };

  const viewOrder = async (orderId: string) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch {
      toast.error('Không thể tải chi tiết đơn hàng');
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-500 mt-1">{total} đơn hàng</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusOptions.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              statusFilter === s
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s ? statusLabels[s] : 'Tất cả'}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã đơn</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Khách hàng</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thanh toán</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => {
                const StatusIcon = statusIcons[order.status] || Clock;
                return (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-mono text-sm font-medium text-gray-900">#{order._id.slice(-6)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{(order.user as any)?.fullName || 'N/A'}</p>
                        <p className="text-xs text-gray-500">{(order.user as any)?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-semibold text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')}₫</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                        order.paymentMethod === 'cod' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {order.paymentMethod === 'cod' ? 'COD' : 'Banking'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer ${statusColors[order.status]} focus:outline-none`}
                      >
                        {Object.entries(statusLabels).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => viewOrder(order._id)}
                        className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {orders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có đơn hàng nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Đơn hàng #{selectedOrder._id.slice(-6)}</h3>
                <p className="text-sm text-gray-500">{new Date(selectedOrder.createdAt).toLocaleString('vi-VN')}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-lg">✕</button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Thông tin khách hàng</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-gray-500">Họ tên:</span> <span className="font-medium">{(selectedOrder.user as any)?.fullName}</span></div>
                  <div><span className="text-gray-500">Email:</span> <span className="font-medium">{(selectedOrder.user as any)?.email}</span></div>
                  <div><span className="text-gray-500">SĐT:</span> <span className="font-medium">{selectedOrder.phone}</span></div>
                  <div><span className="text-gray-500">Thanh toán:</span> <span className="font-medium">{selectedOrder.paymentMethod === 'cod' ? 'COD' : 'Banking'}</span></div>
                </div>
                {selectedOrder.shippingAddress && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Địa chỉ:</span>{' '}
                    <span className="font-medium">
                      {typeof selectedOrder.shippingAddress === 'object'
                        ? `${selectedOrder.shippingAddress.street}, ${selectedOrder.shippingAddress.ward || ''} ${selectedOrder.shippingAddress.district || ''}, ${selectedOrder.shippingAddress.city}`
                        : selectedOrder.shippingAddress}
                    </span>
                  </div>
                )}
                {selectedOrder.note && (
                  <div className="mt-2 text-sm">
                    <span className="text-gray-500">Ghi chú:</span> <span className="font-medium">{selectedOrder.note}</span>
                  </div>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Sản phẩm ({selectedOrder.items.length})</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        {item.image ? (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <PackageIcon className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">SL: {item.quantity} × {item.price?.toLocaleString('vi-VN')}₫</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">{(item.quantity * item.price).toLocaleString('vi-VN')}₫</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-amber-50 rounded-xl p-4 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Tổng cộng</span>
                <span className="text-xl font-bold text-amber-600">{selectedOrder.totalAmount?.toLocaleString('vi-VN')}₫</span>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">Cập nhật trạng thái</h4>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateStatus(selectedOrder._id, e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border font-medium ${statusColors[selectedOrder.status]} focus:outline-none`}
                >
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
