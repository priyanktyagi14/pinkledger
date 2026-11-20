import React from 'react';
import { findAppInRegistry } from '../../data/appRegistry';
import { Smartphone } from 'lucide-react';

interface AppLogoProps {
  name: string;
  iconName?: string;
  color?: string;
  bgColor?: string;
  logoUrl?: string;
  customIcon?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  name,
  iconName,
  color,
  bgColor,
  logoUrl,
  customIcon,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 text-[10px] rounded-lg',
    md: 'w-10 h-10 text-xs rounded-2xl',
    lg: 'w-12 h-12 text-sm rounded-[18px]',
    xl: 'w-14 h-14 text-base rounded-2xl',
  };

  const imageSrc = customIcon || logoUrl;

  if (imageSrc) {
    return (
      <div
        className={`${sizeClasses[size]} overflow-hidden shadow-md shrink-0 flex items-center justify-center bg-black/10 ${className}`}
      >
        <img src={imageSrc} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }

  // Look up in bundled local registry
  const match = findAppInRegistry(iconName || name);

  if (match) {
    return (
      <div
        className={`${sizeClasses[size]} shadow-md shrink-0 flex items-center justify-center transition-transform ${className}`}
        style={{ backgroundColor: bgColor || match.bgColor }}
      >
        {match.renderLogo()}
      </div>
    );
  }

  // Fallback 1: First letter avatar
  const firstLetter = (name.trim().charAt(0) || 'A').toUpperCase();
  const fallbackBg = bgColor || color || '#ec4899';

  return (
    <div
      className={`${sizeClasses[size]} shadow-md shrink-0 flex items-center justify-center font-display font-extrabold text-white transition-transform ${className}`}
      style={{ backgroundColor: fallbackBg }}
    >
      {firstLetter}
    </div>
  );
};
