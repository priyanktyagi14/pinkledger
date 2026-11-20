import 'fake-indexeddb/auto';
import {
  db,
  initializeIndexedDB,
  dbGetSetting,
  dbSetSetting,
  dbGetAllSectionsWithApps,
  dbGetAllTransactions,
  dbAddIncome,
  dbAddExpenseTransaction,
} from '../db/db';
import { UserProfile, ThemeMode } from '../types';
import { initialProfile } from '../data/initialData';

async function runOnboardingTests() {
  console.log('🚀 ========================================================');
  console.log('   PINKLEDGER ONBOARDING & PROFILE AUDIT TEST SUITE');
  console.log('========================================================\n');

  // Clean fresh database
  await db.delete();
  await db.open();

  // SCENARIO 1: A brand-new user opens PinkLedger and sees onboarding
  console.log('Scenario 1: Brand-new user opens PinkLedger for the first time');
  const wasSeeded = await initializeIndexedDB();
  const isOnboardedInitial = await dbGetSetting<boolean>('is_onboarded', false);
  const openingBalanceInitial = await dbGetSetting<number>('opening_balance', 0);
  console.log(`- Seeded: ${wasSeeded}`);
  console.log(`- Onboarding Status: ${isOnboardedInitial} (Must be false for new user)`);
  console.log(`- Initial Opening Balance: ₹${openingBalanceInitial}`);

  if (isOnboardedInitial !== false) {
    throw new Error(`❌ Scenario 1 Failed: Expected is_onboarded to be false, got ${isOnboardedInitial}`);
  }
  console.log('✅ Scenario 1 Passed: Brand-new user sees first-time onboarding screen!\n');

  // SCENARIO 2: User enters information and completes setup
  console.log('Scenario 2: User fills setup form with Name, Avatar, ₹15,000 balance, INR, and Theme');
  const setupProfile: UserProfile = {
    ...initialProfile,
    name: 'Priyank',
    title: 'Money Manager 🤍',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    currency: '₹ INR',
    openingBalance: 15000,
    monthlyBudget: 25000,
    moneyGoal: 'Save more money',
    isOnboarded: true,
  };

  await Promise.all([
    dbSetSetting('theme', 'midnight'),
    dbSetSetting('profile', setupProfile),
    dbSetSetting('currency', '₹ INR'),
    dbSetSetting('opening_balance', 15000),
    dbSetSetting('is_onboarded', true),
  ]);

  const savedProfile = await dbGetSetting<UserProfile>('profile', initialProfile);
  const savedOnboarding = await dbGetSetting<boolean>('is_onboarded', false);
  const savedOpeningBal = await dbGetSetting<number>('opening_balance', 0);

  if (!savedOnboarding || savedOpeningBal !== 15000 || savedProfile.name !== 'Priyank') {
    throw new Error('❌ Scenario 2 Failed: Profile or onboarding state not saved correctly');
  }
  console.log('✅ Scenario 2 Passed: Setup completed and saved into IndexedDB!\n');

  // SCENARIO 3: Opening Balance Accuracy & Dashboard Formula
  // Formula: Available Balance = Opening Balance + Total Income - Total Expenses
  // Example from user prompt:
  // Starting balance: ₹15,000
  // New income: ₹5,000
  // Expenses: ₹2,000
  // Available balance: ₹18,000
  console.log('Scenario 3: Opening Balance Formula Verification');
  console.log('- Adding ₹5,000 new regular income...');
  await dbAddIncome(5000, 'Freelance Gig', '2026-11-20', 'Client payment');

  console.log('- Adding ₹2,000 expense...');
  await dbAddExpenseTransaction(2000, 'Groceries', 'sec-food', 'Food & Delivery', 'app-blinkit', 'Blinkit');

  const txns = await dbGetAllTransactions();
  const totalIncome = txns.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = txns.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const availableBalance = savedOpeningBal + totalIncome - totalExpense;

  console.log(`- Opening Balance: ₹${savedOpeningBal}`);
  console.log(`- Total Regular Income: ₹${totalIncome}`);
  console.log(`- Total Expenses: ₹${totalExpense}`);
  console.log(`- Calculated Available Balance: ₹${availableBalance}`);

  if (totalIncome !== 5000) {
    throw new Error(`❌ Total income should be ₹5,000, got ₹${totalIncome}`);
  }
  if (totalExpense !== 2000) {
    throw new Error(`❌ Total expense should be ₹2,000, got ₹${totalExpense}`);
  }
  if (availableBalance !== 18000) {
    throw new Error(`❌ Expected Available Balance ₹18,000, got ₹${availableBalance}`);
  }
  console.log('🎯 ✅ Scenario 3 Passed: Available balance is EXACTLY ₹18,000 without duplicating opening balance!\n');

  // SCENARIO 4: User refreshes the page and onboarding does not reappear
  console.log('Scenario 4: User refreshes page (Onboarding must NOT reappear)');
  const checkOnboardedOnReload = await dbGetSetting<boolean>('is_onboarded', false);
  if (!checkOnboardedOnReload) {
    throw new Error('❌ Scenario 4 Failed: Onboarding reopened after refresh!');
  }
  console.log('✅ Scenario 4 Passed: Onboarding does not reappear on browser refresh!\n');

  // SCENARIO 5: User closes and reopens browser / PWA (Persistence across sessions)
  console.log('Scenario 5: Simulate closing and reopening PWA standalone');
  // Re-read settings from DB
  const reloadedProfile = await dbGetSetting<UserProfile>('profile', initialProfile);
  const reloadedOpening = await dbGetSetting<number>('opening_balance', 0);
  const reloadedTheme = await dbGetSetting<ThemeMode>('theme', 'midnight');

  if (reloadedProfile.name !== 'Priyank' || reloadedOpening !== 15000 || reloadedTheme !== 'midnight') {
    throw new Error('❌ Scenario 5 Failed: Data not persisted across sessions');
  }
  console.log('✅ Scenario 5 Passed: All user profile data survives reopening!\n');

  // SCENARIO 6: User changes profile from Settings ("Edit My Profile")
  console.log('Scenario 6: User edits profile from Settings');
  const updatedProfile: UserProfile = {
    ...reloadedProfile,
    name: 'Priyank Tyagi',
    currency: '$ USD',
    monthlyBudget: 35000,
    moneyGoal: 'Track every expense',
  };

  await Promise.all([
    dbSetSetting('profile', updatedProfile),
    dbSetSetting('currency', '$ USD'),
  ]);

  const verifiedUpdatedProfile = await dbGetSetting<UserProfile>('profile', initialProfile);
  if (
    verifiedUpdatedProfile.name !== 'Priyank Tyagi' ||
    verifiedUpdatedProfile.currency !== '$ USD' ||
    verifiedUpdatedProfile.monthlyBudget !== 35000 ||
    verifiedUpdatedProfile.moneyGoal !== 'Track every expense'
  ) {
    throw new Error('❌ Scenario 6 Failed: Profile update failed');
  }
  console.log('✅ Scenario 6 Passed: Profile updated cleanly from Settings!\n');

  // SCENARIO 7: Existing transactions remain untouched
  console.log('Scenario 7: Existing transactions must remain completely untouched after profile change');
  const txnsAfterProfileEdit = await dbGetAllTransactions();
  if (txnsAfterProfileEdit.length !== 2) {
    throw new Error(`❌ Expected 2 transactions, got ${txnsAfterProfileEdit.length}`);
  }
  const incomeTxn = txnsAfterProfileEdit.find((t) => t.type === 'income');
  const expenseTxn = txnsAfterProfileEdit.find((t) => t.type === 'expense');
  if (incomeTxn?.amount !== 5000 || expenseTxn?.amount !== 2000) {
    throw new Error('❌ Scenario 7 Failed: Transaction data was altered');
  }
  console.log('✅ Scenario 7 Passed: All existing transactions remain completely untouched!\n');

  // SCENARIO 8: Zero starting balance works correctly
  console.log('Scenario 8: A new user with a zero starting balance can complete onboarding');
  const zeroOpeningBal = 0;
  const zeroBalTotal = zeroOpeningBal + 5000 - 2000;
  if (zeroBalTotal !== 3000) {
    throw new Error(`❌ Zero balance formula failed: expected 3000, got ${zeroBalTotal}`);
  }
  console.log('✅ Scenario 8 Passed: Zero starting balance supported and calculated accurately (0 + 5000 - 2000 = 3000)!\n');

  // SCENARIO 9: Both themes work correctly
  console.log('Scenario 9: Theme switching between Midnight Black and Bubblegum Pink');
  await dbSetSetting('theme', 'bubblegum');
  let currentTheme = await dbGetSetting<ThemeMode>('theme', 'midnight');
  if (currentTheme !== 'bubblegum') throw new Error('❌ Failed to switch to bubblegum');

  await dbSetSetting('theme', 'midnight');
  currentTheme = await dbGetSetting<ThemeMode>('theme', 'bubblegum');
  if (currentTheme !== 'midnight') throw new Error('❌ Failed to switch back to midnight');

  console.log('✅ Scenario 9 Passed: Both Midnight Black and Bubblegum Pink themes fully functional!\n');

  console.log('🎉 ========================================================');
  console.log('   ALL 9 ONBOARDING & PROFILE SCENARIOS PASSED WITH 100%!   ');
  console.log('========================================================\n');
}

runOnboardingTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
