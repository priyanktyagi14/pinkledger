import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, AlertCircle } from 'lucide-react';

export const AddMoneyModal: React.FC = () => {
  const { isAddMoneyOpen, setIsAddMoneyOpen, addMoney, theme } = useApp();
  const isMidnight = theme === 'midnight';

  const [amount, setAmount] = useState('5000');
  const [source, setSource] = useState('Salary');
  const [customSource, setCustomSource] = useState('');
  const [date, setDate] = useState('Today');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddMoneyOpen) return null;

  const sources = ['Salary', 'Freelancing', 'Pocket Money', 'Business', 'Gift', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    const finalSource = source === 'Other' && customSource.trim() ? customSource.trim() : source;
    if (!finalSource) {
      setErrorMsg('Please specify an income source.');
      return;
    }

    setIsSubmitting(true);
    const finalDate = date === 'Today' ? new Date().toISOString().slice(0, 10) : date;
    const success = await addMoney(parsed, finalSource, finalDate, note);
    setIsSubmitting(false);

    if (success) {
      setAmount('');
      setNote('');
      setCustomSource('');
      setErrorMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl transition-all border ${
          isMidnight
            ? 'bg-[#150d24] border-purple-500/30 text-white'
            : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        {/* Header with Title and Close X */}
        <div className="flex items-center justify-between pb-2">
          <div className="w-6" />
          <h2 className="font-display font-extrabold text-lg tracking-tight">Add Money</h2>
          <button
            onClick={() => setIsAddMoneyOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-500 hover:text-slate-800 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3D Purple Wallet Illustration Banner */}
        <div className="my-3 flex flex-col items-center justify-center text-center">
          <div className="relative w-28 h-24 flex items-center justify-center mb-1">
            <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl animate-pulse" />

            <svg
              width="100"
              height="85"
              viewBox="0 0 100 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 transform hover:scale-105 transition-transform"
            >
              <rect x="15" y="24" width="70" height="52" rx="14" fill="#8B5CF6" />
              <rect x="15" y="24" width="70" height="52" rx="14" fill="url(#wallet_grad)" />
              <path
                d="M15 36C15 29.3726 20.3726 24 27 24H73C79.6274 24 85 29.3726 85 36V44C85 44 65 48 50 48C35 48 15 44 15 44V36Z"
                fill="#7C3AED"
              />
              <rect x="68" y="42" width="18" height="16" rx="6" fill="#A78BFA" />
              <circle cx="77" cy="50" r="3" fill="#FDE047" />
              <circle cx="50" cy="22" r="18" fill="#FACC15" stroke="#EAB308" strokeWidth="2.5" />
              <circle cx="50" cy="22" r="14" fill="#FEF08A" />
              <text x="50" y="27" fontSize="16" fontWeight="bold" textAnchor="middle" fill="#854D0E">
                ₹
              </text>
              <path d="M14 16L16 10L18 16L24 18L18 20L16 26L14 20L8 18L14 16Z" fill="#F472B6" />
              <path d="M84 18L85.5 13.5L87 18L91.5 19.5L87 21L85.5 25.5L84 21L79.5 19.5L84 18Z" fill="#FDE047" />
              <defs>
                <linearGradient id="wallet_grad" x1="15" y1="24" x2="85" y2="76" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#6D28D9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h3
            className={`font-display font-extrabold text-base tracking-tight flex items-center gap-1.5 ${
              isMidnight ? 'text-white' : 'text-slate-900'
            }`}
          >
            Money in! <span>🎉</span>
          </h3>
          <p className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
            Deposits are saved directly to IndexedDB.
          </p>
        </div>

        {/* Error notification banner */}
        {errorMsg && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Add Money Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          {/* Amount Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Amount
            </label>
            <div
              className={`relative rounded-2xl border transition-all ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 focus-within:border-pink-500'
                  : 'bg-white border-pink-200 focus-within:border-pink-400'
              }`}
            >
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-bold text-pink-500">
                ₹
              </span>
              <input
                type="number"
                min="1"
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="0"
                required
                className={`w-full py-3 pl-9 pr-4 rounded-2xl bg-transparent font-display text-xl font-bold tracking-tight outline-none ${
                  isMidnight ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Source Tag Chips */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Source
            </label>
            <div className="flex flex-wrap gap-2">
              {sources.map((s) => {
                const isSelected = source === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSource(s)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      isSelected
                        ? isMidnight
                          ? 'bg-[#291745] text-pink-300 ring-2 ring-pink-500/70 shadow-sm'
                          : 'bg-pink-500 text-white shadow-sm ring-2 ring-pink-400/50'
                        : isMidnight
                        ? 'bg-[#1b122e] text-slate-400 hover:text-slate-200 border border-purple-500/20'
                        : 'bg-white text-slate-600 hover:bg-pink-50 border border-pink-100'
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>

            {source === 'Other' && (
              <input
                type="text"
                value={customSource}
                onChange={(e) => setCustomSource(e.target.value)}
                placeholder="Enter custom source name..."
                className={`w-full mt-2 py-2 px-3.5 rounded-xl border text-xs font-bold outline-none ${
                  isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200'
                }`}
              />
            )}
          </div>

          {/* Date Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Date
            </label>
            <div
              className={`flex items-center gap-2 px-3.5 py-3 rounded-2xl border transition-all ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30' : 'bg-white border-pink-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-400" />
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today or YYYY-MM-DD"
                className={`w-full bg-transparent text-xs font-semibold outline-none ${
                  isMidnight ? 'text-white' : 'text-slate-900'
                }`}
              />
            </div>
          </div>

          {/* Note Field */}
          <div>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add note (optional)..."
              className={`w-full py-3 px-3.5 rounded-2xl border text-xs outline-none transition-all ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white placeholder-slate-500 focus:border-purple-400'
                  : 'bg-white border-pink-200 text-slate-900 placeholder-slate-400 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Submit CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white shadow-[0_4px_20px_rgba(168,85,247,0.4)] hover:opacity-95 transform active:scale-98 transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Saving to Device...' : 'Deposit Money'}
          </button>
        </form>
      </div>
    </div>
  );
};
