import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { PurchaseOrderItem } from '@/data/pharmacyData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Package, Clock, CheckCircle, XCircle, Truck, Eye } from 'lucide-react';
import { toast } from 'sonner';


export default function PurchaseOrders() {
  const { purchaseOrders, addPurchaseOrder, updatePurchaseOrderStatus, suppliers, medicines } = usePharmacy();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [orderItems, setOrderItems] = useState<PurchaseOrderItem[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [itemQty, setItemQty] = useState(0);
  const [notes, setNotes] = useState('');
  const [viewOrder, setViewOrder] = useState<string | null>(null);

  const addOrderItem = () => {
    const med = medicines.find(m => m.id === selectedMedicine);
    if (!med || itemQty <= 0) { toast.error('اختر دواء وكمية صحيحة'); return; }
    if (orderItems.find(i => i.medicineId === med.id)) { toast.error('الدواء مضاف مسبقاً'); return; }
    setOrderItems(prev => [...prev, { medicineId: med.id, medicineName: med.name, quantity: itemQty, unitCost: med.costPrice, total: itemQty * med.costPrice }]);
    setSelectedMedicine(''); setItemQty(0);
  };

  const handleCreateOrder = () => {
    if (!selectedSupplier || orderItems.length === 0) { toast.error('اختر مورد وأضف منتجات'); return; }
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    if (!supplier) return;
    addPurchaseOrder({
      supplierId: selectedSupplier, supplierName: supplier.name,
      items: orderItems, total: orderItems.reduce((s, i) => s + i.total, 0),
      status: 'pending', orderDate: new Date().toISOString().split('T')[0], notes,
    });
    toast.success('تم إنشاء طلب الشراء');
    setDialogOpen(false); setSelectedSupplier(''); setOrderItems([]); setNotes('');
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'بانتظار الموافقة' },
      ordered: { variant: 'secondary', label: 'تم الطلب' },
      received: { variant: 'default', label: 'تم الاستلام' },
      cancelled: { variant: 'destructive', label: 'ملغي' },
    };
    const s = map[status] || map.pending;
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const viewedOrder = viewOrder ? purchaseOrders.find(o => o.id === viewOrder) : null;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">طلبات الشراء</h1>
          <p className="text-sm text-muted-foreground">{purchaseOrders.length} طلب</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />طلب شراء جديد</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>إنشاء طلب شراء</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>المورد *</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger><SelectValue placeholder="اختر المورد" /></SelectTrigger>
                  <SelectContent>{suppliers.filter(s => s.status === 'active').map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="border rounded-lg p-4 space-y-3">
                <Label>إضافة منتج</Label>
                <div className="flex gap-2">
                  <Select value={selectedMedicine} onValueChange={setSelectedMedicine}>
                    <SelectTrigger className="flex-1"><SelectValue placeholder="اختر الدواء" /></SelectTrigger>
                    <SelectContent>{medicines.map(m => <SelectItem key={m.id} value={m.id}>{m.name} (المخزون: {m.stock})</SelectItem>)}</SelectContent>
                  </Select>
                  <Input type="number" min={1} placeholder="الكمية" value={itemQty || ''} onChange={e => setItemQty(+e.target.value)} className="w-28" />
                  <Button variant="outline" onClick={addOrderItem}>إضافة</Button>
                </div>
                {orderItems.length > 0 && (
                  <Table>
                    <TableHeader><TableRow><TableHead className="text-right">الدواء</TableHead><TableHead className="text-right">الكمية</TableHead><TableHead className="text-right">التكلفة</TableHead><TableHead className="text-right">الإجمالي</TableHead><TableHead></TableHead></TableRow></TableHeader>
                    <TableBody>
                      {orderItems.map(item => (
                        <TableRow key={item.medicineId}>
                          <TableCell className="text-sm">{item.medicineName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unitCost} ر.س</TableCell>
                          <TableCell className="font-bold">{item.total} ر.س</TableCell>
                          <TableCell><Button variant="ghost" size="icon" className="text-destructive h-7 w-7" onClick={() => setOrderItems(prev => prev.filter(i => i.medicineId !== item.medicineId))}>✕</Button></TableCell>
                        </TableRow>
                      ))}
                      <TableRow><TableCell colSpan={3} className="font-bold">الإجمالي</TableCell><TableCell className="font-bold text-primary">{orderItems.reduce((s, i) => s + i.total, 0).toLocaleString()} ر.س</TableCell><TableCell /></TableRow>
                    </TableBody>
                  </Table>
                )}
              </div>
              <div className="space-y-2"><Label>ملاحظات</Label><Input value={notes} onChange={e => setNotes(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
              <Button onClick={handleCreateOrder}>إنشاء الطلب</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-warning/10 p-3"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-xs text-muted-foreground">بانتظار الموافقة</p><p className="text-xl font-bold">{purchaseOrders.filter(o => o.status === 'pending').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-info/10 p-3"><Truck className="h-5 w-5 text-info" /></div><div><p className="text-xs text-muted-foreground">تم الطلب</p><p className="text-xl font-bold">{purchaseOrders.filter(o => o.status === 'ordered').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-success/10 p-3"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-xs text-muted-foreground">تم الاستلام</p><p className="text-xl font-bold">{purchaseOrders.filter(o => o.status === 'received').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-destructive/10 p-3"><XCircle className="h-5 w-5 text-destructive" /></div><div><p className="text-xs text-muted-foreground">ملغي</p><p className="text-xl font-bold">{purchaseOrders.filter(o => o.status === 'cancelled').length}</p></div></div></CardContent></Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">رقم الطلب</TableHead>
                <TableHead className="text-right">المورد</TableHead>
                <TableHead className="text-right">المنتجات</TableHead>
                <TableHead className="text-right">الإجمالي</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                  <TableCell className="font-medium font-mono">{order.id.toUpperCase()}</TableCell>
                  <TableCell className="text-sm">{order.supplierName}</TableCell>
                  <TableCell><Badge variant="secondary">{order.items.length} منتج</Badge></TableCell>
                  <TableCell className="font-bold">{order.total.toLocaleString()} ر.س</TableCell>
                  <TableCell className="text-sm">{new Date(order.orderDate).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewOrder(order.id)}><Eye className="h-4 w-4" /></Button>
                      {order.status === 'pending' && (
                        <>
                          <Button variant="ghost" size="sm" className="text-xs" onClick={() => { updatePurchaseOrderStatus(order.id, 'ordered'); toast.success('تم تأكيد الطلب'); }}>تأكيد</Button>
                          <Button variant="ghost" size="sm" className="text-xs text-destructive" onClick={() => { updatePurchaseOrderStatus(order.id, 'cancelled'); toast.success('تم إلغاء الطلب'); }}>إلغاء</Button>
                        </>
                      )}
                      {order.status === 'ordered' && (
                        <Button variant="ghost" size="sm" className="text-xs text-success" onClick={() => { updatePurchaseOrderStatus(order.id, 'received'); toast.success('تم استلام الطلب وتحديث المخزون'); }}>استلام</Button>
                      )}
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Order Dialog */}
      <Dialog open={!!viewOrder} onOpenChange={() => setViewOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>تفاصيل طلب الشراء</DialogTitle></DialogHeader>
          {viewedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">المورد</p><p className="font-medium">{viewedOrder.supplierName}</p></div>
                <div><p className="text-muted-foreground">الحالة</p>{getStatusBadge(viewedOrder.status)}</div>
                <div><p className="text-muted-foreground">تاريخ الطلب</p><p className="font-medium">{new Date(viewedOrder.orderDate).toLocaleDateString('ar-SA')}</p></div>
                {viewedOrder.expectedDelivery && <div><p className="text-muted-foreground">التسليم المتوقع</p><p className="font-medium">{new Date(viewedOrder.expectedDelivery).toLocaleDateString('ar-SA')}</p></div>}
              </div>
              <Table>
                <TableHeader><TableRow><TableHead className="text-right">الدواء</TableHead><TableHead className="text-right">الكمية</TableHead><TableHead className="text-right">التكلفة</TableHead><TableHead className="text-right">الإجمالي</TableHead></TableRow></TableHeader>
                <TableBody>
                  {viewedOrder.items.map(item => (
                    <TableRow key={item.medicineId}><TableCell>{item.medicineName}</TableCell><TableCell>{item.quantity}</TableCell><TableCell>{item.unitCost} ر.س</TableCell><TableCell className="font-bold">{item.total} ر.س</TableCell></TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="text-left font-bold text-lg text-primary">الإجمالي: {viewedOrder.total.toLocaleString()} ر.س</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
