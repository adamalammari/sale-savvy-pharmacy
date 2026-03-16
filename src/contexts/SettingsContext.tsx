import React, { createContext, useContext, useState } from 'react';

export interface PharmacySettings {
  pharmacyName: string;
  pharmacyNameEn: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  vatNumber: string;
  vatRate: number;
  currency: string;
  invoicePrefix: string;
  showLogo: boolean;
  printAutomatically: boolean;
  paperSize: 'A4' | 'A5' | 'thermal';
  showVatOnInvoice: boolean;
  invoiceFooter: string;
  lowStockThreshold: number;
  expiryWarningDays: number;
  allowNegativeStock: boolean;
  requirePrescription: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const defaultSettings: PharmacySettings = {
  pharmacyName: 'صيدلية فارما بلس',
  pharmacyNameEn: 'Pharma Plus Pharmacy',
  licenseNumber: 'PH-2024-001',
  phone: '0501234567',
  email: 'info@pharmaplus.sa',
  address: 'شارع الملك فهد، حي العليا',
  city: 'الرياض',
  vatNumber: '300123456789003',
  vatRate: 15,
  currency: 'ر.س',
  invoicePrefix: 'INV',
  showLogo: true,
  printAutomatically: false,
  paperSize: 'A4',
  showVatOnInvoice: true,
  invoiceFooter: 'شكراً لزيارتكم - نتمنى لكم الشفاء العاجل',
  lowStockThreshold: 10,
  expiryWarningDays: 90,
  allowNegativeStock: false,
  requirePrescription: true,
  backupFrequency: 'daily',
};

interface SettingsContextType {
  settings: PharmacySettings;
  updateSettings: (updates: Partial<PharmacySettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<PharmacySettings>(defaultSettings);

  const updateSettings = (updates: Partial<PharmacySettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => setSettings(defaultSettings);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
};
