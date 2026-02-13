import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import {
  TrendingUp, ShoppingCart, Package, Users,
  DollarSign, ArrowUpRight, ArrowDownRight, Eye,
} from 'lucide-react';
import api from '../../services/api';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  deliveredOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  recentOrders: any[];
  monthlyRevenue: { _id: { year: number; month: number }; revenue: number; orders: number }[];
  topProducts: any[];
}

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6', '#ec4899'];

const statusLabels: Record<string, string> = {
  pending: 'Chờ xử lý',
  confirmed: 'Đã xác nhận',
  processing: 'Đang xử lý',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipping: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/revenue/stats')
      .then((res) => setStats(res.data))
      .catch(console.error)
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

  const orderStatusData = [
    { name: 'Chờ xử lý', value: stats.pendingOrders, color: '#f59e0b' },
    { name: 'Đã giao', value: stats.deliveredOrders, color: '#10b981' },
    { name: 'Đã hủy', value: stats.cancelledOrders, color: '#ef4444' },
    { name: 'Khác', value: stats.totalOrders - stats.pendingOrders - stats.deliveredOrders - stats.cancelledOrders, color: '#6b7280' },
  ].filter((d) => d.value > 0);

  const statCards = [
    {
      label: 'Tổng doanh thu',
      value: `${(stats.totalRevenue || 0).toLocaleString('vi-VN')}₫`,
      icon: DollarSign,
      change: '+12.5%',
      up: true,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50',
    },
    {
      label: 'Đơn hàng',
      value: stats.totalOrders,
      icon: ShoppingCart,
      change: `${stats.pendingOrders} chờ xử lý`,
      up: true,
      gradient: 'from-blue-500 to-indigo-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      change: 'Đang bán',
      up: true,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Khách hàng',
      value: stats.totalUsers,
      icon: Users,
      change: 'Đã đăng ký',
      up: true,
      gradient: 'from-purple-500 to-pink-500',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center shadow-lg`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex items-center mt-3 text-xs">
              {card.up ? (
                <ArrowUpRight className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="w-3 h-3 text-red-500 mr-1" />
              )}
              <span className={card.up ? 'text-green-600' : 'text-red-600'}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Doanh thu theo tháng</h3>
              <p className="text-sm text-gray-500">Biểu đồ doanh thu 12 tháng gần nhất</p>
            </div>
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" fontSize={12} tick={{ fill: '#6b7280' }} />
                <YAxis fontSize={12} tick={{ fill: '#6b7280' }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                <Tooltip
                  formatter={(value: any) => [`${Number(value).toLocaleString('vi-VN')}₫`, 'Doanh thu']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#ea580c" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Chưa có dữ liệu</div>
          )}
        </div>

        {/* Order Status Pie */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
          {orderStatusData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [value, 'Đơn hàng']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {orderStatusData.map((d, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-600">{d.name}</span>
                    </div>
                    <span className="font-medium text-gray-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">Chưa có dữ liệu</div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 pb-0">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
            <Link to="/admin/orders" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6 pt-4">
            <div className="space-y-3">
              {stats.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <ShoppingCart className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">#{order._id.slice(-6)}</p>
                      <p className="text-xs text-gray-500">{order.user?.fullName || 'Khách hàng'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{order.totalAmount?.toLocaleString('vi-VN')}₫</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>
              ))}
              {stats.recentOrders.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">Chưa có đơn hàng</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 pb-0">
            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
            <Link to="/admin/products" className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="p-6 pt-4">
            <div className="space-y-3">
              {stats.topProducts?.map((product: any, index: number) => (
                <div key={product._id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.price?.toLocaleString('vi-VN')}₫</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-600">{product.sold || 0} đã bán</p>
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                  </div>
                </div>
              ))}
              {(!stats.topProducts || stats.topProducts.length === 0) && (
                <p className="text-sm text-gray-400 text-center py-8">Chưa có dữ liệu</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
