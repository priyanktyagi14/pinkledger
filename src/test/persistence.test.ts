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
  dbUpdateTransaction,
  dbDeleteTransaction,
  dbAddSection,
  dbAddApplication,
  saveAssetRecord,
  dbExportBackup,
  dbImportBackup,
} from '../db/db';

async function runTests() {
  console.log('🧪 Starting PinkLedger Prompt 3 Automated Persistence & Functionality Tests...\n');

  // Test 0: Initialization
  console.log('Test 0: Database Initialization & Seeding');
  const wasSeeded = await initializeIndexedDB();
  console.log(`- Database initialized (seeded: ${wasSeeded})`);

  let txns = await dbGetAllTransactions();
  let totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  let totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  let balance = totalIncome - totalExpense;
  console.log(`- Initial Total Income: ₹${totalIncome}`);
  console.log(`- Initial Total Expense: ₹${totalExpense}`);
  console.log(`- Initial Balance: ₹${balance}\n`);

  // Test A: Add ₹10,000 income. Balance must increase by ₹10,000.
  console.log('Test A: Add ₹10,000 income');
  const initialBalanceA = balance;
  await dbAddIncome(10000, 'Bonus', '2026-11-20', 'Festival bonus');
  txns = await dbGetAllTransactions();
  totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  balance = totalIncome - totalExpense;
  console.log(`- New Balance: ₹${balance}`);
  if (balance === initialBalanceA + 10000) {
    console.log('✅ Test A Passed: Available balance increased by exactly ₹10,000!\n');
  } else {
    throw new Error(`❌ Test A Failed: expected ${initialBalanceA + 10000}, got ${balance}`);
  }

  // Test B: Add ₹1,000 expense. Balance must decrease by ₹1,000.
  console.log('Test B: Add ₹1,000 expense');
  const initialBalanceB = balance;
  await dbAddExpenseTransaction(1000, 'Dinner', 'sec-food', 'Food & Delivery', 'app-zomato', 'Zomato');
  txns = await dbGetAllTransactions();
  totalIncome = txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  totalExpense = txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  balance = totalIncome - totalExpense;
  console.log(`- New Balance: ₹${balance}`);
  if (balance === initialBalanceB - 1000) {
    console.log('✅ Test B Passed: Available balance decreased by exactly ₹1,000!\n');
  } else {
    throw new Error(`❌ Test B Failed: expected ${initialBalanceB - 1000}, got ${balance}`);
  }

  // Test C: Create a section. Add Zomato. Refresh / query DB. Section & app must exist.
  console.log('Test C: Create Section & Add Application');
  const newSec = await dbAddSection({
    id: 'sec-custom-test',
    name: 'Food & Dining Out',
    icon: 'Utensils',
    color: '#ef4444',
    gradient: 'from-rose-500/30 to-red-600/10',
    budgetLimit: 7500,
  });
  await dbAddApplication({
    id: 'app-zomato-custom',
    name: 'Zomato',
    parentSectionId: newSec.id,
    iconName: 'zomato',
    color: '#e23744',
    bgColor: '#e23744',
  });
  const { sections, applications } = await dbGetAllSectionsWithApps();
  const foundSec = sections.find(s => s.id === 'sec-custom-test');
  const foundApp = applications.find(a => a.id === 'app-zomato-custom');
  if (foundSec && foundApp && foundApp.parentSectionId === 'sec-custom-test') {
    console.log(`✅ Test C Passed: Section "${foundSec.name}" and Application "${foundApp.name}" exist in IndexedDB!\n`);
  } else {
    throw new Error('❌ Test C Failed: Section or Application not found in IndexedDB');
  }

  // Test D: Upload custom background Blob. Refresh / query DB. Asset exists.
  console.log('Test D: Upload Custom Background Blob');
  const fakeBlob = new Blob(['fake image data bytes for test'], { type: 'image/png' });
  const asset = await saveAssetRecord(fakeBlob, 'section_bg', newSec.id);
  const savedAsset = await db.assets.get(asset.id);
  if (savedAsset && savedAsset.blob && savedAsset.associatedId === newSec.id) {
    console.log(`✅ Test D Passed: Asset Blob (ID: ${asset.id}) persisted in IndexedDB assets store!\n`);
  } else {
    throw new Error('❌ Test D Failed: Asset blob not persisted properly');
  }

  // Test E: Switch theme. Close and reopen (query DB). Selected theme remains active.
  console.log('Test E: Theme Persistence');
  await dbSetSetting('theme', 'bubblegum');
  let restoredTheme = await dbGetSetting('theme', 'midnight');
  if (restoredTheme === 'bubblegum') {
    console.log(`✅ Test E Passed: Theme switched to "${restoredTheme}" and persisted in settings store!\n`);
  } else {
    throw new Error(`❌ Test E Failed: expected bubblegum, got ${restoredTheme}`);
  }

  // Switch to midnight
  await dbSetSetting('theme', 'midnight');
  restoredTheme = await dbGetSetting('theme', 'bubblegum');
  if (restoredTheme === 'midnight') {
    console.log('✅ Test E Part 2 Passed: Theme switched back to "midnight" and persisted!\n');
  }

  // Test F: Edit or delete a transaction. Verify all totals recalculated correctly.
  console.log('Test F: Edit and Delete Transaction & Total Recalculation');
  const testTxn = await dbAddExpenseTransaction(500, 'Movie Ticket', 'sec-entertainment', 'Entertainment');
  let currentTxns = await dbGetAllTransactions();
  let preEditSpent = currentTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  // Edit: change amount from 500 to 750
  await dbUpdateTransaction(testTxn.id, { amount: 750, description: 'IMAX 3D Movie' });
  currentTxns = await dbGetAllTransactions();
  let postEditSpent = currentTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  if (postEditSpent === preEditSpent + 250) {
    console.log('✅ Test F (Edit): Expense updated from ₹500 to ₹750, total expense increased by ₹250!');
  } else {
    throw new Error(`❌ Test F Edit Failed: expected ${preEditSpent + 250}, got ${postEditSpent}`);
  }

  // Delete transaction
  await dbDeleteTransaction(testTxn.id);
  currentTxns = await dbGetAllTransactions();
  let postDeleteSpent = currentTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  if (postDeleteSpent === postEditSpent - 750) {
    console.log('✅ Test F (Delete): Transaction deleted, total expense recalculated correctly!\n');
  } else {
    throw new Error(`❌ Test F Delete Failed: expected ${postEditSpent - 750}, got ${postDeleteSpent}`);
  }

  // Test G: Export and Import backup verification
  console.log('Test G: Export and Import JSON backup');
  const backup = await dbExportBackup();
  console.log(`- Exported backup: ${backup.transactions.length} transactions, ${backup.sections.length} sections, ${backup.assets.length} assets`);
  if (backup.app === 'PinkLedger' && backup.transactions.length > 0 && backup.sections.length > 0) {
    console.log('✅ Test G Export Passed: Backup structure is valid and contains full data!');
  }

  // Test Merge import
  const importRes = await dbImportBackup(backup, 'merge');
  if (importRes.success) {
    console.log(`✅ Test G Import Passed: ${importRes.message}\n`);
  } else {
    throw new Error('❌ Test G Import Failed: ' + importRes.message);
  }

  console.log('🎉 ALL PROMPT 3 LOCAL STORAGE & FUNCTIONALITY TESTS PASSED SUCCESSFULLY! 🎉');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
