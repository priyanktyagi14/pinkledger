import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Calendar, ChevronDown, ShoppingBag, Utensils, Gamepad2, Plane, Sparkles, AlertTriangle, ShieldAlert, FolderPlus } from 'lucide-react';
import { AppLogo } from '../common/AppLogo';

export const AddExpenseModal: React.FC = () => {
  const {
    isAddExpenseOpen,
    setIsAddExpenseOpen,
    addExpense,
    sections,
    availableBalance,
    theme,
    setIsAddMoneyOpen,
    setIsCreateSectionOpen,
  } = useApp();

  const isMidnight = theme === 'midnight';

  const [amount, setAmount] = useState('450');
  const [sectionId, setSectionId] = useState(sections[0]?.id || '');
  const activeSec = sections.find((s) => s.id === sectionId) || sections[0];
  const [applicationId, setApplicationId] = useState(activeSec?.applications[0]?.id || '');
  const activeApp = activeSec?.applications?.find((a) => a.id === applicationId) || activeSec?.applications?.[0];
  const [date, setDate] = useState('Today');
  const [note, setNote] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Synchronize section selection when modal opens or sections change
  useEffect(() => {
    if (isAddExpenseOpen && sections.length > 0) {
      if (!sectionId || !sections.some((s) => s.id === sectionId)) {
        const firstSec = sections[0];
        setSectionId(firstSec.id);
        if (firstSec.applications && firstSec.applications.length > 0) {
          setApplicationId(firstSec.applications[0].id);
        } else {
          setApplicationId('');
        }
      }
    }
  }, [isAddExpenseOpen, sections, sectionId]);

  if (!isAddExpenseOpen) return null;

  const parsedAmount = parseFloat(amount) || 0;
  const isOverBudget = parsedAmount > availableBalance;

  const handleSectionChange = (newSecId: string) => {
    setSectionId(newSecId);
    const target = sections.find((s) => s.id === newSecId);
    if (target && target.applications.length > 0) {
      setApplicationId(target.applications[0].id);
    } else {
      setApplicationId('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid expense amount greater than 0.');
      return;
    }

    if (parsedAmount > availableBalance) {
      setErrorMsg(
        `Insufficient balance! You are trying to spend ₹${parsedAmount.toLocaleString('en-IN')}, but your available balance is only ₹${availableBalance.toLocaleString('en-IN')}. Please deposit funds first.`
      );
      return;
    }

    if (!sectionId) {
      setErrorMsg('Please choose a category/section for this expense.');
      return;
    }

    setIsSubmitting(true);
    const finalDate = date === 'Today' ? new Date().toISOString().slice(0, 10) : date;
    const success = await addExpense(
      parsedAmount,
      sectionId,
      applicationId || activeSec?.applications[0]?.id || '',
      finalDate,
      note
    );
    setIsSubmitting(false);

    if (success) {
      setAmount('');
      setNote('');
      setErrorMsg('');
    }
  };

  const getSectionIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'utensils':
      case 'food':
        return <Utensils className="w-3.5 h-3.5 text-white" />;
      case 'shoppingbag':
      case 'shopping':
        return <ShoppingBag className="w-3.5 h-3.5 text-white" />;
      case 'gamepad2':
      case 'entertainment':
        return <Gamepad2 className="w-3.5 h-3.5 text-white" />;
      case 'plane':
      case 'travel':
        return <Plane className="w-3.5 h-3.5 text-white" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl transition-all border ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        {/* Top Header with Back Arrow and Title */}
        <div className="flex items-center justify-between pb-2">
          <button
            onClick={() => setIsAddExpenseOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-pink-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display font-extrabold text-lg tracking-tight">Add Expense</h2>
          <div className="w-5" />
        </div>

        {/* Available Balance Pill */}
        <div className="flex items-center justify-center mb-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
              availableBalance > 0
                ? isMidnight
                  ? 'bg-purple-900/40 text-purple-300 border border-purple-500/30'
                  : 'bg-pink-100 text-pink-700 border border-pink-200'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}
          >
            <span>Available Balance:</span>
            <span className="font-extrabold">₹{availableBalance.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* 3D Shopping Bags Banner Illustration */}
        <div className="my-2 flex flex-col items-center justify-center text-center">
          <div className="relative w-24 h-20 flex items-center justify-center mb-1">
            <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl animate-pulse" />

            <svg
              width="85"
              height="75"
              viewBox="0 0 95 85"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative z-10 transform hover:scale-105 transition-transform"
            >
              <rect x="42" y="24" width="38" height="46" rx="8" fill="#F472B6" />
              <path
                d="M52 24V18C52 14.6863 54.6863 12 58 12C61.3137 12 64 14.6863 64 18V24"
                stroke="#FBCFE8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <rect x="22" y="28" width="44" height="48" rx="10" fill="url(#bag_front_grad_exp)" />
              <path
                d="M34 28V20C34 15.5817 37.5817 12 42 12C46.4183 12 50 15.5817 50 20V28"
                stroke="#DDD6FE"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path d="M44 48L38 43H42L44 45L46 43H50L44 48Z" fill="#FDE047" />
              <path d="M12 28L14 22L16 28L22 30L16 32L14 38L12 32L6 30L12 28Z" fill="#F472B6" />
              <path d="M82 20L83.5 15.5L85 20L89.5 21.5L85 23L83.5 27.5L82 23L77.5 21.5L82 20Z" fill="#FDE047" />
              <defs>
                <linearGradient id="bag_front_grad_exp" x1="22" y1="28" x2="66" y2="76" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A855F7" />
                  <stop offset="1" stopColor="#7E22CE" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h3
            className={`font-display font-extrabold text-base tracking-tight ${
              isMidnight ? 'text-white' : 'text-slate-900'
            }`}
          >
            What did you spend on?
          </h3>
        </div>

        {/* Insufficient balance warning alert */}
        {isOverBudget && (
          <div className="my-2 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex flex-col gap-1.5 animate-shake">
            <div className="flex items-center gap-2 font-bold text-rose-200">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Insufficient Balance Prevention</span>
            </div>
            <p>
              This expense (₹{parsedAmount.toLocaleString('en-IN')}) exceeds your current balance of ₹{availableBalance.toLocaleString('en-IN')}.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsAddExpenseOpen(false);
                setIsAddMoneyOpen(true);
              }}
              className="mt-1 py-1 px-2.5 rounded-lg bg-rose-500 text-white font-bold text-[11px] self-start hover:bg-rose-600 transition-colors"
            >
              + Deposit Money First
            </button>
          </div>
        )}

        {/* General Error Message */}
        {errorMsg && !isOverBudget && (
          <div className="my-2 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Check if any sections exist */}
        {sections.length === 0 ? (
          <div
            className={`my-4 p-5 rounded-2xl text-center space-y-3 border ${
              isMidnight ? 'bg-[#1a1030] border-purple-500/30' : 'bg-white border-pink-200'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 mx-auto flex items-center justify-center">
              <FolderPlus className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-sm">No sections created yet</h4>
            <p className={`text-xs ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
              Expenses must belong to a category (e.g. Food & Delivery, Shopping). Create your first section to start tracking!
            </p>
            <button
              type="button"
              onClick={() => {
                setIsAddExpenseOpen(false);
                setIsCreateSectionOpen(true);
              }}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-md hover:opacity-95 transition-opacity"
            >
              + Create a Section First
            </button>
          </div>
        ) : (
          /* Expense Form */
          <form onSubmit={handleSubmit} className="space-y-3 mt-2">
          {/* Amount Field */}
          <div>
            <div
              className={`relative rounded-2xl border transition-all ${
                isOverBudget
                  ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500/50'
                  : isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 focus-within:border-pink-500'
                  : 'bg-white border-pink-200 focus-within:border-pink-400'
              }`}
            >
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-display text-lg font-bold ${
                isOverBudget ? 'text-rose-500' : 'text-pink-500'
              }`}>
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

          {/* Section Selector */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Section
            </label>
            <div className="relative">
              <select
                value={sectionId}
                onChange={(e) => handleSectionChange(e.target.value)}
                className={`w-full py-2.5 pl-12 pr-8 rounded-2xl border text-xs font-bold appearance-none outline-none cursor-pointer ${
                  isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-800'
                }`}
              >
                {sections.map((sec) => (
                  <option key={sec.id} value={sec.id} className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
                    {sec.name}
                  </option>
                ))}
              </select>

              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center text-white text-[11px] shadow-sm pointer-events-none"
                style={{ backgroundColor: activeSec?.color || '#ec4899' }}
              >
                {getSectionIcon(activeSec?.icon || 'ShoppingBag')}
              </div>

              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
            </div>
          </div>

          {/* Application Selector */}
          {activeSec && activeSec.applications.length > 0 && (
            <div>
              <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
                Application
              </label>
              <div className="relative">
                <select
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  className={`w-full py-2.5 pl-12 pr-8 rounded-2xl border text-xs font-bold appearance-none outline-none cursor-pointer ${
                    isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-800'
                  }`}
                >
                  {activeSec.applications.map((app) => (
                    <option key={app.id} value={app.id} className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
                      {app.name}
                    </option>
                  ))}
                </select>

                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                  <AppLogo
                    name={activeApp?.name || 'App'}
                    iconName={activeApp?.iconName}
                    color={activeApp?.color}
                    bgColor={activeApp?.bgColor}
                    customIcon={activeApp?.customIcon}
                    size="sm"
                  />
                </div>

                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400" />
              </div>
            </div>
          )}

          {/* Date Selector */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Date
            </label>
            <div
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30' : 'bg-white border-pink-200'
              }`}
            >
              <Calendar className="w-4 h-4 text-pink-400" />
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
              placeholder="Add a note (optional)..."
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs outline-none transition-all ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white placeholder-slate-500 focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 placeholder-slate-400 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Big Pink CTA Button */}
          <button
            type="submit"
            disabled={isSubmitting || isOverBudget}
            className={`w-full mt-2 py-3.5 px-4 rounded-2xl font-bold text-sm text-white shadow-lg transition-all ${
              isOverBudget
                ? 'bg-slate-600/50 cursor-not-allowed text-slate-400'
                : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-95 shadow-[0_4px_20px_rgba(244,114,182,0.4)] active:scale-98'
            }`}
          >
            {isSubmitting
              ? 'Saving to Local Device...'
              : isOverBudget
              ? 'Cannot Exceed Available Balance'
              : 'Save Expense'}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};
