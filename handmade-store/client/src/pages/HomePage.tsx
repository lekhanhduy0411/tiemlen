import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/common/ProductCard';
import { Loading } from '../components/common/UIComponents';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/products/featured').catch(() => ({ data: [] })),
      api.get('/categories').catch(() => ({ data: [] })),
    ]).then(([prodRes, catRes]) => {
      setFeaturedProducts(prodRes.data);
      setCategories(catRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-cream-100 via-cream-50 to-sage-100 py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold text-olive-800 leading-tight mb-6">
                Đồ thủ công <br />
                <span className="text-warm-600">từ trái tim</span>
              </h1>
              <p className="text-lg text-olive-600 leading-relaxed mb-8 max-w-lg">
                Mỗi sản phẩm tại Handmade Store đều được tạo ra bằng tình yêu, 
                sự tỉ mỉ và nguyên liệu tự nhiên. Khám phá bộ sưu tập độc đáo của chúng tôi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary text-lg px-8 py-3">
                  Khám phá ngay
                </Link>
                <Link to="/register" className="btn-secondary text-lg px-8 py-3">
                  Tạo tài khoản
                </Link>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-cream-200 rounded-2xl h-48 flex items-center justify-center text-6xl shadow-inner">🧶</div>
                <div className="bg-sage-200 rounded-2xl h-32 flex items-center justify-center text-5xl shadow-inner">🕯️</div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="bg-warm-100 rounded-2xl h-32 flex items-center justify-center text-5xl shadow-inner">🧸</div>
                <div className="bg-cream-300 rounded-2xl h-48 flex items-center justify-center text-6xl shadow-inner">🎨</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-serif font-bold text-olive-800 text-center mb-10">
              Danh mục sản phẩm
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?category=${cat._id}`}
                  className="card p-4 text-center hover:shadow-lg transition-all group"
                >
                  <span className="text-3xl block mb-2">{cat.image || '📦'}</span>
                  <h3 className="text-sm font-medium text-olive-700 group-hover:text-warm-600 transition-colors">
                    {cat.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-serif font-bold text-olive-800">
                Sản phẩm nổi bật
              </h2>
              <Link to="/products" className="text-warm-600 hover:text-warm-700 font-medium text-sm">
                Xem tất cả →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-olive-800 text-center mb-12">
            Tại sao chọn chúng tôi?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '🌿', title: 'Nguyên liệu tự nhiên', desc: 'Sử dụng 100% nguyên liệu thân thiện với môi trường, an toàn cho sức khỏe.' },
              { icon: '✋', title: 'Làm thủ công', desc: 'Mỗi sản phẩm được tạo ra bằng tay bởi các nghệ nhân tài hoa và tâm huyết.' },
              { icon: '💝', title: 'Quà tặng ý nghĩa', desc: 'Món quà handmade luôn mang giá trị tinh thần đặc biệt, thể hiện sự quan tâm.' },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <span className="text-5xl block mb-4">{item.icon}</span>
                <h3 className="text-lg font-serif font-semibold text-olive-800 mb-2">{item.title}</h3>
                <p className="text-olive-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
