import { Link } from 'react-router-dom';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.slug}`} className="card group hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-xl">
        <img
          src={product.images[0] || 'https://placehold.co/400x300/f5f0e8/8b7355?text=Handmade'}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-warm-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-olive-800 font-medium px-4 py-2 rounded-full text-sm">
              Hết hàng
            </span>
          </div>
        )}
        {product.featured && (
          <span className="absolute top-3 right-3 bg-sage-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            Nổi bật
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif font-semibold text-olive-800 group-hover:text-warm-600 transition-colors line-clamp-2 mb-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-olive-500 ml-1">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-warm-600">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-olive-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
