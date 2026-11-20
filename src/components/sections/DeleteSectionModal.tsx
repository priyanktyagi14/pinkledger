import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, AlertTriangle, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const DeleteSectionModal: React.FC = () => {
  const {
    isDeleteSectionOpen,
    setIsDeleteSectionOpen,
    sectionToDelete,
    sections,
    confirmDeleteSection,
    transactions,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';

  const otherSections = sections.filter((s) => s.id !== sectionToDelete?.id);
  const [reassignMode, setReassignMode] = useState<'unassigned' | 'reassign'>('unassigned');
  const [targetSectionId, setTargetSectionId] = useState<string>(otherSections[0]?.id || '');

  if (!isDeleteSectionOpen || !sectionToDelete) return null;

  const linkedTxns = transactions.filter(
    (t) => t.sectionId === sectionToDelete.id && t.type === 'expense'
  );
  const totalAmount = linkedTxns.reduce((sum, t) => sum + t.amount, 0);

  const handleConfirm = () => {
    confirmDeleteSection(reassignMode === 'reassign' ? targetSectionId : undefined);
    setIsDeleteSectionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 shadow-2xl border transition-all ${
          isMidnight ? 'bg-[#160c28] border-rose-500/30 text-white' : 'bg-white border-rose-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2 text-rose-500">
            <Trash2 className="w-5 h-5" />
            <h3 className="font-display font-extrabold text-base tracking-tight">
              Delete Section
            </h3>
          </div>
          <button
            onClick={() => setIsDeleteSectionOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-2">
          <p className="text-xs font-semibold mb-2">
            Are you sure you want to delete <span className="font-bold text-rose-400">"{sectionToDelete.name}"</span>?
          </p>

          <div
            className={`p-3 rounded-2xl border mb-4 text-xs ${
              isMidnight ? 'bg-[#1f1035] border-purple-500/20' : 'bg-pink-50 border-pink-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-1 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Financial History Preserved</span>
            </div>
            <p className={isMidnight ? 'text-slate-300' : 'text-slate-600'}>
              This section contains <span className="font-bold">{linkedTxns.length} transactions</span> (₹{totalAmount.toLocaleString('en-IN')}). Your financial data will <span className="font-bold underline">not</span> be deleted.
            </p>
          </div>

          <label className="block text-xs font-bold mb-2">
            What should happen to these transactions?
          </label>

          <div className="space-y-2">
            <label
              className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                reassignMode === 'unassigned'
                  ? 'border-pink-500 bg-pink-500/10'
                  : isMidnight
                  ? 'border-purple-500/20 bg-[#120722]'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <input
                type="radio"
                name="reassignMode"
                checked={reassignMode === 'unassigned'}
                onChange={() => setReassignMode('unassigned')}
                className="mt-0.5 accent-pink-500"
              />
              <div>
                <span className="text-xs font-bold block">Keep as "General / Unassigned"</span>
                <span className="text-[11px] text-slate-400">
                  Transactions remain visible in history and totals are unchanged.
                </span>
              </div>
            </label>

            {otherSections.length > 0 && (
              <label
                className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition-all ${
                  reassignMode === 'reassign'
                    ? 'border-pink-500 bg-pink-500/10'
                    : isMidnight
                    ? 'border-purple-500/20 bg-[#120722]'
                    : 'border-slate-200 bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="reassignMode"
                  checked={reassignMode === 'reassign'}
                  onChange={() => setReassignMode('reassign')}
                  className="mt-0.5 accent-pink-500"
                />
                <div className="flex-1">
                  <span className="text-xs font-bold block mb-1">
                    Reassign to another Section
                  </span>
                  {reassignMode === 'reassign' && (
                    <select
                      value={targetSectionId}
                      onChange={(e) => setTargetSectionId(e.target.value)}
                      className={`w-full py-1.5 px-2.5 rounded-xl text-xs font-bold border outline-none ${
                        isMidnight
                          ? 'bg-[#170c2a] border-purple-500/30 text-white'
                          : 'bg-white border-pink-200 text-slate-900'
                      }`}
                    >
                      {otherSections.map((sec) => (
                        <option key={sec.id} value={sec.id} className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
                          {sec.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </label>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 mt-5">
          <button
            onClick={() => setIsDeleteSectionOpen(false)}
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
            Delete & Reassign
          </button>
        </div>
      </div>
    </div>
  );
};
