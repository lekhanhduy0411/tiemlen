import { ReactNode, useState, useCallback, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle, X, Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
}

export function Loading({ className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-cream-300 border-t-warm-500" />
    </div>
  );
}

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ icon = '📦', title, description, children }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4">{icon}</span>
      <h3 className="text-lg font-serif font-semibold text-olive-700 mb-2">{title}</h3>
      {description && <p className="text-olive-500 text-sm mb-4">{description}</p>}
      {children}
    </div>
  );
}

// ============ MODERN CONFIRM MODAL ============

type ModalVariant = 'danger' | 'warning' | 'info' | 'success';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  variant?: ModalVariant;
  loading?: boolean;
}

const variantConfig = {
  danger: {
    icon: XCircle,
    iconBg: 'bg-gradient-to-br from-red-500 to-rose-600',
    iconColor: 'text-white',
    buttonBg: 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700',
    ringColor: 'ring-red-500/20',
    glowColor: 'shadow-red-500/25',
  },
  warning: {
    icon: AlertTriangle,
    iconBg: 'bg-gradient-to-br from-amber-400 to-orange-500',
    iconColor: 'text-white',
    buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600',
    ringColor: 'ring-amber-500/20',
    glowColor: 'shadow-amber-500/25',
  },
  info: {
    icon: Info,
    iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    iconColor: 'text-white',
    buttonBg: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700',
    ringColor: 'ring-blue-500/20',
    glowColor: 'shadow-blue-500/25',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    buttonBg: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    ringColor: 'ring-emerald-500/20',
    glowColor: 'shadow-emerald-500/25',
  },
};

export function ConfirmModal({ 
  open, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  danger,
  variant: propVariant,
  loading = false,
}: ConfirmModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  const variant = propVariant || (danger ? 'danger' : 'info');
  const config = variantConfig[variant];
  const Icon = config.icon;

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      // Small delay to trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = useCallback(() => {
    if (loading) return;
    onCancel();
  }, [onCancel, loading]);

  const handleConfirm = useCallback(() => {
    if (loading) return;
    onConfirm();
  }, [onConfirm, loading]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open && !loading) {
        handleClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, handleClose, loading]);

  // Handle click outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md transform transition-all duration-200 ${
          isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Glow effect */}
        <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${config.iconBg} opacity-20 blur-xl`} />
        
        {/* Modal content */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tech pattern overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Close button */}
          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative p-6 pt-8">
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <div className={`relative p-4 rounded-2xl ${config.iconBg} shadow-lg ${config.glowColor} ring-8 ${config.ringColor}`}>
                <Icon className={`w-8 h-8 ${config.iconColor}`} strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-800 text-center mb-2 tracking-tight">
              {title}
            </h3>

            {/* Message */}
            <p className="text-slate-600 text-center text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              {message}
            </p>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 px-5 py-3 rounded-xl text-sm font-semibold text-white ${config.buttonBg} shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className={`h-1 w-full bg-gradient-to-r ${config.iconBg}`} />
        </div>
      </div>
    </div>
  );
}

// ============ USE CONFIRM MODAL HOOK ============

interface ConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
}

export function useConfirmModal() {
  const [modalState, setModalState] = useState<{
    open: boolean;
    options: ConfirmOptions | null;
    resolve: ((value: boolean) => void) | null;
    loading: boolean;
  }>({
    open: false,
    options: null,
    resolve: null,
    loading: false,
  });

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalState({
        open: true,
        options,
        resolve,
        loading: false,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (modalState.resolve) {
      modalState.resolve(true);
    }
    setModalState((prev) => ({ ...prev, open: false, resolve: null }));
  }, [modalState.resolve]);

  const handleCancel = useCallback(() => {
    if (modalState.resolve) {
      modalState.resolve(false);
    }
    setModalState((prev) => ({ ...prev, open: false, resolve: null }));
  }, [modalState.resolve]);

  const ConfirmModalComponent = modalState.options ? (
    <ConfirmModal
      open={modalState.open}
      title={modalState.options.title}
      message={modalState.options.message}
      confirmText={modalState.options.confirmText}
      cancelText={modalState.options.cancelText}
      variant={modalState.options.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      loading={modalState.loading}
    />
  ) : null;

  return { confirm, ConfirmModalComponent };
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded-lg text-sm border border-cream-300 text-olive-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-warm-500 text-white' : 'border border-cream-300 text-olive-600 hover:bg-cream-100'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded-lg text-sm border border-cream-300 text-olive-600 hover:bg-cream-100 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        ›
      </button>
    </div>
  );
}
