import React from 'react';
import { useApp } from '../../context/AppContext';
import { Eye, EyeOff, Plus, Minus, ArrowRight, Wallet } from 'lucide-react';
import { AppLogo } from '../common/AppLogo';
import { getCurrencySymbol } from '../../utils/currency';

export const HomeDashboard: React.FC = () => {
  const {
    theme,
    profile,
    openingBalance,
    availableBalance,
    totalIncome,
    totalSpent,
    isBalanceHidden,
    toggleHideBalance,
    sections,
    transactions,
    setActiveTab,
    setSelectedSectionId,
    setIsAddMoneyOpen,
    setIsAddExpenseOpen,
    setIsCreateSectionOpen,
    setEditingTransaction,
    setIsEditTxnOpen,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const currencySymbol = getCurrencySymbol(profile?.currency);

  // Helper to format currency
  const formatCurrency = (val: number) => {
    return currencySymbol + Math.abs(val).toLocaleString('en-IN');
  };

  // 3 Recent expense transactions
  const recentTransactions = transactions.slice(0, 3);

  return (
    <div className="px-5 pt-1 pb-28 space-y-5 animate-fadeIn">
      {/* Greeting Header */}
      <div>
        <h1
          className={`text-2xl font-extrabold tracking-tight flex items-center gap-2 ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Hey, {profile?.name ? profile.name.split(' ')[0] : 'Money Boss'}! <span className="text-2xl animate-bounce">👋</span>
        </h1>
        <p
          className={`text-sm font-medium mt-0.5 ${
            isMidnight ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {profile?.moneyGoal || 'Your money, your rules.'}
        </p>
      </div>

      {/* Hero Balance Card */}
      <div
        className={`relative overflow-hidden rounded-[26px] p-6 transition-all duration-300 ${
          isMidnight
            ? 'bg-gradient-to-br from-[#24133b] via-[#1c0e32] to-[#140a24] border border-purple-500/30 shadow-[0_12px_35px_-8px_rgba(168,85,247,0.35)]'
            : 'bg-gradient-to-br from-[#ffccd9] via-[#ffa6c2] to-[#ffb6ce] border border-pink-300/70 shadow-[0_12px_35px_-8px_rgba(244,114,182,0.45)]'
        }`}
      >
        {/* Glowing Wave Curve in Background (matching 01_dashboard & 02_dashboard) */}
        <div className="absolute right-0 bottom-0 pointer-events-none opacity-40">
          <svg width="240" height="95" viewBox="0 0 240 95" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 72C45 72 70 20 120 52C170 84 195 32 240 32V95H0V72Z"
              fill={isMidnight ? 'url(#hero_wave_midnight)' : 'url(#hero_wave_pink)'}
            />
            <path
              d="M0 76C45 76 70 24 120 56C170 88 195 36 240 36"
              stroke={isMidnight ? '#d946ef' : '#db2777'}
              strokeWidth="3.5"
            />
            <defs>
              <linearGradient id="hero_wave_midnight" x1="120" y1="20" x2="120" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" stopOpacity="0.5" />
                <stop offset="1" stopColor="#7e22ce" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="hero_wave_pink" x1="120" y1="20" x2="120" y2="95" gradientUnits="userSpaceOnUse">
                <stop stopColor="#f472b6" stopOpacity="0.6" />
                <stop offset="1" stopColor="#db2777" stopOpacity="0.05" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Card Header: Available Balance & Eye Toggle */}
        <div className="flex items-center justify-between relative z-10">
          <span
            className={`text-xs uppercase tracking-wider font-semibold ${
              isMidnight ? 'text-purple-300' : 'text-pink-900/80 font-bold'
            }`}
          >
            Available Balance
          </span>
          <button
            onClick={toggleHideBalance}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight
                ? 'bg-purple-900/40 text-purple-300 hover:text-white hover:bg-purple-800/60'
                : 'bg-white/60 text-pink-700 hover:text-pink-900 hover:bg-white/90 shadow-sm'
            }`}
            title={isBalanceHidden ? 'Show balance' : 'Hide balance'}
          >
            {isBalanceHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {/* Main Available Balance */}
        <div className="mt-2 relative z-10">
          <div
            className={`font-display text-3xl sm:text-4xl font-extrabold tracking-tight ${
              isMidnight ? 'text-white' : 'text-slate-900'
            }`}
          >
            {isBalanceHidden ? `${currencySymbol} ••••••••` : `${formatCurrency(availableBalance)}.00`}
          </div>
        </div>

        {/* Income & Spent Sub-metrics */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between relative z-10">
          <div>
            <div className={`text-base font-extrabold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
              {isBalanceHidden ? `${currencySymbol} ••••` : formatCurrency(totalIncome)}
            </div>
            <div className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-pink-900/80 font-medium'}`}>
              Total Income
            </div>
          </div>

          {openingBalance > 0 && (
            <div className="text-center px-1">
              <div className={`text-xs font-bold ${isMidnight ? 'text-purple-300' : 'text-pink-800'}`}>
                {isBalanceHidden ? `${currencySymbol} ••••` : formatCurrency(openingBalance)}
              </div>
              <div className={`text-[10px] mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-pink-900/70 font-medium'}`}>
                Starting
              </div>
            </div>
          )}

          <div className="text-right">
            <div className={`text-base font-extrabold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
              {isBalanceHidden ? `${currencySymbol} ••••` : formatCurrency(totalSpent)}
            </div>
            <div className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-pink-900/80 font-medium'}`}>
              Total Spent
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 gap-3.5">
        {/* + Add Money Button */}
        <button
          onClick={() => setIsAddMoneyOpen(true)}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all transform active:scale-95 shadow-md ${
            isMidnight
              ? 'bg-[#d8b4fe] text-[#1e1035] hover:bg-[#e9d5ff] shadow-purple-500/20'
              : 'bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:from-pink-600 hover:to-rose-500 shadow-pink-300'
          }`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Money</span>
        </button>

        {/* - Add Expense Button */}
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl font-bold text-sm transition-all transform active:scale-95 border ${
            isMidnight
              ? 'bg-[#191029]/80 border-purple-500/30 text-white hover:bg-[#23163a]'
              : 'bg-white/80 border-pink-200 text-slate-800 hover:bg-white shadow-sm'
          }`}
        >
          <Minus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* "My Sections" Header */}
      <div className="flex items-center justify-between pt-1">
        <h2 className={`font-display font-bold text-lg ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
          My Sections
        </h2>
        <button
          onClick={() => setActiveTab('sections')}
          className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
            isMidnight ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
          }`}
        >
          <span>See all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Sections 2x2 Grid */}
      <div className="grid grid-cols-2 gap-3.5">
        {sections.slice(0, 3).map((section) => {
          const isFood = section.id === 'sec-food';
          const isShopping = section.id === 'sec-shopping';
          const isEntertainment = section.id === 'sec-entertainment';

          // First app in section
          const primaryApp = section.applications[0];

          return (
            <div
              key={section.id}
              onClick={() => {
                setSelectedSectionId(section.id);
                setActiveTab('section-details');
              }}
              className={`relative overflow-hidden rounded-[22px] p-4 cursor-pointer transition-all transform active:scale-95 group ${
                isMidnight
                  ? 'bg-gradient-to-b from-[#1b112d] to-[#140b22] border border-purple-500/20 hover:border-pink-500/50 shadow-lg'
                  : 'bg-white border border-pink-100 hover:border-pink-300 shadow-[0_4px_16px_rgba(244,114,182,0.15)]'
              }`}
            >
              {/* Background ambient decorative 3D elements matching reference */}
              <div className="absolute right-0 bottom-0 pointer-events-none opacity-20 group-hover:opacity-35 transition-opacity">
                {isFood && (
                  <div className="w-20 h-20 -mr-2 -mb-2 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 blur-lg" />
                )}
                {isShopping && (
                  <div className="w-20 h-20 -mr-2 -mb-2 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 blur-lg" />
                )}
                {isEntertainment && (
                  <div className="w-20 h-20 -mr-2 -mb-2 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 blur-lg" />
                )}
              </div>

              {/* Decorative mini emoji/art icons matching reference */}
              <div className="absolute right-2 bottom-2 text-2xl select-none opacity-85 group-hover:scale-110 transition-transform">
                {isFood && '🍕'}
                {isShopping && '🛍️'}
                {isEntertainment && '🎮'}
                {!isFood && !isShopping && !isEntertainment && '✨'}
              </div>

              {/* Top Row: App Badge */}
              <div className="flex items-center justify-between mb-3">
                <AppLogo
                  name={primaryApp?.name || section.name}
                  iconName={primaryApp?.iconName || section.icon}
                  color={primaryApp?.color || section.color}
                  bgColor={primaryApp?.bgColor || section.color}
                  customIcon={primaryApp?.customIcon}
                  size="sm"
                  className="shadow-sm"
                />
              </div>

              {/* Section Title */}
              <div
                className={`font-bold text-sm tracking-tight truncate ${
                  isMidnight ? 'text-white' : 'text-slate-900'
                }`}
              >
                {section.name}
              </div>

              {/* Section Amount Spent */}
              <div
                className={`font-display font-extrabold text-lg mt-1 ${
                  isMidnight ? 'text-white' : 'text-slate-900'
                }`}
              >
                {formatCurrency(section.totalSpent)}
              </div>

              {/* Transaction Count */}
              <div
                className={`text-xs font-medium mt-0.5 ${
                  isMidnight ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                {section.transactionCount} txns
              </div>
            </div>
          );
        })}

        {/* 4th Card: + Create Section */}
        <div
          onClick={() => setIsCreateSectionOpen(true)}
          className={`rounded-[22px] p-4 flex flex-col items-center justify-center cursor-pointer transition-all transform active:scale-95 border-2 border-dashed min-h-[140px] group ${
            isMidnight
              ? 'bg-[#150d24]/60 border-purple-500/30 hover:border-pink-400 hover:bg-[#1b102f]'
              : 'bg-white/60 border-pink-300 hover:border-pink-500 hover:bg-white shadow-sm'
          }`}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-110 ${
              isMidnight ? 'bg-purple-900/50 text-purple-300' : 'bg-pink-100 text-pink-600'
            }`}
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span
            className={`font-bold text-xs text-center leading-snug ${
              isMidnight ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            Create
            <br />
            Section
          </span>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className={`font-display font-bold text-base ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
            Recent Transactions
          </h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isMidnight ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentTransactions.length === 0 ? (
            <div
              className={`p-6 rounded-[22px] text-center border transition-all ${
                isMidnight
                  ? 'bg-[#160c28] border-purple-500/15 text-slate-400'
                  : 'bg-white border-pink-100 text-slate-500 shadow-sm'
              }`}
            >
              <div className="text-3xl mb-1.5">✨</div>
              <p className={`font-bold text-xs ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
                No transactions recorded yet
              </p>
              <p className={`text-[11px] mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                Tap "+ Add Money" to record income, or "- Add Expense" to log your first spend!
              </p>
            </div>
          ) : (
            recentTransactions.map((txn) => {
              const isExpense = txn.type === 'expense';
              return (
                <div
                  key={txn.id}
                  onClick={() => {
                    setEditingTransaction(txn);
                    setIsEditTxnOpen(true);
                  }}
                  className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                    isMidnight
                      ? 'bg-[#160c28] border-purple-500/15 hover:border-pink-500/40'
                      : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <AppLogo
                      name={txn.applicationName || txn.title}
                      color="#ec4899"
                      size="md"
                      className="shadow-sm"
                    />
                    <div>
                      <div className={`text-xs font-bold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                        {txn.applicationName || txn.title}
                      </div>
                      <div className={`text-[11px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {txn.note || (isExpense ? 'Expense' : 'Income')}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-xs font-extrabold ${
                        isExpense ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {isExpense ? '- ' : '+ '}
                      {formatCurrency(txn.amount)}
                    </div>
                    <div className={`text-[10px] ${isMidnight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {txn.displayDate || 'Today'}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
