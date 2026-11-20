import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Image as ImageIcon, User, Upload, Sparkles, Palette } from 'lucide-react';

export const CustomizationModal: React.FC = () => {
  const {
    isCustomizationOpen,
    setIsCustomizationOpen,
    profile,
    updateProfile,
    uploadAssetBlob,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [currency, setCurrency] = useState(profile.currency);
  const [bgCategory, setBgCategory] = useState<'presets' | 'gradients' | 'solids' | 'upload'>('presets');
  const [selectedBg, setSelectedBg] = useState(profile.backgroundPreset);
  const [customWallpaper, setCustomWallpaper] = useState(profile.customWallpaper || '');
  const [customWallpaperAssetId, setCustomWallpaperAssetId] = useState<string | undefined>(
    profile.customWallpaperAssetId
  );

  if (!isCustomizationOpen) return null;

  const wallpapers = [
    {
      id: 'sunset_clouds',
      name: 'Twilight Clouds',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cyber_neon',
      name: 'Cyber Neon',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'lofi_room',
      name: 'Pastel Dream',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'midnight_stars',
      name: 'Deep Galaxy',
      url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const gradientPresets = [
    { id: 'grad_pink_purple', name: 'Bubblegum Dream', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
    { id: 'grad_cyber', name: 'Cyber Neon', value: 'linear-gradient(135deg, #d946ef 0%, #3b82f6 100%)' },
    { id: 'grad_sunset', name: 'Sunset Glow', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
    { id: 'grad_dark', name: 'Midnight Deep', value: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)' },
  ];

  const solidColors = [
    { id: 'col_pink', name: 'Bubblegum Pink', value: '#ec4899' },
    { id: 'col_purple', name: 'Royal Purple', value: '#8b5cf6' },
    { id: 'col_blue', name: 'Electric Blue', value: '#3b82f6' },
    { id: 'col_dark', name: 'Midnight Onyx', value: '#120722' },
  ];

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
  ];

  const handleCustomUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadAssetBlob(file, 'wallpaper');
        setCustomWallpaper(asset.dataUrl || asset.url);
        setCustomWallpaperAssetId(asset.id);
        setSelectedBg('custom');
      } catch (err) {
        console.error('Failed to upload custom wallpaper:', err);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      title,
      currency,
      backgroundPreset: selectedBg,
      customWallpaper: selectedBg === 'custom' ? customWallpaper : undefined,
      customWallpaperAssetId: selectedBg === 'custom' ? customWallpaperAssetId : undefined,
    });
    setIsCustomizationOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border transition-all ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-pink-400" />
            <h2 className="font-display font-extrabold text-base tracking-tight">
              Personalize PinkLedger
            </h2>
          </div>
          <button
            onClick={() => setIsCustomizationOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 mt-2">
          {/* Avatar Selector */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Choose Avatar
            </label>
            <div className="flex items-center justify-between px-1">
              {avatarOptions.map((url, idx) => (
                <div
                  key={idx}
                  onClick={() => updateProfile({ avatarUrl: url })}
                  className={`w-12 h-12 rounded-full overflow-hidden cursor-pointer transition-transform ${
                    profile.avatarUrl === url
                      ? 'ring-4 ring-pink-500 scale-105 shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="avatar" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
              }`}
            />
          </div>

          {/* Title Field */}
          <div>
            <label className={`block text-xs font-semibold mb-1 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Bio / Subtitle
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
              }`}
            />
          </div>

          {/* Background Customization Tabs */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              App Wallpaper Customization
            </label>

            <div className={`flex items-center p-1 rounded-xl mb-3 border text-[11px] font-bold ${
              isMidnight ? 'bg-[#1b122e] border-purple-500/20' : 'bg-pink-100/70 border-pink-200'
            }`}>
              {(['presets', 'gradients', 'solids', 'upload'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setBgCategory(tab)}
                  className={`flex-1 py-1 rounded-lg capitalize transition-all ${
                    bgCategory === tab
                      ? 'bg-pink-500 text-white shadow-sm'
                      : isMidnight ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Presets */}
            {bgCategory === 'presets' && (
              <div className="grid grid-cols-2 gap-2">
                {wallpapers.map((w) => (
                  <div
                    key={w.id}
                    onClick={() => setSelectedBg(w.id)}
                    className={`h-20 rounded-xl relative overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedBg === w.id ? 'border-pink-500 scale-102 ring-2 ring-pink-400' : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={w.url} alt={w.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-2">
                      <span className="text-[11px] font-bold text-white drop-shadow truncate">{w.name}</span>
                    </div>
                    {selectedBg === w.id && (
                      <Check className="w-4 h-4 absolute top-1.5 right-1.5 text-white bg-pink-500 rounded-full p-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Gradients */}
            {bgCategory === 'gradients' && (
              <div className="grid grid-cols-2 gap-2">
                {gradientPresets.map((g) => (
                  <div
                    key={g.id}
                    onClick={() => setSelectedBg(g.id)}
                    className={`h-16 rounded-xl cursor-pointer p-2 flex items-end border-2 relative transition-all ${
                      selectedBg === g.id ? 'border-pink-500 ring-2 ring-pink-400' : 'border-transparent opacity-85'
                    }`}
                    style={{ background: g.value }}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow">{g.name}</span>
                    {selectedBg === g.id && (
                      <Check className="w-4 h-4 absolute top-1.5 right-1.5 text-white bg-black/40 rounded-full p-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Solids */}
            {bgCategory === 'solids' && (
              <div className="grid grid-cols-2 gap-2">
                {solidColors.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedBg(s.id)}
                    className={`h-14 rounded-xl cursor-pointer p-2 flex items-end border-2 relative transition-all ${
                      selectedBg === s.id ? 'border-pink-500 ring-2 ring-pink-400' : 'border-transparent opacity-85'
                    }`}
                    style={{ backgroundColor: s.value }}
                  >
                    <span className="text-[10px] font-bold text-white drop-shadow">{s.name}</span>
                    {selectedBg === s.id && (
                      <Check className="w-4 h-4 absolute top-1.5 right-1.5 text-white bg-black/40 rounded-full p-0.5" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload */}
            {bgCategory === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleCustomUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-5 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isMidnight
                      ? 'border-purple-500/30 bg-[#1a1030]/60 hover:border-pink-500'
                      : 'border-pink-300 bg-white/70 hover:border-pink-400'
                  }`}
                >
                  <Upload className="w-5 h-5 text-pink-500 mb-1.5" />
                  <span className="text-xs font-bold">Upload Custom Wallpaper</span>
                  <span className={`text-[10px] mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                    Saved to local device storage
                  </span>
                </div>
                {selectedBg === 'custom' && customWallpaper && (
                  <div className="text-center text-xs text-emerald-400 font-bold">
                    ✓ Custom image loaded
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-md hover:from-pink-600 hover:to-rose-500"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};
