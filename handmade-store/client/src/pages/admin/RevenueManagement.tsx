import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart,
  Package, Calendar,
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  totalUsers: number;
  totalProducts: number;
  monthlyRevenue: { _id: { year: number; month: number }; revenue: number; orders: number }[];
  topProducts: any[];
  recentOrders: any[];
}

export default function RevenueManagement() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/revenue/stats')
      .then((res) => setStats(res.data))
      .catch(() => toast.error('Không thể tải dữ liệu'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!stats) return <div className="text-center text-gray-500 py-20">Không thể tải dữ liệu</div>;

  const monthNames = ['', 'Th1', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7', 'Th8', 'Th9', 'Th10', 'Th11', 'Th12'];
  const chartData = [...stats.monthlyRevenue].reverse().map((m) => ({
    name: `${monthNames[m._id.month]}/${m._id.year}`,
    revenue: m.revenue,
    orders: m.orders,
  }));

  const avgOrderValue = stats.totalOrders > 0
    ? Math.round(stats.totalRevenue / stats.deliveredOrders) || 0
    : 0;

  const deliveryRate = stats.totalOrders > 0
    ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
    : 0;

  const cancellationRate = stats.totalOrders > 0
    ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Báo cáo doanh thu</h2>
        <p className="text-sm text-gray-500 mt-1">Thống kê chi tiết về doanh thu và đơn hàng</p>
      </div>

      {/* Revenue Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Tổng doanh thu</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats.totalRevenue.toLocaleString('vi-VN')}₫</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> Từ đơn hàng đã giao
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Giá trị TB/đơn</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{avgOrderValue.toLocaleString('vi-VN')}₫</p>
          <p className="text-xs text-gray-500 mt-2">{stats.deliveredOrders} đơn đã giao</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Tỷ lệ giao hàng</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{deliveryRate}%</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-3 h-3" /> {stats.deliveredOrders}/{stats.totalOrders} đơn
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Tỷ lệ hủy</span>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{cancellationRate}%</p>
          <p className="text-xs text-red-600 flex items-center gap-1 mt-2">
            <TrendingDown className="w-3 h-3" /> {stats.cancelledOrders} đơn hủy
          </p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
            <p className="text-sm text-gray-500">12 tháng gần nhất</p>
          </div>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} />
              <YAxis fontSize={12} tick={{ fill: '#6b7280' }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip
                formatter={(value: any, name: any) => [
                  name === 'revenue' ? `${Number(value).toLocaleString('vi-VN')}₫` : value,
                  name === 'revenue' ? 'Doanh thu' : 'Đơn hàng',
                ]}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-gray-400">Chưa có dữ liệu</div>
        )}
      </div>

      {/* Orders Chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Số đơn hàng theo tháng</h3>
            <p className="text-sm text-gray-500">Biểu đồ đơn hàng</p>
          </div>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} />
              <YAxis fontSize={12} tick={{ fill: '#6b7280' }} />
              <Tooltip
                formatter={(value: any) => [value, 'Đơn hàng']}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="orders" fill="url(#ordersGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">Chưa có dữ liệu</div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top sản phẩm bán chạy</h3>
        <div className="space-y-3">
          {stats.topProducts?.map((product, index) => {
            const maxSold = stats.topProducts[0]?.sold || 1;
            const percentage = Math.round((product.sold / maxSold) * 100);
            return (
              <div key={product._id} className="flex items-center gap-4">
                <span className="text-sm font-bold text-gray-400 w-6 text-center">#{index + 1}</span>
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900 truncate">{product.name}</span>
                    <span className="text-sm font-semibold text-amber-600 ml-2">{product.sold} bán</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-full h-2 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {(!stats.topProducts || stats.topProducts.length === 0) && (
            <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu</p>
          )}
        </div>
      </div>
    </div>
  );
}
