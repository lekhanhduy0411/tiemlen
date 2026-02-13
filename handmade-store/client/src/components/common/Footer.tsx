import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-olive-800 text-cream-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🧶</span>
              <span className="text-xl font-serif font-bold text-cream-50">Handmade Store</span>
            </div>
            <p className="text-cream-300 text-sm leading-relaxed max-w-md">
              Nơi mỗi sản phẩm đều được tạo ra bằng tình yêu và sự tỉ mỉ. 
              Chúng tôi mang đến những món đồ thủ công độc đáo, được làm từ nguyên liệu tự nhiên 
              bởi các nghệ nhân tài hoa.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-cream-50 font-serif font-semibold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-cream-300 hover:text-cream-50 transition-colors">Trang chủ</Link></li>
              <li><Link to="/products" className="text-cream-300 hover:text-cream-50 transition-colors">Sản phẩm</Link></li>
              <li><Link to="/login" className="text-cream-300 hover:text-cream-50 transition-colors">Đăng nhập</Link></li>
              <li><Link to="/register" className="text-cream-300 hover:text-cream-50 transition-colors">Đăng ký</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-cream-50 font-serif font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-sm text-cream-300">
              <li className="flex items-center space-x-2">
                <span>📧</span><span>hello@handmadestore.vn</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📞</span><span>0123 456 789</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span><span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-olive-700 mt-8 pt-6 text-center text-sm text-cream-400">
          <p>&copy; {new Date().getFullYear()} Handmade Store. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
}
