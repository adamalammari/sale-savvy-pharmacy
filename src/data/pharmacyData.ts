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
  location?: string; // shelf location
  batchNumber?: string;
}

export interface Sale {
  id: string;
  items: SaleItem[];
  total: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'insurance';
  date: string;
  customerName?: string;
  customerId?: string;
  invoiceNumber: string;
  status: 'completed' | 'returned' | 'partial-return';
}

export interface SaleItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  totalOrders: number;
  totalAmount: number;
  rating: number; // 1-5
  status: 'active' | 'inactive';
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  allergies: string[];
  chronicConditions: string[];
  totalPurchases: number;
  totalSpent: number;
  lastVisit: string;
  notes?: string;
}

export interface PurchaseOrder {
  id: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  total: number;
  status: 'pending' | 'ordered' | 'received' | 'cancelled';
  orderDate: string;
  expectedDelivery?: string;
  receivedDate?: string;
  notes?: string;
}

export interface PurchaseOrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitCost: number;
  total: number;
}

export interface Prescription {
  id: string;
  customerId?: string;
  customerName: string;
  doctorName: string;
  hospitalClinic?: string;
  date: string;
  items: PrescriptionItem[];
  status: 'pending' | 'dispensed' | 'partially-dispensed' | 'cancelled';
  notes?: string;
  insuranceCovered: boolean;
}

export interface PrescriptionItem {
  medicineId: string;
  medicineName: string;
  dosage: string;
  duration: string;
  quantity: number;
  dispensed: boolean;
}

export interface ReturnItem {
  id: string;
  saleId: string;
  invoiceNumber: string;
  date: string;
  items: ReturnItemDetail[];
  reason: string;
  totalRefund: number;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ReturnItemDetail {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Notification {
  id: string;
  type: 'low-stock' | 'expiry' | 'order' | 'return' | 'general';
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

export const categories = [
  'مسكنات', 'مضادات حيوية', 'أدوية القلب', 'أدوية السكري',
  'فيتامينات', 'أدوية الجهاز الهضمي', 'أدوية الحساسية', 'مستلزمات طبية',
  'أدوية الضغط', 'أدوية العيون', 'كريمات ومراهم', 'أدوية الأطفال',
  'أدوية الجهاز التنفسي', 'أدوية نفسية وعصبية', 'مكملات غذائية'
];

export const suppliers = [
  'شركة فارما المتحدة', 'المستودع الطبي الحديث', 'شركة الدواء العربية',
  'مجموعة الصحة الدوائية', 'شركة النجمة للأدوية'
];

export const initialMedicines: Medicine[] = [
  { id: '1', name: 'باراسيتامول 500 مج', genericName: 'Paracetamol', category: 'مسكنات', price: 12, costPrice: 7, stock: 250, minStock: 50, expiryDate: '2026-08-15', supplier: 'شركة فارما المتحدة', barcode: '6281001010101', unit: 'شريط', requiresPrescription: false, location: 'A-1-3', batchNumber: 'BT-2025-001' },
  { id: '2', name: 'أموكسيسيلين 500 مج', genericName: 'Amoxicillin', category: 'مضادات حيوية', price: 35, costPrice: 20, stock: 120, minStock: 30, expiryDate: '2026-05-20', supplier: 'المستودع الطبي الحديث', barcode: '6281001010102', unit: 'علبة', requiresPrescription: true, location: 'B-2-1', batchNumber: 'BT-2025-002' },
  { id: '3', name: 'أملوديبين 5 مج', genericName: 'Amlodipine', category: 'أدوية الضغط', price: 28, costPrice: 15, stock: 85, minStock: 20, expiryDate: '2027-01-10', supplier: 'شركة الدواء العربية', barcode: '6281001010103', unit: 'علبة', requiresPrescription: true, location: 'C-1-2', batchNumber: 'BT-2025-003' },
  { id: '4', name: 'ميتفورمين 850 مج', genericName: 'Metformin', category: 'أدوية السكري', price: 22, costPrice: 12, stock: 180, minStock: 40, expiryDate: '2026-11-30', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010104', unit: 'علبة', requiresPrescription: true, location: 'C-2-1', batchNumber: 'BT-2025-004' },
  { id: '5', name: 'فيتامين سي 1000 مج', genericName: 'Vitamin C', category: 'فيتامينات', price: 18, costPrice: 9, stock: 300, minStock: 60, expiryDate: '2027-03-25', supplier: 'شركة النجمة للأدوية', barcode: '6281001010105', unit: 'علبة', requiresPrescription: false, location: 'D-1-1', batchNumber: 'BT-2025-005' },
  { id: '6', name: 'أوميبرازول 20 مج', genericName: 'Omeprazole', category: 'أدوية الجهاز الهضمي', price: 30, costPrice: 16, stock: 95, minStock: 25, expiryDate: '2026-09-18', supplier: 'شركة فارما المتحدة', barcode: '6281001010106', unit: 'علبة', requiresPrescription: true, location: 'B-3-2', batchNumber: 'BT-2025-006' },
  { id: '7', name: 'لوراتادين 10 مج', genericName: 'Loratadine', category: 'أدوية الحساسية', price: 15, costPrice: 8, stock: 200, minStock: 40, expiryDate: '2027-02-14', supplier: 'المستودع الطبي الحديث', barcode: '6281001010107', unit: 'شريط', requiresPrescription: false, location: 'A-2-1', batchNumber: 'BT-2025-007' },
  { id: '8', name: 'إيبوبروفين 400 مج', genericName: 'Ibuprofen', category: 'مسكنات', price: 14, costPrice: 7, stock: 280, minStock: 50, expiryDate: '2026-12-01', supplier: 'شركة الدواء العربية', barcode: '6281001010108', unit: 'شريط', requiresPrescription: false, location: 'A-1-4', batchNumber: 'BT-2025-008' },
  { id: '9', name: 'سيتريزين 10 مج', genericName: 'Cetirizine', category: 'أدوية الحساسية', price: 16, costPrice: 9, stock: 150, minStock: 30, expiryDate: '2026-10-22', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010109', unit: 'شريط', requiresPrescription: false, location: 'A-2-2', batchNumber: 'BT-2025-009' },
  { id: '10', name: 'أتورفاستاتين 20 مج', genericName: 'Atorvastatin', category: 'أدوية القلب', price: 45, costPrice: 25, stock: 60, minStock: 15, expiryDate: '2027-04-30', supplier: 'شركة النجمة للأدوية', barcode: '6281001010110', unit: 'علبة', requiresPrescription: true, location: 'C-3-1', batchNumber: 'BT-2025-010' },
  { id: '11', name: 'قطرة عيون مرطبة', genericName: 'Artificial Tears', category: 'أدوية العيون', price: 25, costPrice: 14, stock: 45, minStock: 15, expiryDate: '2026-07-10', supplier: 'شركة فارما المتحدة', barcode: '6281001010111', unit: 'قطرة', requiresPrescription: false, location: 'D-2-1', batchNumber: 'BT-2025-011' },
  { id: '12', name: 'كريم فيوسيدين', genericName: 'Fusidic Acid', category: 'كريمات ومراهم', price: 32, costPrice: 18, stock: 70, minStock: 20, expiryDate: '2026-06-15', supplier: 'المستودع الطبي الحديث', barcode: '6281001010112', unit: 'أنبوب', requiresPrescription: false, location: 'D-3-1', batchNumber: 'BT-2025-012' },
  { id: '13', name: 'شراب باراسيتامول أطفال', genericName: 'Paracetamol Syrup', category: 'أدوية الأطفال', price: 20, costPrice: 11, stock: 10, minStock: 25, expiryDate: '2026-08-01', supplier: 'شركة الدواء العربية', barcode: '6281001010113', unit: 'زجاجة', requiresPrescription: false, location: 'E-1-1', batchNumber: 'BT-2025-013' },
  { id: '14', name: 'كمامات طبية (50 قطعة)', genericName: 'Medical Masks', category: 'مستلزمات طبية', price: 35, costPrice: 20, stock: 5, minStock: 30, expiryDate: '2028-12-31', supplier: 'مجموعة الصحة الدوائية', barcode: '6281001010114', unit: 'علبة', requiresPrescription: false, location: 'F-1-1', batchNumber: 'BT-2025-014' },
  { id: '15', name: 'أنسولين لانتوس', genericName: 'Insulin Glargine', category: 'أدوية السكري', price: 180, costPrice: 120, stock: 25, minStock: 10, expiryDate: '2026-04-20', supplier: 'شركة النجمة للأدوية', barcode: '6281001010115', unit: 'قلم', requiresPrescription: true, location: 'C-2-3', batchNumber: 'BT-2025-015' },
];

export const initialSuppliers: Supplier[] = [
  { id: 's1', name: 'شركة فارما المتحدة', contactPerson: 'محمد العلي', phone: '0551234567', email: 'info@pharma-united.com', address: 'الرياض - حي العليا', totalOrders: 45, totalAmount: 125000, rating: 5, status: 'active' },
  { id: 's2', name: 'المستودع الطبي الحديث', contactPerson: 'أحمد سعيد', phone: '0559876543', email: 'sales@modernmed.com', address: 'جدة - حي الفيصلية', totalOrders: 32, totalAmount: 89000, rating: 4, status: 'active' },
  { id: 's3', name: 'شركة الدواء العربية', contactPerson: 'خالد حسن', phone: '0553456789', email: 'orders@arabpharma.com', address: 'الدمام - حي الشاطئ', totalOrders: 28, totalAmount: 76000, rating: 4, status: 'active' },
  { id: 's4', name: 'مجموعة الصحة الدوائية', contactPerson: 'سعد الرشيد', phone: '0557654321', email: 'info@healthgroup.com', address: 'الرياض - حي النخيل', totalOrders: 20, totalAmount: 54000, rating: 3, status: 'active' },
  { id: 's5', name: 'شركة النجمة للأدوية', contactPerson: 'فهد العمري', phone: '0552345678', email: 'star@starpharma.com', address: 'مكة المكرمة - العزيزية', totalOrders: 15, totalAmount: 42000, rating: 4, status: 'inactive' },
];

export const initialCustomers: Customer[] = [
  { id: 'c1', name: 'أحمد محمد', phone: '0501234567', email: 'ahmed@email.com', insuranceProvider: 'بوبا', insuranceNumber: 'INS-001', allergies: ['بنسلين'], chronicConditions: ['ضغط الدم'], totalPurchases: 12, totalSpent: 856, lastVisit: '2026-03-14', notes: 'يحتاج متابعة شهرية' },
  { id: 'c2', name: 'فاطمة علي', phone: '0509876543', email: 'fatima@email.com', insuranceProvider: 'التعاونية', insuranceNumber: 'INS-002', allergies: [], chronicConditions: ['سكري'], totalPurchases: 8, totalSpent: 620, lastVisit: '2026-03-13' },
  { id: 'c3', name: 'خالد سعيد', phone: '0503456789', insuranceProvider: 'ميدغلف', insuranceNumber: 'INS-003', allergies: ['أسبرين'], chronicConditions: ['سكري', 'ضغط الدم'], totalPurchases: 15, totalSpent: 1240, lastVisit: '2026-03-12' },
  { id: 'c4', name: 'نورة عبدالله', phone: '0507654321', allergies: [], chronicConditions: [], totalPurchases: 3, totalSpent: 180, lastVisit: '2026-03-10' },
  { id: 'c5', name: 'عبدالرحمن يوسف', phone: '0502345678', email: 'abdulrahman@email.com', insuranceProvider: 'بوبا', insuranceNumber: 'INS-005', allergies: ['سلفا'], chronicConditions: ['ربو'], totalPurchases: 20, totalSpent: 2100, lastVisit: '2026-03-14' },
];

export const initialPurchaseOrders: PurchaseOrder[] = [
  { id: 'po1', supplierId: 's1', supplierName: 'شركة فارما المتحدة', items: [{ medicineId: '1', medicineName: 'باراسيتامول 500 مج', quantity: 500, unitCost: 7, total: 3500 }, { medicineId: '6', medicineName: 'أوميبرازول 20 مج', quantity: 200, unitCost: 16, total: 3200 }], total: 6700, status: 'received', orderDate: '2026-03-01', expectedDelivery: '2026-03-05', receivedDate: '2026-03-04' },
  { id: 'po2', supplierId: 's2', supplierName: 'المستودع الطبي الحديث', items: [{ medicineId: '2', medicineName: 'أموكسيسيلين 500 مج', quantity: 300, unitCost: 20, total: 6000 }], total: 6000, status: 'ordered', orderDate: '2026-03-10', expectedDelivery: '2026-03-16' },
  { id: 'po3', supplierId: 's4', supplierName: 'مجموعة الصحة الدوائية', items: [{ medicineId: '14', medicineName: 'كمامات طبية (50 قطعة)', quantity: 100, unitCost: 20, total: 2000 }, { medicineId: '13', medicineName: 'شراب باراسيتامول أطفال', quantity: 50, unitCost: 11, total: 550 }], total: 2550, status: 'pending', orderDate: '2026-03-13' },
];

export const initialPrescriptions: Prescription[] = [
  { id: 'rx1', customerId: 'c1', customerName: 'أحمد محمد', doctorName: 'د. سالم الحربي', hospitalClinic: 'مستشفى الملك فيصل', date: '2026-03-14', items: [{ medicineId: '3', medicineName: 'أملوديبين 5 مج', dosage: 'قرص واحد يومياً', duration: '30 يوم', quantity: 30, dispensed: true }, { medicineId: '10', medicineName: 'أتورفاستاتين 20 مج', dosage: 'قرص واحد مساءً', duration: '30 يوم', quantity: 30, dispensed: true }], status: 'dispensed', insuranceCovered: true },
  { id: 'rx2', customerId: 'c3', customerName: 'خالد سعيد', doctorName: 'د. عمر الشريف', hospitalClinic: 'عيادات الحياة', date: '2026-03-12', items: [{ medicineId: '4', medicineName: 'ميتفورمين 850 مج', dosage: 'قرص مرتين يومياً', duration: '60 يوم', quantity: 120, dispensed: true }, { medicineId: '15', medicineName: 'أنسولين لانتوس', dosage: 'حسب الحاجة', duration: '30 يوم', quantity: 2, dispensed: false }], status: 'partially-dispensed', insuranceCovered: true, notes: 'انتظار توفر الأنسولين' },
  { id: 'rx3', customerName: 'سارة حسين', doctorName: 'د. ليلى أحمد', date: '2026-03-14', items: [{ medicineId: '2', medicineName: 'أموكسيسيلين 500 مج', dosage: 'كبسولة كل 8 ساعات', duration: '7 أيام', quantity: 21, dispensed: false }], status: 'pending', insuranceCovered: false },
];

export const initialReturns: ReturnItem[] = [
  { id: 'r1', saleId: '1', invoiceNumber: 'INV-001', date: '2026-03-14', items: [{ medicineId: '1', medicineName: 'باراسيتامول 500 مج', quantity: 1, price: 12, total: 12 }], reason: 'منتج تالف', totalRefund: 12, status: 'approved' },
];

export const initialNotifications: Notification[] = [
  { id: 'n1', type: 'low-stock', title: 'مخزون منخفض', message: 'كمامات طبية - المخزون: 5 (الحد الأدنى: 30)', date: '2026-03-14T08:00:00', read: false, actionUrl: '/inventory' },
  { id: 'n2', type: 'expiry', title: 'قرب انتهاء الصلاحية', message: 'أنسولين لانتوس - ينتهي في 20 أبريل 2026', date: '2026-03-14T08:00:00', read: false, actionUrl: '/inventory' },
  { id: 'n3', type: 'order', title: 'طلب شراء جديد', message: 'طلب شراء من مجموعة الصحة الدوائية بانتظار الموافقة', date: '2026-03-13T14:00:00', read: true, actionUrl: '/purchase-orders' },
  { id: 'n4', type: 'low-stock', title: 'مخزون منخفض', message: 'شراب باراسيتامول أطفال - المخزون: 10 (الحد الأدنى: 25)', date: '2026-03-14T08:00:00', read: false },
];

export const initialSales: Sale[] = [
  { id: '1', items: [{ medicineId: '1', medicineName: 'باراسيتامول 500 مج', quantity: 3, price: 12, total: 36 }], total: 36, discount: 0, paymentMethod: 'cash', date: '2026-03-14T09:15:00', invoiceNumber: 'INV-001', status: 'completed' },
  { id: '2', items: [{ medicineId: '5', medicineName: 'فيتامين سي 1000 مج', quantity: 2, price: 18, total: 36 }, { medicineId: '7', medicineName: 'لوراتادين 10 مج', quantity: 1, price: 15, total: 15 }], total: 51, discount: 0, paymentMethod: 'card', date: '2026-03-14T10:30:00', invoiceNumber: 'INV-002', status: 'completed' },
  { id: '3', items: [{ medicineId: '2', medicineName: 'أموكسيسيلين 500 مج', quantity: 1, price: 35, total: 35 }, { medicineId: '6', medicineName: 'أوميبرازول 20 مج', quantity: 1, price: 30, total: 30 }], total: 65, discount: 5, paymentMethod: 'insurance', date: '2026-03-14T11:45:00', customerName: 'أحمد محمد', customerId: 'c1', invoiceNumber: 'INV-003', status: 'completed' },
  { id: '4', items: [{ medicineId: '4', medicineName: 'ميتفورمين 850 مج', quantity: 2, price: 22, total: 44 }], total: 44, discount: 0, paymentMethod: 'cash', date: '2026-03-13T14:20:00', invoiceNumber: 'INV-004', status: 'completed' },
  { id: '5', items: [{ medicineId: '10', medicineName: 'أتورفاستاتين 20 مج', quantity: 1, price: 45, total: 45 }, { medicineId: '3', medicineName: 'أملوديبين 5 مج', quantity: 1, price: 28, total: 28 }], total: 73, discount: 3, paymentMethod: 'card', date: '2026-03-13T16:00:00', customerName: 'فاطمة علي', customerId: 'c2', invoiceNumber: 'INV-005', status: 'completed' },
  { id: '6', items: [{ medicineId: '8', medicineName: 'إيبوبروفين 400 مج', quantity: 2, price: 14, total: 28 }], total: 28, discount: 0, paymentMethod: 'cash', date: '2026-03-12T09:30:00', invoiceNumber: 'INV-006', status: 'completed' },
  { id: '7', items: [{ medicineId: '15', medicineName: 'أنسولين لانتوس', quantity: 1, price: 180, total: 180 }], total: 180, discount: 10, paymentMethod: 'insurance', date: '2026-03-12T11:00:00', customerName: 'خالد سعيد', customerId: 'c3', invoiceNumber: 'INV-007', status: 'completed' },
  { id: '8', items: [{ medicineId: '12', medicineName: 'كريم فيوسيدين', quantity: 1, price: 32, total: 32 }, { medicineId: '11', medicineName: 'قطرة عيون مرطبة', quantity: 2, price: 25, total: 50 }], total: 82, discount: 0, paymentMethod: 'cash', date: '2026-03-11T15:45:00', invoiceNumber: 'INV-008', status: 'completed' },
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
