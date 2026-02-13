import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <span className="text-4xl block mb-3">🧶</span>
          <h1 className="text-2xl font-serif font-bold text-olive-800">Đăng nhập</h1>
          <p className="text-olive-500 text-sm mt-1">Chào mừng bạn quay lại!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg p-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-olive-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-olive-500 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-warm-600 hover:text-warm-700 font-medium">
            Đăng ký ngay
          </Link>
        </p>

        <div className="mt-6 p-3 bg-cream-50 rounded-lg text-xs text-olive-500">
          <p className="font-medium mb-1">Tài khoản demo:</p>
          <p>Admin: admin@handmade.com / admin123</p>
          <p>Staff: staff@handmade.com / staff123</p>
          <p>Customer: customer@handmade.com / customer123</p>
        </div>
      </div>
    </div>
  );
}
