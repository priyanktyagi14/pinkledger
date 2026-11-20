import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Check, Image as ImageIcon, Upload, Sparkles } from 'lucide-react';

export const SectionCustomizationModal: React.FC = () => {
  const {
    isSectionCustomizationOpen,
    setIsSectionCustomizationOpen,
    sectionForCustomization,
    updateSection,
    uploadAssetBlob,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<'presets' | 'gradients' | 'solids' | 'upload'>('presets');
  const [selectedBg, setSelectedBg] = useState<string>(
    sectionForCustomization?.bgImage || sectionForCustomization?.customBg || ''
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>(
    sectionForCustomization?.customBgAssetId
  );
  const [bgType, setBgType] = useState<'aesthetic' | 'gradient' | 'solid' | 'custom'>(
    sectionForCustomization?.bgType || 'aesthetic'
  );

  if (!isSectionCustomizationOpen || !sectionForCustomization) return null;

  const aestheticPresets = [
    {
      id: 'food_pizza',
      name: 'Artisan Pizza',
      url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'shopping_aesthetic',
      name: 'Luxury Shopping',
      url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'entertainment_neon',
      name: 'Neon Gaming',
      url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'travel_sky',
      name: 'Sunset Airplane',
      url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'lofi_clouds',
      name: 'Pink Twilight',
      url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'neon_cafe',
      name: 'Coffee & Cafe',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const gradientPresets = [
    { id: 'grad_pink_purple', name: 'Bubblegum Dream', value: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)' },
    { id: 'grad_midnight_neon', name: 'Cyber Neon', value: 'linear-gradient(135deg, #d946ef 0%, #3b82f6 100%)' },
    { id: 'grad_sunset', name: 'Sunset Glow', value: 'linear-gradient(135deg, #f97316 0%, #ec4899 100%)' },
    { id: 'grad_aurora', name: 'Aurora Velvet', value: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' },
    { id: 'grad_emerald', name: 'Mint Forest', value: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)' },
    { id: 'grad_dark_onyx', name: 'Dark Nebula', value: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)' },
  ];

  const solidColors = [
    { id: 'col_pink', name: 'Bubblegum Pink', value: '#ec4899' },
    { id: 'col_purple', name: 'Royal Purple', value: '#8b5cf6' },
    { id: 'col_red', name: 'Crimson Rose', value: '#ef4444' },
    { id: 'col_orange', name: 'Vibrant Orange', value: '#f97316' },
    { id: 'col_blue', name: 'Electric Blue', value: '#3b82f6' },
    { id: 'col_emerald', name: 'Emerald Green', value: '#10b981' },
    { id: 'col_dark', name: 'Midnight Onyx', value: '#120722' },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadAssetBlob(file, 'section_bg', sectionForCustomization.id);
        setSelectedBg(asset.dataUrl || asset.url);
        setSelectedAssetId(asset.id);
        setBgType('custom');
      } catch (err) {
        console.error('Failed to upload background asset:', err);
      }
    }
  };

  const handleSave = () => {
    updateSection(sectionForCustomization.id, {
      customBg: selectedBg,
      customBgAssetId: selectedAssetId,
      bgImage: bgType === 'aesthetic' || bgType === 'custom' ? selectedBg : undefined,
      bgType,
      bgValue: selectedBg,
    });
    setIsSectionCustomizationOpen(false);
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
            <Sparkles className="w-5 h-5 text-pink-400" />
            <h2 className="font-display font-extrabold text-base tracking-tight">
              Customize {sectionForCustomization.name}
            </h2>
          </div>
          <button
            onClick={() => setIsSectionCustomizationOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Card */}
        <div className="my-3">
          <label className={`block text-[11px] font-bold mb-1.5 ${isMidnight ? 'text-slate-300' : 'text-slate-600'}`}>
            Live Background Preview
          </label>
          <div
            className="relative h-28 rounded-2xl overflow-hidden p-4 flex flex-col justify-between shadow-lg border border-white/20 transition-all"
            style={{
              background: bgType === 'gradient' ? selectedBg : bgType === 'solid' ? selectedBg : undefined,
              backgroundImage: bgType === 'aesthetic' || bgType === 'custom' ? `url(${selectedBg})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Readability Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="font-extrabold text-sm text-white drop-shadow">
                {sectionForCustomization.name}
              </span>
              <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full backdrop-blur-md font-bold">
                Preview
              </span>
            </div>

            <div className="relative z-10">
              <div className="font-display font-extrabold text-lg text-white drop-shadow">
                ₹{sectionForCustomization.totalSpent.toLocaleString('en-IN')}
              </div>
              <div className="text-[11px] text-slate-200 drop-shadow">
                {sectionForCustomization.tagline || 'Eat. Repeat. 😋'}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className={`flex items-center p-1 rounded-xl my-3 border text-xs font-bold ${
          isMidnight ? 'bg-[#1b122e] border-purple-500/20' : 'bg-pink-100/70 border-pink-200'
        }`}>
          {(['presets', 'gradients', 'solids', 'upload'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-1.5 rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-pink-500 text-white shadow-sm'
                  : isMidnight ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab 1: Aesthetic Photo Presets */}
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {aestheticPresets.map((preset) => (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedBg(preset.url);
                  setBgType('aesthetic');
                }}
                className={`relative h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-transform ${
                  selectedBg === preset.url ? 'border-pink-500 scale-102 ring-2 ring-pink-400/50' : 'border-transparent opacity-80 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                  <span className="text-[10px] font-bold text-white truncate">{preset.name}</span>
                </div>
                {selectedBg === preset.url && (
                  <Check className="w-4 h-4 absolute top-1 right-1 text-white bg-pink-500 rounded-full p-0.5" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Gradients */}
        {activeTab === 'gradients' && (
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto no-scrollbar">
            {gradientPresets.map((grad) => (
              <div
                key={grad.id}
                onClick={() => {
                  setSelectedBg(grad.value);
                  setBgType('gradient');
                }}
                className={`p-3 h-16 rounded-xl cursor-pointer flex items-end text-[10px] font-bold text-white border-2 relative transition-all ${
                  selectedBg === grad.value ? 'border-pink-500 ring-2 ring-pink-400/50' : 'border-transparent opacity-85'
                }`}
                style={{ background: grad.value }}
              >
                <span className="drop-shadow">{grad.name}</span>
                {selectedBg === grad.value && (
                  <Check className="w-4 h-4 absolute top-1 right-1 text-white bg-black/30 rounded-full p-0.5" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Solids */}
        {activeTab === 'solids' && (
          <div className="grid grid-cols-3 gap-2.5 max-h-48 overflow-y-auto no-scrollbar">
            {solidColors.map((col) => (
              <div
                key={col.id}
                onClick={() => {
                  setSelectedBg(col.value);
                  setBgType('solid');
                }}
                className={`h-14 rounded-xl cursor-pointer flex flex-col justify-end p-1.5 border-2 relative transition-all ${
                  selectedBg === col.value ? 'border-pink-500 ring-2 ring-pink-400/50' : 'border-transparent opacity-85'
                }`}
                style={{ backgroundColor: col.value }}
              >
                <span className="text-[9px] font-bold text-white drop-shadow truncate">{col.name}</span>
                {selectedBg === col.value && (
                  <Check className="w-3.5 h-3.5 absolute top-1 right-1 text-white bg-black/40 rounded-full p-0.5" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Custom Image Upload */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                isMidnight
                  ? 'border-purple-500/30 bg-[#1a1030]/60 hover:border-pink-500/60'
                  : 'border-pink-300 bg-white/70 hover:border-pink-400'
              }`}
            >
              <Upload className="w-6 h-6 text-pink-500 mb-2" />
              <span className="text-xs font-bold">Upload Custom Image</span>
              <span className={`text-[10px] mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                PNG, JPG or WebP from your device
              </span>
            </div>
            {bgType === 'custom' && selectedBg && (
              <div className="text-center text-xs text-emerald-400 font-bold">
                ✓ Image selected & ready to save
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="mt-5 pt-3 border-t border-white/10 flex gap-2.5">
          <button
            onClick={() => setIsSectionCustomizationOpen(false)}
            className={`flex-1 py-3 rounded-2xl font-bold text-xs ${
              isMidnight ? 'bg-[#1b122e] text-slate-300' : 'bg-pink-100 text-slate-700'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs shadow-md hover:from-pink-600 hover:to-rose-500"
          >
            Apply Background
          </button>
        </div>
      </div>
    </div>
  );
};
