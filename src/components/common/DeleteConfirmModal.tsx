import React from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export const DeleteConfirmModal: React.FC = () => {
  const {
    isDeleteConfirmOpen,
    setIsDeleteConfirmOpen,
    deleteAction,
    deleteTitle,
    deleteMessage,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';

  if (!isDeleteConfirmOpen) return null;

  const handleConfirm = () => {
    if (deleteAction) {
      deleteAction();
    }
    setIsDeleteConfirmOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className={`relative w-full max-w-sm rounded-[32px] p-6 shadow-2xl border transition-all text-center ${
        isMidnight ? 'bg-[#160c28] border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-800'
      }`}>
        {/* Warning Icon with Red Pulsing Halo */}
        <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-500 mx-auto flex items-center justify-center mb-3">
          <Trash2 className="w-7 h-7" />
        </div>

        <h3 className="font-display font-extrabold text-lg tracking-tight mb-1">
          {deleteTitle || 'Confirm Delete'}
        </h3>

        <p className={`text-xs px-2 mb-5 ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
          {deleteMessage || 'Are you sure you want to proceed? This action cannot be undone.'}
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setIsDeleteConfirmOpen(false)}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs transition-colors ${
              isMidnight ? 'bg-white/10 text-slate-300 hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 py-3 rounded-2xl font-bold text-xs bg-rose-500 text-white hover:bg-rose-600 shadow-md shadow-rose-500/30 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
};
