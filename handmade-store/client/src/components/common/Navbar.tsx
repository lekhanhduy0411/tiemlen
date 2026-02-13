import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-cream-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🧶</span>
            <span className="text-xl font-serif font-bold text-olive-700">Handmade Store</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-olive-600 hover:text-olive-800 transition-colors font-medium">
              Trang chủ
            </Link>
            <Link to="/products" className="text-olive-600 hover:text-olive-800 transition-colors font-medium">
              Sản phẩm
            </Link>

            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/cart" className="relative text-olive-600 hover:text-olive-800 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-warm-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-2 text-olive-600 hover:text-olive-800"
                  >
                    <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-olive-700">
                        {user.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden lg:inline font-medium">{user.fullName}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-cream-200 py-1 z-50"
                      onMouseLeave={() => setUserMenuOpen(false)}>
                      <div className="px-4 py-2 border-b border-cream-100">
                        <p className="text-sm font-medium text-olive-800">{user.fullName}</p>
                        <p className="text-xs text-olive-500 capitalize">{user.role}</p>
                      </div>
                      <Link to="/profile" className="block px-4 py-2 text-sm text-olive-600 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                        Hồ sơ cá nhân
                      </Link>
                      {user.role === 'customer' && (
                        <Link to="/orders" className="block px-4 py-2 text-sm text-olive-600 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                          Đơn hàng của tôi
                        </Link>
                      )}
                      {(user.role === 'admin' || user.role === 'staff') && (
                        <Link to="/admin" className="block px-4 py-2 text-sm text-olive-600 hover:bg-cream-50" onClick={() => setUserMenuOpen(false)}>
                          Quản trị
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="btn-secondary text-sm">Đăng nhập</Link>
                <Link to="/register" className="btn-primary text-sm">Đăng ký</Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-olive-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>Trang chủ</Link>
            <Link to="/products" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>Sản phẩm</Link>
            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/cart" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>
                    Giỏ hàng ({cartCount})
                  </Link>
                )}
                <Link to="/profile" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>Hồ sơ</Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded">
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>Đăng nhập</Link>
                <Link to="/register" className="block px-3 py-2 text-olive-600 hover:bg-cream-50 rounded" onClick={() => setMenuOpen(false)}>Đăng ký</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
