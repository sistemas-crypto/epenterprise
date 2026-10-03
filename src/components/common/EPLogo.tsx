import React from 'react';

interface EPLogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const EPLogo: React.FC<EPLogoProps> = ({
  className = '',
  variant = 'full',
  size = 'md',
  showSubtitle = true,
}) => {
  // Sizing definitions
  const dimensions = {
    sm: { icon: 30, textClass: 'text-sm', subClass: 'text-[9px]' },
    md: { icon: 38, textClass: 'text-base', subClass: 'text-[10px]' },
    lg: { icon: 46, textClass: 'text-lg', subClass: 'text-xs' },
    xl: { icon: 58, textClass: 'text-2xl', subClass: 'text-xs' },
  }[size];

  const isLight = variant === 'light';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Official Essential Pharma Organic Leaves Emblem */}
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-xs transition-transform hover:scale-105 duration-200"
        aria-label="Logo EP Enterprise"
      >
        <defs>
          <linearGradient id="epGradLeft" x1="10" y1="38" x2="50" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#15803D" />
            <stop offset="100%" stopColor="#14532D" />
          </linearGradient>
          <linearGradient id="epGradRight" x1="90" y1="38" x2="50" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#84CC16" />
            <stop offset="100%" stopColor="#16A34A" />
          </linearGradient>
          <linearGradient id="epGradCenter" x1="50" y1="32" x2="50" y2="72" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A3E635" />
            <stop offset="100%" stopColor="#65A30D" />
          </linearGradient>
        </defs>

        {/* Central silhouette head / vitality seed */}
        <circle cx="50" cy="24" r="8.5" fill="#84CC16" />

        {/* Left leaf (Forest & Emerald) */}
        <path
          d="M 50 82 C 30 80 12 60 10 36 C 24 38 40 45 48 64 C 49 68 50 78 50 82 Z"
          fill="url(#epGradLeft)"
        />
        {/* Left inner vein / highlight stroke */}
        <path
          d="M 12 38 C 22 47 35 53 48 64"
          stroke="#4ADE80"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Right leaf (Vibrant Herbal Lime & Green) */}
        <path
          d="M 50 82 C 70 80 88 60 90 36 C 76 38 60 45 52 64 C 51 68 50 78 50 82 Z"
          fill="url(#epGradRight)"
        />
        {/* Right inner vein */}
        <path
          d="M 88 38 C 78 47 65 53 52 64"
          stroke="#BEF264"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Center blooming leaf / core */}
        <path
          d="M 50 72 C 42 56 41 40 50 30 C 59 40 58 56 50 72 Z"
          fill="url(#epGradCenter)"
        />

        {/* Base stem */}
        <path
          d="M 47 79 C 50 86 50 89 50 91"
          stroke="#14532D"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Brand Typography: explicitly EP ENTERPRISE */}
      {variant !== 'compact' && (
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline tracking-tight">
            <span
              className={`font-black tracking-tight ${
                isLight ? 'text-lime-400' : 'text-emerald-700'
              } ${dimensions.textClass}`}
            >
              EP
            </span>
            <span
              className={`font-black tracking-tight ml-1.5 ${
                isLight ? 'text-white' : 'text-slate-900'
              } ${dimensions.textClass}`}
            >
              ENTERPRISE
            </span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`font-bold uppercase tracking-wider ${
                  isLight ? 'text-emerald-200' : 'text-emerald-800'
                } ${dimensions.subClass}`}
              >
                Essential Pharma
              </span>
              <span className="text-slate-300 text-[8px] font-bold">·</span>
              <span
                className={`font-medium ${
                  isLight ? 'text-slate-300' : 'text-slate-500'
                } ${dimensions.subClass}`}
              >
                Talento & Contabilidad
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
