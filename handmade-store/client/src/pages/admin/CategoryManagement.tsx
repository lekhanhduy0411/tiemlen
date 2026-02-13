import { useEffect, useState } from 'react';
import api from '../../services/api';
import { Category } from '../../types';
import { Plus, Pencil, Trash2, X, Save, FolderTree, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useConfirmModal } from '../../components/common/UIComponents';

const emptyCategory = { name: '', description: '', image: '', isActive: true };

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyCategory);
  const [saving, setSaving] = useState(false);
  const { confirm, ConfirmModalComponent } = useConfirmModal();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/categories/all');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || []);
    } catch {
      toast.error('Không thể tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyCategory);
    setShowForm(true);
  };

  const openEdit = (category: Category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || '',
      image: category.image || '',
      isActive: category.isActive,
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Vui lòng nhập tên danh mục');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const res = await api.put(`/categories/${editingId}`, form);
        setCategories(categories.map((c) => (c._id === editingId ? res.data : c)));
        toast.success('Đã cập nhật danh mục');
      } else {
        const res = await api.post('/categories', form);
        setCategories([res.data, ...categories]);
        toast.success('Đã thêm danh mục');
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
      title: 'Xóa danh mục',
      message: 'Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.',
      confirmText: 'Xóa',
      variant: 'danger',
    });
    if (!confirmed) return;
    
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Đã xóa danh mục');
    } catch {
      toast.error('Không thể xóa danh mục');
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h2>
          <p className="text-sm text-gray-500 mt-1">{categories.length} danh mục</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> Thêm danh mục
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[3/2] overflow-hidden bg-gray-100 relative">
              {category.image ? (
                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FolderTree className="w-12 h-12" />
                </div>
              )}
              <div className="absolute top-3 right-3">
                {category.isActive ? (
                  <span className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white rounded-lg text-xs font-medium">
                    <Eye className="w-3 h-3" /> Hiện
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium">
                    <EyeOff className="w-3 h-3" /> Ẩn
                  </span>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 text-lg">{category.name}</h3>
              {category.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{category.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openEdit(category)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-700"
                >
                  <Pencil className="w-3 h-3" /> Sửa
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="flex items-center justify-center px-3 py-2 text-sm border border-red-200 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="text-center py-16">
          <FolderTree className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có danh mục nào</p>
        </div>
      )}

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {editingId ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h3>
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="Nhập tên danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  placeholder="Mô tả danh mục"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh (URL)</label>
                <input
                  value={form.image}
                  onChange={(e) => setForm({ ...form, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                  placeholder="URL hình ảnh"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
                />
                <span className="text-sm text-gray-700">Hiển thị trên trang chủ</span>
              </label>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
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
