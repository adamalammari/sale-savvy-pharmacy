import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { ReturnItemDetail } from '@/data/pharmacyData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, RotateCcw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';


export default function Returns() {
  const { returns, addReturn, updateReturnStatus, sales } = usePharmacy();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState('');
  const [reason, setReason] = useState('');
  const [returnItems, setReturnItems] = useState<ReturnItemDetail[]>([]);

  const selectedSaleData = sales.find(s => s.id === selectedSale);

  const toggleReturnItem = (medicineId: string) => {
    if (!selectedSaleData) return;
    const existing = returnItems.find(i => i.medicineId === medicineId);
    if (existing) {
      setReturnItems(prev => prev.filter(i => i.medicineId !== medicineId));
    } else {
      const saleItem = selectedSaleData.items.find(i => i.medicineId === medicineId);
      if (saleItem) {
        setReturnItems(prev => [...prev, { medicineId: saleItem.medicineId, medicineName: saleItem.medicineName, quantity: saleItem.quantity, price: saleItem.price, total: saleItem.total }]);
      }
    }
  };

  const handleCreate = () => {
    if (!selectedSale || returnItems.length === 0 || !reason) { toast.error('أكمل البيانات المطلوبة'); return; }
    const sale = sales.find(s => s.id === selectedSale);
    if (!sale) return;
    addReturn({
      saleId: selectedSale, invoiceNumber: sale.invoiceNumber, date: new Date().toISOString().split('T')[0],
      items: returnItems, reason, totalRefund: returnItems.reduce((s, i) => s + i.total, 0), status: 'pending',
    });
    toast.success('تم تسجيل المرتجع');
    setDialogOpen(false); setSelectedSale(''); setReturnItems([]); setReason('');
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'بانتظار المراجعة' },
      approved: { variant: 'default', label: 'تمت الموافقة' },
      rejected: { variant: 'destructive', label: 'مرفوض' },
    };
    const s = map[status] || map.pending;
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">المرتجعات</h1>
          <p className="text-sm text-muted-foreground">{returns.length} عملية إرجاع</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />تسجيل مرتجع</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>تسجيل مرتجع جديد</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>اختر الفاتورة *</Label>
                <Select value={selectedSale} onValueChange={v => { setSelectedSale(v); setReturnItems([]); }}>
                  <SelectTrigger><SelectValue placeholder="رقم الفاتورة" /></SelectTrigger>
                  <SelectContent>{sales.filter(s => s.status === 'completed').map(s => <SelectItem key={s.id} value={s.id}>{s.invoiceNumber} - {s.total} ر.س</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {selectedSaleData && (
                <div className="border rounded-lg p-3 space-y-2">
                  <Label>اختر المنتجات للإرجاع</Label>
                  {selectedSaleData.items.map(item => (
                    <div key={item.medicineId} className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${returnItems.find(i => i.medicineId === item.medicineId) ? 'border-primary bg-primary/5' : ''}`} onClick={() => toggleReturnItem(item.medicineId)}>
                      <div><p className="text-sm font-medium">{item.medicineName}</p><p className="text-xs text-muted-foreground">{item.quantity} × {item.price} ر.س</p></div>
                      <span className="text-sm font-bold">{item.total} ر.س</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="space-y-2"><Label>سبب الإرجاع *</Label><Textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="منتج تالف، خطأ في الصرف..." /></div>
              {returnItems.length > 0 && (
                <div className="text-left font-bold text-primary">إجمالي المبلغ المسترد: {returnItems.reduce((s, i) => s + i.total, 0)} ر.س</div>
              )}
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
              <Button onClick={handleCreate}>تسجيل المرتجع</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-warning/10 p-3"><Clock className="h-5 w-5 text-warning" /></div><div><p className="text-sm text-muted-foreground">بانتظار المراجعة</p><p className="text-2xl font-bold">{returns.filter(r => r.status === 'pending').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-success/10 p-3"><CheckCircle className="h-5 w-5 text-success" /></div><div><p className="text-sm text-muted-foreground">تمت الموافقة</p><p className="text-2xl font-bold">{returns.filter(r => r.status === 'approved').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-destructive/10 p-3"><RotateCcw className="h-5 w-5 text-destructive" /></div><div><p className="text-sm text-muted-foreground">إجمالي المبالغ المستردة</p><p className="text-2xl font-bold">{returns.filter(r => r.status === 'approved').reduce((s, r) => s + r.totalRefund, 0).toLocaleString()} ر.س</p></div></div></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[90px]">الفاتورة</TableHead>
                  <TableHead className="text-right min-w-[90px]">التاريخ</TableHead>
                  <TableHead className="text-right min-w-[80px]">المنتجات</TableHead>
                  <TableHead className="text-right min-w-[120px]">السبب</TableHead>
                  <TableHead className="text-right min-w-[80px]">المبلغ</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[100px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((r) => (
                  <TableRow key={r.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium whitespace-nowrap">{r.invoiceNumber}</TableCell>
                    <TableCell className="text-sm whitespace-nowrap">{new Date(r.date).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell><Badge variant="secondary">{r.items.length} منتج</Badge></TableCell>
                    <TableCell className="text-sm max-w-[150px] truncate">{r.reason}</TableCell>
                    <TableCell className="font-bold whitespace-nowrap">{r.totalRefund} ر.س</TableCell>
                    <TableCell>{getStatusBadge(r.status)}</TableCell>
                    <TableCell>
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-success" onClick={() => { updateReturnStatus(r.id, 'approved'); toast.success('تمت الموافقة وتحديث المخزون'); }}>موافقة</Button>
                          <Button variant="ghost" size="sm" className="text-xs h-8 px-2 text-destructive" onClick={() => { updateReturnStatus(r.id, 'rejected'); toast.success('تم رفض المرتجع'); }}>رفض</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {returns.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">لا توجد مرتجعات</TableCell></TableRow>}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
