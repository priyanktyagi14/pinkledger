import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../context/PWAContext';
import { Sparkles, Moon, Heart, WifiOff } from 'lucide-react';

export const Header: React.FC = () => {
  const { theme, setTheme, profile, setActiveTab, setIsWelcomeOpen } = useApp();
  const { isOnline } = usePWA();
  const isMidnight = theme === 'midnight';

  // Fallback avatar SVG
  const fallbackAvatar = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='50' fill='%23ec4899'/><text x='50' y='65' font-size='42' font-family='sans-serif' font-weight='bold' fill='white' text-anchor='middle'>${(profile.name.charAt(0) || 'P').toUpperCase()}</text></svg>`;

  return (
    <header className="px-5 pt-3 pb-2 flex items-center justify-between transition-colors duration-300">
      {/* Brand Logo & Name */}
      <div 
        onClick={() => setIsWelcomeOpen(true)}
        className="flex items-center gap-2 cursor-pointer group"
        title="PinkLedger Mascot & About"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-md group-hover:scale-105 ${
          isMidnight 
            ? 'bg-gradient-to-tr from-pink-500 to-purple-600 text-white shadow-purple-500/30' 
            : 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white shadow-pink-400/30'
        }`}>
          <span className="font-display font-black text-xs tracking-tighter">PL</span>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className={`font-display font-bold text-xl tracking-tight transition-colors ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}>
            Pink<span className="text-pink-500">Ledger</span>
          </span>
          <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse fill-pink-400" />
        </div>
      </div>

      {/* Right controls: Offline badge, Theme quick toggle & Avatar */}
      <div className="flex items-center gap-2.5">
        {/* Offline Indicator Badge */}
        {!isOnline && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse"
            title="PinkLedger is working in 100% offline mode"
          >
            <WifiOff className="w-3 h-3" />
            <span className="hidden xs:inline">Offline</span>
          </div>
        )}

        {/* Theme quick-switch pill */}
        <button
          onClick={() => setTheme(isMidnight ? 'bubblegum' : 'midnight')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all shadow-sm ${
            isMidnight
              ? 'bg-[#1b122c] border border-pink-500/20 text-pink-300 hover:border-pink-500/40 hover:bg-[#25183d]'
              : 'bg-white border border-pink-200 text-pink-600 hover:border-pink-300 hover:bg-pink-50 shadow-pink-100'
          }`}
          title={isMidnight ? 'Switch to Bubblegum Pink Theme' : 'Switch to Midnight Black Theme'}
        >
          {isMidnight ? (
            <>
              <Moon className="w-3 h-3 text-purple-400" />
              <span>Midnight</span>
            </>
          ) : (
            <>
              <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />
              <span>Bubblegum</span>
            </>
          )}
        </button>

        {/* Profile Avatar */}
        <div 
          onClick={() => setActiveTab('settings')}
          className={`w-9 h-9 rounded-full overflow-hidden p-0.5 cursor-pointer transition-transform hover:scale-105 active:scale-95 ${
            isMidnight 
              ? 'ring-2 ring-purple-500/50 hover:ring-pink-400' 
              : 'ring-2 ring-pink-400/60 hover:ring-pink-500'
          }`}
          title="Open Settings"
        >
          <img 
            src={profile.avatarUrl} 
            alt={profile.name}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
            }}
            className="w-full h-full object-cover rounded-full" 
          />
        </div>
      </div>
    </header>
  );
};
