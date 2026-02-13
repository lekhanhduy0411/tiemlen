import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Loading } from '../components/common/UIComponents';

export default function StaffDashboard() {
  const [tab, setTab] = useState<'orders' | 'products' | 'reviews' | 'chat'>('orders');

  const tabs = [
    { key: 'orders', label: '📦 Đơn hàng' },
    { key: 'products', label: '🛍️ Sản phẩm' },
    { key: 'reviews', label: '⭐ Đánh giá' },
    { key: 'chat', label: '💬 Chat' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-6">Quản lý (Nhân viên)</h1>

      <div className="flex overflow-x-auto gap-2 mb-8 pb-2">
        {tabs.map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${tab === key ? 'bg-warm-500 text-white' : 'bg-cream-100 text-olive-600 hover:bg-cream-200'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'orders' && <StaffOrders />}
      {tab === 'products' && <StaffProducts />}
      {tab === 'reviews' && <StaffReviews />}
      {tab === 'chat' && <StaffChat />}
    </div>
  );
}

function StaffOrders() {
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/admin/all').then((r) => setProducts(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;
  return (
    <div className="card p-5 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-cream-200 text-olive-500">
            <th className="text-left py-2">Tên</th>
            <th className="text-left py-2">Giá</th>
            <th className="text-left py-2">Kho</th>
            <th className="text-left py-2">Rating</th>
            <th className="text-left py-2">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-cream-100">
              <td className="py-2 font-medium">{p.name}</td>
              <td className="py-2">{p.price?.toLocaleString('vi-VN')}₫</td>
              <td className="py-2">{p.stock}</td>
              <td className="py-2">⭐ {p.rating?.toFixed(1)}</td>
              <td className="py-2"><span className={`text-xs ${p.isActive ? 'text-green-600' : 'text-red-500'}`}>{p.isActive ? 'Hoạt động' : 'Ẩn'}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffReviews() {
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
                <button onClick={async () => { if (confirm('Xóa?')) { await api.delete(`/reviews/${r._id}`); reload(); } }} className="text-red-500 hover:underline text-xs">Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffChat() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/chat/conversations').then((r) => setConversations(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    api.get(`/chat/history/${selectedUser}`).then((r) => setMessages(r.data)).catch(() => {});
  }, [selectedUser]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    try {
      await api.post('/chat/send', { receiverId: selectedUser, content: newMsg });
      setNewMsg('');
      api.get(`/chat/history/${selectedUser}`).then((r) => setMessages(r.data));
    } catch {}
  };

  if (loading) return <Loading />;
  return (
    <div className="card overflow-hidden" style={{ height: '500px' }}>
      <div className="grid grid-cols-3 h-full">
        <div className="border-r border-cream-200 overflow-y-auto">
          <h3 className="p-3 font-serif font-semibold text-olive-800 border-b border-cream-200">Cuộc trò chuyện</h3>
          {conversations.map((c: any) => (
            <button key={c._id} onClick={() => setSelectedUser(c._id)}
              className={`w-full text-left p-3 text-sm border-b border-cream-100 ${selectedUser === c._id ? 'bg-warm-50' : 'hover:bg-cream-50'}`}>
              <p className="font-medium text-olive-800">{c.fullName}</p>
              <p className="text-xs text-olive-500">{c.email}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="p-3 text-sm text-olive-500">Chưa có cuộc trò chuyện</p>}
        </div>
        <div className="col-span-2 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {messages.map((msg: any) => (
              <div key={msg._id} className={`flex ${msg.sender === selectedUser ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-xs rounded-lg px-3 py-2 text-sm ${msg.sender === selectedUser ? 'bg-cream-200 text-olive-800' : 'bg-warm-500 text-white'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          {selectedUser && (
            <div className="border-t border-cream-200 p-3 flex gap-2">
              <input value={newMsg} onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="input-field flex-1 text-sm" placeholder="Nhập tin nhắn..." />
              <button onClick={sendMessage} className="btn-primary text-sm px-4">Gửi</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
