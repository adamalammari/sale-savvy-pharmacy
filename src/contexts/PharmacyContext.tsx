import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  Medicine, Sale, SaleItem, Supplier, Customer, PurchaseOrder, Prescription, ReturnItem, Notification,
  initialMedicines, initialSales, initialSuppliers, initialCustomers,
  initialPurchaseOrders, initialPrescriptions, initialReturns, initialNotifications,
} from '@/data/pharmacyData';

interface PharmacyContextType {
  // Medicine
  medicines: Medicine[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  // Sales
  sales: Sale[];
  cart: SaleItem[];
  addToCart: (medicine: Medicine, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateCartQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'insurance', discount: number, customerName?: string, customerId?: string) => Sale | null;
  getCartTotal: () => number;

  // Suppliers
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Customers
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, customer: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Purchase Orders
  purchaseOrders: PurchaseOrder[];
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void;
  updatePurchaseOrderStatus: (id: string, status: PurchaseOrder['status']) => void;

  // Prescriptions
  prescriptions: Prescription[];
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  updatePrescriptionStatus: (id: string, status: Prescription['status']) => void;
  dispensePrescriptionItem: (prescriptionId: string, medicineId: string) => void;

  // Returns
  returns: ReturnItem[];
  addReturn: (returnItem: Omit<ReturnItem, 'id'>) => void;
  updateReturnStatus: (id: string, status: ReturnItem['status']) => void;

  // Notifications
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadNotificationsCount: number;

  // Derived
  getLowStockMedicines: () => Medicine[];
  getExpiringMedicines: () => Medicine[];
  getTodaySales: () => Sale[];
  getTodayRevenue: () => number;
}

const PharmacyContext = createContext<PharmacyContextType | undefined>(undefined);

export const PharmacyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [sales, setSales] = useState<Sale[]>(initialSales);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [suppliersList, setSuppliers] = useState<Supplier[]>(initialSuppliers);
  const [customersList, setCustomers] = useState<Customer[]>(initialCustomers);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [returns, setReturns] = useState<ReturnItem[]>(initialReturns);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  // Medicine CRUD
  const addMedicine = useCallback((medicine: Omit<Medicine, 'id'>) => {
    setMedicines(prev => [...prev, { ...medicine, id: Date.now().toString() }]);
  }, []);
  const updateMedicine = useCallback((id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);
  const deleteMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }, []);

  // Cart & Sales
  const addToCart = useCallback((medicine: Medicine, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicineId === medicine.id);
      if (existing) {
        return prev.map(item =>
          item.medicineId === medicine.id
            ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.price }
            : item
        );
      }
      return [...prev, { medicineId: medicine.id, medicineName: medicine.name, quantity, price: medicine.price, total: quantity * medicine.price }];
    });
  }, []);
  const removeFromCart = useCallback((medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicineId !== medicineId));
  }, []);
  const updateCartQuantity = useCallback((medicineId: string, quantity: number) => {
    if (quantity <= 0) { setCart(prev => prev.filter(item => item.medicineId !== medicineId)); return; }
    setCart(prev => prev.map(item => item.medicineId === medicineId ? { ...item, quantity, total: quantity * item.price } : item));
  }, []);
  const clearCart = useCallback(() => setCart([]), []);
  const getCartTotal = useCallback(() => cart.reduce((sum, item) => sum + item.total, 0), [cart]);

  const completeSale = useCallback((paymentMethod: 'cash' | 'card' | 'insurance', discount: number, customerName?: string, customerId?: string) => {
    if (cart.length === 0) return null;
    const total = getCartTotal() - discount;
    const sale: Sale = {
      id: Date.now().toString(), items: [...cart], total, discount, paymentMethod,
      date: new Date().toISOString(), customerName, customerId,
      invoiceNumber: `INV-${String(sales.length + 1).padStart(3, '0')}`, status: 'completed',
    };
    setSales(prev => [sale, ...prev]);
    setMedicines(prev => prev.map(m => {
      const cartItem = cart.find(c => c.medicineId === m.id);
      return cartItem ? { ...m, stock: Math.max(0, m.stock - cartItem.quantity) } : m;
    }));
    if (customerId) {
      setCustomers(prev => prev.map(c => c.id === customerId ? { ...c, totalPurchases: c.totalPurchases + 1, totalSpent: c.totalSpent + total, lastVisit: new Date().toISOString().split('T')[0] } : c));
    }
    setCart([]);
    return sale;
  }, [cart, getCartTotal, sales.length]);

  // Suppliers
  const addSupplier = useCallback((supplier: Omit<Supplier, 'id'>) => {
    setSuppliers(prev => [...prev, { ...supplier, id: `s${Date.now()}` }]);
  }, []);
  const updateSupplier = useCallback((id: string, updates: Partial<Supplier>) => {
    setSuppliers(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);
  const deleteSupplier = useCallback((id: string) => {
    setSuppliers(prev => prev.filter(s => s.id !== id));
  }, []);

  // Customers
  const addCustomer = useCallback((customer: Omit<Customer, 'id'>) => {
    setCustomers(prev => [...prev, { ...customer, id: `c${Date.now()}` }]);
  }, []);
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
  }, []);

  // Purchase Orders
  const addPurchaseOrder = useCallback((order: Omit<PurchaseOrder, 'id'>) => {
    setPurchaseOrders(prev => [...prev, { ...order, id: `po${Date.now()}` }]);
  }, []);
  const updatePurchaseOrderStatus = useCallback((id: string, status: PurchaseOrder['status']) => {
    setPurchaseOrders(prev => prev.map(po => {
      if (po.id !== id) return po;
      const updated = { ...po, status };
      if (status === 'received') {
        updated.receivedDate = new Date().toISOString().split('T')[0];
        // Update stock
        po.items.forEach(item => {
          setMedicines(prev => prev.map(m => m.id === item.medicineId ? { ...m, stock: m.stock + item.quantity } : m));
        });
      }
      return updated;
    }));
  }, []);

  // Prescriptions
  const addPrescription = useCallback((prescription: Omit<Prescription, 'id'>) => {
    setPrescriptions(prev => [...prev, { ...prescription, id: `rx${Date.now()}` }]);
  }, []);
  const updatePrescriptionStatus = useCallback((id: string, status: Prescription['status']) => {
    setPrescriptions(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  }, []);
  const dispensePrescriptionItem = useCallback((prescriptionId: string, medicineId: string) => {
    setPrescriptions(prev => prev.map(p => {
      if (p.id !== prescriptionId) return p;
      const items = p.items.map(i => i.medicineId === medicineId ? { ...i, dispensed: true } : i);
      const allDispensed = items.every(i => i.dispensed);
      return { ...p, items, status: allDispensed ? 'dispensed' : 'partially-dispensed' };
    }));
  }, []);

  // Returns
  const addReturn = useCallback((returnItem: Omit<ReturnItem, 'id'>) => {
    setReturns(prev => [...prev, { ...returnItem, id: `r${Date.now()}` }]);
  }, []);
  const updateReturnStatus = useCallback((id: string, status: ReturnItem['status']) => {
    setReturns(prev => prev.map(r => {
      if (r.id !== id) return r;
      if (status === 'approved') {
        r.items.forEach(item => {
          setMedicines(prev => prev.map(m => m.id === item.medicineId ? { ...m, stock: m.stock + item.quantity } : m));
        });
      }
      return { ...r, status };
    }));
  }, []);

  // Notifications
  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Derived
  const getLowStockMedicines = useCallback(() => medicines.filter(m => m.stock <= m.minStock), [medicines]);
  const getExpiringMedicines = useCallback(() => {
    const threeMonths = new Date(); threeMonths.setMonth(threeMonths.getMonth() + 3);
    return medicines.filter(m => new Date(m.expiryDate) <= threeMonths);
  }, [medicines]);
  const getTodaySales = useCallback(() => {
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.date).toDateString() === today);
  }, [sales]);
  const getTodayRevenue = useCallback(() => getTodaySales().reduce((sum, s) => sum + s.total, 0), [getTodaySales]);

  return (
    <PharmacyContext.Provider value={{
      medicines, addMedicine, updateMedicine, deleteMedicine,
      sales, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, completeSale, getCartTotal,
      suppliers: suppliersList, addSupplier, updateSupplier, deleteSupplier,
      customers: customersList, addCustomer, updateCustomer, deleteCustomer,
      purchaseOrders, addPurchaseOrder, updatePurchaseOrderStatus,
      prescriptions, addPrescription, updatePrescriptionStatus, dispensePrescriptionItem,
      returns, addReturn, updateReturnStatus,
      notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount,
      getLowStockMedicines, getExpiringMedicines, getTodaySales, getTodayRevenue,
    }}>
      {children}
    </PharmacyContext.Provider>
  );
};

export const usePharmacy = () => {
  const context = useContext(PharmacyContext);
  if (!context) throw new Error('usePharmacy must be used within PharmacyProvider');
  return context;
};
