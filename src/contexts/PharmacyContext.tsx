import React, { createContext, useContext, useState, useCallback } from 'react';
import { Medicine, Sale, SaleItem, initialMedicines, initialSales } from '@/data/pharmacyData';

interface PharmacyContextType {
  medicines: Medicine[];
  sales: Sale[];
  cart: SaleItem[];
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (id: string, medicine: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;
  addToCart: (medicine: Medicine, quantity: number) => void;
  removeFromCart: (medicineId: string) => void;
  updateCartQuantity: (medicineId: string, quantity: number) => void;
  clearCart: () => void;
  completeSale: (paymentMethod: 'cash' | 'card' | 'insurance', discount: number, customerName?: string) => Sale | null;
  getCartTotal: () => number;
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

  const addMedicine = useCallback((medicine: Omit<Medicine, 'id'>) => {
    const newMedicine: Medicine = { ...medicine, id: Date.now().toString() };
    setMedicines(prev => [...prev, newMedicine]);
  }, []);

  const updateMedicine = useCallback((id: string, updates: Partial<Medicine>) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  }, []);

  const deleteMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
  }, []);

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
      return [...prev, {
        medicineId: medicine.id,
        medicineName: medicine.name,
        quantity,
        price: medicine.price,
        total: quantity * medicine.price,
      }];
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicineId !== medicineId));
  }, []);

  const updateCartQuantity = useCallback((medicineId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.medicineId !== medicineId));
      return;
    }
    setCart(prev => prev.map(item =>
      item.medicineId === medicineId
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((sum, item) => sum + item.total, 0);
  }, [cart]);

  const completeSale = useCallback((paymentMethod: 'cash' | 'card' | 'insurance', discount: number, customerName?: string) => {
    if (cart.length === 0) return null;
    const total = getCartTotal() - discount;
    const sale: Sale = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      discount,
      paymentMethod,
      date: new Date().toISOString(),
      customerName,
      invoiceNumber: `INV-${String(sales.length + 1).padStart(3, '0')}`,
    };
    setSales(prev => [sale, ...prev]);
    // Update stock
    setMedicines(prev => prev.map(m => {
      const cartItem = cart.find(c => c.medicineId === m.id);
      if (cartItem) {
        return { ...m, stock: Math.max(0, m.stock - cartItem.quantity) };
      }
      return m;
    }));
    setCart([]);
    return sale;
  }, [cart, getCartTotal, sales.length]);

  const getLowStockMedicines = useCallback(() => {
    return medicines.filter(m => m.stock <= m.minStock);
  }, [medicines]);

  const getExpiringMedicines = useCallback(() => {
    const threeMonths = new Date();
    threeMonths.setMonth(threeMonths.getMonth() + 3);
    return medicines.filter(m => new Date(m.expiryDate) <= threeMonths);
  }, [medicines]);

  const getTodaySales = useCallback(() => {
    const today = new Date().toDateString();
    return sales.filter(s => new Date(s.date).toDateString() === today);
  }, [sales]);

  const getTodayRevenue = useCallback(() => {
    return getTodaySales().reduce((sum, s) => sum + s.total, 0);
  }, [getTodaySales]);

  return (
    <PharmacyContext.Provider value={{
      medicines, sales, cart,
      addMedicine, updateMedicine, deleteMedicine,
      addToCart, removeFromCart, updateCartQuantity, clearCart,
      completeSale, getCartTotal,
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
