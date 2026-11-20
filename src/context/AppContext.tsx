import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  ThemeMode,
  Section,
  Transaction,
  UserProfile,
  AppItem,
  ToastMessage,
  ExportBackupData,
} from '../types';
import {
  db,
  initializeIndexedDB,
  dbGetSetting,
  dbSetSetting,
  dbGetAllSectionsWithApps,
  dbGetAllTransactions,
  dbAddIncome,
  dbAddExpenseTransaction,
  dbUpdateTransaction,
  dbDeleteTransaction,
  dbAddSection,
  dbUpdateSection,
  dbDeleteSectionWithReassignment,
  dbAddApplication,
  dbUpdateApplication,
  dbDeleteApplication,
  dbMoveApplication,
  saveAssetRecord,
  getAssetDisplayUrl,
  dbExportBackup,
  dbImportBackup,
} from '../db/db';
import { initialProfile, initialSections, initialTransactions } from '../data/initialData';
import { safeLog } from '../utils/logger';
import confetti from 'canvas-confetti';

interface AppContextType {
  isInitialized: boolean;
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  sections: Section[];
  transactions: Transaction[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string | null) => void;
  selectedSection: Section | null;
  openingBalance: number;
  availableBalance: number;
  totalIncome: number;
  totalSpent: number;
  isBalanceHidden: boolean;
  toggleHideBalance: () => void;
  isOnboarded: boolean;
  completeOnboarding: (data: {
    name: string;
    avatarUrl: string;
    currency: string;
    theme: ThemeMode;
    openingBalance: number;
    monthlyBudget?: number;
    moneyGoal?: string;
  }) => Promise<void>;

  // Toast notifications
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info', title?: string) => void;
  removeToast: (id: string) => void;

  // Modals
  isAddMoneyOpen: boolean;
  setIsAddMoneyOpen: (open: boolean) => void;
  isAddExpenseOpen: boolean;
  setIsAddExpenseOpen: (open: boolean) => void;
  isCreateSectionOpen: boolean;
  setIsCreateSectionOpen: (open: boolean) => void;
  isEditTxnOpen: boolean;
  setIsEditTxnOpen: (open: boolean) => void;
  editingTransaction: Transaction | null;
  setEditingTransaction: (txn: Transaction | null) => void;
  isDeleteConfirmOpen: boolean;
  setIsDeleteConfirmOpen: (open: boolean) => void;
  deleteAction: (() => void) | null;
  deleteTitle: string;
  deleteMessage: string;
  promptDelete: (title: string, message: string, onConfirm: () => void) => void;
  isAppManageOpen: boolean;
  setIsAppManageOpen: (open: boolean) => void;
  isCustomizationOpen: boolean;
  setIsCustomizationOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isSectionCustomizationOpen: boolean;
  setIsSectionCustomizationOpen: (open: boolean) => void;
  sectionForCustomization: Section | null;
  setSectionForCustomization: (sec: Section | null) => void;
  isExportImportOpen: boolean;
  setIsExportImportOpen: (open: boolean) => void;
  isWelcomeOpen: boolean;
  setIsWelcomeOpen: (open: boolean) => void;

  // Delete Section with Reassignment Modal
  isDeleteSectionOpen: boolean;
  setIsDeleteSectionOpen: (open: boolean) => void;
  sectionToDelete: Section | null;
  setSectionToDelete: (sec: Section | null) => void;
  openDeleteSectionModal: (sec: Section) => void;
  confirmDeleteSection: (targetSectionId?: string) => Promise<void>;

  // Actions
  addMoney: (amount: number, source: string, date: string, note?: string) => Promise<boolean>;
  addExpense: (
    amount: number,
    sectionId: string,
    applicationId: string,
    date: string,
    note?: string
  ) => Promise<boolean>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<boolean>;
  deleteTransaction: (id: string) => Promise<void>;
  createSection: (
    name: string,
    icon: string,
    color: string,
    gradient: string,
    bannerPreset?: string,
    budgetLimit?: number,
    customBg?: string,
    customBgAssetId?: string
  ) => Promise<void>;
  updateSection: (sectionId: string, updates: Partial<Section>) => Promise<void>;
  deleteSection: (id: string) => Promise<void>;
  addApplicationToSection: (sectionId: string, app: AppItem) => Promise<void>;
  updateApplication: (sectionId: string, appId: string, updates: Partial<AppItem>) => Promise<void>;
  removeApplicationFromSection: (sectionId: string, appId: string) => Promise<void>;
  moveApplication: (fromSectionId: string, toSectionId: string, appId: string) => Promise<void>;
  uploadAssetBlob: (
    blob: Blob,
    type: string,
    associatedId?: string
  ) => Promise<{ id: string; url: string; dataUrl: string }>;
  resolveAssetUrl: (assetId: string) => Promise<string | null>;
  resetAllData: () => Promise<void>;
  exportJSON: () => Promise<void>;
  importJSON: (jsonString: string, mode?: 'replace' | 'merge') => Promise<{ success: boolean; message: string }>;
  triggerCelebration: () => void;
  refreshFromDB: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Theme state
  const [theme, setThemeState] = useState<ThemeMode>('midnight');

  // User profile
  const [profile, setProfileState] = useState<UserProfile>(initialProfile);

  // Onboarding & Opening Balance state
  const [isOnboarded, setIsOnboarded] = useState<boolean>(true);
  const [openingBalance, setOpeningBalance] = useState<number>(0);

  // Sections and Transactions
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  // Navigation
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>('sec-food');

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal States
  const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isCreateSectionOpen, setIsCreateSectionOpen] = useState(false);
  const [isEditTxnOpen, setIsEditTxnOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);
  const [deleteTitle, setDeleteTitle] = useState('Are you sure?');
  const [deleteMessage, setDeleteMessage] = useState('This action cannot be undone.');
  const [isAppManageOpen, setIsAppManageOpen] = useState(false);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSectionCustomizationOpen, setIsSectionCustomizationOpen] = useState(false);
  const [sectionForCustomization, setSectionForCustomization] = useState<Section | null>(null);
  const [isExportImportOpen, setIsExportImportOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);

  // Section Deletion with Reassignment Modal State
  const [isDeleteSectionOpen, setIsDeleteSectionOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState<Section | null>(null);

  const addToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info', title?: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6);
    const newToast: ToastMessage = { id, message, type, title };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Celebration Confetti
  const triggerCelebration = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ec4899', '#a855f7', '#f472b6', '#fb7185', '#38bdf8', '#fbbf24'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Compute live section statistics from transactions
  const assembleSectionsWithStats = (
    secRecords: Array<Omit<Section, 'applications' | 'totalSpent' | 'transactionCount'>>,
    appRecords: Array<AppItem & { parentSectionId: string }>,
    txns: Transaction[]
  ): Section[] => {
    return secRecords.map((sec) => {
      const secApps = appRecords.filter((a) => a.parentSectionId === sec.id);
      const secTxns = txns.filter((t) => t.sectionId === sec.id && t.type === 'expense');
      const spent = secTxns.reduce((sum, t) => sum + t.amount, 0);

      return {
        ...sec,
        applications: secApps,
        totalSpent: spent,
        transactionCount: secTxns.length,
      };
    });
  };

  // Refresh all state directly from IndexedDB
  const refreshFromDB = useCallback(async () => {
    try {
      const [savedTheme, savedProfile, savedOpeningBalance, savedIsOnboarded, { sections: secList, applications: appList }, txnList] =
        await Promise.all([
          dbGetSetting<ThemeMode>('theme', 'midnight'),
          dbGetSetting<UserProfile>('profile', initialProfile),
          dbGetSetting<number>('opening_balance', 0),
          dbGetSetting<boolean | undefined>('is_onboarded', undefined),
          dbGetAllSectionsWithApps(),
          dbGetAllTransactions(),
        ]);

      setThemeState(savedTheme);
      setProfileState(savedProfile);
      setOpeningBalance(typeof savedOpeningBalance === 'number' ? savedOpeningBalance : (savedProfile?.openingBalance ?? 0));

      const onboarded = savedIsOnboarded !== undefined
        ? Boolean(savedIsOnboarded)
        : Boolean(savedProfile?.isOnboarded);
      setIsOnboarded(onboarded);

      // Map Transactions
      const mappedTxns: Transaction[] = txnList.map((t) => ({
        id: t.id,
        title: t.description,
        description: t.description,
        amount: t.amount,
        type: t.type,
        date: t.date,
        displayDate: t.displayDate || 'Recent',
        sectionId: t.sectionId,
        sectionName: t.sectionName,
        applicationId: t.applicationId,
        applicationName: t.applicationName,
        source: t.source,
        note: t.notes,
        notes: t.notes,
        createdAt: t.createdAt,
        lastUpdatedAt: t.lastUpdatedAt,
      }));

      // Map Sections with Apps and live totals
      const fullyAssembledSections = assembleSectionsWithStats(secList, appList, mappedTxns);

      setTransactions(mappedTxns);
      setSections(fullyAssembledSections);

      // Apply theme CSS class and sync PWA theme-color meta
      if (savedTheme === 'midnight') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
      if (meta) {
        meta.setAttribute('content', savedTheme === 'midnight' ? '#0a0512' : '#ffdbe8');
      }
    } catch (err) {
      safeLog.error('Error refreshing state from IndexedDB', err);
    }
  }, []);

  // Initialize DB on mount
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        await initializeIndexedDB();
        if (isMounted) {
          await refreshFromDB();
          setIsInitialized(true);
        }
      } catch (e) {
        safeLog.error('Failed to initialize PinkLedger IndexedDB', e);
        if (isMounted) setIsInitialized(true);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [refreshFromDB]);

  // Synchronize theme to document and DB
  const setTheme = async (t: ThemeMode) => {
    setThemeState(t);
    if (t === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', t === 'midnight' ? '#0a0512' : '#ffdbe8');
    }
    await dbSetSetting('theme', t);
  };

  // Complete onboarding
  const completeOnboarding = async (data: {
    name: string;
    avatarUrl: string;
    currency: string;
    theme: ThemeMode;
    openingBalance: number;
    monthlyBudget?: number;
    moneyGoal?: string;
  }) => {
    const updatedProfile: UserProfile = {
      ...profile,
      name: data.name.trim(),
      avatarUrl: data.avatarUrl,
      currency: data.currency,
      openingBalance: data.openingBalance,
      monthlyBudget: data.monthlyBudget,
      moneyGoal: data.moneyGoal,
      isOnboarded: true,
    };

    setThemeState(data.theme);
    setProfileState(updatedProfile);
    setOpeningBalance(data.openingBalance);
    setIsOnboarded(true);

    if (data.theme === 'midnight') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    const meta = document.getElementById('theme-color-meta') || document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', data.theme === 'midnight' ? '#0a0512' : '#ffdbe8');
    }

    await Promise.all([
      dbSetSetting('theme', data.theme),
      dbSetSetting('profile', updatedProfile),
      dbSetSetting('currency', data.currency),
      dbSetSetting('opening_balance', data.openingBalance),
      dbSetSetting('is_onboarded', true),
    ]);

    triggerCelebration();
    addToast(`You're all set, ${data.name.trim()}! Your money journey starts now. 💗`, 'success', 'Welcome! ✨');
  };

  // Synchronize profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfileState(updated);
    if (updates.openingBalance !== undefined) {
      setOpeningBalance(updates.openingBalance);
      await dbSetSetting('opening_balance', updates.openingBalance);
    }
    if (updates.currency !== undefined) {
      await dbSetSetting('currency', updates.currency);
    }
    await dbSetSetting('profile', updated);
    addToast('Profile preferences updated', 'success');
  };

  const toggleHideBalance = async () => {
    const updated = { ...profile, hideBalance: !profile.hideBalance };
    setProfileState(updated);
    await dbSetSetting('profile', updated);
  };

  // Dynamically compute totals from live transactions
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalSpent = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  // Available Balance = Opening Balance + Total Income - Total Expenses
  const availableBalance = openingBalance + totalIncome - totalSpent;

  // Add Money
  const addMoney = async (
    amount: number,
    source: string,
    date: string,
    note?: string
  ): Promise<boolean> => {
    if (isNaN(amount) || amount <= 0) {
      addToast('Please enter a valid positive amount', 'error', 'Invalid Amount');
      return false;
    }
    if (!source || !source.trim()) {
      addToast('Please specify an income source', 'error', 'Missing Source');
      return false;
    }

    try {
      await dbAddIncome(amount, source.trim(), date, note?.trim());
      await refreshFromDB();
      triggerCelebration();
      addToast(`₹${amount.toLocaleString('en-IN')} added from ${source}!`, 'success', 'Money Added 🎉');
      setIsAddMoneyOpen(false);
      return true;
    } catch (e) {
      safeLog.error('Failed to add income', e);
      addToast('Failed to save money deposit to local database', 'error');
      return false;
    }
  };

  // Add Expense
  const addExpense = async (
    amount: number,
    sectionId: string,
    applicationId: string,
    date: string,
    note?: string
  ): Promise<boolean> => {
    if (isNaN(amount) || amount <= 0) {
      addToast('Please enter a valid expense amount', 'error', 'Invalid Amount');
      return false;
    }

    // CRITICAL: Prevent expenses that exceed available balance
    if (amount > availableBalance) {
      addToast(
        `Insufficient balance! Available balance is ₹${availableBalance.toLocaleString('en-IN')}. Please add money first.`,
        'error',
        'Over Budget Alert ⚠️'
      );
      return false;
    }

    const targetSec = sections.find((s) => s.id === sectionId);
    if (!targetSec) {
      addToast('Please select a valid section', 'error');
      return false;
    }

    const targetApp = targetSec.applications.find((a) => a.id === applicationId);
    const description = targetApp?.name || targetSec.name;

    try {
      await dbAddExpenseTransaction(
        amount,
        description,
        sectionId,
        targetSec.name,
        applicationId,
        targetApp?.name,
        date,
        note?.trim()
      );
      await refreshFromDB();
      triggerCelebration();
      addToast(`₹${amount.toLocaleString('en-IN')} recorded for ${description}!`, 'success', 'Expense Logged ✨');
      setIsAddExpenseOpen(false);
      return true;
    } catch (e) {
      safeLog.error('Failed to add expense', e);
      addToast('Failed to save expense to local database', 'error');
      return false;
    }
  };

  // Update Transaction
  const updateTransaction = async (
    id: string,
    updates: Partial<Transaction>
  ): Promise<boolean> => {
    const existing = transactions.find((t) => t.id === id);
    if (!existing) return false;

    // Validate positive amount if updating amount
    if (updates.amount !== undefined && (isNaN(updates.amount) || updates.amount <= 0)) {
      addToast('Transaction amount must be greater than zero', 'error', 'Invalid Amount');
      return false;
    }

    // If updating an expense amount, verify balance
    if (existing.type === 'expense' && updates.amount !== undefined) {
      const difference = updates.amount - existing.amount;
      if (difference > availableBalance) {
        addToast(
          `Insufficient balance! This increase exceeds your available balance (₹${availableBalance.toLocaleString('en-IN')}).`,
          'error',
          'Balance Limit Exceeded'
        );
        return false;
      }
    }

    try {
      await dbUpdateTransaction(id, {
        description: updates.title || updates.description,
        amount: updates.amount,
        sectionId: updates.sectionId,
        sectionName: updates.sectionName,
        applicationId: updates.applicationId,
        applicationName: updates.applicationName,
        source: updates.source,
        date: updates.date,
        notes: updates.notes || updates.note,
      });
      await refreshFromDB();
      addToast('Transaction updated successfully', 'success');
      setIsEditTxnOpen(false);
      setEditingTransaction(null);
      return true;
    } catch (e) {
      safeLog.error('Failed to update transaction', e);
      addToast('Failed to update transaction in database', 'error');
      return false;
    }
  };

  // Delete Transaction
  const deleteTransaction = async (id: string): Promise<void> => {
    try {
      await dbDeleteTransaction(id);
      await refreshFromDB();
      addToast('Transaction deleted and totals recalculated', 'info');
      setIsDeleteConfirmOpen(false);
    } catch (e) {
      safeLog.error('Failed to delete transaction', e);
      addToast('Failed to delete transaction from database', 'error');
    }
  };

  // Prompt generic delete modal
  const promptDelete = (title: string, message: string, onConfirm: () => void) => {
    setDeleteTitle(title);
    setDeleteMessage(message);
    setDeleteAction(() => onConfirm);
    setIsDeleteConfirmOpen(true);
  };

  // Open Section Delete Modal with Reassignment
  const openDeleteSectionModal = (sec: Section) => {
    setSectionToDelete(sec);
    setIsDeleteSectionOpen(true);
  };

  // Confirm Section Delete with Reassignment
  const confirmDeleteSection = async (targetSectionId?: string) => {
    if (!sectionToDelete) return;
    const target = sections.find((s) => s.id === targetSectionId);

    try {
      await dbDeleteSectionWithReassignment(sectionToDelete.id, {
        mode: targetSectionId ? 'reassign' : 'unassigned',
        targetSectionId,
        targetSectionName: target?.name,
      });

      await refreshFromDB();
      addToast(
        targetSectionId
          ? `"${sectionToDelete.name}" deleted. Transactions reassigned to "${target?.name}".`
          : `"${sectionToDelete.name}" deleted. Transactions retained as Unassigned.`,
        'success',
        'Section Removed'
      );

      if (selectedSectionId === sectionToDelete.id) {
        setSelectedSectionId(sections.find((s) => s.id !== sectionToDelete.id)?.id || null);
      }
      setSectionToDelete(null);
      setIsDeleteSectionOpen(false);
    } catch (e) {
      safeLog.error('Failed to delete section', e);
      addToast('Failed to delete section', 'error');
    }
  };

  // Create Section
  const createSection = async (
    name: string,
    icon: string,
    color: string,
    gradient: string,
    bannerPreset = 'default',
    budgetLimit = 5000,
    customBg?: string,
    customBgAssetId?: string
  ) => {
    try {
      const sectionId = 'sec-' + Date.now();
      const newSec = await dbAddSection({
        id: sectionId,
        name,
        tagline: 'Track your ' + name.toLowerCase() + ' expenses ✨',
        icon,
        color,
        gradient,
        bannerPreset,
        customBg,
        customBgAssetId,
        budgetLimit,
        bgType: customBg ? 'custom' : 'solid',
        bgValue: customBg || color,
      });

      // Add starter app for section
      await dbAddApplication({
        id: 'app-' + Date.now(),
        name: name + ' App',
        parentSectionId: newSec.id,
        iconName: icon.toLowerCase(),
        color,
        bgColor: color,
      });

      await refreshFromDB();
      triggerCelebration();
      setSelectedSectionId(sectionId);
      setIsCreateSectionOpen(false);
      addToast(`Section "${name}" created!`, 'success');
    } catch (e) {
      safeLog.error('Failed to create section', e);
      addToast('Failed to create section', 'error');
    }
  };

  // Update Section
  const updateSection = async (sectionId: string, updates: Partial<Section>) => {
    try {
      const { applications, totalSpent, transactionCount, ...secData } = updates;
      await dbUpdateSection(sectionId, secData);
      await refreshFromDB();
      addToast('Section updated successfully', 'success');
    } catch (e) {
      safeLog.error('Failed to update section', e);
      addToast('Failed to update section', 'error');
    }
  };

  // Direct Delete Section (calls prompt modal)
  const deleteSection = async (id: string) => {
    const sec = sections.find((s) => s.id === id);
    if (sec) {
      openDeleteSectionModal(sec);
    }
  };

  // Add App to Section
  const addApplicationToSection = async (sectionId: string, app: AppItem) => {
    try {
      await dbAddApplication({
        id: app.id,
        name: app.name,
        parentSectionId: sectionId,
        iconName: app.iconName,
        color: app.color,
        bgColor: app.bgColor,
        textColor: app.textColor,
        logoUrl: app.logoUrl,
        customIcon: app.customIcon,
        customIconAssetId: app.customIconAssetId,
        bgType: app.bgType,
        bgValue: app.bgValue,
      });
      await refreshFromDB();
      addToast(`Added "${app.name}"`, 'success');
    } catch (e) {
      safeLog.error('Failed to add application', e);
      addToast('Failed to add application', 'error');
    }
  };

  // Update App in Section
  const updateApplication = async (
    _sectionId: string,
    appId: string,
    updates: Partial<AppItem>
  ) => {
    try {
      await dbUpdateApplication(appId, updates);
      await refreshFromDB();
      addToast('Application updated', 'success');
    } catch (e) {
      safeLog.error('Failed to update application', e);
      addToast('Failed to update application', 'error');
    }
  };

  // Remove App from Section (retaining past transaction history)
  const removeApplicationFromSection = async (_sectionId: string, appId: string) => {
    try {
      await dbDeleteApplication(appId);
      await refreshFromDB();
      addToast('Application removed (financial history preserved)', 'info');
    } catch (e) {
      safeLog.error('Failed to remove application', e);
      addToast('Failed to remove application', 'error');
    }
  };

  // Move App between sections
  const moveApplication = async (
    _fromSectionId: string,
    toSectionId: string,
    appId: string
  ) => {
    try {
      await dbMoveApplication(appId, toSectionId);
      await refreshFromDB();
      addToast('Application moved to new section', 'success');
    } catch (e) {
      safeLog.error('Failed to move application', e);
      addToast('Failed to move application', 'error');
    }
  };

  // Asset Upload
  const uploadAssetBlob = async (
    blob: Blob,
    type: string,
    associatedId?: string
  ): Promise<{ id: string; url: string; dataUrl: string }> => {
    return await saveAssetRecord(blob, type, associatedId);
  };

  const resolveAssetUrl = async (assetId: string): Promise<string | null> => {
    return await getAssetDisplayUrl(assetId);
  };

  // Reset to default
  const resetAllData = async () => {
    try {
      await db.settings.clear();
      await db.income.clear();
      await db.sections.clear();
      await db.applications.clear();
      await db.transactions.clear();
      await db.assets.clear();
      await initializeIndexedDB();
      await refreshFromDB();
      setIsDeleteConfirmOpen(false);
      addToast('Reset to default template', 'info');
    } catch (e) {
      safeLog.error('Failed to reset database', e);
    }
  };

  // Export JSON
  const exportJSON = async () => {
    try {
      const backupData = await dbExportBackup();
      const blob = new Blob([JSON.stringify(backupData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `PinkLedger_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);
      addToast('Local backup exported successfully!', 'success', 'Backup Downloaded');
    } catch (e) {
      safeLog.error('Export error', e);
      addToast('Failed to export data backup', 'error');
    }
  };

  // Import JSON
  const importJSON = async (
    jsonString: string,
    mode: 'replace' | 'merge' = 'replace'
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const data: ExportBackupData = JSON.parse(jsonString);
      const result = await dbImportBackup(data, mode);
      if (result.success) {
        await refreshFromDB();
        addToast(result.message, 'success', 'Import Complete');
      } else {
        addToast(result.message, 'error', 'Import Failed');
      }
      return result;
    } catch (e: any) {
      const msg = e?.message || 'Invalid JSON format';
      addToast('Invalid backup file. Could not parse JSON.', 'error');
      return { success: false, message: msg };
    }
  };

  const selectedSection =
    sections.find((s) => s.id === selectedSectionId) || sections[0] || null;

  return (
    <AppContext.Provider
      value={{
        isInitialized,
        theme,
        setTheme,
        profile,
        updateProfile,
        sections,
        transactions,
        activeTab,
        setActiveTab,
        selectedSectionId,
        setSelectedSectionId,
        selectedSection,
        openingBalance,
        availableBalance,
        totalIncome,
        totalSpent,
        isBalanceHidden: profile.hideBalance,
        toggleHideBalance,
        isOnboarded,
        completeOnboarding,
        toasts,
        addToast,
        removeToast,
        isAddMoneyOpen,
        setIsAddMoneyOpen,
        isAddExpenseOpen,
        setIsAddExpenseOpen,
        isCreateSectionOpen,
        setIsCreateSectionOpen,
        isEditTxnOpen,
        setIsEditTxnOpen,
        editingTransaction,
        setEditingTransaction,
        isDeleteConfirmOpen,
        setIsDeleteConfirmOpen,
        deleteAction,
        deleteTitle,
        deleteMessage,
        promptDelete,
        isAppManageOpen,
        setIsAppManageOpen,
        isCustomizationOpen,
        setIsCustomizationOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isSectionCustomizationOpen,
        setIsSectionCustomizationOpen,
        sectionForCustomization,
        setSectionForCustomization,
        isExportImportOpen,
        setIsExportImportOpen,
        isWelcomeOpen,
        setIsWelcomeOpen,
        isDeleteSectionOpen,
        setIsDeleteSectionOpen,
        sectionToDelete,
        setSectionToDelete,
        openDeleteSectionModal,
        confirmDeleteSection,
        addMoney,
        addExpense,
        updateTransaction,
        deleteTransaction,
        createSection,
        updateSection,
        deleteSection,
        addApplicationToSection,
        updateApplication,
        removeApplicationFromSection,
        moveApplication,
        uploadAssetBlob,
        resolveAssetUrl,
        resetAllData,
        exportJSON,
        importJSON,
        triggerCelebration,
        refreshFromDB,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
