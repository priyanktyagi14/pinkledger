import Dexie, { Table } from 'dexie';
import {
  SettingsRecord,
  IncomeRecord,
  SectionRecord,
  ApplicationRecord,
  TransactionRecord,
  AssetRecord,
  UserProfile,
  ThemeMode,
  ExportBackupData,
} from '../types';
import { initialProfile, initialSections, initialIncomeList, initialTransactions } from '../data/initialData';

export class PinkLedgerDB extends Dexie {
  settings!: Table<SettingsRecord, string>;
  income!: Table<IncomeRecord, string>;
  sections!: Table<SectionRecord, string>;
  applications!: Table<ApplicationRecord, string>;
  transactions!: Table<TransactionRecord, string>;
  assets!: Table<AssetRecord, string>;

  constructor() {
    super('PinkLedgerLocalDB');
    this.version(1).stores({
      settings: 'key, updatedAt',
      income: 'id, amount, source, date, createdAt',
      sections: 'id, name, createdAt',
      applications: 'id, parentSectionId, name, createdAt',
      transactions: 'id, type, amount, sectionId, applicationId, date, createdAt, lastUpdatedAt',
      assets: 'id, imageType, associatedId, createdAt',
    });
  }
}

export const db = new PinkLedgerDB();

// In-memory cache for Object URLs generated from Blobs
const assetUrlCache = new Map<string, string>();

/**
 * Converts a Blob or File to a Base64 data URL string
 */
export const blobToDataUrl = async (blob: Blob): Promise<string> => {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert Blob to Data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } else {
    // Node.js fallback for tests and universal environments
    const nodeBuf = (globalThis as any).Buffer;
    if (nodeBuf) {
      const buffer = nodeBuf.from(await blob.arrayBuffer());
      const mime = blob.type || 'image/png';
      return `data:${mime};base64,${buffer.toString('base64')}`;
    }
    return '';
  }
};

/**
 * Converts a Base64 data URL string to a Blob
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(parts[1]);
  const array = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    array[i] = binary.charCodeAt(i);
  }
  return new Blob([array], { type: mime });
};

/**
 * Retrieve or generate a stable browser Object URL for an asset
 */
export const getAssetDisplayUrl = async (assetId: string): Promise<string | null> => {
  if (!assetId) return null;
  if (assetUrlCache.has(assetId)) {
    return assetUrlCache.get(assetId)!;
  }
  const asset = await db.assets.get(assetId);
  if (!asset) return null;

  let url: string;
  if (asset.blob && typeof URL.createObjectURL === 'function') {
    try {
      url = URL.createObjectURL(asset.blob);
    } catch {
      url = asset.dataUrl || '';
    }
  } else if (asset.dataUrl) {
    url = asset.dataUrl;
  } else {
    return null;
  }
  assetUrlCache.set(assetId, url);
  return url;
};

/**
 * Save an uploaded image Blob into the Assets store in IndexedDB
 */
export const saveAssetRecord = async (
  blob: Blob,
  imageType: string,
  associatedId?: string
): Promise<{ id: string; url: string; dataUrl: string }> => {
  const assetId = 'asset-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8);
  const dataUrl = await blobToDataUrl(blob);

  const asset: AssetRecord = {
    id: assetId,
    imageType: imageType || blob.type || 'image/png',
    blob,
    dataUrl,
    associatedId,
    createdAt: Date.now(),
  };

  await db.assets.put(asset);
  let objectUrl = dataUrl;
  if (typeof URL.createObjectURL === 'function') {
    try {
      objectUrl = URL.createObjectURL(blob);
    } catch {
      objectUrl = dataUrl;
    }
  }
  assetUrlCache.set(assetId, objectUrl);

  return { id: assetId, url: objectUrl, dataUrl };
};

/**
 * Initialize IndexedDB. Only seeds initial data once on very first launch.
 * Never clears or overwrites existing user data on reload or refresh.
 */
export const initializeIndexedDB = async (): Promise<boolean> => {
  const initializedRecord = await db.settings.get('is_initialized');
  if (initializedRecord && initializedRecord.value) {
    // Already initialized, load user data
    return false;
  }

  // Check if sections already exist
  const existingSectionCount = await db.sections.count();
  if (existingSectionCount > 0) {
    await db.settings.put({
      key: 'is_initialized',
      value: true,
      updatedAt: Date.now(),
    });
    return false;
  }

  // First time initialization: seed default data
  await db.transaction('rw', [db.settings, db.sections, db.applications, db.income, db.transactions], async () => {
    // 1. Theme and Profile Settings
    await db.settings.put({
      key: 'theme',
      value: 'midnight',
      updatedAt: Date.now(),
    });

    await db.settings.put({
      key: 'profile',
      value: initialProfile,
      updatedAt: Date.now(),
    });

    await db.settings.put({
      key: 'currency',
      value: '₹ INR',
      updatedAt: Date.now(),
    });

    await db.settings.put({
      key: 'opening_balance',
      value: 0,
      updatedAt: Date.now(),
    });

    await db.settings.put({
      key: 'is_onboarded',
      value: false,
      updatedAt: Date.now(),
    });

    // 2. Sections and Applications
    for (const sec of initialSections) {
      const { applications, ...secData } = sec;
      await db.sections.put({
        ...secData,
        createdAt: Date.now(),
        lastUpdatedAt: Date.now(),
      });

      for (const app of applications) {
        await db.applications.put({
          ...app,
          parentSectionId: sec.id,
          createdAt: Date.now(),
          lastUpdatedAt: Date.now(),
        });
      }
    }

    // 3. Income Records
    for (const inc of initialIncomeList) {
      await db.income.put(inc);
    }

    // 4. Transaction Records
    for (const txn of initialTransactions) {
      await db.transactions.put({
        id: txn.id,
        type: txn.type,
        amount: txn.amount,
        description: txn.title || txn.description || 'Transaction',
        sectionId: txn.sectionId,
        sectionName: txn.sectionName,
        applicationId: txn.applicationId,
        applicationName: txn.applicationName,
        source: txn.source,
        date: txn.date,
        displayDate: txn.displayDate,
        notes: txn.notes || txn.note,
        createdAt: txn.createdAt || Date.now(),
        lastUpdatedAt: txn.lastUpdatedAt || txn.createdAt || Date.now(),
      });
    }

    // Mark as initialized
    await db.settings.put({
      key: 'is_initialized',
      value: true,
      updatedAt: Date.now(),
    });
  });

  return true;
};

/**
 * Settings CRUD
 */
export const dbGetSetting = async <T>(key: string, defaultValue: T): Promise<T> => {
  const record = await db.settings.get(key);
  if (record && record.value !== undefined) {
    return record.value as T;
  }
  return defaultValue;
};

export const dbSetSetting = async <T>(key: string, value: T): Promise<void> => {
  await db.settings.put({
    key,
    value,
    updatedAt: Date.now(),
  });
};

/**
 * Income CRUD
 */
export const dbGetAllIncome = async (): Promise<IncomeRecord[]> => {
  return await db.income.orderBy('createdAt').reverse().toArray();
};

export const dbAddIncome = async (
  amount: number,
  source: string,
  date: string,
  notes?: string
): Promise<{ income: IncomeRecord; transaction: TransactionRecord }> => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Income amount must be greater than zero');
  }
  const id = 'inc-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const createdAt = Date.now();

  const incomeRecord: IncomeRecord = {
    id,
    amount,
    source,
    date,
    notes,
    createdAt,
    lastUpdatedAt: createdAt,
  };

  const transactionRecord: TransactionRecord = {
    id: 'txn-' + id,
    type: 'income',
    amount,
    description: `${source} Deposit`,
    source,
    date,
    displayDate: 'Today',
    notes,
    createdAt,
    lastUpdatedAt: createdAt,
  };

  await db.transaction('rw', [db.income, db.transactions], async () => {
    await db.income.put(incomeRecord);
    await db.transactions.put(transactionRecord);
  });

  return { income: incomeRecord, transaction: transactionRecord };
};

/**
 * Transactions CRUD
 */
export const dbGetAllTransactions = async (): Promise<TransactionRecord[]> => {
  return await db.transactions.orderBy('createdAt').reverse().toArray();
};

export const dbAddExpenseTransaction = async (
  amount: number,
  description: string,
  sectionId: string,
  sectionName?: string,
  applicationId?: string,
  applicationName?: string,
  date: string = new Date().toISOString().slice(0, 10),
  notes?: string
): Promise<TransactionRecord> => {
  if (isNaN(amount) || amount <= 0) {
    throw new Error('Expense amount must be greater than zero');
  }
  const id = 'txn-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
  const createdAt = Date.now();

  const txn: TransactionRecord = {
    id,
    type: 'expense',
    amount,
    description,
    sectionId,
    sectionName,
    applicationId,
    applicationName,
    date,
    displayDate: 'Today',
    notes,
    createdAt,
    lastUpdatedAt: createdAt,
  };

  await db.transactions.put(txn);
  return txn;
};

export const dbUpdateTransaction = async (
  id: string,
  updates: Partial<TransactionRecord>
): Promise<void> => {
  if (updates.amount !== undefined && (isNaN(updates.amount) || updates.amount <= 0)) {
    throw new Error('Updated transaction amount must be greater than zero');
  }
  const existing = await db.transactions.get(id);
  if (!existing) return;

  const updated: TransactionRecord = {
    ...existing,
    ...updates,
    lastUpdatedAt: Date.now(),
  };

  await db.transaction('rw', [db.transactions, db.income], async () => {
    await db.transactions.put(updated);

    // If it's an income transaction, also sync with db.income
    if (updated.type === 'income') {
      const incomeId = id.replace(/^txn-/, '');
      const inc = await db.income.get(incomeId);
      if (inc) {
        await db.income.put({
          ...inc,
          amount: updated.amount,
          source: updated.source || inc.source,
          date: updated.date,
          notes: updated.notes,
          lastUpdatedAt: Date.now(),
        });
      }
    }
  });
};

export const dbDeleteTransaction = async (id: string): Promise<void> => {
  const existing = await db.transactions.get(id);
  if (!existing) return;

  await db.transaction('rw', [db.transactions, db.income], async () => {
    await db.transactions.delete(id);
    if (existing.type === 'income') {
      const incomeId = id.replace(/^txn-/, '');
      await db.income.delete(incomeId);
    }
  });
};

/**
 * Sections & Applications CRUD
 */
export const dbGetAllSectionsWithApps = async (): Promise<{
  sections: SectionRecord[];
  applications: ApplicationRecord[];
}> => {
  const [sections, applications] = await Promise.all([
    db.sections.toArray(),
    db.applications.toArray(),
  ]);
  return { sections, applications };
};

export const dbAddSection = async (
  section: Omit<SectionRecord, 'createdAt' | 'lastUpdatedAt'>
): Promise<SectionRecord> => {
  const record: SectionRecord = {
    ...section,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  };
  await db.sections.put(record);
  return record;
};

export const dbUpdateSection = async (
  id: string,
  updates: Partial<SectionRecord>
): Promise<void> => {
  const existing = await db.sections.get(id);
  if (!existing) return;
  await db.sections.put({
    ...existing,
    ...updates,
    lastUpdatedAt: Date.now(),
  });
};

export const dbDeleteSectionWithReassignment = async (
  sectionId: string,
  reassignment: {
    mode: 'unassigned' | 'reassign';
    targetSectionId?: string;
    targetSectionName?: string;
  }
): Promise<void> => {
  await db.transaction('rw', [db.sections, db.applications, db.transactions], async () => {
    // 1. Update all associated transactions
    const txns = await db.transactions.where('sectionId').equals(sectionId).toArray();
    for (const t of txns) {
      if (reassignment.mode === 'reassign' && reassignment.targetSectionId) {
        await db.transactions.update(t.id, {
          sectionId: reassignment.targetSectionId,
          sectionName: reassignment.targetSectionName || 'Reassigned',
          lastUpdatedAt: Date.now(),
        });
      } else {
        await db.transactions.update(t.id, {
          sectionId: 'sec-unassigned',
          sectionName: 'General / Unassigned',
          lastUpdatedAt: Date.now(),
        });
      }
    }

    // 2. Remove applications under this section
    const apps = await db.applications.where('parentSectionId').equals(sectionId).toArray();
    for (const a of apps) {
      await db.applications.delete(a.id);
    }

    // 3. Remove section
    await db.sections.delete(sectionId);
  });
};

export const dbAddApplication = async (
  app: Omit<ApplicationRecord, 'createdAt' | 'lastUpdatedAt'>
): Promise<ApplicationRecord> => {
  const record: ApplicationRecord = {
    ...app,
    createdAt: Date.now(),
    lastUpdatedAt: Date.now(),
  };
  await db.applications.put(record);
  return record;
};

export const dbUpdateApplication = async (
  id: string,
  updates: Partial<ApplicationRecord>
): Promise<void> => {
  const existing = await db.applications.get(id);
  if (!existing) return;
  await db.applications.put({
    ...existing,
    ...updates,
    lastUpdatedAt: Date.now(),
  });
};

export const dbDeleteApplication = async (id: string): Promise<void> => {
  await db.transaction('rw', [db.applications, db.transactions], async () => {
    // Retain transaction history! Keep section and description, mark app as unassigned
    const txns = await db.transactions.where('applicationId').equals(id).toArray();
    for (const t of txns) {
      await db.transactions.update(t.id, {
        applicationId: undefined,
        lastUpdatedAt: Date.now(),
      });
    }
    await db.applications.delete(id);
  });
};

export const dbMoveApplication = async (
  appId: string,
  newParentSectionId: string
): Promise<void> => {
  const app = await db.applications.get(appId);
  if (!app) return;
  await db.applications.put({
    ...app,
    parentSectionId: newParentSectionId,
    lastUpdatedAt: Date.now(),
  });
};

/**
 * Data Export & Import
 */
export const dbExportBackup = async (): Promise<ExportBackupData> => {
  const [settingsList, incomeList, sectionsList, applicationsList, transactionsList, assetsList] =
    await Promise.all([
      db.settings.toArray(),
      db.income.toArray(),
      db.sections.toArray(),
      db.applications.toArray(),
      db.transactions.toArray(),
      db.assets.toArray(),
    ]);

  const settingsMap: Record<string, any> = {};
  settingsList.forEach((s) => {
    settingsMap[s.key] = s.value;
  });

  // Safely serialize assets with Data URLs
  const serializedAssets = await Promise.all(
    assetsList.map(async (a) => {
      let dataUrl = a.dataUrl;
      if (!dataUrl && a.blob) {
        try {
          dataUrl = await blobToDataUrl(a.blob);
        } catch (e) {
          dataUrl = '';
        }
      }
      return {
        id: a.id,
        imageType: a.imageType,
        dataUrl: dataUrl || '',
        associatedId: a.associatedId,
        createdAt: a.createdAt,
      };
    })
  );

  return {
    app: 'PinkLedger',
    version: '2.0.0',
    exportedAt: new Date().toISOString(),
    settings: settingsMap,
    income: incomeList,
    sections: sectionsList,
    applications: applicationsList,
    transactions: transactionsList,
    assets: serializedAssets,
  };
};

export const dbImportBackup = async (
  backup: ExportBackupData,
  mode: 'replace' | 'merge'
): Promise<{ success: boolean; message: string }> => {
  if (!backup || backup.app !== 'PinkLedger' || !Array.isArray(backup.sections) || !Array.isArray(backup.transactions)) {
    return {
      success: false,
      message: 'Invalid backup file structure. Please provide a genuine PinkLedger backup JSON.',
    };
  }

  await db.transaction(
    'rw',
    [db.settings, db.income, db.sections, db.applications, db.transactions, db.assets],
    async () => {
      if (mode === 'replace') {
        // Clear all existing stores
        await Promise.all([
          db.settings.clear(),
          db.income.clear(),
          db.sections.clear(),
          db.applications.clear(),
          db.transactions.clear(),
          db.assets.clear(),
        ]);
        assetUrlCache.clear();
      }

      // 1. Settings
      if (backup.settings) {
        for (const [key, value] of Object.entries(backup.settings)) {
          await db.settings.put({
            key,
            value,
            updatedAt: Date.now(),
          });
        }
      }

      // 2. Sections
      for (const sec of backup.sections) {
        await db.sections.put(sec);
      }

      // 3. Applications
      if (Array.isArray(backup.applications)) {
        for (const app of backup.applications) {
          await db.applications.put(app);
        }
      }

      // 4. Income
      if (Array.isArray(backup.income)) {
        for (const inc of backup.income) {
          await db.income.put(inc);
        }
      }

      // 5. Transactions
      for (const txn of backup.transactions) {
        await db.transactions.put(txn);
      }

      // 6. Assets
      if (Array.isArray(backup.assets)) {
        for (const a of backup.assets) {
          if (a.dataUrl) {
            try {
              const blob = dataUrlToBlob(a.dataUrl);
              await db.assets.put({
                id: a.id,
                imageType: a.imageType || 'image/png',
                blob,
                dataUrl: a.dataUrl,
                associatedId: a.associatedId,
                createdAt: a.createdAt || Date.now(),
              });
              assetUrlCache.set(a.id, URL.createObjectURL(blob));
            } catch (err) {
              console.warn('Failed to restore asset blob:', a.id, err);
            }
          }
        }
      }

      // Ensure marked as initialized
      await db.settings.put({
        key: 'is_initialized',
        value: true,
        updatedAt: Date.now(),
      });
    }
  );

  return {
    success: true,
    message: `Successfully ${mode === 'replace' ? 'restored' : 'merged'} ${backup.transactions.length} transactions and ${backup.sections.length} sections!`,
  };
};
