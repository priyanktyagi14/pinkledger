import React from 'react';

export interface AppRegistryItem {
  id: string;
  name: string;
  category: 'food' | 'shopping' | 'entertainment' | 'travel' | 'finance' | 'utilities' | 'other';
  aliases: string[];
  color: string;
  bgColor: string;
  textColor?: string;
  renderLogo: (props?: { className?: string; size?: number }) => React.ReactNode;
}

export const APP_REGISTRY: AppRegistryItem[] = [
  // --- FOOD & DELIVERY ---
  {
    id: 'zomato',
    name: 'Zomato',
    category: 'food',
    aliases: ['zomato', 'zomato delivery', 'zom', 'zomato gold'],
    color: '#e23744',
    bgColor: '#e23744',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-sans font-black italic tracking-tighter text-white text-[11px] select-none">
        zomato
      </span>
    ),
  },
  {
    id: 'swiggy',
    name: 'Swiggy',
    category: 'food',
    aliases: ['swiggy', 'swiggy instamart', 'swiggy delivery', 'swig'],
    color: '#fc8019',
    bgColor: '#fc8019',
    textColor: '#ffffff',
    renderLogo: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        <path d="M12 7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="#fc8019" />
      </svg>
    ),
  },
  {
    id: 'dominos',
    name: "Domino's",
    category: 'food',
    aliases: ['dominos', "domino's", 'dominos pizza', 'domino'],
    color: '#006491',
    bgColor: '#006491',
    textColor: '#ffffff',
    renderLogo: () => (
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Domino tile rotated */}
        <div className="w-4 h-4 transform rotate-45 flex rounded-sm overflow-hidden shadow-sm">
          <div className="w-1/2 h-full bg-[#e31837] flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
          <div className="w-1/2 h-full bg-[#006491] flex flex-col items-center justify-center gap-0.5">
            <div className="w-1 h-1 rounded-full bg-white" />
            <div className="w-1 h-1 rounded-full bg-white" />
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'blinkit',
    name: 'Blinkit',
    category: 'food',
    aliases: ['blinkit', 'grofers', 'blink it'],
    color: '#f8cb46',
    bgColor: '#f8cb46',
    textColor: '#1a1a1a',
    renderLogo: () => (
      <div className="flex items-center text-[#1c1917] font-black text-[10px] tracking-tighter select-none">
        <span>blink</span>
        <span className="text-[#15803d]">it</span>
      </div>
    ),
  },
  {
    id: 'zepto',
    name: 'Zepto',
    category: 'food',
    aliases: ['zepto', 'zepto delivery'],
    color: '#ff3269',
    bgColor: '#3b0066',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-extrabold text-[11px] tracking-tight text-[#ff3269]">
        zepto
      </span>
    ),
  },
  {
    id: 'mcdonalds',
    name: "McDonald's",
    category: 'food',
    aliases: ['mcdonalds', "mcdonald's", 'mcd', 'mcdonald'],
    color: '#da291c',
    bgColor: '#da291c',
    textColor: '#ffc72c',
    renderLogo: () => (
      <span className="font-display font-black text-amber-300 text-sm leading-none">
        M
      </span>
    ),
  },
  {
    id: 'starbucks',
    name: 'Starbucks',
    category: 'food',
    aliases: ['starbucks', 'starbucks coffee', 'sbux'],
    color: '#006241',
    bgColor: '#006241',
    textColor: '#ffffff',
    renderLogo: () => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-white">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
        <line x1="6" y1="1" x2="6" y2="4" />
        <line x1="10" y1="1" x2="10" y2="4" />
        <line x1="14" y1="1" x2="14" y2="4" />
      </svg>
    ),
  },

  // --- SHOPPING ---
  {
    id: 'amazon',
    name: 'Amazon',
    category: 'shopping',
    aliases: ['amazon', 'amazon shopping', 'amzn', 'amazon.in', 'amazon prime'],
    color: '#ff9900',
    bgColor: '#131921',
    textColor: '#ffffff',
    renderLogo: () => (
      <div className="relative flex flex-col items-center justify-center">
        <span className="font-black text-white text-[11px] tracking-tight leading-none">a</span>
        {/* Amazon smile arrow */}
        <svg width="14" height="6" viewBox="0 0 14 6" fill="none">
          <path d="M1 2C4 5.5 10 5.5 13 2" stroke="#ff9900" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
    ),
  },
  {
    id: 'flipkart',
    name: 'Flipkart',
    category: 'shopping',
    aliases: ['flipkart', 'fk', 'flipkart plus'],
    color: '#2874f0',
    bgColor: '#2874f0',
    textColor: '#ffe500',
    renderLogo: () => (
      <div className="flex items-center justify-center font-black italic text-amber-300 text-xs">
        <span>f</span>
      </div>
    ),
  },
  {
    id: 'myntra',
    name: 'Myntra',
    category: 'shopping',
    aliases: ['myntra', 'myntra fashion'],
    color: '#ff3f6c',
    bgColor: '#ffffff',
    textColor: '#ff3f6c',
    renderLogo: () => (
      <div className="flex items-center justify-center">
        <span className="font-extrabold text-sm tracking-tighter bg-gradient-to-r from-[#ff3f6c] via-[#f7a23c] to-[#e61d67] bg-clip-text text-transparent">
          M
        </span>
      </div>
    ),
  },
  {
    id: 'zara',
    name: 'Zara',
    category: 'shopping',
    aliases: ['zara', 'zara india'],
    color: '#000000',
    bgColor: '#000000',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-serif font-black tracking-tighter text-white text-[9px]">
        ZARA
      </span>
    ),
  },
  {
    id: 'nykaa',
    name: 'Nykaa',
    category: 'shopping',
    aliases: ['nykaa', 'nykaa fashion', 'nykaa beauty'],
    color: '#fc2779',
    bgColor: '#fc2779',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-sans font-black italic text-white text-[10px]">
        NYKAA
      </span>
    ),
  },
  {
    id: 'meesho',
    name: 'Meesho',
    category: 'shopping',
    aliases: ['meesho'],
    color: '#9b2574',
    bgColor: '#9b2574',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-sans font-black text-white text-[11px]">
        m
      </span>
    ),
  },

  // --- ENTERTAINMENT ---
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'entertainment',
    aliases: ['netflix', 'nflx'],
    color: '#e50914',
    bgColor: '#000000',
    textColor: '#e50914',
    renderLogo: () => (
      <span className="font-black text-rose-600 text-base leading-none tracking-tight">
        N
      </span>
    ),
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'entertainment',
    aliases: ['spotify', 'spotify premium'],
    color: '#1db954',
    bgColor: '#121212',
    textColor: '#1db954',
    renderLogo: () => (
      <div className="w-5 h-5 rounded-full bg-[#1db954] flex items-center justify-center p-0.5">
        <svg viewBox="0 0 24 24" fill="black" className="w-3.5 h-3.5">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
      </div>
    ),
  },
  {
    id: 'youtube',
    name: 'YouTube Premium',
    category: 'entertainment',
    aliases: ['youtube', 'youtube premium', 'yt', 'yt music', 'youtube music'],
    color: '#ff0000',
    bgColor: '#ff0000',
    textColor: '#ffffff',
    renderLogo: () => (
      <div className="w-5 h-3.5 bg-red-600 rounded-sm flex items-center justify-center">
        <div className="w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[6px] border-l-white ml-0.5" />
      </div>
    ),
  },
  {
    id: 'bookmyshow',
    name: 'BookMyShow',
    category: 'entertainment',
    aliases: ['bookmyshow', 'bms', 'book my show'],
    color: '#c4242d',
    bgColor: '#c4242d',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-extrabold text-[10px] text-white tracking-tighter">
        bms
      </span>
    ),
  },
  {
    id: 'steam',
    name: 'Steam',
    category: 'entertainment',
    aliases: ['steam', 'steam games', 'valve'],
    color: '#171a21',
    bgColor: '#171a21',
    textColor: '#ffffff',
    renderLogo: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-cyan-400">
        <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.029 4.524 4.524s-2.03 4.524-4.524 4.524h-.105l-4.076 2.911c0 .052.005.105.005.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.605 0 11.979 0z" />
      </svg>
    ),
  },

  // --- TRAVEL ---
  {
    id: 'uber',
    name: 'Uber',
    category: 'travel',
    aliases: ['uber', 'uber rides', 'uber auto'],
    color: '#000000',
    bgColor: '#000000',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-sans font-black tracking-tight text-white text-[10px]">
        Uber
      </span>
    ),
  },
  {
    id: 'ola',
    name: 'Ola',
    category: 'travel',
    aliases: ['ola', 'ola cabs', 'ola electric'],
    color: '#9aca3c',
    bgColor: '#171717',
    textColor: '#9aca3c',
    renderLogo: () => (
      <div className="w-4 h-4 rounded-full border-2 border-[#9aca3c] flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-[#9aca3c]" />
      </div>
    ),
  },
  {
    id: 'makemytrip',
    name: 'MakeMyTrip',
    category: 'travel',
    aliases: ['makemytrip', 'mmt', 'make my trip'],
    color: '#d63b2f',
    bgColor: '#ffffff',
    textColor: '#d63b2f',
    renderLogo: () => (
      <span className="font-black text-[10px] text-[#d63b2f] tracking-tighter">
        my
      </span>
    ),
  },
  {
    id: 'rapido',
    name: 'Rapido',
    category: 'travel',
    aliases: ['rapido', 'rapido bike'],
    color: '#f8cb46',
    bgColor: '#f8cb46',
    textColor: '#000000',
    renderLogo: () => (
      <span className="font-black text-[10px] text-black">
        R
      </span>
    ),
  },
  {
    id: 'airbnb',
    name: 'Airbnb',
    category: 'travel',
    aliases: ['airbnb', 'air bnb'],
    color: '#ff5a5f',
    bgColor: '#ff5a5f',
    textColor: '#ffffff',
    renderLogo: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
        <path d="M12 2C7.03 2 3 6.03 3 11c0 4.12 2.78 7.6 6.6 8.64L12 22l2.4-2.36C18.22 18.6 21 15.12 21 11c0-4.97-4.03-9-9-9zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
      </svg>
    ),
  },

  // --- UTILITIES & OTHER ---
  {
    id: 'apollo',
    name: 'Apollo Pharmacy',
    category: 'utilities',
    aliases: ['apollo', 'apollo pharmacy', 'pharmacy', 'medicine'],
    color: '#0d9488',
    bgColor: '#0d9488',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-black text-white text-xs">
        +
      </span>
    ),
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    category: 'finance',
    aliases: ['phonepe', 'phone pe'],
    color: '#5f259f',
    bgColor: '#5f259f',
    textColor: '#ffffff',
    renderLogo: () => (
      <span className="font-black text-white text-xs font-serif">
        पे
      </span>
    ),
  },
  {
    id: 'googlepay',
    name: 'Google Pay',
    category: 'finance',
    aliases: ['google pay', 'gpay', 'google'],
    color: '#4285f4',
    bgColor: '#ffffff',
    textColor: '#4285f4',
    renderLogo: () => (
      <span className="font-black text-xs bg-gradient-to-r from-blue-500 via-red-500 to-green-500 bg-clip-text text-transparent">
        G
      </span>
    ),
  },
];

/**
 * Searches the registry for a match by app name or alias
 */
export function findAppInRegistry(query: string): AppRegistryItem | null {
  if (!query) return null;
  const clean = query.trim().toLowerCase().replace(/['’]/g, '');

  for (const item of APP_REGISTRY) {
    if (item.name.toLowerCase().replace(/['’]/g, '') === clean) {
      return item;
    }
    if (item.aliases.some(alias => alias.replace(/['’]/g, '') === clean)) {
      return item;
    }
  }

  // Substring match
  for (const item of APP_REGISTRY) {
    if (clean.includes(item.id) || item.name.toLowerCase().includes(clean)) {
      return item;
    }
  }

  return null;
}
