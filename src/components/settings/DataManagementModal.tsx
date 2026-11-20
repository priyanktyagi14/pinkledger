import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Upload,
  Download,
  CheckCircle,
  AlertTriangle,
  FileText,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { ExportBackupData } from '../../types';

export const DataManagementModal: React.FC = () => {
  const {
    isExportImportOpen,
    setIsExportImportOpen,
    exportJSON,
    importJSON,
    theme,
  } = useApp();

  const isMidnight = theme === 'midnight';
  const [jsonText, setJsonText] = useState('');
  const [parsedData, setParsedData] = useState<ExportBackupData | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('replace');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isExportImportOpen) return null;

  const validateAndParse = (text: string): boolean => {
    try {
      const data = JSON.parse(text);
      if (
        data &&
        (data.app === 'PinkLedger' || (Array.isArray(data.sections) && Array.isArray(data.transactions)))
      ) {
        setParsedData(data);
        setStatus('idle');
        return true;
      } else {
        setStatus('error');
        setStatusMessage('Invalid PinkLedger backup. Missing required sections or transactions.');
        setParsedData(null);
        return false;
      }
    } catch (e: any) {
      setStatus('error');
      setStatusMessage('Invalid JSON format. Please check the backup file.');
      setParsedData(null);
      return false;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setJsonText(text);
      validateAndParse(text);
    };
    reader.readAsText(file);
  };

  const handleTextChange = (text: string) => {
    setJsonText(text);
    if (text.trim().length > 10) {
      validateAndParse(text);
    } else {
      setParsedData(null);
      setStatus('idle');
    }
  };

  const handleConfirmImport = async () => {
    if (!jsonText.trim() || !parsedData) return;

    setIsProcessing(true);
    const result = await importJSON(jsonText, importMode);
    setIsProcessing(false);

    if (result.success) {
      setStatus('success');
      setStatusMessage(result.message);
      setTimeout(() => {
        setIsExportImportOpen(false);
        setJsonText('');
        setParsedData(null);
        setStatus('idle');
      }, 1500);
    } else {
      setStatus('error');
      setStatusMessage(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className={`relative w-full max-w-sm rounded-[32px] p-6 max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl border transition-all ${
          isMidnight ? 'bg-[#150d24] border-purple-500/30 text-white' : 'bg-[#fff5f9] border-pink-200 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-pink-400" />
            <h2 className="font-display font-extrabold text-base tracking-tight">Data Backup & Restore</h2>
          </div>
          <button
            onClick={() => {
              setIsExportImportOpen(false);
              setParsedData(null);
              setJsonText('');
              setStatus('idle');
            }}
            className={`p-1.5 rounded-full transition-colors ${
              isMidnight ? 'text-slate-400 hover:text-white hover:bg-white/10' : 'text-slate-500 hover:bg-pink-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status notification banner */}
        {status === 'success' && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage || 'Data successfully restored into local IndexedDB!'}</span>
          </div>
        )}

        {status === 'error' && (
          <div className="mb-3 p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{statusMessage || 'Invalid backup format. Please verify your file.'}</span>
          </div>
        )}

        {/* Export Card */}
        <div className="space-y-3">
          <div
            className={`p-4 rounded-2xl border ${
              isMidnight ? 'bg-[#1b102f] border-purple-500/20' : 'bg-white border-pink-100'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-xs flex items-center gap-1.5">
                <Download className="w-4 h-4 text-purple-400" />
                <span>Export Local Backup</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                100% Offline
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-3">
              Export all your settings, categories, apps, transactions, and custom backgrounds as a portable JSON file.
            </p>
            <button
              onClick={exportJSON}
              className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Backup (JSON)</span>
            </button>
          </div>

          {/* Import Card */}
          <div
            className={`p-4 rounded-2xl border ${
              isMidnight ? 'bg-[#1b102f] border-purple-500/20' : 'bg-white border-pink-100'
            }`}
          >
            <h3 className="font-bold text-xs mb-1 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-pink-400" />
              <span>Import & Restore Backup</span>
            </h3>
            <p className="text-[11px] text-slate-400 mb-3">
              Restore transactions, categories, and settings from a previously saved PinkLedger backup.
            </p>

            {/* File Upload Button */}
            <label className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:opacity-95 cursor-pointer active:scale-98 transition-all">
              <Upload className="w-4 h-4" />
              <span>Choose Backup File (.json)</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Paste JSON directly */}
            <div className="mt-3">
              <textarea
                rows={2}
                value={jsonText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Or paste backup JSON content here..."
                className={`w-full p-2.5 rounded-xl border text-[11px] font-mono outline-none ${
                  isMidnight ? 'bg-[#140b22] border-purple-500/30 text-white' : 'bg-white border-pink-200 text-slate-900'
                }`}
              />
            </div>

            {/* Parsed Summary Card and Confirmation Options */}
            {parsedData && (
              <div
                className={`mt-3 p-3 rounded-xl border animate-scaleUp text-xs ${
                  isMidnight ? 'bg-[#140b22] border-pink-500/30' : 'bg-pink-50 border-pink-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-pink-400 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Valid Backup Detected</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                  <div className={`p-2 rounded-lg ${isMidnight ? 'bg-white/5' : 'bg-white'}`}>
                    <span className="text-slate-400 block">Sections:</span>
                    <span className="font-extrabold">{parsedData.sections?.length || 0}</span>
                  </div>
                  <div className={`p-2 rounded-lg ${isMidnight ? 'bg-white/5' : 'bg-white'}`}>
                    <span className="text-slate-400 block">Transactions:</span>
                    <span className="font-extrabold">{parsedData.transactions?.length || 0}</span>
                  </div>
                  <div className={`p-2 rounded-lg ${isMidnight ? 'bg-white/5' : 'bg-white'}`}>
                    <span className="text-slate-400 block">Applications:</span>
                    <span className="font-extrabold">{parsedData.applications?.length || 0}</span>
                  </div>
                  <div className={`p-2 rounded-lg ${isMidnight ? 'bg-white/5' : 'bg-white'}`}>
                    <span className="text-slate-400 block">Assets:</span>
                    <span className="font-extrabold">{parsedData.assets?.length || 0}</span>
                  </div>
                </div>

                {/* Import Mode Radio Choices */}
                <label className="block text-[11px] font-bold mb-1.5 text-slate-300">
                  Select Import Strategy:
                </label>
                <div className="space-y-1.5 mb-3">
                  <label
                    className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer text-[11px] ${
                      importMode === 'replace'
                        ? 'border-pink-500 bg-pink-500/10 font-bold'
                        : isMidnight
                        ? 'border-purple-500/20 bg-white/5'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importStrategy"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="mt-0.5 accent-pink-500"
                    />
                    <div>
                      <span className="block font-bold">Replace Existing Data</span>
                      <span className="text-[10px] text-slate-400">
                        Overwrites current records with the exact state from this backup file.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-2 p-2 rounded-xl border cursor-pointer text-[11px] ${
                      importMode === 'merge'
                        ? 'border-pink-500 bg-pink-500/10 font-bold'
                        : isMidnight
                        ? 'border-purple-500/20 bg-white/5'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="importStrategy"
                      checked={importMode === 'merge'}
                      onChange={() => setImportMode('merge')}
                      className="mt-0.5 accent-pink-500"
                    />
                    <div>
                      <span className="block font-bold">Merge with Existing Data</span>
                      <span className="text-[10px] text-slate-400">
                        Keeps existing records and adds missing sections and transactions.
                      </span>
                    </div>
                  </label>
                </div>

                {/* Confirm Apply Button */}
                <button
                  onClick={handleConfirmImport}
                  disabled={isProcessing}
                  className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-pink-500/30 transition-all disabled:opacity-50"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>
                    {isProcessing
                      ? 'Restoring to IndexedDB...'
                      : importMode === 'replace'
                      ? 'Confirm & Replace All Data'
                      : 'Confirm & Merge Data'}
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
