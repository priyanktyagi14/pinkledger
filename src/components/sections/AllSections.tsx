import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, Plus, ChevronRight, Utensils, ShoppingBag, Gamepad2, Plane, Sparkles } from 'lucide-react';

export const AllSections: React.FC = () => {
  const {
    theme,
    sections,
    setActiveTab,
    setSelectedSectionId,
    setIsCreateSectionOpen,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN');

  const getSectionIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'utensils':
      case 'food':
        return <Utensils className="w-5 h-5 text-white" />;
      case 'shoppingbag':
      case 'shopping':
        return <ShoppingBag className="w-5 h-5 text-white" />;
      case 'gamepad2':
      case 'entertainment':
        return <Gamepad2 className="w-5 h-5 text-white" />;
      case 'plane':
      case 'travel':
        return <Plane className="w-5 h-5 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="px-5 pt-2 pb-28 space-y-4 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('home')}
            className={`p-1.5 rounded-xl transition-colors ${
              isMidnight ? 'hover:bg-white/10 text-slate-300' : 'hover:bg-pink-100 text-slate-700'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className={`font-display font-extrabold text-2xl tracking-tight ${
            isMidnight ? 'text-white' : 'text-slate-900'
          }`}>
            All Categories
          </h1>
        </div>

        <button
          onClick={() => setIsCreateSectionOpen(true)}
          className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
            isMidnight
              ? 'bg-purple-900/50 text-pink-300 border border-purple-500/30'
              : 'bg-pink-100 text-pink-600 border border-pink-200'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Section</span>
        </button>
      </div>

      {/* Sections List */}
      <div className="space-y-3 pt-1">
        {sections.map((section) => {
          const budget = section.budgetLimit || 5000;
          const percent = Math.min(100, Math.round((section.totalSpent / budget) * 100));

          return (
            <div
              key={section.id}
              onClick={() => {
                setSelectedSectionId(section.id);
                setActiveTab('section-details');
              }}
              className={`p-4 rounded-[22px] border cursor-pointer transition-all hover:scale-[1.01] active:scale-98 ${
                isMidnight
                  ? 'bg-[#170e2a] border-purple-500/20 hover:border-purple-500/40 shadow-lg'
                  : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md"
                    style={{ backgroundColor: section.color }}
                  >
                    {getSectionIcon(section.icon)}
                  </div>
                  <div>
                    <h3 className={`font-display font-bold text-base ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                      {section.name}
                    </h3>
                    <p className={`text-xs ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {section.transactionCount} transactions • {section.applications.length} apps
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className={`font-display font-extrabold text-base ${
                      isMidnight ? 'text-white' : 'text-slate-900'
                    }`}>
                      {formatCurrency(section.totalSpent)}
                    </div>
                    <div className="text-[11px] text-pink-400 font-semibold">
                      Budget: {formatCurrency(budget)}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                </div>
              </div>

              {/* Budget Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-700/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
