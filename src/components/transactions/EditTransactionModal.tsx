import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, AlertCircle } from 'lucide-react';

export const EditTransactionModal: React.FC = () => {
  const {
    isEditTxnOpen,
    setIsEditTxnOpen,
    editingTransaction,
    updateTransaction,
    sections,
    availableBalance,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState('');
  const [sectionId, setSectionId] = useState('');
  const [source, setSource] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setTitle(editingTransaction.title || editingTransaction.description || '');
      setAmount(String(editingTransaction.amount));
      setNote(editingTransaction.note || editingTransaction.notes || '');
      setDate(editingTransaction.date || 'Today');
      setSectionId(editingTransaction.sectionId || sections[0]?.id || '');
      setSource(editingTransaction.source || '');
      setErrorMsg('');
    }
  }, [editingTransaction, sections]);

  if (!isEditTxnOpen || !editingTransaction) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    // If it's an expense and amount increased, check balance
    if (editingTransaction.type === 'expense') {
      const diff = parsedAmount - editingTransaction.amount;
      if (diff > availableBalance) {
        setErrorMsg(
          `Insufficient balance! Increasing this expense by ₹${diff.toLocaleString('en-IN')} exceeds your available balance (₹${availableBalance.toLocaleString('en-IN')}).`
        );
        return;
      }
    }

    const chosenSection = sections.find((s) => s.id === sectionId);

    setIsSubmitting(true);
    const success = await updateTransaction(editingTransaction.id, {
      title,
      description: title,
      amount: parsedAmount,
      note,
      notes: note,
      date,
      sectionId: editingTransaction.type === 'expense' ? chosenSection?.id : undefined,
      sectionName: editingTransaction.type === 'expense' ? chosenSection?.name : undefined,
      source: editingTransaction.type === 'income' ? source || 'Income' : undefined,
    });
    setIsSubmitting(false);

    if (success) {
      setIsEditTxnOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 shadow-2xl transition-all border ${
          isMidnight
            ? 'bg-[#150d24] border-purple-500/30 text-white'
            : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <h2 className="font-display font-extrabold text-lg tracking-tight">
            Edit {editingTransaction.type === 'income' ? 'Income' : 'Expense'}
          </h2>
          <button
            onClick={() => setIsEditTxnOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {/* Title / Description */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Description
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Amount */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrorMsg('');
              }}
              required
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Section dropdown (for expense) */}
          {editingTransaction.type === 'expense' && (
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
                Category / Section
              </label>
              <select
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                  isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
                }`}
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id} className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
                    {sec.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Source input (for income) */}
          {editingTransaction.type === 'income' && (
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
                Source
              </label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                  isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
                }`}
              />
            </div>
          )}

          {/* Date */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Date
            </label>
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30' : 'bg-white border-pink-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-pink-400" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={`w-full bg-transparent text-xs font-semibold outline-none ${
                  isMidnight ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Note
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note..."
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs outline-none ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
              }`}
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setIsEditTxnOpen(false)}
              className={`flex-1 py-3 rounded-2xl font-bold text-xs ${
                isMidnight ? 'bg-white/10 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-2xl font-bold text-xs bg-pink-500 text-white hover:bg-pink-600 shadow-md shadow-pink-500/30 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
