import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { Supplier } from '@/data/pharmacyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit2, Trash2, Truck, Star, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner';


const emptySupplier: {
  name: string; contactPerson: string; phone: string; email: string; address: string;
  totalOrders: number; totalAmount: number; rating: number; status: 'active' | 'inactive';
} = {
  name: '', contactPerson: '', phone: '', email: '', address: '',
  totalOrders: 0, totalAmount: 0, rating: 3, status: 'active',
};

export default function Suppliers() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = usePharmacy();
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState(emptySupplier);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewSupplier, setViewSupplier] = useState<Supplier | null>(null);

  const filtered = suppliers.filter(s =>
    s.name.includes(search) || s.contactPerson.includes(search) || s.phone.includes(search)
  );

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      toast.error('يرجى ملء الحقول المطلوبة'); return;
    }
    if (editingId) {
      updateSupplier(editingId, formData);
      toast.success('تم تحديث المورد');
    } else {
      addSupplier(formData);
      toast.success('تم إضافة المورد');
    }
    setFormData(emptySupplier); setEditingId(null); setDialogOpen(false);
  };

  const handleEdit = (s: Supplier) => {
    setEditingId(s.id);
    setFormData({ name: s.name, contactPerson: s.contactPerson, phone: s.phone, email: s.email, address: s.address, totalOrders: s.totalOrders, totalAmount: s.totalAmount, rating: s.rating, status: s.status });
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الموردين</h1>
          <p className="text-sm text-muted-foreground">{suppliers.length} مورد مسجل</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setFormData(emptySupplier); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />إضافة مورد</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل مورد' : 'إضافة مورد جديد'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2"><Label>اسم الشركة *</Label><Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>الشخص المسؤول</Label><Input value={formData.contactPerson} onChange={e => setFormData(p => ({ ...p, contactPerson: e.target.value }))} /></div>
                <div className="space-y-2"><Label>رقم الهاتف *</Label><Input value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} /></div>
              </div>
              <div className="space-y-2"><Label>البريد الإلكتروني</Label><Input type="email" value={formData.email} onChange={e => setFormData(p => ({ ...p, email: e.target.value }))} /></div>
              <div className="space-y-2"><Label>العنوان</Label><Input value={formData.address} onChange={e => setFormData(p => ({ ...p, address: e.target.value }))} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>التقييم</Label>
                  <Select value={String(formData.rating)} onValueChange={v => setFormData(p => ({ ...p, rating: +v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{[1,2,3,4,5].map(r => <SelectItem key={r} value={String(r)}>{'⭐'.repeat(r)}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>الحالة</Label>
                  <Select value={formData.status} onValueChange={v => setFormData(p => ({ ...p, status: v as 'active' | 'inactive' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشط</SelectItem>
                      <SelectItem value="inactive">غير نشط</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
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
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-3"><Truck className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">إجمالي الموردين</p><p className="text-2xl font-bold">{suppliers.length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-success/10 p-3"><Star className="h-6 w-6 text-success" /></div><div><p className="text-sm text-muted-foreground">النشطون</p><p className="text-2xl font-bold">{suppliers.filter(s => s.status === 'active').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-info/10 p-3"><Truck className="h-6 w-6 text-info" /></div><div><p className="text-sm text-muted-foreground">إجمالي المشتريات</p><p className="text-2xl font-bold">{suppliers.reduce((s, sup) => s + sup.totalAmount, 0).toLocaleString()} ر.س</p></div></div></CardContent></Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pr-9" placeholder="بحث عن مورد..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[140px]">المورد</TableHead>
                  <TableHead className="text-right min-w-[100px]">المسؤول</TableHead>
                  <TableHead className="text-right min-w-[100px]">الهاتف</TableHead>
                  <TableHead className="text-right min-w-[80px]">الطلبات</TableHead>
                  <TableHead className="text-right min-w-[80px]">التقييم</TableHead>
                  <TableHead className="text-right min-w-[70px]">الحالة</TableHead>
                  <TableHead className="text-right min-w-[80px]">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[140px]">{s.address}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{s.contactPerson}</TableCell>
                    <TableCell className="text-sm font-mono whitespace-nowrap">{s.phone}</TableCell>
                    <TableCell><Badge variant="secondary">{s.totalOrders} طلب</Badge></TableCell>
                    <TableCell><span className="text-sm">{'⭐'.repeat(s.rating)}</span></TableCell>
                    <TableCell><Badge variant={s.status === 'active' ? 'default' : 'secondary'}>{s.status === 'active' ? 'نشط' : 'غير نشط'}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(s)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { deleteSupplier(s.id); toast.success('تم حذف المورد'); }}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!viewSupplier} onOpenChange={() => setViewSupplier(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>تفاصيل المورد</DialogTitle></DialogHeader>
          {viewSupplier && (
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /><span>{viewSupplier.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /><span>{viewSupplier.email}</span></div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /><span>{viewSupplier.address}</span></div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
