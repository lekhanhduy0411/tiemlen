import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { Product, Category } from '../types';
import ProductCard from '../components/common/ProductCard';
import { Loading, EmptyState, Pagination } from '../components/common/UIComponents';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '-createdAt';

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: any = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search) params.search = search;
    api.get('/products', { params })
      .then((res) => {
        setProducts(res.data.products || res.data);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [page, category, search, sort]);

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.set('page', '1');
    setSearchParams(params);
  };

  const [searchInput, setSearchInput] = useState(search);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-serif font-bold text-olive-800 mb-8">Sản phẩm</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1">
          <form onSubmit={(e) => { e.preventDefault(); updateParam('search', searchInput); }} className="flex">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Tìm kiếm sản phẩm..."
              className="input-field rounded-r-none flex-1"
            />
            <button type="submit" className="btn-primary rounded-l-none px-6">
              Tìm
            </button>
          </form>
        </div>

        <select
          value={category}
          onChange={(e) => updateParam('category', e.target.value)}
          className="input-field w-full md:w-48"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="input-field w-full md:w-48"
        >
          <option value="-createdAt">Mới nhất</option>
          <option value="price">Giá tăng dần</option>
          <option value="-price">Giá giảm dần</option>
          <option value="-rating">Đánh giá cao</option>
          <option value="name">Tên A-Z</option>
        </select>
      </div>

      {loading ? (
        <Loading />
      ) : products.length === 0 ? (
        <EmptyState icon="🔍" title="Không tìm thấy sản phẩm" description="Hãy thử thay đổi từ khóa hoặc bộ lọc" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => updateParam('page', String(p))} />
        </>
      )}
    </div>
  );
}
