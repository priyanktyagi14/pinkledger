import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Moon, Heart, Sparkles } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const { isWelcomeOpen, setIsWelcomeOpen, theme, setTheme } = useApp();
  const isMidnight = theme === 'midnight';

  if (!isWelcomeOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fadeIn">
      <div className={`relative w-full max-w-sm rounded-[36px] p-6 text-center shadow-2xl border overflow-hidden ${
        isMidnight 
          ? 'bg-gradient-to-b from-[#190d2e] via-[#120722] to-[#0a0316] border-purple-500/30 text-white' 
          : 'bg-gradient-to-b from-[#ffe5ee] via-[#fff0f5] to-[#ffd6e5] border-pink-300 text-slate-900'
      }`}>
        {/* Close Button */}
        <button
          onClick={() => setIsWelcomeOpen(false)}
          className={`absolute top-4 right-4 p-1.5 rounded-full z-20 ${
            isMidnight ? 'text-slate-400 hover:text-white bg-white/5' : 'text-slate-500 hover:text-slate-900 bg-pink-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Decorative Crown Doodle & Sparkles */}
        <div className="flex justify-between items-center px-4 pt-1 opacity-70">
          <Sparkles className="w-5 h-5 text-pink-400 animate-pulse" />
          <span className="text-xl">👑</span>
        </div>

        {/* Poetic Typography matching 09_promo_track_plan_save_repeat.png */}
        <div className="my-2 space-y-0.5">
          <div className="font-cursive text-3xl font-bold tracking-wide text-purple-300">
            Track.
          </div>
          <div className="font-cursive text-3xl font-bold tracking-wide text-pink-400">
            Plan.
          </div>
          <div className="font-cursive text-3xl font-bold tracking-wide text-rose-300">
            Save.
          </div>
          <div className="font-cursive text-3xl font-bold tracking-wide text-pink-400 flex items-center justify-center gap-1.5">
            <span>Repeat.</span>
            <span className="text-xl">💜</span>
          </div>
        </div>

        {/* Kawaii Mascot Cat in Pink Rupee Wallet */}
        <div className="my-4 relative flex items-center justify-center">
          <div className="absolute w-36 h-36 bg-pink-500/25 rounded-full blur-2xl" />

          {/* Cat in Wallet SVG */}
          <svg width="150" height="135" viewBox="0 0 150 135" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 transform hover:scale-105 transition-transform">
            {/* Cat Ears */}
            <path d="M48 40L40 16L60 28L48 40Z" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2" strokeLinejoin="round" />
            <path d="M47 34L43 22L54 28L47 34Z" fill="#F472B6" />
            <path d="M102 40L110 16L90 28L102 40Z" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2" strokeLinejoin="round" />
            <path d="M103 34L107 22L96 28L103 34Z" fill="#F472B6" />
            
            {/* Cat Head */}
            <circle cx="75" cy="46" r="32" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.5" />
            {/* Cat Grey Stripes */}
            <path d="M75 16V26M67 18L70 26M83 18L80 26" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Cat Eyes */}
            <circle cx="63" cy="45" r="4" fill="#1E293B" />
            <circle cx="64.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            <circle cx="87" cy="45" r="4" fill="#1E293B" />
            <circle cx="88.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            
            {/* Cat Blushes */}
            <ellipse cx="56" cy="50" rx="4.5" ry="3" fill="#FDA4AF" />
            <ellipse cx="94" cy="50" rx="4.5" ry="3" fill="#FDA4AF" />
            
            {/* Cat Nose & Mouth */}
            <path d="M75 48L73 50H77L75 48Z" fill="#F472B6" />
            <path d="M71 52Q75 56 75 52Q75 56 79 52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
            
            {/* Cat Little Paws resting on wallet edge */}
            <ellipse cx="55" cy="74" rx="7" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
            <ellipse cx="95" cy="74" rx="7" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />

            {/* Pink Wallet */}
            <rect x="30" y="70" width="90" height="58" rx="14" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
            <rect x="33" y="73" width="84" height="52" rx="12" fill="url(#pink_wallet_glow)" />
            
            {/* Rupee Symbol on Wallet */}
            <text x="75" y="105" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#FFFFFF" drop-shadow="0 2px 4px rgba(0,0,0,0.2)">₹</text>

            {/* Little Sparkles around cat */}
            <path d="M22 65L24 59L26 65L32 67L26 69L24 75L22 69L16 67L22 65Z" fill="#F472B6" />
            <path d="M128 65L129.5 60.5L131 65L135.5 66.5L131 68L129.5 72.5L128 68L123.5 66.5L128 65Z" fill="#C084FC" />
            
            <defs>
              <linearGradient id="pink_wallet_glow" x1="33" y1="73" x2="117" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Dual Mode Switch Buttons */}
        <div className="space-y-2.5 my-3 px-2">
          {/* Midnight Mode Button */}
          <button
            onClick={() => setTheme('midnight')}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition-all ${
              theme === 'midnight'
                ? 'bg-[#1e1038] border-purple-500/80 text-purple-200 ring-2 ring-purple-500/50 shadow-md'
                : 'bg-black/30 border-purple-500/30 text-slate-300 hover:bg-black/50'
            }`}
          >
            <Moon className="w-4 h-4 text-purple-300" />
            <span>Midnight Mode</span>
          </button>

          {/* Bubblegum Mode Button */}
          <button
            onClick={() => setTheme('bubblegum')}
            className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md ${
              theme === 'bubblegum'
                ? 'bg-gradient-to-r from-pink-400 to-rose-400 text-white ring-2 ring-pink-300'
                : 'bg-white/80 border border-pink-200 text-pink-600 hover:bg-white'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-500 fill-pink-500" />
            <span>Bubblegum Mode</span>
          </button>
        </div>

        {/* Footer Tagline */}
        <p className={`text-xs font-semibold mt-4 flex items-center justify-center gap-1.5 ${
          isMidnight ? 'text-pink-300' : 'text-pink-700'
        }`}>
          <span>Your Personal Expense Tracker</span>
          <span className="text-sm">💜</span>
        </p>
      </div>
    </div>
  );
};
