import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Image as ImageIcon, Plane, Briefcase, Palmtree, Car, Plus, Sparkles, Utensils, ShoppingBag, Gamepad2, Upload } from 'lucide-react';

export const CreateSectionModal: React.FC = () => {
  const { isCreateSectionOpen, setIsCreateSectionOpen, createSection, uploadAssetBlob, theme } = useApp();
  const isMidnight = theme === 'midnight';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('Travel');
  const [selectedIcon, setSelectedIcon] = useState('Plane');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [selectedGradient, setSelectedGradient] = useState('from-cyan-500/30 to-blue-600/10');
  const [selectedBgUrl, setSelectedBgUrl] = useState<string>(
    'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80'
  );
  const [selectedAssetId, setSelectedAssetId] = useState<string | undefined>();

  if (!isCreateSectionOpen) return null;

  const icons = [
    { name: 'Plane', icon: Plane, color: '#3b82f6', bg: '#2563eb' },
    { name: 'Briefcase', icon: Briefcase, color: '#d97706', bg: '#b45309' },
    { name: 'Palmtree', icon: Palmtree, color: '#059669', bg: '#047857' },
    { name: 'Car', icon: Car, color: '#6366f1', bg: '#4f46e5' },
    { name: 'Utensils', icon: Utensils, color: '#ef4444', bg: '#dc2626' },
    { name: 'ShoppingBag', icon: ShoppingBag, color: '#f97316', bg: '#ea580c' },
    { name: 'Gamepad2', icon: Gamepad2, color: '#a855f7', bg: '#9333ea' },
  ];

  const presets = [
    {
      id: 'airplane_sky',
      name: 'Sky & Plane',
      url: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'sunset_palm',
      name: 'Tropical Sunset',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'city_night',
      name: 'Cyber City',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 'cafe_aesthetic',
      name: 'Cafe Cozy',
      url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadAssetBlob(file, 'section_bg');
        setSelectedBgUrl(asset.dataUrl || asset.url);
        setSelectedAssetId(asset.id);
      } catch (err) {
        console.error('Failed to upload section background:', err);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    createSection(
      name.trim(),
      selectedIcon,
      selectedColor,
      selectedGradient,
      'custom',
      5000,
      selectedBgUrl,
      selectedAssetId
    );
  };

  const getActiveIconComponent = () => {
    const found = icons.find((i) => i.name === selectedIcon);
    if (found) {
      const Comp = found.icon;
      return <Comp className="w-5 h-5 text-white" />;
    }
    return <Sparkles className="w-5 h-5 text-white" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl transition-all border ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <button
            onClick={() => setIsCreateSectionOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:text-slate-800 hover:bg-pink-100'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display font-extrabold text-lg tracking-tight">Create Section</h2>
          <div className="w-5" />
        </div>

        {/* Background Upload Card matching Reference 06 */}
        <div className="mb-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[22px] p-4 text-center cursor-pointer transition-all ${
              isMidnight
                ? 'border-purple-500/30 bg-[#1b102f]/60 hover:border-pink-500/50'
                : 'border-pink-300 bg-white/60 hover:border-pink-400'
            }`}
          >
            <div className="flex flex-col items-center justify-center py-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                  isMidnight ? 'bg-purple-900/40 text-purple-300' : 'bg-pink-100 text-pink-500'
                }`}
              >
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
                Add a background
              </span>
              <span className={`text-[11px] mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                (or choose from presets)
              </span>

              {/* Preset Selector Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3">
                {presets.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedBgUrl(p.url);
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                      selectedBgUrl === p.url
                        ? 'bg-pink-500 text-white shadow-sm ring-2 ring-pink-300'
                        : isMidnight
                        ? 'bg-[#251540] text-slate-300 hover:bg-[#301b52]'
                        : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Section Name */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Section Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Travel"
              required
              className={`w-full py-3 px-3.5 rounded-2xl border text-xs font-bold outline-none transition-all ${
                isMidnight
                  ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500'
                  : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Choose Icon matching Reference 06 */}
          <div>
            <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Choose Icon
            </label>
            <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
              {icons.map((item) => {
                const isSelected = selectedIcon === item.name;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => {
                      setSelectedIcon(item.name);
                      setSelectedColor(item.color);
                    }}
                    className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isSelected ? 'ring-3 ring-pink-500 scale-110 shadow-lg' : 'opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: item.bg }}
                  >
                    <IconComponent className="w-5 h-5 text-white" />
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => {
                  setSelectedIcon('Sparkles');
                  setSelectedColor('#ec4899');
                }}
                className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border border-dashed transition-transform ${
                  isMidnight ? 'border-purple-500/40 text-purple-300' : 'border-pink-300 text-pink-600'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Preview Card matching Reference 06 */}
          <div>
            <label className={`block text-xs font-semibold mb-1.5 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Preview
            </label>
            <div
              className="relative h-28 rounded-[22px] overflow-hidden p-4 shadow-lg border border-white/20 flex flex-col justify-between"
              style={{
                backgroundImage: `url(${selectedBgUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {/* Overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

              <div className="relative z-10 flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shadow-md"
                  style={{ backgroundColor: selectedColor }}
                >
                  {getActiveIconComponent()}
                </div>
                <span className="font-display font-extrabold text-base text-white drop-shadow">
                  {name.trim() || 'Travel'}
                </span>
              </div>

              <div className="relative z-10 text-[11px] font-semibold text-slate-200 drop-shadow">
                0 spent • 0 txns
              </div>
            </div>
          </div>

          {/* Submit Button matching Reference 06 */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-display font-extrabold text-sm shadow-[0_8px_25px_-5px_rgba(236,72,153,0.5)] hover:opacity-95 active:scale-95 transition-all"
            >
              Create Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
