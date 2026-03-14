export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  price: number;
  costPrice: number;
  stock: number;
  minStock: number;
  expiryDate: string;
  supplier: string;
  barcode: string;
  unit: string;
  requiresPrescription: boolean;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  date: string;
  customerName?: string;
  invoiceNumber: string;
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

export const categories = [
  'مسكنات', 'مضادات حيوية', 'أدوية القلب', 'أدوية السكري',
  'فيتامينات', 'أدوية الجهاز الهضمي', 'أدوية الحساسية', 'مستلزمات طبية',
  'أدوية الضغط', 'أدوية العيون', 'كريمات ومراهم', 'أدوية الأطفال'
];

export const suppliers = [
  'شركة فارما المتحدة', 'المستودع الطبي الحديث', 'شركة الدواء العربية',
  'مجموعة الصحة الدوائية', 'شركة النجمة للأدوية'
];

export const initialMedicines: Medicine[] = [
  { id: '1', name: 'باراسيتامول 500 مج', genericName: 'Paracetamol', category: 'مسكنات', price: 12, costPrice: 7, stock: 250, minStock: 50, expiryDate: '2026-08-15', supplier: 'شركة فارما المتحدة', barcode: '6281001010101', unit: 'شريط', requiresPrescription: false },
  { id: '2', name: 'أموكسيسيلين 500 مج', genericName: 'Amoxicillin', category: 'مضادات حيوية', price: 35, costPrice: 20, stock: 120, minStock: 30, expiryDate: '2026-05-20', supplier: 'المستودع الطبي الحديث', barcode: '6281001010102', unit: 'علبة', requiresPrescription: true },
  { id: '3', name: 'أملوديبين 5 مج', genericName: 'Amlodipine', category: 'أدوية الضغط', price: 28, costPrice: 15, stock: 85, minStock: 20, expiryDate: '2027-01-10', supplier: 'شركة الدواء العربية', barcode: '6281001010103', unit: 'علبة', requiresPrescription: true },
  { id: '4', name: 'ميتفورمين 850 مج', genericName: 'Metformin', category: 'أدوية السكري', price: 22, costPrice: 12, stock: 180, minStock: 40, expiryDate: '2026-11-30', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010104', unit: 'علبة', requiresPrescription: true },
  { id: '5', name: 'فيتامين سي 1000 مج', genericName: 'Vitamin C', category: 'فيتامينات', price: 18, costPrice: 9, stock: 300, minStock: 60, expiryDate: '2027-03-25', supplier: 'شركة النجمة للأدوية', barcode: '6281001010105', unit: 'علبة', requiresPrescription: false },
  { id: '6', name: 'أوميبرازول 20 مج', genericName: 'Omeprazole', category: 'أدوية الجهاز الهضمي', price: 30, costPrice: 16, stock: 95, minStock: 25, expiryDate: '2026-09-18', supplier: 'شركة فارما المتحدة', barcode: '6281001010106', unit: 'علبة', requiresPrescription: true },
  { id: '7', name: 'لوراتادين 10 مج', genericName: 'Loratadine', category: 'أدوية الحساسية', price: 15, costPrice: 8, stock: 200, minStock: 40, expiryDate: '2027-02-14', supplier: 'المستودع الطبي الحديث', barcode: '6281001010107', unit: 'شريط', requiresPrescription: false },
  { id: '8', name: 'إيبوبروفين 400 مج', genericName: 'Ibuprofen', category: 'مسكنات', price: 14, costPrice: 7, stock: 280, minStock: 50, expiryDate: '2026-12-01', supplier: 'شركة الدواء العربية', barcode: '6281001010108', unit: 'شريط', requiresPrescription: false },
  { id: '9', name: 'سيتريزين 10 مج', genericName: 'Cetirizine', category: 'أدوية الحساسية', price: 16, costPrice: 9, stock: 150, minStock: 30, expiryDate: '2026-10-22', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010109', unit: 'شريط', requiresPrescription: false },
  { id: '10', name: 'أتورفاستاتين 20 مج', genericName: 'Atorvastatin', category: 'أدوية القلب', price: 45, costPrice: 25, stock: 60, minStock: 15, expiryDate: '2027-04-30', supplier: 'شركة النجمة للأدوية', barcode: '6281001010110', unit: 'علبة', requiresPrescription: true },
  { id: '11', name: 'قطرة عيون مرطبة', genericName: 'Artificial Tears', category: 'أدوية العيون', price: 25, costPrice: 14, stock: 45, minStock: 15, expiryDate: '2026-07-10', supplier: 'شركة فارما المتحدة', barcode: '6281001010111', unit: 'قطرة', requiresPrescription: false },
  { id: '12', name: 'كريم فيوسيدين', genericName: 'Fusidic Acid', category: 'كريمات ومراهم', price: 32, costPrice: 18, stock: 70, minStock: 20, expiryDate: '2026-06-15', supplier: 'المستودع الطبي الحديث', barcode: '6281001010112', unit: 'أنبوب', requiresPrescription: false },
  { id: '13', name: 'شراب باراسيتامول أطفال', genericName: 'Paracetamol Syrup', category: 'أدوية الأطفال', price: 20, costPrice: 11, stock: 10, minStock: 25, expiryDate: '2026-08-01', supplier: 'شركة الدواء العربية', barcode: '6281001010113', unit: 'زجاجة', requiresPrescription: false },
  { id: '14', name: 'كمامات طبية (50 قطعة)', genericName: 'Medical Masks', category: 'مستلزمات طبية', price: 35, costPrice: 20, stock: 5, minStock: 30, expiryDate: '2028-12-31', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010114', unit: 'علبة', requiresPrescription: false },
  { id: '15', name: 'أنسولين لانتوس', genericName: 'Insulin Glargine', category: 'أدوية السكري', price: 180, costPrice: 120, stock: 25, minStock: 10, expiryDate: '2026-04-20', supplier: 'شركة النجمة للأدوية', barcode: '6281001010115', unit: 'قلم', requiresPrescription: true },
];

export const initialSales: Sale[] = [
  { id: '1', items: [{ medicineId: '1', medicineName: 'باراسيتامول 500 مج', quantity: 3, price: 12, total: 36 }], total: 36, discount: 0, paymentMethod: 'cash', date: '2026-03-14T09:15:00', invoiceNumber: 'INV-001' },
  { id: '2', items: [{ medicineId: '5', medicineName: 'فيتامين سي 1000 مج', quantity: 2, price: 18, total: 36 }, { medicineId: '7', medicineName: 'لوراتادين 10 مج', quantity: 1, price: 15, total: 15 }], total: 51, discount: 0, paymentMethod: 'card', date: '2026-03-14T10:30:00', invoiceNumber: 'INV-002' },
  { id: '3', items: [{ medicineId: '2', medicineName: 'أموكسيسيلين 500 مج', quantity: 1, price: 35, total: 35 }, { medicineId: '6', medicineName: 'أوميبرازول 20 مج', quantity: 1, price: 30, total: 30 }], total: 65, discount: 5, paymentMethod: 'insurance', date: '2026-03-14T11:45:00', customerName: 'أحمد محمد', invoiceNumber: 'INV-003' },
  { id: '4', items: [{ medicineId: '4', medicineName: 'ميتفورمين 850 مج', quantity: 2, price: 22, total: 44 }], total: 44, discount: 0, paymentMethod: 'cash', date: '2026-03-13T14:20:00', invoiceNumber: 'INV-004' },
  { id: '5', items: [{ medicineId: '10', medicineName: 'أتورفاستاتين 20 مج', quantity: 1, price: 45, total: 45 }, { medicineId: '3', medicineName: 'أملوديبين 5 مج', quantity: 1, price: 28, total: 28 }], total: 73, discount: 3, paymentMethod: 'card', date: '2026-03-13T16:00:00', customerName: 'فاطمة علي', invoiceNumber: 'INV-005' },
  { id: '6', items: [{ medicineId: '8', medicineName: 'إيبوبروفين 400 مج', quantity: 2, price: 14, total: 28 }], total: 28, discount: 0, paymentMethod: 'cash', date: '2026-03-12T09:30:00', invoiceNumber: 'INV-006' },
  { id: '7', items: [{ medicineId: '15', medicineName: 'أنسولين لانتوس', quantity: 1, price: 180, total: 180 }], total: 180, discount: 10, paymentMethod: 'insurance', date: '2026-03-12T11:00:00', customerName: 'خالد سعيد', invoiceNumber: 'INV-007' },
  { id: '8', items: [{ medicineId: '12', medicineName: 'كريم فيوسيدين', quantity: 1, price: 32, total: 32 }, { medicineId: '11', medicineName: 'قطرة عيون مرطبة', quantity: 2, price: 25, total: 50 }], total: 82, discount: 0, paymentMethod: 'cash', date: '2026-03-11T15:45:00', invoiceNumber: 'INV-008' },
];

export const monthlySalesData = [
  { month: 'يناير', sales: 45200, profit: 12500 },
  { month: 'فبراير', sales: 52800, profit: 15200 },
  { month: 'مارس', sales: 48900, profit: 13800 },
  { month: 'أبريل', sales: 61200, profit: 18400 },
  { month: 'مايو', sales: 55600, profit: 16100 },
  { month: 'يونيو', sales: 67800, profit: 20300 },
  { month: 'يوليو', sales: 72100, profit: 22500 },
  { month: 'أغسطس', sales: 58900, profit: 17200 },
  { month: 'سبتمبر', sales: 64300, profit: 19100 },
  { month: 'أكتوبر', sales: 71500, profit: 21800 },
  { month: 'نوفمبر', sales: 68200, profit: 20100 },
  { month: 'ديسمبر', sales: 75400, profit: 23600 },
];

export const categorySalesData = [
  { name: 'مسكنات', value: 28, fill: 'hsl(var(--chart-1))' },
  { name: 'مضادات حيوية', value: 22, fill: 'hsl(var(--chart-2))' },
  { name: 'أدوية مزمنة', value: 20, fill: 'hsl(var(--chart-3))' },
  { name: 'فيتامينات', value: 15, fill: 'hsl(var(--chart-4))' },
  { name: 'أخرى', value: 15, fill: 'hsl(var(--chart-5))' },
];
