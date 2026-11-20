import React from 'react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../context/PWAContext';
import {
  Settings as SettingsIcon,
  Moon,
  Heart,
  ChevronRight,
  Upload,
  Download,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
  HardDrive,
  AlertTriangle,
  Sparkles,
  Wifi,
  WifiOff,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    theme,
    setTheme,
    profile,
    exportJSON,
    setIsExportImportOpen,
    setIsCustomizationOpen,
    setIsEditProfileOpen,
    promptDelete,
    resetAllData,
  } = useApp();

  const {
    isInstalled,
    canInstall,
    isIOS,
    isOnline,
    promptInstall,
    setShowIOSInstallGuide,
  } = usePWA();

  const isMidnight = theme === 'midnight';

  const handleClearAll = () => {
    promptDelete(
      'Clear All Data',
      'This action will permanently delete all your custom sections, expenses, and income logs, and reset PinkLedger to default factory state.',
      () => {
        resetAllData();
      }
    );
  };

  return (
    <div className="px-5 pt-1 pb-28 space-y-5 animate-fadeIn">
      {/* Settings Header matching Reference 08 */}
      <div className="flex items-center gap-2">
        <SettingsIcon className="w-5 h-5 text-pink-400" />
        <h1
          className={`font-display font-extrabold text-2xl tracking-tight ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Settings
        </h1>
      </div>

      {/* User Profile Card matching Reference 08 */}
      <div
        className={`p-4 rounded-[24px] border transition-all ${
          isMidnight
            ? 'bg-[#180e2b] border-purple-500/25 shadow-lg'
            : 'bg-white border-pink-100 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-purple-500/40 shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%23ec4899"/><text x="50" y="65" font-size="42" font-family="sans-serif" font-weight="bold" fill="white" text-anchor="middle">P</text></svg>';
                }}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className={`font-display font-bold text-base ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                {profile.name}
              </h3>
              <p className={`text-xs flex items-center gap-1.5 ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className="text-pink-400 font-bold">{profile.currency || '₹ INR'}</span>
                {profile.moneyGoal && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-[140px]">{profile.moneyGoal}</span>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons: Edit My Profile & Personalize */}
        <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center gap-2">
          <button
            onClick={() => setIsEditProfileOpen(true)}
            className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
              isMidnight
                ? 'bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 text-purple-200'
                : 'bg-pink-100/80 hover:bg-pink-200/80 border border-pink-200 text-pink-700'
            }`}
          >
            <span>Edit My Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsCustomizationOpen(true)}
            className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all ${
              isMidnight
                ? 'bg-[#140b22] border-purple-500/20 text-slate-400 hover:text-white'
                : 'bg-white border-pink-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            Wallpapers
          </button>
        </div>
      </div>

      {/* Progressive Web App (PWA) Installation Section */}
      <div className="space-y-2.5">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
          App Installation & Mode
        </h2>

        {isInstalled ? (
          /* State 1: App is verified as Installed */
          <div
            className={`p-4 rounded-[24px] border transition-all ${
              isMidnight
                ? 'bg-gradient-to-br from-[#1b1033] to-[#120824] border-emerald-500/30 shadow-lg'
                : 'bg-gradient-to-br from-emerald-50/90 to-pink-50/60 border-emerald-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-display font-bold text-sm">Installed Mobile App</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                  <p className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Running standalone with no browser bars
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px]">
              <span className={`flex items-center gap-1.5 ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                <HardDrive className="w-3.5 h-3.5 text-pink-400" />
                <span>Offline Storage: IndexedDB</span>
              </span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Offline Ready</span>
              </span>
            </div>
          </div>
        ) : canInstall ? (
          /* State 2: Browser supports direct installation prompt (Android / Chrome / Edge) */
          <div
            className={`p-4 rounded-[24px] border transition-all ${
              isMidnight
                ? 'bg-gradient-to-br from-[#21123d] to-[#160a2c] border-pink-500/35 shadow-lg'
                : 'bg-gradient-to-br from-pink-50 to-white border-pink-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display font-extrabold text-sm">Install PinkLedger App</h3>
                <p className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-300' : 'text-slate-600'}`}>
                  Add to home screen for fullscreen mobile feel & offline access.
                </p>
              </div>
            </div>

            <button
              onClick={() => promptInstall()}
              className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-pink-500/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Install PinkLedger to Home Screen</span>
            </button>
          </div>
        ) : isIOS ? (
          /* State 3: iOS / Safari - Guide user to Share -> Add to Home Screen */
          <div
            className={`p-4 rounded-[24px] border transition-all ${
              isMidnight
                ? 'bg-[#180e2b] border-purple-500/30'
                : 'bg-white border-pink-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm">Install on iPhone / iPad</h3>
                  <p className={`text-xs mt-0.5 ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                    Add to Home Screen via Safari Share menu
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSInstallGuide(true)}
                className="px-3 py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/30 text-pink-300 font-bold text-xs transition-colors shrink-0"
              >
                View Steps
              </button>
            </div>
          </div>
        ) : (
          /* State 4: Standard Browser / Fallback */
          <div
            className={`p-4 rounded-[24px] border text-xs space-y-2 transition-all ${
              isMidnight ? 'bg-[#180e2b] border-purple-500/25 text-slate-300' : 'bg-white border-pink-100 text-slate-700 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-pink-400">
              <Smartphone className="w-4 h-4" />
              <span>Progressive Web App</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              PinkLedger is an installable PWA. To install on your device, open your browser menu (⋮) and select <strong className="text-pink-400">"Install PinkLedger"</strong> or <strong className="text-pink-400">"Add to Home screen"</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Appearance Section matching Reference 08 */}
      <div className="space-y-3">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
          Appearance
        </h2>

        {/* Theme Toggle Buttons matching 08_settings.png */}
        <div>
          <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
            Theme
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Dark Mode Card */}
            <button
              onClick={() => setTheme('midnight')}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${
                theme === 'midnight'
                  ? 'bg-[#1c1033] border-purple-500 ring-2 ring-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : isMidnight
                  ? 'bg-[#140b22] border-purple-500/20 text-slate-400'
                  : 'bg-white border-pink-100 text-slate-400'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-purple-900/60 flex items-center justify-center">
                <Moon className="w-5 h-5 text-purple-300" />
              </div>
              <span className={`text-xs font-bold ${theme === 'midnight' ? 'text-white' : 'text-slate-400'}`}>
                Dark
              </span>
            </button>

            {/* Pink Mode Card */}
            <button
              onClick={() => setTheme('bubblegum')}
              className={`p-3.5 rounded-2xl flex flex-col items-center justify-center gap-2 border transition-all ${
                theme === 'bubblegum'
                  ? 'bg-pink-100 border-pink-400 ring-2 ring-pink-400/50 shadow-[0_0_15px_rgba(244,114,182,0.3)] text-pink-700'
                  : isMidnight
                  ? 'bg-[#140b22] border-purple-500/20 text-slate-400'
                  : 'bg-white border-pink-100 text-slate-400'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
              </div>
              <span className={`text-xs font-bold ${theme === 'bubblegum' ? 'text-pink-600' : 'text-slate-400'}`}>
                Pink
              </span>
            </button>
          </div>
        </div>

        {/* Background Preview & Customize Button matching Reference 08 */}
        <div className="pt-1">
          <label className={`block text-xs font-semibold mb-2 ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
            Background
          </label>
          <div
            onClick={() => setIsCustomizationOpen(true)}
            className={`relative overflow-hidden rounded-[22px] p-4 flex items-center justify-between cursor-pointer border group transition-all ${
              isMidnight
                ? 'bg-[#180e2b] border-purple-500/25 hover:border-pink-500/40 shadow-md'
                : 'bg-white border-pink-200 hover:border-pink-300 shadow-sm'
            }`}
          >
            {/* Thumbnail Preview of clouds wallpaper */}
            <div className="relative w-32 h-14 rounded-xl overflow-hidden shadow-sm shrink-0 border border-white/20 bg-pink-900/30">
              <img
                src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80"
                alt="Cloud wallpaper preview"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 150"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ec4899"/><stop offset="100%" stop-color="%238b5cf6"/></linearGradient></defs><rect width="400" height="150" fill="url(%23g)"/></svg>';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold text-pink-400 group-hover:text-pink-300">
              <span>Customize</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section matching Reference 08 */}
      <div className="space-y-2.5">
        <h2 className={`text-xs font-bold uppercase tracking-wider ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
          Data Management
        </h2>

        <div
          className={`rounded-[24px] border divide-y overflow-hidden ${
            isMidnight
              ? 'bg-[#180e2b] border-purple-500/25 divide-purple-500/15'
              : 'bg-white border-pink-100 divide-pink-100 shadow-sm'
          }`}
        >
          {/* Export Data */}
          <button
            onClick={exportJSON}
            className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
              isMidnight ? 'hover:bg-purple-900/20 text-slate-200' : 'hover:bg-pink-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Upload className="w-4 h-4 text-pink-400" />
              <span className="text-xs font-bold">Export Data (JSON Backup)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Import Data */}
          <button
            onClick={() => setIsExportImportOpen(true)}
            className={`w-full p-4 flex items-center justify-between text-left transition-colors ${
              isMidnight ? 'hover:bg-purple-900/20 text-slate-200' : 'hover:bg-pink-50 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Download className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold">Import Data (Restore)</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>

          {/* Clear All Data matching red badge in 08_settings */}
          <button
            onClick={handleClearAll}
            className="w-full p-4 flex items-center justify-between text-left text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 className="w-4 h-4" />
              <span className="text-xs font-bold">Clear All Data</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          </button>
        </div>
      </div>

      {/* Security, Privacy & Local-First Architecture Information */}
      <div
        className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
          isMidnight ? 'bg-[#140b22]/90 border-purple-500/25 text-slate-300' : 'bg-pink-50/90 border-pink-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-1.5 font-bold text-pink-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm">Privacy & Local Architecture</span>
        </div>

        <div className="space-y-2 text-[11px] leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400 shrink-0 font-bold">✓</span>
            <p>
              <strong className="text-white">100% Offline & Private:</strong> Zero servers, zero trackers, and zero telemetry scripts. Financial records never leave your local device.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-emerald-400 shrink-0 font-bold">✓</span>
            <p>
              <strong className="text-white">Isolated Database:</strong> Service worker caches only visual shell files (HTML/CSS/JS). Cache cleanup or app updates never touch or delete your IndexedDB transaction records.
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span className="text-emerald-400 shrink-0 font-bold">✓</span>
            <p>
              <strong className="text-white">Zero Console Leakage:</strong> Transaction amounts and financial totals are never logged to the browser console.
            </p>
          </div>

          <div className="flex items-start gap-2 pt-1 border-t border-white/5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-amber-300/90 font-medium">
              <strong>Local Backup Advisory:</strong> Progressive Web Apps do not guarantee permanent storage against browser site data clearing or device loss. Export regular backups to preserve your history.
            </p>
          </div>
        </div>

        <button
          onClick={exportJSON}
          className="w-full mt-1 py-2 px-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Export Backup File Now</span>
        </button>
      </div>
    </div>
  );
};
