import { useState, FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setMsg(''); setError(''); setLoading(true);
    try {
      await api.put('/auth/profile', { fullName, phone, address, currentPassword: currentPassword || undefined, newPassword: newPassword || undefined });
      setMsg('Cập nhật thành công!');
      setCurrentPassword(''); setNewPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Cập nhật thất bại');
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-8">Hồ sơ cá nhân</h1>

      {msg && <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-lg p-3 mb-4">{msg}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">{error}</div>}

      <form onSubmit={handleUpdate} className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Email</label>
          <input type="email" value={user?.email || ''} className="input-field bg-cream-100" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Vai trò</label>
          <input type="text" value={user?.role === 'admin' ? 'Quản trị viên' : user?.role === 'staff' ? 'Nhân viên' : 'Khách hàng'} className="input-field bg-cream-100" disabled />
        </div>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Họ và tên</label>
          <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Số điện thoại</label>
          <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Địa chỉ</label>
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" />
        </div>

        <hr className="border-cream-200" />
        <p className="text-sm text-olive-500">Đổi mật khẩu (để trống nếu không đổi)</p>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Mật khẩu hiện tại</label>
          <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-olive-700 mb-1">Mật khẩu mới</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
        </button>
      </form>
    </div>
  );
}
