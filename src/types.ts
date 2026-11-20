export type ThemeMode = 'midnight' | 'bubblegum';

export interface SettingsRecord {
  key: string;
  value: any;
  updatedAt: number;
}

export interface IncomeRecord {
  id: string;
  amount: number;
  source: string;
  date: string;
  notes?: string;
  createdAt: number;
  lastUpdatedAt?: number;
}

export interface SectionRecord {
  id: string;
  name: string;
  tagline?: string;
  icon: string;
  color: string;
  gradient: string;
  bgImage?: string;
  bannerPreset?: string;
  customBg?: string; // asset ID or Data URL / preset URL
  customBgAssetId?: string;
  bgType?: 'solid' | 'gradient' | 'aesthetic' | 'custom';
  bgValue?: string;
  budgetLimit?: number;
  createdAt: number;
  lastUpdatedAt?: number;
}

export interface ApplicationRecord {
  id: string;
  name: string;
  parentSectionId: string;
  iconName: string;
  color: string;
  bgColor: string;
  textColor?: string;
  logoUrl?: string;
  customIcon?: string; // asset ID or Data URL
  customIconAssetId?: string;
  bgType?: 'solid' | 'gradient' | 'aesthetic' | 'custom';
  bgValue?: string;
  createdAt: number;
  lastUpdatedAt?: number;
}

export interface TransactionRecord {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  sectionId?: string;
  sectionName?: string;
  applicationId?: string;
  applicationName?: string;
  source?: string;
  date: string;
  displayDate?: string;
  notes?: string;
  createdAt: number;
  lastUpdatedAt: number;
}

export interface AssetRecord {
  id: string;
  imageType: string;
  blob: Blob;
  dataUrl?: string;
  associatedId?: string;
  createdAt: number;
}

export interface AppItem {
  id: string;
  name: string;
  iconName: string;
  color: string;
  bgColor: string;
  textColor?: string;
  logoUrl?: string;
  customIcon?: string;
  customIconAssetId?: string;
  bgType?: 'solid' | 'gradient' | 'aesthetic' | 'custom';
  bgValue?: string;
}

export interface Section {
  id: string;
  name: string;
  tagline?: string;
  icon: string;
  color: string;
  gradient: string;
  bgImage?: string;
  bannerPreset?: string;
  customBg?: string;
  customBgAssetId?: string;
  bgType?: 'solid' | 'gradient' | 'aesthetic' | 'custom';
  bgValue?: string;
  totalSpent: number;
  transactionCount: number;
  budgetLimit?: number;
  applications: AppItem[];
  createdAt?: number;
}

export interface Transaction {
  id: string;
  title: string; // aliases description
  description?: string;
  amount: number;
  type: 'expense' | 'income';
  date: string; // ISO string or human string
  displayDate?: string;
  sectionId?: string;
  sectionName?: string;
  applicationId?: string;
  applicationName?: string;
  source?: string; // for income (Salary, Freelancing, etc.)
  note?: string; // aliases notes
  notes?: string;
  createdAt: number;
  lastUpdatedAt?: number;
}

export interface UserProfile {
  name: string;
  title: string;
  avatarUrl: string;
  currency: string;
  hideBalance: boolean;
  backgroundPreset: string;
  customWallpaper?: string;
  customWallpaperAssetId?: string;
  openingBalance?: number;
  monthlyBudget?: number;
  moneyGoal?: string;
  isOnboarded?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

export interface ExportBackupData {
  app: 'PinkLedger';
  version: '2.0.0';
  exportedAt: string;
  settings: Record<string, any>;
  income: IncomeRecord[];
  sections: SectionRecord[];
  applications: ApplicationRecord[];
  transactions: TransactionRecord[];
  assets: Array<{
    id: string;
    imageType: string;
    dataUrl: string;
    associatedId?: string;
    createdAt: number;
  }>;
}
