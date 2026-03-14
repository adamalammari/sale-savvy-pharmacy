import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { Medicine, categories, suppliers } from '@/data/pharmacyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit2, Trash2, Package, AlertTriangle, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const emptyMedicine = {
  name: '', genericName: '', category: categories[0], price: 0, costPrice: 0,
  stock: 0, minStock: 10, expiryDate: '', supplier: suppliers[0], barcode: '', unit: 'علبة', requiresPrescription: false,
};

export default function Inventory() {
  const { medicines, addMedicine, updateMedicine, deleteMedicine } = usePharmacy();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  const [formData, setFormData] = useState(emptyMedicine);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filtered = medicines.filter(m => {
    const matchSearch = m.name.includes(search) || m.genericName.toLowerCase().includes(search.toLowerCase()) || m.barcode.includes(search);
    const matchCategory = categoryFilter === 'all' || m.category === categoryFilter;
    const matchStock = stockFilter === 'all' || (stockFilter === 'low' && m.stock <= m.minStock) || (stockFilter === 'ok' && m.stock > m.minStock);
    return matchSearch && matchCategory && matchStock;
  });

  const handleSave = () => {
    if (!formData.name || !formData.price) {
      toast.error('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    if (editingId) {
      updateMedicine(editingId, formData);
      toast.success('تم تحديث الدواء بنجاح');
    } else {
      addMedicine(formData);
      toast.success('تم إضافة الدواء بنجاح');
    }
    setFormData(emptyMedicine);
    setEditingId(null);
    setDialogOpen(false);
  };

  const handleEdit = (med: Medicine) => {
    setEditingId(med.id);
    setFormData({ name: med.name, genericName: med.genericName, category: med.category, price: med.price, costPrice: med.costPrice, stock: med.stock, minStock: med.minStock, expiryDate: med.expiryDate, supplier: med.supplier, barcode: med.barcode, unit: med.unit, requiresPrescription: med.requiresPrescription });
    setDialogOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    deleteMedicine(id);
    toast.success(`تم حذف "${name}"`);
  };

  const getStockBadge = (med: Medicine) => {
    if (med.stock === 0) return <Badge variant="destructive">نفذ</Badge>;
    if (med.stock <= med.minStock) return <Badge variant="destructive" className="bg-warning text-warning-foreground">منخفض</Badge>;
    return <Badge variant="secondary" className="bg-success/10 text-success">متوفر</Badge>;
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المخزون</h1>
          <p className="text-sm text-muted-foreground">{medicines.length} دواء • {medicines.reduce((s, m) => s + m.stock, 0).toLocaleString()} وحدة</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) { setEditingId(null); setFormData(emptyMedicine); } }}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />إضافة دواء</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'تعديل دواء' : 'إضافة دواء جديد'}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>اسم الدواء *</Label>
                <Input value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الاسم العلمي</Label>
                <Input value={formData.genericName} onChange={e => setFormData(p => ({ ...p, genericName: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المورد</Label>
                <Select value={formData.supplier} onValueChange={v => setFormData(p => ({ ...p, supplier: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{suppliers.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>سعر البيع *</Label>
                <Input type="number" value={formData.price || ''} onChange={e => setFormData(p => ({ ...p, price: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>سعر التكلفة</Label>
                <Input type="number" value={formData.costPrice || ''} onChange={e => setFormData(p => ({ ...p, costPrice: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الكمية</Label>
                <Input type="number" value={formData.stock || ''} onChange={e => setFormData(p => ({ ...p, stock: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الحد الأدنى</Label>
                <Input type="number" value={formData.minStock || ''} onChange={e => setFormData(p => ({ ...p, minStock: +e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الانتهاء</Label>
                <Input type="date" value={formData.expiryDate} onChange={e => setFormData(p => ({ ...p, expiryDate: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الباركود</Label>
                <Input value={formData.barcode} onChange={e => setFormData(p => ({ ...p, barcode: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>الوحدة</Label>
                <Input value={formData.unit} onChange={e => setFormData(p => ({ ...p, unit: e.target.value }))} />
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch checked={formData.requiresPrescription} onCheckedChange={v => setFormData(p => ({ ...p, requiresPrescription: v }))} />
                <Label>يتطلب وصفة طبية</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
              <Button onClick={handleSave}>{editingId ? 'تحديث' : 'إضافة'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pr-9" placeholder="بحث بالاسم أو الباركود..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 ml-2" /><SelectValue placeholder="الفئة" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">كل الفئات</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="المخزون" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="low">منخفض</SelectItem>
                <SelectItem value="ok">متوفر</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الدواء</TableHead>
                  <TableHead className="text-right">الفئة</TableHead>
                  <TableHead className="text-right">السعر</TableHead>
                  <TableHead className="text-right">المخزون</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right">إجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((med, i) => (
                  <motion.tr key={med.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{med.name}</p>
                        <p className="text-xs text-muted-foreground">{med.genericName}</p>
                      </div>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{med.category}</Badge></TableCell>
                    <TableCell className="font-medium">{med.price} ر.س</TableCell>
                    <TableCell>{med.stock} {med.unit}</TableCell>
                    <TableCell>{getStockBadge(med)}</TableCell>
                    <TableCell className="text-sm">{new Date(med.expiryDate).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(med)}><Edit2 className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(med.id, med.name)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <Package className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
