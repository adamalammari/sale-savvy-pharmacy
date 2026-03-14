import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Search, Plus, Minus, Trash2, ShoppingCart, CreditCard, Banknote, Shield, Receipt, User } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export default function POS() {
  const { medicines, cart, addToCart, removeFromCart, updateCartQuantity, clearCart, completeSale, getCartTotal, customers } = usePharmacy();
  const [search, setSearch] = useState('');
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'insurance'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');

  const searchResults = search.length >= 1
    ? medicines.filter(m => m.name.includes(search) || m.genericName.toLowerCase().includes(search.toLowerCase()) || m.barcode.includes(search)).slice(0, 8)
    : medicines.slice(0, 12);

  const cartTotal = getCartTotal();
  const finalTotal = cartTotal - discount;

  const handleCompleteSale = () => {
    if (cart.length === 0) {
      toast.error('السلة فارغة');
      return;
    }
    const sale = completeSale(paymentMethod, discount, customerName || undefined, customerId || undefined);
    if (sale) {
      toast.success(`تم إتمام البيع بنجاح - فاتورة ${sale.invoiceNumber}`);
      setDiscount(0);
      setCustomerName('');
      setCustomerId('');
    }
  };

  const handleAddToCart = (med: typeof medicines[0]) => {
    if (med.stock <= 0) {
      toast.error('المنتج غير متوفر في المخزون');
      return;
    }
    const inCart = cart.find(c => c.medicineId === med.id);
    if (inCart && inCart.quantity >= med.stock) {
      toast.error('لا يمكن إضافة أكثر من الكمية المتوفرة');
      return;
    }
    addToCart(med, 1);
  };

  return (
    <div className="h-[calc(100vh-48px)] flex gap-4 p-4 animate-fade-in">
      {/* Products */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pr-9 h-12 text-base" placeholder="بحث عن دواء بالاسم أو الباركود..." value={search} onChange={e => setSearch(e.target.value)} autoFocus />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {searchResults.map(med => (
              <motion.div key={med.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${med.stock <= 0 ? 'opacity-50' : ''} ${med.stock <= med.minStock && med.stock > 0 ? 'border-warning/50' : ''}`}
                  onClick={() => handleAddToCart(med)}
                >
                  <CardContent className="p-3">
                    <p className="font-semibold text-sm truncate">{med.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{med.genericName}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-primary">{med.price} ر.س</span>
                      <Badge variant={med.stock <= 0 ? 'destructive' : 'secondary'} className="text-xs">{med.stock} {med.unit}</Badge>
                    </div>
                    {med.requiresPrescription && (
                      <Badge variant="outline" className="mt-1 text-xs border-warning text-warning">وصفة طبية</Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart */}
      <Card className="w-[380px] shrink-0 flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="h-5 w-5 text-primary" />
            السلة
            {cart.length > 0 && <Badge className="mr-auto">{cart.length}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 pt-0">
          {/* Items */}
          <div className="flex-1 overflow-y-auto space-y-2 mb-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.medicineId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 rounded-lg border p-2"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.medicineName}</p>
                    <p className="text-xs text-muted-foreground">{item.price} ر.س × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.medicineId, item.quantity - 1)}>
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateCartQuantity(item.medicineId, item.quantity + 1)}>
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-sm font-bold w-16 text-left">{item.total} ر.س</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeFromCart(item.medicineId)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <ShoppingCart className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">السلة فارغة</p>
              </div>
            )}
          </div>

          <Separator className="mb-4" />

          {/* Customer */}
          <Input placeholder="اسم العميل (اختياري)" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mb-3" />

          {/* Discount */}
          <div className="flex items-center gap-2 mb-3">
            <Label className="text-sm shrink-0">خصم:</Label>
            <Input type="number" min={0} value={discount || ''} onChange={e => setDiscount(+e.target.value)} className="h-9" />
            <span className="text-sm text-muted-foreground">ر.س</span>
          </div>

          {/* Payment */}
          <div className="flex gap-2 mb-4">
            {([['cash', 'نقدي', Banknote], ['card', 'بطاقة', CreditCard], ['insurance', 'تأمين', Shield]] as const).map(([method, label, Icon]) => (
              <Button
                key={method}
                variant={paymentMethod === method ? 'default' : 'outline'}
                className="flex-1 gap-1 text-xs h-9"
                onClick={() => setPaymentMethod(method)}
              >
                <Icon className="h-3.5 w-3.5" />{label}
              </Button>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-1 mb-4 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">المجموع:</span><span>{cartTotal.toLocaleString()} ر.س</span></div>
            {discount > 0 && <div className="flex justify-between text-destructive"><span>الخصم:</span><span>-{discount} ر.س</span></div>}
            <Separator />
            <div className="flex justify-between text-lg font-bold"><span>الإجمالي:</span><span className="text-primary">{finalTotal.toLocaleString()} ر.س</span></div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={clearCart} disabled={cart.length === 0}>مسح</Button>
            <Button className="flex-1 gap-2" onClick={handleCompleteSale} disabled={cart.length === 0}>
              <Receipt className="h-4 w-4" />إتمام البيع
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>;
}
