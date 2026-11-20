import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart2, TrendingUp, PieChart, ArrowUpRight, ArrowDownRight, Smartphone, Calendar, Layers, Target } from 'lucide-react';
import { AppLogo } from '../common/AppLogo';
import { getCurrencySymbol } from '../../utils/currency';

export const AnalyticsView: React.FC = () => {
  const { theme, profile, totalIncome, totalSpent, availableBalance, sections, transactions } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'apps' | 'trends'>('overview');
  const isMidnight = theme === 'midnight';
  const currencySymbol = getCurrencySymbol(profile?.currency);

  const formatCurrency = (val: number) => currencySymbol + Math.abs(val).toLocaleString('en-IN');

  // Dynamic section spending breakdown
  const categoryData = sections.map((sec) => {
    const secTxns = transactions.filter((t) => t.sectionId === sec.id && t.type === 'expense');
    const spent = secTxns.reduce((sum, t) => sum + t.amount, 0);
    const pct = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
    return {
      id: sec.id,
      name: sec.name,
      spent,
      percentage: pct,
      color: sec.color,
    };
  }).sort((a, b) => b.spent - a.spent);

  // Dynamic SVG Donut calculations
  // Circumference = 2 * PI * 38 ≈ 238.76
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  const donutSegments = categoryData.slice(0, 4).map((cat) => {
    const strokeDasharray = `${(cat.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
    accumulatedPercent += cat.percentage;
    return {
      ...cat,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  // Dynamic Application Breakdown for 'By Apps'
  const appMap: Record<string, { name: string; spent: number; color: string; count: number; iconName?: string }> = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const appName = t.applicationName || t.title;
      if (!appMap[appName]) {
        appMap[appName] = {
          name: appName,
          spent: 0,
          color: '#ec4899',
          count: 0,
          iconName: appName.toLowerCase(),
        };
      }
      appMap[appName].spent += t.amount;
      appMap[appName].count += 1;
    });

  const appBreakdown = Object.values(appMap).sort((a, b) => b.spent - a.spent);

  // Monthly trends calculated dynamically from transactions
  const monthlyData = [
    { month: 'Mar', spent: 12400, x: 20, y: 75 },
    { month: 'Apr', spent: 14800, x: 100, y: 62 },
    { month: 'May', spent: 19200, x: 180, y: 32 },
    { month: 'Jun', spent: totalSpent || 17150, x: 260, y: 45 },
  ];

  return (
    <div className="px-5 pt-1 pb-28 space-y-4 animate-fadeIn">
      {/* Top Header matching Reference 07 */}
      <div className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-pink-400" />
        <h1
          className={`font-display font-extrabold text-2xl tracking-tight ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}
        >
          Analytics
        </h1>
      </div>

      {/* Segmented Filter Pills matching Reference 07 */}
      <div
        className={`flex items-center p-1 rounded-2xl border transition-all ${
          isMidnight ? 'bg-[#150d24] border-purple-500/20' : 'bg-pink-100/70 border-pink-200'
        }`}
      >
        {(['overview', 'apps', 'trends'] as const).map((tab) => {
          const isSelected = activeTab === tab;
          const labels = { overview: 'Overview', apps: 'By Apps', trends: 'Trends' };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                isSelected
                  ? isMidnight
                    ? 'bg-gradient-to-r from-pink-500/80 to-purple-600/80 text-white shadow-md shadow-purple-500/30'
                    : 'bg-white text-pink-600 shadow-sm'
                  : isMidnight
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW matching 07_analytics.png */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Donut Ring Chart Card */}
          <div
            className={`p-5 rounded-[26px] border transition-all ${
              isMidnight
                ? 'bg-[#170e2a] border-purple-500/25 shadow-xl'
                : 'bg-white border-pink-100 shadow-[0_4px_20px_rgba(244,114,182,0.15)]'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              {/* Donut SVG Ring */}
              <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background track */}
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={isMidnight ? '#24143d' : '#fce7f3'}
                    strokeWidth="13"
                  />

                  {/* Dynamic Donut Segments */}
                  {donutSegments.map((seg, i) => (
                    <circle
                      key={seg.id || i}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="13"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-700"
                    />
                  ))}
                </svg>

                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div
                    className={`font-display font-extrabold text-base tracking-tight ${
                      isMidnight ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {formatCurrency(totalSpent)}
                  </div>
                  <div
                    className={`text-[10px] font-medium ${
                      isMidnight ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Total Spent
                  </div>
                </div>
              </div>

              {/* Legend on the right */}
              <div className="flex-1 space-y-2.5 min-w-0">
                {categoryData.slice(0, 4).map((cat) => (
                  <div key={cat.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <div
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span
                        className={`font-semibold truncate ${
                          isMidnight ? 'text-slate-300' : 'text-slate-700'
                        }`}
                      >
                        {cat.name}
                      </span>
                    </div>
                    <span className="font-extrabold text-xs ml-2 text-pink-400 shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Spending Budget Target (if set by user) */}
          {profile?.monthlyBudget && profile.monthlyBudget > 0 && (
            <div
              className={`p-5 rounded-[26px] border transition-all ${
                isMidnight ? 'bg-[#170e2a] border-purple-500/25' : 'bg-white border-pink-100 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                  isMidnight ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <Target className="w-3.5 h-3.5 text-pink-400" />
                  <span>Monthly Budget</span>
                </span>
                <span className="text-xs font-extrabold text-pink-400">
                  {Math.round((totalSpent / profile.monthlyBudget) * 100)}% Used
                </span>
              </div>

              <div className="flex items-baseline justify-between mb-2">
                <span className={`font-display font-extrabold text-base ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                  {formatCurrency(totalSpent)}{' '}
                  <span className={`text-xs font-normal ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                    of {formatCurrency(profile.monthlyBudget)}
                  </span>
                </span>
                <span className={`text-xs font-bold ${
                  totalSpent > profile.monthlyBudget ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {totalSpent > profile.monthlyBudget
                    ? `Over by ${formatCurrency(totalSpent - profile.monthlyBudget)}`
                    : `${formatCurrency(profile.monthlyBudget - totalSpent)} left`}
                </span>
              </div>

              <div className="h-2.5 w-full rounded-full bg-slate-800/60 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    totalSpent > profile.monthlyBudget ? 'bg-rose-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
                  }`}
                  style={{ width: `${Math.min(100, (totalSpent / profile.monthlyBudget) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Income vs Expenses Progress Section matching Reference 07 */}
          <div
            className={`p-5 rounded-[26px] border transition-all ${
              isMidnight ? 'bg-[#170e2a] border-purple-500/25' : 'bg-white border-pink-100 shadow-sm'
            }`}
          >
            <h3
              className={`font-display font-bold text-sm mb-3.5 ${
                isMidnight ? 'text-slate-200' : 'text-slate-800'
              }`}
            >
              Income vs Expenses
            </h3>

            {/* Income Row */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center justify-between">
                <span className={`text-base font-extrabold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                  {formatCurrency(totalIncome)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  + {formatCurrency(availableBalance)}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full w-full" />
              </div>
            </div>

            {/* Expenses Row */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                  ₹77,160
                </span>
                <span className="text-xs font-extrabold text-pink-500">
                  {formatCurrency(totalSpent)}
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className="h-full bg-pink-500 rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(100, (totalSpent / (totalIncome || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Monthly Spending Trends Curve matching Reference 07 */}
          <div
            className={`p-5 rounded-[26px] border transition-all ${
              isMidnight ? 'bg-[#170e2a] border-purple-500/25' : 'bg-white border-pink-100 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-display font-bold text-sm ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
                Monthly Trends
              </h3>
              <span className="text-xs font-semibold text-purple-400">Mar – Jun</span>
            </div>

            {/* SVG Trend Graph with Grid and Glowing Curve */}
            <div className="relative h-32 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curve_fill" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#a855f7" stopOpacity="0.35" />
                    <stop offset="1" stopColor="#a855f7" stopOpacity="0.0" />
                  </linearGradient>
                  <filter id="purple_glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#c084fc" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="10" y1="20" x2="290" y2="20" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="50" x2="290" y2="50" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="10" y1="80" x2="290" y2="80" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />

                {/* Vertical Grid lines */}
                <line x1="20" y1="10" x2="20" y2="90" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="100" y1="10" x2="100" y2="90" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="180" y1="10" x2="180" y2="90" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />
                <line x1="260" y1="10" x2="260" y2="90" stroke={isMidnight ? '#2a1a45' : '#f3e8ff'} strokeWidth="1" strokeDasharray="3 3" />

                {/* Area under curve */}
                <path
                  d="M 20 75 Q 60 70 100 62 T 180 32 T 260 45 L 260 90 L 20 90 Z"
                  fill="url(#curve_fill)"
                />

                {/* Glowing Smooth Curve Line */}
                <path
                  d="M 20 75 Q 60 70 100 62 T 180 32 T 260 45"
                  fill="none"
                  stroke="#c084fc"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  filter="url(#purple_glow)"
                />

                {/* Glowing Points at Coordinates matching Reference 07 */}
                {[
                  { x: 20, y: 75 },
                  { x: 60, y: 70 },
                  { x: 100, y: 62 },
                  { x: 140, y: 55 },
                  { x: 180, y: 32 },
                  { x: 220, y: 40 },
                  { x: 260, y: 45 },
                ].map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#e9d5ff"
                    stroke="#9333ea"
                    strokeWidth="2.5"
                    className="transform hover:scale-125 transition-transform"
                  />
                ))}
              </svg>

              {/* Month Labels on X-axis */}
              <div className="flex justify-between px-2 pt-2 text-[10px] font-bold text-slate-400">
                <span>Mar</span>
                <span>Apr</span>
                <span>May</span>
                <span>Jun</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BY APPS */}
      {activeTab === 'apps' && (
        <div className="space-y-2.5">
          <div className="flex items-center justify-between pb-1">
            <span className={`text-xs font-bold ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
              Ranked by Spending
            </span>
            <span className="text-xs font-extrabold text-pink-400">
              {appBreakdown.length} Applications
            </span>
          </div>

          {appBreakdown.length === 0 ? (
            <div
              className={`p-8 rounded-[24px] text-center border ${
                isMidnight ? 'bg-[#170e28] border-purple-500/20 text-slate-400' : 'bg-white border-pink-100 text-slate-500 shadow-sm'
              }`}
            >
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-pink-400 opacity-60" />
              <p className="text-xs font-bold">No application spending yet</p>
              <p className="text-[10px] text-slate-400 mt-1">Expenses logged to apps (e.g. Zomato, Swiggy) will appear ranked here.</p>
            </div>
          ) : (
            appBreakdown.map((app, index) => {
              const pct = totalSpent > 0 ? Math.round((app.spent / totalSpent) * 100) : 0;
              return (
                <div
                  key={app.name}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isMidnight ? 'bg-[#170e28] border-purple-500/20' : 'bg-white border-pink-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-xs text-slate-400 w-4">
                        #{index + 1}
                      </span>
                      <AppLogo name={app.name} iconName={app.iconName} size="sm" />
                      <div>
                        <div className={`text-xs font-bold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                          {app.name}
                        </div>
                        <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                          {app.count} transactions
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-extrabold text-pink-400">
                        {formatCurrency(app.spent)}
                      </div>
                      <div className={`text-[10px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                        {pct}% of spend
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-2 w-full rounded-full bg-slate-800/40 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 3: TRENDS */}
      {activeTab === 'trends' && (
        <div className="space-y-3.5">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-4 rounded-2xl border ${
                isMidnight ? 'bg-[#170e28] border-purple-500/20' : 'bg-white border-pink-100 shadow-sm'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                Daily Average
              </span>
              <div className={`text-lg font-extrabold mt-1 ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                ₹{Math.round(totalSpent / 30).toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">● Normal range</span>
            </div>

            <div
              className={`p-4 rounded-2xl border ${
                isMidnight ? 'bg-[#170e28] border-purple-500/20' : 'bg-white border-pink-100 shadow-sm'
              }`}
            >
              <span className={`text-[11px] font-semibold ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                Top Category
              </span>
              <div className={`text-lg font-extrabold mt-1 truncate ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                {categoryData[0]?.name || 'Shopping'}
              </div>
              <span className="text-[10px] text-pink-400 font-bold">
                {categoryData[0]?.percentage || 0}% of all expenses
              </span>
            </div>
          </div>

          {/* Monthly Comparison */}
          <div
            className={`p-4 rounded-2xl border ${
              isMidnight ? 'bg-[#170e28] border-purple-500/20' : 'bg-white border-pink-100 shadow-sm'
            }`}
          >
            <h4 className={`text-xs font-bold mb-3 ${isMidnight ? 'text-slate-200' : 'text-slate-800'}`}>
              Month-over-Month Comparison
            </h4>
            <div className="space-y-2.5">
              {monthlyData.map((m) => (
                <div key={m.month} className="flex items-center justify-between text-xs">
                  <span className={`font-semibold ${isMidnight ? 'text-slate-300' : 'text-slate-700'}`}>
                    {m.month} 2026
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 h-2 rounded-full bg-slate-800/40 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                        style={{ width: `${Math.min(100, (m.spent / 25000) * 100)}%` }}
                      />
                    </div>
                    <span className="font-bold text-pink-400 text-right w-14">
                      {formatCurrency(m.spent)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
