import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Check,
  User,
  Upload,
  Sparkles,
  PiggyBank,
  TrendingDown,
  Receipt,
  Clock,
  Compass,
  AlertCircle,
  Save,
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

export const EditProfileModal: React.FC = () => {
  const {
    isEditProfileOpen,
    setIsEditProfileOpen,
    profile,
    updateProfile,
    uploadAssetBlob,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [currency, setCurrency] = useState(profile.currency || '₹ INR');
  const [monthlyBudget, setMonthlyBudget] = useState<string>(
    profile.monthlyBudget !== undefined ? String(profile.monthlyBudget) : ''
  );
  const [moneyGoal, setMoneyGoal] = useState<string>(profile.moneyGoal || '');
  const [nameError, setNameError] = useState<string | null>(null);

  // Sync state whenever modal opens or profile changes
  useEffect(() => {
    if (isEditProfileOpen) {
      setName(profile.name);
      setAvatarUrl(profile.avatarUrl);
      setCurrency(profile.currency || '₹ INR');
      setMonthlyBudget(profile.monthlyBudget !== undefined ? String(profile.monthlyBudget) : '');
      setMoneyGoal(profile.moneyGoal || '');
      setNameError(null);
    }
  }, [isEditProfileOpen, profile]);

  if (!isEditProfileOpen) return null;

  const currencySymbol = getCurrencySymbol(currency);

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const asset = await uploadAssetBlob(file, 'profile_avatar');
      setAvatarUrl(asset.dataUrl || asset.url);
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setNameError('Name cannot be empty');
      return;
    }

    const parsedBudget = monthlyBudget.trim() ? parseFloat(monthlyBudget) : undefined;

    updateProfile({
      name: name.trim(),
      avatarUrl,
      currency,
      monthlyBudget: parsedBudget !== undefined && !isNaN(parsedBudget) && parsedBudget >= 0 ? parsedBudget : undefined,
      moneyGoal: moneyGoal || undefined,
    });

    setIsEditProfileOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border transition-all ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-extrabold text-base tracking-tight">Edit My Profile</h2>
              <p className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                Update your personal money space
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-4">
          {/* Avatar Selector */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${isMidnight ? 'text-slate-200' : 'text-slate-700'}`}>
              Profile Avatar
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {PRESET_AVATARS.map((url, idx) => {
                const isSelected = avatarUrl === url;
                return (
                  <div
                    key={idx}
                    onClick={() => setAvatarUrl(url)}
                    className={`relative w-11 h-11 rounded-full cursor-pointer shrink-0 transition-transform active:scale-95 ${
                      isSelected
                        ? 'ring-4 ring-pink-500 scale-105 shadow-md shadow-pink-500/30'
                        : 'opacity-70 hover:opacity-100 ring-1 ring-white/20'
                    }`}
                  >
                    <img src={url} alt={`Avatar ${idx + 1}`} className="w-full h-full object-cover rounded-full" />
                    {isSelected && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-pink-500 text-white flex items-center justify-center">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Upload Custom Avatar */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`w-11 h-11 rounded-full flex flex-col items-center justify-center shrink-0 border border-dashed transition-all active:scale-95 ${
                  avatarUrl && !PRESET_AVATARS.includes(avatarUrl)
                    ? 'ring-4 ring-pink-500 scale-105 bg-pink-500/20 border-pink-400'
                    : isMidnight
                    ? 'bg-purple-900/20 border-purple-500/40 text-purple-300'
                    : 'bg-pink-100/60 border-pink-300 text-pink-600'
                }`}
                title="Upload custom avatar"
              >
                {avatarUrl && !PRESET_AVATARS.includes(avatarUrl) ? (
                  <img src={avatarUrl} alt="Custom" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <>
                    <Upload className="w-3.5 h-3.5" />
                    <span className="text-[7px] font-bold">Upload</span>
                  </>
                )}
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} />
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isMidnight ? 'text-slate-200' : 'text-slate-700'}`}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError(null);
              }}
              required
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                nameError
                  ? 'border-rose-500 ring-2 ring-rose-500/20'
                  : isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
              }`}
            />
            {nameError && (
              <p className="text-[11px] font-semibold text-rose-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{nameError}</span>
              </p>
            )}
          </div>

          {/* Currency Field */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isMidnight ? 'text-slate-200' : 'text-slate-700'}`}>
              Preferred Currency
            </label>
            <div className="relative">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none appearance-none cursor-pointer ${
                  isMidnight
                    ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                    : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
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

          {/* Monthly Budget */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isMidnight ? 'text-slate-200' : 'text-slate-700'}`}>
              Monthly Spending Budget
            </label>
            <div className="relative flex items-center">
              <div className={`absolute left-3.5 font-bold text-xs pointer-events-none ${
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
                placeholder="Optional monthly budget"
                className={`w-full py-2.5 pl-8 pr-3.5 rounded-2xl border text-xs font-bold outline-none ${
                  isMidnight
                    ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                    : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
                }`}
              />
            </div>
          </div>

          {/* Money Goal */}
          <div>
            <label className={`block text-xs font-bold mb-1.5 ${isMidnight ? 'text-slate-200' : 'text-slate-700'}`}>
              Your Money Goal
            </label>
            <div className="space-y-1.5">
              {MONEY_GOALS.map((goal) => {
                const isSelected = moneyGoal === goal.id;
                const Icon = goal.icon;
                return (
                  <div
                    key={goal.id}
                    onClick={() => setMoneyGoal(isSelected ? '' : goal.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? isMidnight
                          ? 'bg-purple-900/40 border-pink-500/70 text-white ring-1 ring-pink-500/50'
                          : 'bg-pink-100/90 border-pink-400 text-pink-900 ring-1 ring-pink-400'
                        : isMidnight
                        ? 'bg-[#150d27] border-purple-500/20 text-slate-300'
                        : 'bg-white border-pink-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-pink-400" />
                      <span className="font-semibold">{goal.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-pink-500 stroke-[3]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs border transition-colors ${
                isMidnight
                  ? 'border-purple-500/30 text-slate-300 hover:bg-white/5'
                  : 'border-pink-200 text-slate-700 hover:bg-pink-50'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-white shadow-md active:scale-95 ${
                isMidnight
                  ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700'
                  : 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
