import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Home, BarChart2, Plus, ReceiptText, Settings, Wallet, ShoppingBag, FolderPlus } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    theme,
    setIsAddMoneyOpen,
    setIsAddExpenseOpen,
    setIsCreateSectionOpen,
  } = useApp();
  const isMidnight = theme === 'midnight';
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsActionMenuOpen(false);
      }
    };
    if (isActionMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionMenuOpen]);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'add-button', label: 'Add', icon: Plus, isAction: true },
    { id: 'transactions', label: 'Transactions', icon: ReceiptText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto pointer-events-auto pb-[env(safe-area-inset-bottom,0px)]">
      {/* Action Menu Popup */}
      {isActionMenuOpen && (
        <div
          ref={menuRef}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 z-50 animate-scaleUp"
        >
          <div
            className={`p-2.5 rounded-3xl backdrop-blur-2xl border shadow-2xl space-y-1.5 ${
              isMidnight
                ? 'bg-[#180e2b]/95 border-purple-500/30 shadow-[0_10px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(217,70,239,0.25)] text-white'
                : 'bg-white/95 border-pink-200/90 shadow-[0_12px_40px_rgba(244,114,182,0.4)] text-slate-800'
            }`}
          >
            {/* Add Money */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsAddMoneyOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                isMidnight ? 'hover:bg-purple-900/40 text-slate-200 hover:text-white' : 'hover:bg-pink-50 text-slate-700 hover:text-pink-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <Wallet className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold">Add Money</div>
                <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>Deposit into balance</div>
              </div>
            </button>

            {/* Add Expense */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsAddExpenseOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                isMidnight ? 'hover:bg-purple-900/40 text-slate-200 hover:text-white' : 'hover:bg-pink-50 text-slate-700 hover:text-pink-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold">Add Expense</div>
                <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>Log app or store spend</div>
              </div>
            </button>

            {/* Create Section */}
            <button
              onClick={() => {
                setIsActionMenuOpen(false);
                setIsCreateSectionOpen(true);
              }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all text-left group ${
                isMidnight ? 'hover:bg-purple-900/40 text-slate-200 hover:text-white' : 'hover:bg-pink-50 text-slate-700 hover:text-pink-600'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                <FolderPlus className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-extrabold">Create Section</div>
                <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>New category bucket</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Dock */}
      <div
        className={`mx-4 mb-3 px-3 py-2 rounded-[28px] backdrop-blur-xl border transition-all duration-300 ${
          isMidnight
            ? 'bg-[#150d24]/90 border-pink-500/20 shadow-[0_10px_35px_-5px_rgba(0,0,0,0.8),0_0_20px_-3px_rgba(217,70,239,0.2)]'
            : 'bg-white/95 border-pink-200/80 shadow-[0_12px_35px_-5px_rgba(244,114,182,0.35)]'
        }`}
      >
        <div className="flex items-center justify-around relative">
          {navItems.map((item) => {
            if (item.isAction) {
              return (
                <div key={item.id} className="relative -top-3">
                  <button
                    onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
                    aria-label="Quick Actions"
                    className={`w-[52px] h-[52px] rounded-full flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                      isMidnight
                        ? 'bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 text-white shadow-[0_0_22px_rgba(236,72,153,0.6)] border-2 border-[#150d24]'
                        : 'bg-gradient-to-tr from-pink-500 via-rose-400 to-pink-400 text-white shadow-[0_4px_18px_rgba(236,72,153,0.5)] border-2 border-white'
                    }`}
                    title="Quick Actions"
                  >
                    <Plus
                      className={`w-7 h-7 stroke-[2.5] transition-transform duration-200 ${
                        isActionMenuOpen ? 'rotate-45' : 'rotate-0'
                      }`}
                    />
                  </button>
                </div>
              );
            }

            const Icon = item.icon;
            const isActive =
              activeTab === item.id ||
              (item.id === 'home' && (activeTab === 'section-details' || activeTab === 'sections'));

            return (
              <button
                key={item.id}
                onClick={() => {
                  setIsActionMenuOpen(false);
                  setActiveTab(item.id);
                }}
                className={`flex flex-col items-center justify-center py-1 px-2 xs:px-3 min-h-[44px] min-w-[48px] rounded-2xl touch-manipulation transition-all ${
                  isActive
                    ? isMidnight
                      ? 'text-pink-400 font-bold'
                      : 'text-pink-600 font-bold'
                    : isMidnight
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <div
                  className={`p-1 rounded-xl transition-all ${
                    isActive && (isMidnight ? 'bg-pink-500/15' : 'bg-pink-100/70')
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                </div>
                <span className="text-[11px] mt-0.5 tracking-tight font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
