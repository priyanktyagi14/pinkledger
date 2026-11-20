import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Moon,
  Heart,
  Upload,
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Wallet,
  PiggyBank,
  TrendingDown,
  Receipt,
  Clock,
  Compass,
} from 'lucide-react';
import { CURRENCY_OPTIONS, getCurrencySymbol } from '../../utils/currency';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
];

const MONEY_GOALS = [
  { id: 'Save more money', label: 'Save more money', icon: PiggyBank },
  { id: 'Control unnecessary spending', label: 'Control unnecessary spending', icon: TrendingDown },
  { id: 'Track every expense', label: 'Track every expense', icon: Receipt },
  { id: 'Manage daily expenses', label: 'Manage daily expenses', icon: Clock },
  { id: 'Just exploring', label: 'Just exploring', icon: Compass },
];

export const OnboardingScreen: React.FC = () => {
  const { theme, setTheme, completeOnboarding, uploadAssetBlob } = useApp();
  const isMidnight = theme === 'midnight';

  // Form states
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState<string | null>(null);
  const [startingBalance, setStartingBalance] = useState<string>('0');
  const [selectedCurrency, setSelectedCurrency] = useState('₹ INR');
  const [monthlyBudget, setMonthlyBudget] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<string>('Save more money');

  // Validation & UI states
  const [nameError, setNameError] = useState<string | null>(null);
  const [balanceError, setBalanceError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Currency symbol
  const currencySymbol = getCurrencySymbol(selectedCurrency);

  // Handle custom avatar upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const asset = await uploadAssetBlob(file, 'profile_avatar');
      const url = asset.dataUrl || asset.url;
      setCustomAvatarUrl(url);
      setSelectedAvatar(url);
    } catch (err) {
      // Fallback to FileReader if offline
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCustomAvatarUrl(reader.result);
          setSelectedAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Validate Name
    if (!name.trim()) {
      setNameError('Please enter your name to personalize your space');
      hasError = true;
    } else {
      setNameError(null);
    }

    // Validate Starting Balance
    const parsedBalance = parseFloat(startingBalance);
    if (isNaN(parsedBalance) || parsedBalance < 0) {
      setBalanceError('Please enter a valid starting amount (0 or more)');
      hasError = true;
    } else {
      setBalanceError(null);
    }

    if (hasError) {
      // Scroll to top of form
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const parsedBudget = monthlyBudget.trim() ? parseFloat(monthlyBudget) : undefined;
      await completeOnboarding({
        name: name.trim(),
        avatarUrl: selectedAvatar,
        currency: selectedCurrency,
        theme,
        openingBalance: isNaN(parsedBalance) ? 0 : parsedBalance,
        monthlyBudget: parsedBudget !== undefined && !isNaN(parsedBudget) && parsedBudget >= 0 ? parsedBudget : undefined,
        moneyGoal: selectedGoal || undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-5 pt-3 pb-24 space-y-6 animate-fadeIn">
      {/* 1. Mascot Illustration & Welcome Section */}
      <div className="text-center pt-2">
        {/* Adorable Wallet & Mascot Illustration */}
        <div className="relative inline-flex items-center justify-center my-2">
          {/* Ambient Glow */}
          <div
            className={`absolute w-36 h-36 rounded-full blur-2xl transition-all duration-700 ${
              isMidnight ? 'bg-purple-600/30' : 'bg-pink-400/35'
            }`}
          />

          {/* SVG Wallet & Mascot consistent with PinkLedger branding */}
          <svg
            width="140"
            height="125"
            viewBox="0 0 150 135"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 transform hover:scale-105 transition-transform duration-300 drop-shadow-lg"
          >
            {/* Cat Ears */}
            <path d="M48 40L40 16L60 28L48 40Z" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M47 34L43 22L54 28L47 34Z" fill="#F472B6" />
            <path d="M102 40L110 16L90 28L102 40Z" fill="#FCE7F3" stroke="#F472B6" strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M103 34L107 22L96 28L103 34Z" fill="#F472B6" />

            {/* Cat Head */}
            <circle cx="75" cy="46" r="32" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2.5" />
            {/* Stripes */}
            <path d="M75 16V26M67 18L70 26M83 18L80 26" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

            {/* Cat Eyes */}
            <circle cx="63" cy="45" r="4" fill="#1E293B" />
            <circle cx="64.5" cy="43.5" r="1.5" fill="#FFFFFF" />
            <circle cx="87" cy="45" r="4" fill="#1E293B" />
            <circle cx="88.5" cy="43.5" r="1.5" fill="#FFFFFF" />

            {/* Blushes */}
            <ellipse cx="56" cy="50" rx="4.5" ry="3" fill="#FDA4AF" />
            <ellipse cx="94" cy="50" rx="4.5" ry="3" fill="#FDA4AF" />

            {/* Nose & Mouth */}
            <path d="M75 48L73 50H77L75 48Z" fill="#F472B6" />
            <path d="M71 52Q75 56 75 52Q75 56 79 52" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />

            {/* Little Paws */}
            <ellipse cx="55" cy="74" rx="7" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />
            <ellipse cx="95" cy="74" rx="7" ry="5" fill="#FFFFFF" stroke="#F472B6" strokeWidth="2" />

            {/* Pink Rupee Wallet */}
            <rect x="30" y="70" width="90" height="58" rx="14" fill="#F472B6" stroke="#DB2777" strokeWidth="2.5" />
            <rect x="33" y="73" width="84" height="52" rx="12" fill="url(#onboarding_wallet_glow)" />

            {/* Rupee Symbol */}
            <text x="75" y="105" fontSize="26" fontWeight="bold" textAnchor="middle" fill="#FFFFFF">
              {currencySymbol}
            </text>

            {/* Sparkles */}
            <path d="M20 62L22 56L24 62L30 64L24 66L22 72L20 66L14 64L20 62Z" fill="#F472B6" />
            <path d="M130 62L131.5 57.5L133 62L137.5 63.5L133 65L131.5 69.5L130 65L125.5 63.5L130 62Z" fill="#C084FC" />

            <defs>
              <linearGradient id="onboarding_wallet_glow" x1="33" y1="73" x2="117" y2="125" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F472B6" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Heading & Subtitle exactly matching Prompt */}
        <h1
          className={`font-display font-extrabold text-2xl tracking-tight mt-1 ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Hey there! Welcome to PinkLedger 💗
        </h1>
        <p
          className={`text-xs font-medium mt-1.5 max-w-xs mx-auto leading-relaxed ${
            isMidnight ? 'text-pink-300/90' : 'text-pink-800/80'
          }`}
        >
          Let's get to know you and set up your money space.
        </p>
      </div>

      {/* 2. Theme Selection Cards (Section 4) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className={`text-xs font-bold uppercase tracking-wider ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
            Choose Your Theme
          </label>
          <span className={`text-[11px] font-semibold ${isMidnight ? 'text-purple-300' : 'text-pink-600'}`}>
            Instant Preview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Midnight Black Card */}
          <div
            onClick={() => setTheme('midnight')}
            className={`p-3.5 rounded-2xl cursor-pointer border text-left transition-all duration-300 relative overflow-hidden ${
              theme === 'midnight'
                ? 'bg-gradient-to-br from-[#1e0f36] via-[#140826] to-[#0a0314] border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.35)] ring-2 ring-purple-500'
                : 'bg-[#120822]/80 border-purple-500/20 text-slate-400 hover:border-purple-500/40'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <Moon className="w-4 h-4" />
              </div>
              {theme === 'midnight' && (
                <div className="w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <div className="font-display font-bold text-xs text-white">Midnight Black</div>
            <div className="text-[10px] text-purple-300/80 mt-0.5 leading-tight">
              Premium dark aesthetic with glowing purple accents
            </div>
          </div>

          {/* Bubblegum Pink Card */}
          <div
            onClick={() => setTheme('bubblegum')}
            className={`p-3.5 rounded-2xl cursor-pointer border text-left transition-all duration-300 relative overflow-hidden ${
              theme === 'bubblegum'
                ? 'bg-gradient-to-br from-[#ffe5ee] via-[#fff0f6] to-[#ffd1e3] border-pink-400 shadow-[0_0_20px_rgba(244,114,182,0.4)] ring-2 ring-pink-400'
                : 'bg-white/80 border-pink-200 text-slate-500 hover:border-pink-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-xl bg-pink-200 border border-pink-300 flex items-center justify-center text-pink-600">
                <Heart className="w-4 h-4 fill-pink-500 text-pink-500" />
              </div>
              {theme === 'bubblegum' && (
                <div className="w-5 h-5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}
            </div>
            <div className="font-display font-bold text-xs text-slate-900">Bubblegum Pink</div>
            <div className="text-[10px] text-pink-700/80 mt-0.5 leading-tight">
              Playful pastel aesthetic with sweet pink vibes
            </div>
          </div>
        </div>
      </div>

      {/* 3. Information Filling Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Field A: Your Name */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
            Your Name <span className="text-pink-500">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              placeholder="e.g. Priyank"
              className={`w-full py-3 px-4 rounded-2xl border text-sm font-bold transition-all outline-none ${
                nameError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : isMidnight
                  ? 'bg-[#170e2b] border-purple-500/30 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white border-pink-200 text-slate-900 placeholder-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 shadow-sm'
              }`}
            />
          </div>
          {nameError && (
            <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{nameError}</span>
            </p>
          )}
        </div>

        {/* Field B: Profile Avatar */}
        <div className="space-y-2">
          <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
            Profile Avatar
          </label>

          {/* Preset Avatars & Custom Upload button */}
          <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
            {PRESET_AVATARS.map((url, idx) => {
              const isSelected = selectedAvatar === url;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedAvatar(url)}
                  className={`relative w-12 h-12 rounded-full cursor-pointer shrink-0 transition-transform active:scale-95 ${
                    isSelected
                      ? 'ring-4 ring-pink-500 scale-105 shadow-md shadow-pink-500/30'
                      : 'opacity-70 hover:opacity-100 ring-1 ring-white/20'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Avatar option ${idx + 1}`}
                    className="w-full h-full object-cover rounded-full"
                  />
                  {isSelected && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-pink-500 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Upload Custom Avatar Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center shrink-0 border border-dashed transition-all active:scale-95 ${
                selectedAvatar === customAvatarUrl && customAvatarUrl
                  ? 'ring-4 ring-pink-500 scale-105 bg-pink-500/20 border-pink-400 text-pink-300'
                  : isMidnight
                  ? 'bg-purple-900/20 border-purple-500/40 text-purple-300 hover:bg-purple-900/40'
                  : 'bg-pink-100/60 border-pink-300 text-pink-600 hover:bg-pink-200/50'
              }`}
              title="Upload custom profile photo"
            >
              {customAvatarUrl && selectedAvatar === customAvatarUrl ? (
                <img src={customAvatarUrl} alt="Custom avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span className="text-[8px] font-bold mt-0.5">Upload</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>
        </div>

        {/* Field C: Starting Balance */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
              How much money do you currently have? <span className="text-pink-500">*</span>
            </label>
            <span className={`text-[10px] font-semibold ${isMidnight ? 'text-purple-300' : 'text-pink-600'}`}>
              Opening Balance
            </span>
          </div>

          <div className="relative flex items-center">
            <div className={`absolute left-3.5 font-display font-extrabold text-base pointer-events-none ${
              isMidnight ? 'text-pink-400' : 'text-pink-600'
            }`}>
              {currencySymbol}
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={startingBalance}
              onChange={(e) => {
                setStartingBalance(e.target.value);
                if (balanceError) setBalanceError(null);
              }}
              placeholder="0"
              className={`w-full py-3 pl-9 pr-4 rounded-2xl border text-sm font-extrabold transition-all outline-none ${
                balanceError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : isMidnight
                  ? 'bg-[#170e2b] border-purple-500/30 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white border-pink-200 text-slate-900 placeholder-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 shadow-sm'
              }`}
            />
          </div>
          {balanceError ? (
            <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1 animate-fadeIn">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{balanceError}</span>
            </p>
          ) : (
            <p className={`text-[11px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
              Your starting cash or bank balance. 0 is completely fine!
            </p>
          )}
        </div>

        {/* Field D: Preferred Currency */}
        <div className="space-y-1.5">
          <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
            Preferred Currency
          </label>
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className={`w-full py-3 px-3.5 rounded-2xl border text-xs font-bold transition-all outline-none appearance-none cursor-pointer ${
                isMidnight
                  ? 'bg-[#170e2b] border-purple-500/30 text-white focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400 shadow-sm'
              }`}
            >
              {CURRENCY_OPTIONS.map((c) => (
                <option key={c.code} value={c.label} className={isMidnight ? 'bg-[#1a0f30] text-white' : 'bg-white text-slate-900'}>
                  {c.label}
                </option>
              ))}
            </select>
            <div className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold ${
              isMidnight ? 'text-purple-300' : 'text-pink-600'
            }`}>
              ▼
            </div>
          </div>
        </div>

        {/* Field E: Monthly Spending Budget (Optional) */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between">
            <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
              What's your monthly spending budget?
            </label>
            <span className={`text-[10px] font-semibold ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
              Optional
            </span>
          </div>
          <div className="relative flex items-center">
            <div className={`absolute left-3.5 font-display font-extrabold text-base pointer-events-none ${
              isMidnight ? 'text-pink-400' : 'text-pink-600'
            }`}>
              {currencySymbol}
            </div>
            <input
              type="number"
              inputMode="decimal"
              step="any"
              min="0"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              placeholder="e.g. 20000 (You can skip this)"
              className={`w-full py-3 pl-9 pr-4 rounded-2xl border text-sm font-extrabold transition-all outline-none ${
                isMidnight
                  ? 'bg-[#170e2b] border-purple-500/30 text-white placeholder-slate-500 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30'
                  : 'bg-white border-pink-200 text-slate-900 placeholder-slate-400 focus:border-pink-400 focus:ring-2 focus:ring-pink-300/40 shadow-sm'
              }`}
            />
          </div>
          <p className={`text-[11px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
            Used for spending progress insights and budget warning indicators.
          </p>
        </div>

        {/* Field F: Your Money Goal (Optional) */}
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
              What's your main money goal?
            </label>
            <span className={`text-[10px] font-semibold ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
              Optional
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {MONEY_GOALS.map((goal) => {
              const isSelected = selectedGoal === goal.id;
              const Icon = goal.icon;
              return (
                <div
                  key={goal.id}
                  onClick={() => setSelectedGoal(isSelected ? '' : goal.id)}
                  className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all active:scale-98 ${
                    isSelected
                      ? isMidnight
                        ? 'bg-purple-900/40 border-pink-500/70 text-white ring-1 ring-pink-500/50'
                        : 'bg-pink-100/90 border-pink-400 text-pink-900 ring-1 ring-pink-400'
                      : isMidnight
                      ? 'bg-[#150d27] border-purple-500/20 text-slate-300 hover:border-purple-500/40'
                      : 'bg-white/80 border-pink-100 text-slate-700 hover:border-pink-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-pink-500 text-white'
                        : isMidnight
                        ? 'bg-purple-900/30 text-purple-300'
                        : 'bg-pink-100 text-pink-600'
                    }`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold">{goal.label}</span>
                  </div>

                  <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                    isSelected
                      ? 'bg-pink-500 border-pink-500 text-white'
                      : isMidnight
                      ? 'border-purple-500/40'
                      : 'border-pink-300'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Final Setup Button (Section 5) */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 rounded-2xl font-display font-extrabold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-lg ${
              isMidnight
                ? 'bg-gradient-to-r from-pink-500 via-purple-600 to-pink-500 text-white shadow-pink-500/25 hover:from-pink-600 hover:to-purple-700'
                : 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-400/35 hover:from-pink-600 hover:to-rose-500'
            }`}
          >
            <span>Let's Get Started ✨</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
          <p className={`text-center text-[10px] font-medium mt-2 ${isMidnight ? 'text-slate-500' : 'text-slate-600'}`}>
            100% Offline & Private • Stored securely on your device
          </p>
        </div>
      </form>
    </div>
  );
};
