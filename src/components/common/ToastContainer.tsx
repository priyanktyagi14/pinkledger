import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-11/12 max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl backdrop-blur-md border animate-slideDown transition-all ${
            toast.type === 'error'
              ? 'bg-rose-900/90 border-rose-500/50 text-white'
              : toast.type === 'success'
              ? 'bg-emerald-900/90 border-emerald-500/50 text-white'
              : 'bg-[#1b102f]/95 border-purple-500/40 text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0 mt-0.5" />
          ) : (
            <Info className="w-5 h-5 text-purple-300 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-xs">
            {toast.title && <p className="font-extrabold text-sm mb-0.5">{toast.title}</p>}
            <p className="font-medium text-slate-100">{toast.message}</p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-300 hover:text-white p-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
