import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, ArrowUpRight, ArrowDownRight, Edit2, Trash2 } from 'lucide-react';
import { Transaction } from '../../types';
import { AppLogo } from '../common/AppLogo';

export const TransactionHistory: React.FC = () => {
  const {
    theme,
    transactions,
    sections,
    setEditingTransaction,
    setIsEditTxnOpen,
    promptDelete,
    deleteTransaction,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedSectionFilter, setSelectedSectionFilter] = useState('all');

  const isMidnight = theme === 'midnight';
  const formatCurrency = (val: number) => '₹' + Math.abs(val).toLocaleString('en-IN');

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.note && t.note.toLowerCase().includes(search.toLowerCase())) ||
      (t.sectionName && t.sectionName.toLowerCase().includes(search.toLowerCase()));

    const matchesType = filterType === 'all' || t.type === filterType;
    const matchesSection =
      selectedSectionFilter === 'all' || t.sectionId === selectedSectionFilter;

    return matchesSearch && matchesType && matchesSection;
  });

  const handleDelete = (txn: Transaction) => {
    promptDelete(
      'Delete Transaction',
      `Are you sure you want to delete "${txn.title}" (${formatCurrency(txn.amount)})?`,
      () => deleteTransaction(txn.id)
    );
  };

  const handleEdit = (txn: Transaction) => {
    setEditingTransaction(txn);
    setIsEditTxnOpen(true);
  };

  return (
    <div className="px-5 pt-1 pb-28 space-y-4 animate-fadeIn">
      {/* Title */}
      <h1 className={`font-display font-extrabold text-2xl tracking-tight ${
        isMidnight ? 'text-white' : 'text-slate-900'
      }`}>
        Transaction History
      </h1>

      {/* Search Input */}
      <div className={`relative flex items-center rounded-2xl border transition-all ${
        isMidnight ? 'bg-[#170e2a] border-purple-500/25' : 'bg-white border-pink-200'
      }`}>
        <Search className="w-4 h-4 ml-3.5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions, notes..."
          className={`w-full py-3 px-3 rounded-2xl bg-transparent text-xs font-semibold outline-none ${
            isMidnight ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'
          }`}
        />
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {(['all', 'expense', 'income'] as const).map((type) => {
          const isSelected = filterType === type;
          const labels = { all: 'All', expense: 'Expenses', income: 'Income' };
          return (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all ${
                isSelected
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-500/25'
                  : isMidnight
                    ? 'bg-[#180f2b] text-slate-400 border border-purple-500/20'
                    : 'bg-white text-slate-600 border border-pink-100'
              }`}
            >
              {labels[type]}
            </button>
          );
        })}

        {/* Section dropdown filter */}
        <select
          value={selectedSectionFilter}
          onChange={(e) => setSelectedSectionFilter(e.target.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 border appearance-none outline-none cursor-pointer ${
            selectedSectionFilter !== 'all'
              ? 'bg-pink-500 text-white'
              : isMidnight
                ? 'bg-[#180f2b] text-slate-400 border-purple-500/20'
                : 'bg-white text-slate-600 border-pink-100'
          }`}
        >
          <option value="all" className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
            All Categories
          </option>
          {sections.map((sec) => (
            <option key={sec.id} value={sec.id} className={isMidnight ? 'bg-[#150d24]' : 'bg-white'}>
              {sec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction List */}
      {filteredTransactions.length === 0 ? (
        <div className={`p-8 rounded-[24px] text-center border ${
          isMidnight ? 'bg-[#150d24] border-purple-500/20 text-slate-400' : 'bg-white border-pink-100 text-slate-500'
        }`}>
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-sm font-semibold">No transactions found</p>
          <p className="text-xs text-slate-500 mt-1">Try tweaking your search or filter</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTransactions.map((txn) => {
            const isIncome = txn.type === 'income';

            return (
              <div
                key={txn.id}
                className={`p-3.5 rounded-2xl flex items-center justify-between border group transition-all ${
                  isMidnight
                    ? 'bg-[#170e2a] border-purple-500/20 hover:border-purple-500/40'
                    : 'bg-white border-pink-100 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  {isIncome ? (
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs text-white shadow-md bg-gradient-to-tr from-emerald-500 to-teal-400 shrink-0">
                      <ArrowDownRight className="w-5 h-5 text-white" />
                    </div>
                  ) : (
                    <AppLogo
                      name={txn.applicationName || txn.title}
                      size="md"
                      className="shadow-sm"
                    />
                  )}

                  <div>
                    <div className={`font-bold text-sm ${isMidnight ? 'text-white' : 'text-slate-900'}`}>
                      {txn.title}
                    </div>
                    <div className={`text-xs ${isMidnight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {txn.note || txn.sectionName || txn.source || 'General'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className={`font-display font-extrabold text-sm ${
                      isIncome ? 'text-emerald-400' : 'text-pink-400'
                    }`}>
                      {isIncome ? '+' : '-'} {formatCurrency(txn.amount)}
                    </div>
                    <div className={`text-[11px] ${isMidnight ? 'text-slate-500' : 'text-slate-400'}`}>
                      {txn.displayDate || txn.date}
                    </div>
                  </div>

                  {/* Actions: Edit & Delete buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleEdit(txn)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
                      }`}
                      title="Edit"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(txn)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
