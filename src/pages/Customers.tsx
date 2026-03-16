import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { Customer } from '@/data/pharmacyData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit2, Trash2, Users, Heart, ShieldCheck, Eye } from 'lucide-react';
import { toast } from 'sonner';


const emptyCustomer = {
  name: '', phone: '', email: '', address: '', insuranceProvider: '', insuranceNumber: '',
  allergies: [] as string[], chronicConditions: [] as string[],
  totalPurchases: 0, totalSpent: 0, lastVisit: new Date().toISOString().split('T')[0], notes: '',
};

export default function Customers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = usePharmacy();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(emptyCustomer);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [allergiesText, setAllergiesText] = useState('');
  const [conditionsText, setConditionsText] = useState('');

  const filtered = customers.filter(c =>
    c.name.includes(search) || c.phone.includes(search) || (c.insuranceNumber || '').includes(search)
  );

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast.error('يرجى ملء الحقول المطلوبة'); return;
    }
    const data = {
      ...formData,
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      chronicConditions: conditionsText.split(',').map(s => s.trim()).filter(Boolean),
    };
    if (editingId) {
      updateCustomer(editingId, data);
      toast.success('تم تحديث بيانات العميل');
    } else {
      addCustomer(data);
      toast.success('تم إضافة العميل');
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData(emptyCustomer); setEditingId(null); setDialogOpen(false);
    setAllergiesText(''); setConditionsText('');
  };

  const handleEdit = (c: Customer) => {
    setEditingId(c.id);
    setFormData({ name: c.name, phone: c.phone, email: c.email || '', address: c.address || '', insuranceProvider: c.insuranceProvider || '', insuranceNumber: c.insuranceNumber || '', allergies: c.allergies, chronicConditions: c.chronicConditions, totalPurchases: c.totalPurchases, totalSpent: c.totalSpent, lastVisit: c.lastVisit, notes: c.notes || '' });
    setAllergiesText(c.allergies.join(', '));
    setConditionsText(c.chronicConditions.join(', '));
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة العملاء</h1>
          <p className="text-sm text-muted-foreground">{customers.length} عميل مسجل</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />إضافة عميل</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? 'تعديل عميل' : 'إضافة عميل جديد'}</DialogTitle></DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2"><Label>الاسم *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="space-y-2"><Label>الهاتف *</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} /></div>
              <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>العنوان</Label><Input value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="space-y-2"><Label>شركة التأمين</Label><Input value={formData.insuranceProvider} onChange={e => setFormData(p => ({ ...p, insuranceProvider: e.target.value }))} /></div>
              <div className="space-y-2"><Label>رقم التأمين</Label><Input value={formData.insuranceNumber} onChange={e => setFormData(p => ({ ...p, insuranceNumber: e.target.value }))} /></div>
              <div className="space-y-2 md:col-span-2"><Label>الحساسية (مفصولة بفاصلة)</Label><Input value={allergiesText} onChange={e => setAllergiesText(e.target.value)} placeholder="بنسلين, أسبرين..." /></div>
              <div className="space-y-2 md:col-span-2"><Label>الأمراض المزمنة (مفصولة بفاصلة)</Label><Input value={conditionsText} onChange={e => setConditionsText(e.target.value)} placeholder="سكري, ضغط..." /></div>
              <div className="space-y-2 md:col-span-2"><Label>ملاحظات</Label><Textarea value={formData.notes} onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))} /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
              <Button onClick={handleSave}>{editingId ? 'تحديث' : 'إضافة'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-3"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">إجمالي العملاء</p><p className="text-2xl font-bold">{customers.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-info/10 p-3"><ShieldCheck className="h-6 w-6 text-info" /></div><div><p className="text-sm text-muted-foreground">مؤمَّنون</p><p className="text-2xl font-bold">{customers.filter(c => c.insuranceProvider).length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-warning/10 p-3"><Heart className="h-6 w-6 text-warning" /></div><div><p className="text-sm text-muted-foreground">لديهم حساسية</p><p className="text-2xl font-bold">{customers.filter(c => c.allergies.length > 0).length}</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pr-9" placeholder="بحث بالاسم أو الهاتف أو رقم التأمين..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">العميل</TableHead>
                <TableHead className="text-right">الهاتف</TableHead>
                <TableHead className="text-right">التأمين</TableHead>
                <TableHead className="text-right">الحساسية</TableHead>
                <TableHead className="text-right">المشتريات</TableHead>
                <TableHead className="text-right">آخر زيارة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((c, i) => (
                <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                  <TableCell><p className="font-medium text-sm">{c.name}</p></TableCell>
                  <TableCell className="text-sm font-mono">{c.phone}</TableCell>
                  <TableCell>{c.insuranceProvider ? <Badge variant="outline" className="text-xs">{c.insuranceProvider}</Badge> : <span className="text-xs text-muted-foreground">-</span>}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {c.allergies.length > 0 ? c.allergies.map(a => <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>) : <span className="text-xs text-muted-foreground">لا يوجد</span>}
                    </div>
                  </TableCell>
                  <TableCell><span className="text-sm font-medium">{c.totalSpent.toLocaleString()} ر.س</span></TableCell>
                  <TableCell className="text-sm">{new Date(c.lastVisit).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => setViewCustomer(c)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(c)}><Edit2 className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="text-destructive" onClick={() => { deleteCustomer(c.id); toast.success('تم حذف العميل'); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewCustomer} onOpenChange={() => setViewCustomer(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>ملف العميل</DialogTitle></DialogHeader>
          {viewCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-muted-foreground">الاسم</p><p className="font-medium">{viewCustomer.name}</p></div>
                <div><p className="text-muted-foreground">الهاتف</p><p className="font-medium font-mono">{viewCustomer.phone}</p></div>
                {viewCustomer.insuranceProvider && <div><p className="text-muted-foreground">التأمين</p><p className="font-medium">{viewCustomer.insuranceProvider} - {viewCustomer.insuranceNumber}</p></div>}
                <div><p className="text-muted-foreground">إجمالي المشتريات</p><p className="font-medium">{viewCustomer.totalPurchases} عملية</p></div>
                <div><p className="text-muted-foreground">إجمالي الإنفاق</p><p className="font-medium">{viewCustomer.totalSpent.toLocaleString()} ر.س</p></div>
              </div>
              {viewCustomer.allergies.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الحساسية</p>
                  <div className="flex gap-1 flex-wrap">{viewCustomer.allergies.map(a => <Badge key={a} variant="destructive">{a}</Badge>)}</div>
                </div>
              )}
              {viewCustomer.chronicConditions.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">الأمراض المزمنة</p>
                  <div className="flex gap-1 flex-wrap">{viewCustomer.chronicConditions.map(c => <Badge key={c} variant="outline">{c}</Badge>)}</div>
                </div>
              )}
              {viewCustomer.notes && <div><p className="text-sm text-muted-foreground mb-1">ملاحظات</p><p className="text-sm bg-muted p-3 rounded-lg">{viewCustomer.notes}</p></div>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
