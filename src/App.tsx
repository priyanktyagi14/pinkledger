import React, { useEffect } from 'react';
import { useApp } from './context/AppContext';
import { usePWA } from './context/PWAContext';
import { AppFrame } from './components/common/AppFrame';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeDashboard } from './components/home/HomeDashboard';
import { SectionDetails } from './components/sections/SectionDetails';
import { AllSections } from './components/sections/AllSections';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { TransactionHistory } from './components/transactions/TransactionHistory';
import { SettingsView } from './components/settings/SettingsView';

// Modals & UI Components
import { AddMoneyModal } from './components/transactions/AddMoneyModal';
import { AddExpenseModal } from './components/transactions/AddExpenseModal';
import { CreateSectionModal } from './components/sections/CreateSectionModal';
import { SectionCustomizationModal } from './components/sections/SectionCustomizationModal';
import { EditTransactionModal } from './components/transactions/EditTransactionModal';
import { AppManagementModal } from './components/settings/AppManagementModal';
import { CustomizationModal } from './components/settings/CustomizationModal';
import { DataManagementModal } from './components/settings/DataManagementModal';
import { DeleteConfirmModal } from './components/common/DeleteConfirmModal';
import { DeleteSectionModal } from './components/sections/DeleteSectionModal';
import { WelcomeModal } from './components/common/WelcomeModal';
import { ToastContainer } from './components/common/ToastContainer';
import { IOSInstallModal } from './components/common/IOSInstallModal';
import { OnboardingScreen } from './components/onboarding/OnboardingScreen';
import { EditProfileModal } from './components/settings/EditProfileModal';
import { Sparkles, RefreshCw } from 'lucide-react';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isInitialized,
    isOnboarded,
    setIsAddExpenseOpen,
    setIsAddMoneyOpen,
  } = useApp();
  const { updateAvailable, updateApp } = usePWA();

  // Handle PWA shortcuts from URL parameters
  useEffect(() => {
    if (!isInitialized) return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    if (action === 'add_expense') {
      setIsAddExpenseOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (action === 'add_money') {
      setIsAddMoneyOpen(true);
      window.history.replaceState({}, '', window.location.pathname);
    } else if (action === 'analytics') {
      setActiveTab('analytics');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [isInitialized, setIsAddExpenseOpen, setIsAddMoneyOpen, setActiveTab]);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#07030e] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-4 border-pink-500 border-t-transparent animate-spin mb-4" />
        <p className="font-display font-bold text-sm text-pink-300">Loading PinkLedger...</p>
      </div>
    );
  }

  // First-time user onboarding screen
  if (!isOnboarded) {
    return (
      <AppFrame>
        <OnboardingScreen />
        <ToastContainer />
      </AppFrame>
    );
  }

  return (
    <AppFrame>
      <div className="relative min-h-[90vh] flex flex-col justify-between">
        <div>
          {/* Top Header */}
          <Header />

          {/* New version available banner */}
          {updateAvailable && (
            <div className="mx-5 mb-3 p-3 rounded-2xl bg-gradient-to-r from-purple-900/90 to-pink-900/90 border border-pink-500/40 shadow-lg flex items-center justify-between text-xs text-white animate-fadeIn">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
                <span className="font-semibold">Update ready! Refresh for latest version.</span>
              </div>
              <button
                onClick={updateApp}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-pink-500 hover:bg-pink-600 font-bold text-[11px] shadow-sm transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Update</span>
              </button>
            </div>
          )}

          {/* Active Screen View */}
          <main className="mt-1">
            {activeTab === 'home' && <HomeDashboard />}
            {activeTab === 'section-details' && <SectionDetails />}
            {activeTab === 'sections' && <AllSections />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'transactions' && <TransactionHistory />}
            {activeTab === 'settings' && <SettingsView />}
          </main>
        </div>

        {/* Bottom Navigation Dock */}
        <BottomNav />
      </div>

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Modals */}
      <AddMoneyModal />
      <AddExpenseModal />
      <CreateSectionModal />
      <SectionCustomizationModal />
      <EditTransactionModal />
      <AppManagementModal />
      <CustomizationModal />
      <EditProfileModal />
      <DataManagementModal />
      <DeleteConfirmModal />
      <DeleteSectionModal />
      <WelcomeModal />
      <IOSInstallModal />
    </AppFrame>
  );
};
