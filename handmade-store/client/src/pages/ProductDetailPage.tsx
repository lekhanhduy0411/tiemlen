import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Loading, EmptyState } from '../components/common/UIComponents';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/products/slug/${slug}`)
      .then((res) => {
        setProduct(res.data);
        return api.get(`/reviews/product/${res.data._id}`);
      })
      .then((res) => setReviews(res.data))
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = async () => {
    if (!user) { navigate('/login'); return; }
    if (!product) return;
    setAddingToCart(true);
    try {
      await addToCart(product._id, quantity);
      setMessage('Đã thêm vào giỏ hàng!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Lỗi thêm vào giỏ hàng');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loading />;
  if (!product) return <EmptyState icon="😕" title="Không tìm thấy sản phẩm" />;

  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  const images = product.images.length > 0 ? product.images : ['https://placehold.co/600x400/f5f0e8/8b7355?text=Handmade'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="rounded-2xl overflow-hidden mb-4 bg-cream-100">
            <img src={images[selectedImage]} alt={product.name} className="w-full h-96 lg:h-[500px] object-cover" />
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`rounded-lg overflow-hidden border-2 flex-shrink-0 ${i === selectedImage ? 'border-warm-500' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-20 h-20 object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-olive-800 mb-4">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={`w-5 h-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-olive-500 text-sm">({product.numReviews} đánh giá)</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3 mb-6">
            <span className="text-3xl font-bold text-warm-600">{product.price.toLocaleString('vi-VN')}₫</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <>
                <span className="text-lg text-olive-400 line-through">{product.originalPrice.toLocaleString('vi-VN')}₫</span>
                <span className="bg-warm-100 text-warm-600 text-sm font-medium px-2 py-1 rounded">-{discount}%</span>
              </>
            )}
          </div>

          {/* Description */}
          <div className="prose prose-olive text-olive-600 mb-6 text-sm leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Stock */}
          <div className="mb-4">
            {product.stock > 0 ? (
              <span className="text-sage-600 text-sm">✓ Còn {product.stock} sản phẩm</span>
            ) : (
              <span className="text-red-500 text-sm">✗ Hết hàng</span>
            )}
          </div>

          {/* Add to Cart */}
          {user?.role === 'customer' && product.stock > 0 && (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center border border-cream-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3 py-2 text-olive-600 hover:bg-cream-100">-</button>
                <span className="px-4 py-2 text-olive-800 font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-3 py-2 text-olive-600 hover:bg-cream-100">+</button>
              </div>
              <button onClick={handleAddToCart} disabled={addingToCart} className="btn-primary flex-1">
                {addingToCart ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
              </button>
            </div>
          )}

          {!user && product.stock > 0 && (
            <button onClick={() => navigate('/login')} className="btn-primary w-full mb-6">
              Đăng nhập để mua hàng
            </button>
          )}

          {message && (
            <div className="bg-sage-50 border border-sage-200 text-sage-700 text-sm rounded-lg p-3 mb-4">
              {message}
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-16">
        <h2 className="text-2xl font-serif font-bold text-olive-800 mb-6">Đánh giá ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-olive-500 text-sm">Chưa có đánh giá nào cho sản phẩm này.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review._id} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-sage-200 rounded-full flex items-center justify-center text-sm font-medium text-olive-700">
                      {(review.user as any)?.fullName?.charAt(0) || '?'}
                    </div>
                    <span className="font-medium text-olive-800 text-sm">{(review.user as any)?.fullName || 'Người dùng'}</span>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {review.comment && <p className="text-olive-600 text-sm">{review.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
