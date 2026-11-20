import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { usePWA } from '../../context/PWAContext';
import { Smartphone, Monitor } from 'lucide-react';

interface AppFrameProps {
  children: React.ReactNode;
}

export const AppFrame: React.FC<AppFrameProps> = ({ children }) => {
  const { theme } = useApp();
  const { isInstalled } = usePWA();
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const isMidnight = theme === 'midnight';

  return (
    <div
      className={`min-h-screen w-full flex flex-col items-center justify-start ${
        isInstalled ? 'p-0' : 'md:py-8'
      } transition-colors duration-500 relative overflow-x-hidden ${
        isMidnight ? 'bg-[#07030e] text-slate-100' : 'bg-[#ffd3e2] text-slate-900'
      }`}
    >
      {/* Ambient background glow effects for desktop */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-[120px] transition-all duration-700 ${
            isMidnight ? 'bg-purple-900/30' : 'bg-pink-300/40'
          }`}
        />
        <div
          className={`absolute top-1/2 -right-40 w-96 h-96 rounded-full blur-[120px] transition-all duration-700 ${
            isMidnight ? 'bg-pink-900/25' : 'bg-rose-300/40'
          }`}
        />
      </div>

      {/* Desktop view switcher pill bar (only when viewing in desktop browser, not installed PWA) */}
      {!isInstalled && (
        <div className="hidden md:flex items-center gap-3 mb-4 z-10">
          <button
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
              isMidnight
                ? 'bg-[#1a0f2e] border border-purple-500/30 text-purple-200 hover:border-pink-500'
                : 'bg-white border border-pink-200 text-pink-600 hover:border-pink-300 shadow-sm'
            }`}
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Expand to Fullscreen</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5" />
                <span>Mobile Phone Frame</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Main Container / Mobile Phone Device Shell */}
      <div
        className={`w-full transition-all duration-300 z-10 relative ${
          isInstalled
            ? 'max-w-md min-h-screen pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] ' +
              (isMidnight ? 'bg-[#0a0512]' : 'bg-[#ffdbe8]')
            : deviceFrameMode
            ? 'md:max-w-[420px] md:rounded-[44px] md:border-[7px] md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] md:my-auto min-h-screen md:min-h-[850px] md:max-h-[92vh] overflow-y-auto no-scrollbar md:pt-3 ' +
              (isMidnight
                ? 'md:border-[#22153b] md:bg-[#0a0512] bg-[#0a0512]'
                : 'md:border-white md:bg-[#ffdbe8] bg-[#ffdbe8]')
            : 'max-w-2xl rounded-3xl min-h-screen px-4 ' +
              (isMidnight ? 'bg-[#0a0512]' : 'bg-[#ffdbe8]')
        }`}
      >
        {/* Child Screen Content */}
        {children}
      </div>
    </div>
  );
};
