import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2, Smartphone, Edit2, Check, ArrowRightLeft, Upload, Sparkles } from 'lucide-react';
import { AppItem } from '../../types';
import { findAppInRegistry } from '../../data/appRegistry';
import { AppLogo } from '../common/AppLogo';

export const AppManagementModal: React.FC = () => {
  const {
    isAppManageOpen,
    setIsAppManageOpen,
    selectedSection,
    sections,
    addApplicationToSection,
    updateApplication,
    removeApplicationFromSection,
    moveApplication,
    uploadAssetBlob,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [appName, setAppName] = useState('');
  const [appColor, setAppColor] = useState('#ec4899');
  const [customIconData, setCustomIconData] = useState<string | null>(null);
  const [customIconAssetId, setCustomIconAssetId] = useState<string | undefined>();
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [moveTargetSectionId, setMoveTargetSectionId] = useState<string>('');

  if (!isAppManageOpen || !selectedSection) return null;

  // Real-time local registry detection
  const detectedApp = findAppInRegistry(appName);

  const handleCustomIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const asset = await uploadAssetBlob(file, 'app_icon', selectedSection.id);
        setCustomIconData(asset.dataUrl || asset.url);
        setCustomIconAssetId(asset.id);
      } catch (err) {
        console.error('Failed to upload custom icon asset:', err);
      }
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim()) return;

    const newApp: AppItem = {
      id: 'app-' + Date.now(),
      name: appName.trim(),
      iconName: detectedApp ? detectedApp.id : appName.trim().toLowerCase(),
      color: detectedApp ? detectedApp.color : appColor,
      bgColor: detectedApp ? detectedApp.bgColor : appColor,
      customIcon: customIconData || undefined,
      customIconAssetId,
    };

    addApplicationToSection(selectedSection.id, newApp);
    setAppName('');
    setCustomIconData(null);
    setCustomIconAssetId(undefined);
  };

  const startRename = (app: AppItem) => {
    setEditingAppId(app.id);
    setEditingName(app.name);
  };

  const saveRename = (appId: string) => {
    if (editingName.trim()) {
      const detected = findAppInRegistry(editingName);
      updateApplication(selectedSection.id, appId, {
        name: editingName.trim(),
        iconName: detected ? detected.id : editingName.trim().toLowerCase(),
        color: detected ? detected.color : undefined,
        bgColor: detected ? detected.bgColor : undefined,
      });
    }
    setEditingAppId(null);
  };

  const handleMove = (appId: string, targetSecId: string) => {
    if (!targetSecId || targetSecId === selectedSection.id) return;
    moveApplication(selectedSection.id, targetSecId, appId);
    setMoveTargetSectionId('');
  };

  const colors = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#111827'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border transition-all ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-pink-400" />
            <h2 className="font-display font-extrabold text-base tracking-tight">
              Manage Apps — {selectedSection.name}
            </h2>
          </div>
          <button
            onClick={() => setIsAppManageOpen(false)}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Apps in Section */}
        <div className="my-3 space-y-2.5 max-h-56 overflow-y-auto no-scrollbar">
          {selectedSection.applications.map((app) => (
            <div
              key={app.id}
              className={`p-3 rounded-2xl border transition-all ${
                isMidnight ? 'bg-[#1b122e] border-purple-500/20' : 'bg-white border-pink-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <AppLogo
                    name={app.name}
                    iconName={app.iconName}
                    color={app.color}
                    bgColor={app.bgColor}
                    customIcon={app.customIcon}
                    size="sm"
                  />
                  {editingAppId === app.id ? (
                    <div className="flex items-center gap-1.5 flex-1 mr-2">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className={`w-full py-1 px-2 rounded-lg text-xs font-bold border outline-none ${
                          isMidnight ? 'bg-[#150d24] border-pink-500 text-white' : 'bg-white border-pink-400'
                        }`}
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(app.id)}
                        className="p-1 rounded-lg bg-pink-500 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="truncate flex-1">
                      <span className="text-xs font-bold truncate block">{app.name}</span>
                      <span className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {app.customIcon ? 'Custom Icon' : app.iconName || 'App'}
                      </span>
                    </div>
                  )}
                </div>

                {/* App Actions: Rename, Move, Delete */}
                <div className="flex items-center gap-1 shrink-0">
                  {editingAppId !== app.id && (
                    <button
                      onClick={() => startRename(app)}
                      title="Rename App"
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
                      }`}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Move Section Dropdown */}
                  {sections.length > 1 && (
                    <select
                      value=""
                      onChange={(e) => handleMove(app.id, e.target.value)}
                      title="Move to another section"
                      className={`text-[10px] font-bold py-1 px-1.5 rounded-lg border cursor-pointer outline-none ${
                        isMidnight ? 'bg-[#150d24] border-purple-500/30 text-purple-300' : 'bg-pink-50 border-pink-200 text-pink-700'
                      }`}
                    >
                      <option value="" disabled>
                        Move...
                      </option>
                      {sections
                        .filter((s) => s.id !== selectedSection.id)
                        .map((s) => (
                          <option key={s.id} value={s.id} className={isMidnight ? 'bg-[#150d24] text-white' : 'bg-white'}>
                            {s.name}
                          </option>
                        ))}
                    </select>
                  )}

                  {/* Remove App */}
                  {selectedSection.applications.length > 1 && (
                    <button
                      onClick={() => removeApplicationFromSection(selectedSection.id, app.id)}
                      title="Remove App"
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add New App Form */}
        <form onSubmit={handleAdd} className="mt-4 pt-3 border-t border-white/10 space-y-3">
          <label className={`block text-xs font-bold ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
            Add New Application
          </label>

          {/* Name input */}
          <div className="relative">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              placeholder="e.g. Zomato, Swiggy, Netflix, Amazon..."
              required
              className={`w-full py-2.5 px-3.5 rounded-2xl border text-xs font-bold outline-none ${
                isMidnight ? 'bg-[#1a1030] border-purple-500/30 text-white focus:border-pink-500' : 'bg-white border-pink-200 text-slate-900 focus:border-pink-400'
              }`}
            />
          </div>

          {/* Automatic detection preview badge */}
          {appName.trim() && (
            <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs animate-scaleUp ${
              isMidnight ? 'bg-[#1f1338] border-purple-500/30' : 'bg-pink-50 border-pink-200'
            }`}>
              <div className="flex items-center gap-2">
                <AppLogo
                  name={appName}
                  iconName={detectedApp?.id}
                  color={detectedApp?.color || appColor}
                  bgColor={detectedApp?.bgColor || appColor}
                  customIcon={customIconData || undefined}
                  size="sm"
                />
                <div>
                  <div className="font-extrabold flex items-center gap-1">
                    <span>{detectedApp ? detectedApp.name : appName}</span>
                    {detectedApp && <Sparkles className="w-3 h-3 text-pink-400" />}
                  </div>
                  <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                    {detectedApp
                      ? 'Local logo recognized automatically'
                      : customIconData
                      ? 'Custom icon attached'
                      : 'First-letter avatar applied'}
                  </div>
                </div>
              </div>

              {/* Upload custom icon button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`p-1.5 rounded-lg border text-[10px] font-bold flex items-center gap-1 ${
                  isMidnight ? 'border-purple-500/30 hover:bg-white/10' : 'border-pink-200 hover:bg-pink-100'
                }`}
                title="Upload Custom Icon Image"
              >
                <Upload className="w-3 h-3" />
                <span>Upload</span>
              </button>
            </div>
          )}

          {/* Hidden file input for custom image upload */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleCustomIconUpload}
            accept="image/*"
            className="hidden"
          />

          {/* Color choices if unknown app */}
          {!detectedApp && (
            <div className="flex items-center gap-2 pt-1">
              <span className={`text-[11px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                Avatar Color:
              </span>
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAppColor(c)}
                  className={`w-5 h-5 rounded-full transition-transform ${
                    appColor === c ? 'ring-2 ring-white scale-110' : 'opacity-80'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:from-pink-600 hover:to-rose-500 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add to {selectedSection.name}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
