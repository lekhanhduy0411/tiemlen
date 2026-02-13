import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Review } from '../../types';
import {
  Star, Trash2, ChevronLeft, ChevronRight,
  MessageSquare, ThumbsUp, ThumbsDown,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../components/common/UIComponents';

export default function ReviewManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  useEffect(() => {
    loadReviews();
  }, [page]);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/reviews/all', { params: { page, limit: 15 } });
      setReviews(res.data.reviews || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch {
      toast.error('Không thể tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Xóa đánh giá',
      message: 'Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      variant: 'danger',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter((r) => r._id !== id));
      toast.success('Đã xóa đánh giá');
    } catch {
      toast.error('Không thể xóa đánh giá');
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
        />
      ))}
    </div>
  );

  if (loading && reviews.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Quản lý đánh giá</h2>
        <p className="text-sm text-gray-500 mt-1">{total} đánh giá</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[5, 4, 3, 2].map((star) => {
          const count = reviews.filter((r) => r.rating === star).length;
          return (
            <div key={star} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-bold text-gray-900">{star}</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-xs text-gray-500">đánh giá</p>
            </div>
          );
        })}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {(review.user as any)?.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900 text-sm">{(review.user as any)?.fullName || 'Ẩn danh'}</span>
                    <span className="text-xs text-gray-400">{(review.user as any)?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {renderStars(review.rating)}
                    <span className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="text-sm text-gray-700 mt-2 leading-relaxed">{review.comment}</p>
                  )}
                  {review.product && (
                    <div className="mt-3 flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      {(review.product as any)?.images?.[0] && (
                        <img
                          src={(review.product as any).images[0]}
                          alt=""
                          className="w-8 h-8 rounded object-cover"
                        />
                      )}
                      <span className="text-xs text-gray-600 font-medium">{(review.product as any)?.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(review._id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                title="Xóa đánh giá"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <div className="text-center py-16">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có đánh giá nào</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Trang {page} / {totalPages}</p>
          <div className="flex gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {ConfirmModalComponent}
    </div>
  );
}
