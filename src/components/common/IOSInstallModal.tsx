import React from 'react';
import { usePWA } from '../../context/PWAContext';
import { useApp } from '../../context/AppContext';
import { X, Share, PlusSquare, Sparkles, Smartphone, CheckCircle2 } from 'lucide-react';

export const IOSInstallModal: React.FC = () => {
  const { showIOSInstallGuide, setShowIOSInstallGuide } = usePWA();
  const { theme } = useApp();
  const isMidnight = theme === 'midnight';

  if (!showIOSInstallGuide) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className={`w-full max-w-sm rounded-3xl p-6 shadow-2xl border transition-all animate-scaleUp ${
          isMidnight
            ? 'bg-[#180e2b] border-purple-500/30 text-white'
            : 'bg-white border-pink-200 text-slate-800'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-base">Install on iPhone / iPad</h3>
              <p className={`text-[11px] ${isMidnight ? 'text-pink-300' : 'text-pink-600'}`}>
                Add to your iOS Home Screen
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowIOSInstallGuide(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps List */}
        <div className="py-4 space-y-4">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center shrink-0 border border-pink-500/30">
              1
            </div>
            <div className="text-xs">
              <span className="font-bold">Open in Safari</span>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                Make sure you are viewing PinkLedger in Apple's Safari browser.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center shrink-0 border border-pink-500/30">
              2
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <span>Tap the Share Button</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-500/20 text-blue-400">
                  <Share className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                Located in the toolbar at the bottom of your iPhone screen (or top on iPad).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs flex items-center justify-center shrink-0 border border-pink-500/30">
              3
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-1.5 font-bold">
                <span>Select "Add to Home Screen"</span>
                <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-purple-500/20 text-purple-400">
                  <PlusSquare className="w-3.5 h-3.5" />
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                Scroll down in the action list and select <strong className="text-pink-400">Add to Home Screen</strong>.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5">
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/30">
              4
            </div>
            <div className="text-xs">
              <span className="font-bold">Tap "Add" in Top Right</span>
              <p className={`text-[11px] mt-0.5 leading-relaxed ${isMidnight ? 'text-slate-400' : 'text-slate-600'}`}>
                Confirm by tapping <strong className="text-emerald-400">Add</strong>. PinkLedger will open in full standalone app mode with zero browser bars!
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => setShowIOSInstallGuide(false)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-lg shadow-pink-500/30 hover:opacity-95 transition-all"
        >
          Got It, Let's Go!
        </button>
      </div>
    </div>
  );
};
