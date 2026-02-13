import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/common/UIComponents';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  recentOrders: any[];
  monthlyRevenue: { _id: { year: number; month: number }; revenue: number; count: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'orders' | 'products' | 'categories' | 'users' | 'promotions' | 'reviews'>('overview');

  useEffect(() => {
    api.get('/revenue/stats')
      .then((res) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  const tabs = [
    { key: 'overview', label: '📊 Tổng quan' },
    { key: 'orders', label: '📦 Đơn hàng' },
    { key: 'products', label: '🛍️ Sản phẩm' },
    { key: 'categories', label: '📂 Danh mục' },
    { key: 'users', label: '👥 Người dùng' },
    { key: 'promotions', label: '🎁 Khuyến mãi' },
    { key: 'reviews', label: '⭐ Đánh giá' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-6">Quản trị hệ thống</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === key ? 'bg-warm-500 text-white' : 'bg-cream-100 text-olive-600 hover:bg-cream-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && stats && <OverviewTab stats={stats} />}
      {tab === 'orders' && <OrdersTab />}
      {tab === 'products' && <ProductsTab />}
      {tab === 'categories' && <CategoriesTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'promotions' && <PromotionsTab />}
      {tab === 'reviews' && <ReviewsTab />}
    </div>
  );
}

function OverviewTab({ stats }: { stats: Stats }) {
  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Doanh thu', value: `${(stats.totalRevenue || 0).toLocaleString('vi-VN')}₫`, icon: '💰', bg: 'bg-warm-50' },
          { label: 'Đơn hàng', value: stats.totalOrders || 0, icon: '📦', bg: 'bg-sage-50' },
          { label: 'Sản phẩm', value: stats.totalProducts || 0, icon: '🛍️', bg: 'bg-cream-100' },
          { label: 'Người dùng', value: stats.totalUsers || 0, icon: '👥', bg: 'bg-blue-50' },
        ].map((item, i) => (
          <div key={i} className={`${item.bg} rounded-xl p-5`}>
            <span className="text-2xl">{item.icon}</span>
            <p className="text-2xl font-bold text-olive-800 mt-2">{item.value}</p>
            <p className="text-sm text-olive-500">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      {stats.recentOrders?.length > 0 && (
        <div className="card p-5">
          <h3 className="font-serif font-semibold text-olive-800 mb-4">Đơn hàng gần đây</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream-200 text-olive-500">
                  <th className="text-left py-2">Mã</th>
                  <th className="text-left py-2">Khách hàng</th>
                  <th className="text-left py-2">Trạng thái</th>
                  <th className="text-right py-2">Tổng tiền</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-b border-cream-100">
                    <td className="py-2 font-mono text-xs">#{order._id.slice(-8)}</td>
                    <td className="py-2">{order.user?.fullName || '—'}</td>
                    <td className="py-2"><span className="badge">{order.status}</span></td>
                    <td className="py-2 text-right font-medium">{order.totalAmount?.toLocaleString('vi-VN')}₫</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders').then((r) => setOrders(r.data.orders || r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      setOrders(orders.map((o) => o._id === id ? { ...o, status } : o));
    } catch {}
  };

  if (loading) return <Loading />;
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream-200 text-olive-500">
            <th className="text-left py-2">Mã</th>
            <th className="text-left py-2">Khách hàng</th>
            <th className="text-left py-2">Tổng tiền</th>
            <th className="text-left py-2">Trạng thái</th>
            <th className="text-left py-2">Ngày tạo</th>
            <th className="text-left py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-cream-100">
              <td className="py-2 font-mono text-xs">#{order._id.slice(-8)}</td>
              <td className="py-2">{order.user?.fullName || '—'}</td>
              <td className="py-2 font-medium">{order.totalAmount?.toLocaleString('vi-VN')}₫</td>
              <td className="py-2">
                <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="text-xs border border-cream-300 rounded px-2 py-1">
                  {['pending','confirmed','processing','shipping','delivered','cancelled'].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="py-2 text-xs text-olive-500">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
              <td className="py-2">
                <Link to={`/orders/${order._id}`} className="text-warm-600 hover:underline text-xs">Chi tiết</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  useEffect(() => {
    api.get('/products/admin/all').then((r) => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const deleteProduct = async (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    try { await api.delete(`/products/${id}`); setProducts(products.filter((p) => p._id !== id)); } catch {}
  };

  if (loading) return <Loading />;
  return (
    <div>
      <button onClick={() => setEditing({})} className="btn-primary mb-4 text-sm">+ Thêm sản phẩm</button>
      {editing && <ProductForm product={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); api.get('/products/admin/all').then((r) => setProducts(r.data)); }} />}
      <div className="card p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-olive-500">
              <th className="text-left py-2">Tên</th>
              <th className="text-left py-2">Giá</th>
              <th className="text-left py-2">Kho</th>
              <th className="text-left py-2">Trạng thái</th>
              <th className="text-left py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-cream-100">
                <td className="py-2 font-medium">{p.name}</td>
                <td className="py-2">{p.price?.toLocaleString('vi-VN')}₫</td>
                <td className="py-2">{p.stock}</td>
                <td className="py-2"><span className={`text-xs ${p.isActive ? 'text-green-600' : 'text-red-500'}`}>{p.isActive ? 'Hoạt động' : 'Ẩn'}</span></td>
                <td className="py-2 space-x-2">
                  <button onClick={() => setEditing(p)} className="text-warm-600 hover:underline text-xs">Sửa</button>
                  <button onClick={() => deleteProduct(p._id)} className="text-red-500 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }: { product: any; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    name: product.name || '', description: product.description || '', price: product.price || 0,
    originalPrice: product.originalPrice || 0, stock: product.stock || 0, category: product.category?._id || product.category || '',
    images: (product.images || []).join(', '), featured: product.featured || false, isActive: product.isActive !== false,
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { api.get('/categories/all').then((r) => setCategories(r.data)).catch(() => {}); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = { ...form, images: form.images.split(',').map((s: string) => s.trim()).filter(Boolean) };
    try {
      if (product._id) await api.put(`/products/${product._id}`, data);
      else await api.post('/products', data);
      onSaved();
    } catch {} finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-lg w-full p-6 space-y-3 my-8">
        <h3 className="text-lg font-serif font-bold text-olive-800">{product._id ? 'Sửa' : 'Thêm'} sản phẩm</h3>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tên sản phẩm" className="input-field" required />
        <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Mô tả" className="input-field" rows={3} />
        <div className="grid grid-cols-3 gap-3">
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Giá" className="input-field" />
          <input type="number" value={form.originalPrice} onChange={(e) => setForm({ ...form, originalPrice: Number(e.target.value) })} placeholder="Giá gốc" className="input-field" />
          <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} placeholder="Kho" className="input-field" />
        </div>
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} placeholder="URLs ảnh (cách nhau bởi dấu phẩy)" className="input-field" />
        <label className="flex items-center gap-2 text-sm text-olive-700">
          <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Sản phẩm nổi bật
        </label>
        <label className="flex items-center gap-2 text-sm text-olive-700">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Đang hoạt động
        </label>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary text-sm">Hủy</button>
          <button type="submit" disabled={loading} className="btn-primary text-sm">{loading ? 'Đang lưu...' : 'Lưu'}</button>
        </div>
      </form>
    </div>
  );
}

import { FormEvent } from 'react';

function CategoriesTab() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const reload = () => api.get('/categories/all').then((r) => setCategories(r.data));
  useEffect(() => { reload().finally(() => setLoading(false)); }, []);

  const deleteCategory = async (id: string) => {
    if (!confirm('Xóa danh mục này?')) return;
    try { await api.delete(`/categories/${id}`); reload(); } catch {}
  };

  if (loading) return <Loading />;
  return (
    <div>
      <button onClick={() => setEditing({})} className="btn-primary mb-4 text-sm">+ Thêm danh mục</button>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (editing._id) await api.put(`/categories/${editing._id}`, editing);
            else await api.post('/categories', editing);
            setEditing(null); reload();
          }} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3">
            <h3 className="text-lg font-serif font-bold text-olive-800">{editing._id ? 'Sửa' : 'Thêm'} danh mục</h3>
            <input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="Tên danh mục" className="input-field" required />
            <input value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Mô tả" className="input-field" />
            <input value={editing.image || ''} onChange={(e) => setEditing({ ...editing, image: e.target.value })} placeholder="Biểu tượng (emoji)" className="input-field" />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">Hủy</button>
              <button type="submit" className="btn-primary text-sm">Lưu</button>
            </div>
          </form>
        </div>
      )}
      <div className="card p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((cat: any) => (
            <div key={cat._id} className="flex items-center justify-between p-3 bg-cream-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cat.image || '📦'}</span>
                <span className="font-medium text-olive-800 text-sm">{cat.name}</span>
              </div>
              <div className="space-x-2">
                <button onClick={() => setEditing(cat)} className="text-warm-600 hover:underline text-xs">Sửa</button>
                <button onClick={() => deleteCategory(cat._id)} className="text-red-500 hover:underline text-xs">Xóa</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function UsersTab() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { api.get('/users').then((r) => setUsers(r.data.users || r.data)).catch(() => {}).finally(() => setLoading(false)); }, []);

  const updateUser = async (id: string, data: any) => {
    try { await api.put(`/users/${id}`, data); setUsers(users.map((u) => u._id === id ? { ...u, ...data } : u)); } catch {}
  };

  if (loading) return <Loading />;
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream-200 text-olive-500">
            <th className="text-left py-2">Tên</th>
            <th className="text-left py-2">Email</th>
            <th className="text-left py-2">Vai trò</th>
            <th className="text-left py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user._id} className="border-b border-cream-100">
              <td className="py-2 font-medium">{user.fullName}</td>
              <td className="py-2 text-olive-500">{user.email}</td>
              <td className="py-2">
                <select value={user.role} onChange={(e) => updateUser(user._id, { role: e.target.value })}
                  className="text-xs border border-cream-300 rounded px-2 py-1">
                  <option value="customer">customer</option>
                  <option value="staff">staff</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td className="py-2">
                <button onClick={() => updateUser(user._id, { isActive: !user.isActive })}
                  className={`text-xs font-medium ${user.isActive ? 'text-green-600' : 'text-red-500'}`}>
                  {user.isActive ? 'Hoạt động' : 'Bị khóa'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PromotionsTab() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);

  const reload = () => api.get('/promotions').then((r) => setPromotions(r.data));
  useEffect(() => { reload().finally(() => setLoading(false)); }, []);

  if (loading) return <Loading />;
  return (
    <div>
      <button onClick={() => setEditing({})} className="btn-primary mb-4 text-sm">+ Thêm khuyến mãi</button>
      {editing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <form onSubmit={async (e) => {
            e.preventDefault();
            if (editing._id) await api.put(`/promotions/${editing._id}`, editing);
            else await api.post('/promotions', editing);
            setEditing(null); reload();
          }} className="bg-white rounded-xl max-w-md w-full p-6 space-y-3">
            <h3 className="text-lg font-serif font-bold text-olive-800">{editing._id ? 'Sửa' : 'Thêm'} khuyến mãi</h3>
            <input value={editing.code || ''} onChange={(e) => setEditing({ ...editing, code: e.target.value })} placeholder="Mã khuyến mãi" className="input-field" required />
            <input value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} placeholder="Mô tả" className="input-field" />
            <select value={editing.type || 'percentage'} onChange={(e) => setEditing({ ...editing, type: e.target.value })} className="input-field">
              <option value="percentage">Phần trăm</option>
              <option value="fixed">Cố định</option>
            </select>
            <input type="number" value={editing.value || 0} onChange={(e) => setEditing({ ...editing, value: Number(e.target.value) })} placeholder="Giá trị" className="input-field" />
            <input type="number" value={editing.minOrderAmount || 0} onChange={(e) => setEditing({ ...editing, minOrderAmount: Number(e.target.value) })} placeholder="Đơn tối thiểu" className="input-field" />
            <input type="number" value={editing.maxUses || 100} onChange={(e) => setEditing({ ...editing, maxUses: Number(e.target.value) })} placeholder="Số lượt dùng tối đa" className="input-field" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={editing.startDate?.slice(0, 10) || ''} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} className="input-field" />
              <input type="date" value={editing.endDate?.slice(0, 10) || ''} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} className="input-field" />
            </div>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setEditing(null)} className="btn-secondary text-sm">Hủy</button>
              <button type="submit" className="btn-primary text-sm">Lưu</button>
            </div>
          </form>
        </div>
      )}
      <div className="card p-5 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-200 text-olive-500">
              <th className="text-left py-2">Mã</th>
              <th className="text-left py-2">Loại</th>
              <th className="text-left py-2">Giá trị</th>
              <th className="text-left py-2">Đã dùng</th>
              <th className="text-left py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p: any) => (
              <tr key={p._id} className="border-b border-cream-100">
                <td className="py-2 font-mono font-medium">{p.code}</td>
                <td className="py-2">{p.type === 'percentage' ? 'Phần trăm' : 'Cố định'}</td>
                <td className="py-2">{p.type === 'percentage' ? `${p.value}%` : `${p.value?.toLocaleString('vi-VN')}₫`}</td>
                <td className="py-2">{p.usedCount || 0}/{p.maxUses}</td>
                <td className="py-2 space-x-2">
                  <button onClick={() => setEditing(p)} className="text-warm-600 hover:underline text-xs">Sửa</button>
                  <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/promotions/${p._id}`); reload(); } }} className="text-red-500 hover:underline text-xs">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ReviewsTab() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = () => api.get('/reviews').then((r) => setReviews(r.data));
  useEffect(() => { reload().finally(() => setLoading(false)); }, []);

  if (loading) return <Loading />;
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream-200 text-olive-500">
            <th className="text-left py-2">Người dùng</th>
            <th className="text-left py-2">Sản phẩm</th>
            <th className="text-left py-2">Sao</th>
            <th className="text-left py-2">Nội dung</th>
            <th className="text-left py-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r: any) => (
            <tr key={r._id} className="border-b border-cream-100">
              <td className="py-2">{r.user?.fullName || '—'}</td>
              <td className="py-2">{r.product?.name || '—'}</td>
              <td className="py-2">{'⭐'.repeat(r.rating)}</td>
              <td className="py-2 max-w-xs truncate text-olive-600">{r.comment || '—'}</td>
              <td className="py-2">
                <button onClick={async () => { if (confirm('Xóa đánh giá?')) { await api.delete(`/reviews/${r._id}`); reload(); } }} className="text-red-500 hover:underline text-xs">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
