import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Promotion } from '../../types';
import {
  Plus, Pencil, Trash2, X, Save, Gift,
  Calendar, Percent, DollarSign, Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../components/common/UIComponents';

const emptyPromotion: {
  code: string; name: string; description: string; type: 'percentage' | 'fixed';
  value: number; minOrderAmount: number; maxDiscount: number;
  startDate: string; endDate: string; usageLimit: number; isActive: boolean;
} = {
  code: '', name: '', description: '', type: 'percentage',
  value: 0, minOrderAmount: 0, maxDiscount: 0,
  startDate: '', endDate: '', usageLimit: 0, isActive: true,
};

export default function PromotionManagement() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyPromotion);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const res = await api.get('/promotions');
      setPromotions(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error('Không thể tải khuyến mãi');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyPromotion);
    setShowForm(true);
  };

  const openEdit = (promo: Promotion) => {
    setEditingId(promo._id);
    setForm({
      code: promo.code,
      name: promo.name,
      description: promo.description || '',
      type: promo.type,
      value: promo.value,
      minOrderAmount: promo.minOrderAmount,
      maxDiscount: promo.maxDiscount,
      startDate: promo.startDate?.slice(0, 10) || '',
      endDate: promo.endDate?.slice(0, 10) || '',
      usageLimit: promo.usageLimit,
      isActive: promo.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.name || !form.value) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    setSaving(true);
    try {
      const data = { ...form, code: form.code.toUpperCase() };
      if (editingId) {
        const res = await api.put(`/promotions/${editingId}`, data);
        setPromotions(promotions.map((p) => (p._id === editingId ? res.data : p)));
        toast.success('Đã cập nhật khuyến mãi');
      } else {
        const res = await api.post('/promotions', data);
        setPromotions([res.data, ...promotions]);
        toast.success('Đã thêm khuyến mãi');
      }
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: 'Xóa khuyến mãi',
      message: 'Bạn có chắc chắn muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      variant: 'danger',
    });
    if (!confirmed) return;
    try {
      await api.delete(`/promotions/${id}`);
      setPromotions(promotions.filter((p) => p._id !== id));
      toast.success('Đã xóa khuyến mãi');
    } catch {
      toast.error('Không thể xóa khuyến mãi');
    }
  };

  const isExpired = (promo: Promotion) => new Date(promo.endDate) < new Date();
  const isUpcoming = (promo: Promotion) => new Date(promo.startDate) > new Date();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý khuyến mãi</h2>
          <p className="text-sm text-gray-500 mt-1">{promotions.length} mã khuyến mãi</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm khuyến mãi
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo._id}
            className={`bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow ${
              isExpired(promo) ? 'border-red-200 opacity-75' : 'border-gray-100'
            }`}
          >
            <div className={`px-5 py-3 flex items-center justify-between ${
              isExpired(promo) ? 'bg-red-50' : isUpcoming(promo) ? 'bg-blue-50' : 'bg-gradient-to-r from-amber-50 to-orange-50'
            }`}>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-600" />
                <span className="font-mono font-bold text-amber-700 text-lg">{promo.code}</span>
              </div>
              <div className="flex items-center gap-1">
                {isExpired(promo) ? (
                  <span className="text-xs px-2 py-1 bg-red-100 text-red-600 rounded-lg font-medium">Hết hạn</span>
                ) : isUpcoming(promo) ? (
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-lg font-medium">Sắp tới</span>
                ) : promo.isActive ? (
                  <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-lg font-medium">Hoạt động</span>
                ) : (
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">Tắt</span>
                )}
              </div>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-gray-900">{promo.name}</h3>
              {promo.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{promo.description}</p>
              )}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  {promo.type === 'percentage' ? <Percent className="w-4 h-4 text-amber-500" /> : <DollarSign className="w-4 h-4 text-amber-500" />}
                  <span>
                    Giảm {promo.type === 'percentage' ? `${promo.value}%` : `${promo.value.toLocaleString('vi-VN')}₫`}
                    {promo.maxDiscount > 0 && promo.type === 'percentage' && ` (tối đa ${promo.maxDiscount.toLocaleString('vi-VN')}₫)`}
                  </span>
                </div>
                {promo.minOrderAmount > 0 && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Gift className="w-4 h-4 text-amber-500" />
                    <span>Đơn tối thiểu: {promo.minOrderAmount.toLocaleString('vi-VN')}₫</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>{new Date(promo.startDate).toLocaleDateString('vi-VN')} - {new Date(promo.endDate).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="text-gray-500">
                  Đã dùng: {promo.usedCount}/{promo.usageLimit > 0 ? promo.usageLimit : '∞'}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => openEdit(promo)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700">
                  <Pencil className="w-3 h-3" /> Sửa
                </button>
                <button onClick={() => handleDelete(promo._id)} className="flex items-center justify-center px-3 py-2 text-sm border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-600">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {promotions.length === 0 && (
        <div className="text-center py-16">
          <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có khuyến mãi nào</p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between rounded-t-2xl z-10">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa khuyến mãi' : 'Thêm khuyến mãi'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mã code *</label>
                  <input
                    value={form.code}
                    onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 font-mono uppercase"
                    placeholder="VD: SALE20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tên *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="Tên khuyến mãi"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  >
                    <option value="percentage">Phần trăm (%)</option>
                    <option value="fixed">Cố định (₫)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giá trị *</label>
                  <input
                    type="number"
                    value={form.value || ''}
                    onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder={form.type === 'percentage' ? '10' : '50000'}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đơn tối thiểu</label>
                  <input
                    type="number"
                    value={form.minOrderAmount || ''}
                    onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giảm tối đa</label>
                  <input
                    type="number"
                    value={form.maxDiscount || ''}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="0 = không giới hạn"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày bắt đầu</label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc</label>
                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới hạn lượt dùng</label>
                  <input
                    type="number"
                    value={form.usageLimit || ''}
                    onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    placeholder="0 = không giới hạn"
                  />
                </div>
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                    />
                    <span className="text-sm text-gray-700">Kích hoạt</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white px-6 py-4 border-t border-gray-100 flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-sm font-medium hover:shadow-lg disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
      {ConfirmModalComponent}
    </div>
  );
}
