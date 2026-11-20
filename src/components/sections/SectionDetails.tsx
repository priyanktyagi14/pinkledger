import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, MoreVertical, Plus, ArrowRight, Trash2, Smartphone, Sparkles, Image as ImageIcon } from 'lucide-react';
import { AppLogo } from '../common/AppLogo';

export const SectionDetails: React.FC = () => {
  const {
    theme,
    selectedSection,
    transactions,
    setActiveTab,
    setIsAddExpenseOpen,
    promptDelete,
    deleteSection,
    openDeleteSectionModal,
    setIsAppManageOpen,
    setIsSectionCustomizationOpen,
    setSectionForCustomization,
    setEditingTransaction,
    setIsEditTxnOpen,
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedAppFilter, setSelectedAppFilter] = useState<string | null>(null);
  const isMidnight = theme === 'midnight';

  if (!selectedSection) {
    return (
      <div className="p-8 text-center">
        <p className={isMidnight ? 'text-white' : 'text-slate-800'}>No section selected.</p>
        <button
          onClick={() => setActiveTab('home')}
          className="mt-4 px-4 py-2 bg-pink-500 text-white rounded-xl"
        >
          Back to Home
        </button>
      </div>
    );
  }

  // Filter transactions for this section (and optional app filter)
  const allSectionTxns = transactions.filter(
    (t) => t.sectionId === selectedSection.id && t.type === 'expense'
  );

  const displayedTxns = selectedAppFilter
    ? allSectionTxns.filter((t) => t.applicationId === selectedAppFilter || t.applicationName === selectedAppFilter)
    : allSectionTxns;

  const budget = selectedSection.budgetLimit || 6000;
  const progressPercent = Math.min(100, Math.round((selectedSection.totalSpent / budget) * 100));

  const formatCurrency = (val: number) => '₹' + Math.abs(val).toLocaleString('en-IN');

  const handleDelete = () => {
    setMenuOpen(false);
    openDeleteSectionModal(selectedSection);
  };

  // Preset illustrations for default sections
  const getDefaultBg = () => {
    if (selectedSection.customBg) return selectedSection.customBg;
    if (selectedSection.bgImage) return selectedSection.bgImage;
    if (selectedSection.id === 'sec-food') {
      return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80';
    }
    if (selectedSection.id === 'sec-shopping') {
      return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80';
    }
    if (selectedSection.id === 'sec-entertainment') {
      return 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=600&q=80';
    }
    if (selectedSection.id === 'sec-travel') {
      return 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&w=600&q=80';
    }
    return null;
  };

  const bgArtwork = getDefaultBg();

  return (
    <div className="px-5 pt-1 pb-28 space-y-4 animate-fadeIn">
      {/* Top Bar with Back Arrow and More Options */}
      <div className="flex items-center justify-between relative">
        <button
          onClick={() => setActiveTab('home')}
          className={`p-2 rounded-xl transition-colors ${
            isMidnight ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-pink-100'
          }`}
          title="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* 3-dots Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`p-2 rounded-xl transition-colors ${
              isMidnight ? 'text-slate-300 hover:bg-white/10' : 'text-slate-700 hover:bg-pink-100'
            }`}
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 top-10 w-52 rounded-2xl py-2 z-50 shadow-2xl border backdrop-blur-xl animate-scaleUp ${
                isMidnight ? 'bg-[#1b122e] border-purple-500/30 text-slate-200' : 'bg-white border-pink-200 text-slate-800'
              }`}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setIsAppManageOpen(true);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-2 hover:bg-pink-500/10 ${
                  isMidnight ? 'hover:text-pink-400' : 'hover:text-pink-600'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span>Manage Applications</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setSectionForCustomization(selectedSection);
                  setIsSectionCustomizationOpen(true);
                }}
                className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-2 hover:bg-pink-500/10 ${
                  isMidnight ? 'hover:text-pink-400' : 'hover:text-pink-600'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Customize Background</span>
              </button>

              <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center gap-2 text-rose-500 hover:bg-rose-500/10"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Section</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Hero Banner Card matching Reference 03 */}
      <div
        className={`relative overflow-hidden rounded-[26px] p-4 transition-all ${
          isMidnight
            ? 'bg-gradient-to-r from-[#201239] to-[#160c28] border border-purple-500/30 shadow-xl'
            : 'bg-white border border-pink-200 shadow-md'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* Section Artwork Image Container with Edit Pencil */}
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center shrink-0 bg-gradient-to-tr from-purple-600 to-pink-500">
            {bgArtwork ? (
              <img
                src={bgArtwork}
                alt={selectedSection.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-3xl">✨</div>
            )}

            {/* Edit Pencil Icon Badge matching Reference 03 */}
            <button
              onClick={() => {
                setSectionForCustomization(selectedSection);
                setIsSectionCustomizationOpen(true);
              }}
              className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/60 text-white backdrop-blur-sm hover:scale-110 transition-transform"
              title="Customize Background"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>

          {/* Section Name & Tagline */}
          <div className="flex-1 min-w-0">
            <h1
              className={`font-display font-extrabold text-xl tracking-tight truncate ${
                isMidnight ? 'text-white' : 'text-slate-900'
              }`}
            >
              {selectedSection.name}
            </h1>
            <p
              className={`text-xs font-medium mt-1 truncate ${
                isMidnight ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {selectedSection.tagline || 'Eat. Repeat. 😋'}
            </p>
          </div>
        </div>

        {/* Spend Stats & Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/10">
          <div
            className={`font-display text-3xl font-extrabold tracking-tight ${
              isMidnight ? 'text-white' : 'text-slate-900'
            }`}
          >
            {formatCurrency(selectedSection.totalSpent)}
          </div>
          <div
            className={`text-xs font-semibold mt-0.5 ${
              isMidnight ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Total Spent • {selectedSection.transactionCount} Transactions
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-2.5 w-full rounded-full bg-slate-800/50 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Applications Row matching Reference 03 */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className={`font-display font-bold text-sm ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
            Applications
          </h2>
          <button
            onClick={() => setIsAppManageOpen(true)}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isMidnight ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            <span>Manage</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* App Tiles Grid / Row */}
        <div className="grid grid-cols-4 gap-2.5">
          {selectedSection.applications.map((app) => {
            const isSelected = selectedAppFilter === app.id;
            return (
              <div
                key={app.id}
                onClick={() => setSelectedAppFilter(isSelected ? null : app.id)}
                className={`p-2.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all transform active:scale-95 border ${
                  isSelected
                    ? 'ring-2 ring-pink-500 border-pink-500 scale-102'
                    : isMidnight
                    ? 'bg-[#170e28] border-purple-500/20 hover:border-pink-500/40'
                    : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'
                }`}
              >
                <AppLogo
                  name={app.name}
                  iconName={app.iconName}
                  color={app.color}
                  bgColor={app.bgColor}
                  customIcon={app.customIcon}
                  size="md"
                  className="mb-1.5"
                />
                <span
                  className={`text-[10px] font-bold text-center truncate w-full ${
                    isMidnight ? 'text-slate-200' : 'text-slate-800'
                  }`}
                >
                  {app.name}
                </span>
              </div>
            );
          })}

          {/* Add Application Tile */}
          <div
            onClick={() => setIsAppManageOpen(true)}
            className={`p-2.5 rounded-2xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all transform active:scale-95 ${
              isMidnight
                ? 'border-purple-500/30 bg-[#160d26]/50 hover:border-pink-500 text-purple-300'
                : 'border-pink-200 bg-white/50 hover:border-pink-400 text-pink-600 shadow-sm'
            }`}
            title="Add Application"
          >
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1.5">
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-bold text-center">Add</span>
          </div>
        </div>
      </div>

      {/* Recent Transactions List */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h2 className={`font-display font-bold text-sm ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
            Recent Transactions {selectedAppFilter && '(Filtered)'}
          </h2>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${
              isMidnight ? 'text-pink-400 hover:text-pink-300' : 'text-pink-600 hover:text-pink-700'
            }`}
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {displayedTxns.length === 0 ? (
            <div
              className={`p-5 rounded-2xl text-center text-xs font-semibold ${
                isMidnight ? 'bg-[#160c28] text-slate-400' : 'bg-white text-slate-500'
              }`}
            >
              No transactions recorded yet in this section.
            </div>
          ) : (
            displayedTxns.slice(0, 4).map((txn) => (
              <div
                key={txn.id}
                onClick={() => {
                  setEditingTransaction(txn);
                  setIsEditTxnOpen(true);
                }}
                className={`p-3.5 rounded-2xl flex items-center justify-between cursor-pointer border transition-all ${
                  isMidnight
                    ? 'bg-[#160c28] border-purple-500/15 hover:border-pink-500/40'
                    : 'bg-white border-pink-100 hover:border-pink-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <AppLogo
                    name={txn.applicationName || txn.title}
                    color="#ec4899"
                    size="md"
                    className="shadow-sm"
                  />
                  <div>
                    <div className={`text-xs font-bold ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                      {txn.applicationName || txn.title}
                    </div>
                    <div className={`text-[11px] ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {txn.note || 'Food Order'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-extrabold text-rose-400">
                    - {formatCurrency(txn.amount)}
                  </div>
                  <div className={`text-[10px] ${isMidnight ? 'text-slate-500' : 'text-slate-400'}`}>
                    {txn.displayDate || 'Today'}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating Bottom Action Button matching Reference 03 */}
      <div className="pt-2">
        <button
          onClick={() => setIsAddExpenseOpen(true)}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-display font-extrabold text-sm shadow-[0_8px_25px_-5px_rgba(236,72,153,0.5)] hover:opacity-95 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>
    </div>
  );
};
