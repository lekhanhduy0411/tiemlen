import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    try {
      await register({ fullName, email, password, phone });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🧶</span>
          <h1 className="text-2xl font-serif font-bold text-olive-800">Đăng ký</h1>
          <p className="text-olive-500 text-sm mt-1">Tạo tài khoản để mua sắm</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Họ và tên</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-field" placeholder="Nguyễn Văn A" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="email@example.com" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Số điện thoại</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-field" placeholder="0123 456 789" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="Ít nhất 6 ký tự" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Xác nhận mật khẩu</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" placeholder="Nhập lại mật khẩu" required />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-sm text-olive-500 mt-6">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-warm-600 hover:text-warm-700 font-medium">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
