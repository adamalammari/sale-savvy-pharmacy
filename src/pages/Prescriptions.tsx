import { useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { PrescriptionItem } from '@/data/pharmacyData';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, FileText, Clock, CheckCircle, Eye, Pill } from 'lucide-react';
import { toast } from 'sonner';


export default function Prescriptions() {
  const { prescriptions, addPrescription, dispensePrescriptionItem, updatePrescriptionStatus, customers, medicines } = usePharmacy();
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);

  // Form
  const [customerName, setCustomerName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [hospitalClinic, setHospitalClinic] = useState('');
  const [insuranceCovered, setInsuranceCovered] = useState(false);
  const [rxNotes, setRxNotes] = useState('');
  const [rxItems, setRxItems] = useState<PrescriptionItem[]>([]);
  const [selMed, setSelMed] = useState('');
  const [dosage, setDosage] = useState('');
  const [duration, setDuration] = useState('');
  const [qty, setQty] = useState(0);

  const addRxItem = () => {
    const med = medicines.find(m => m.id === selMed);
    if (!med || !dosage || qty <= 0) { toast.error('أكمل بيانات الدواء'); return; }
    setRxItems(prev => [...prev, { medicineId: med.id, medicineName: med.name, dosage, duration, quantity: qty, dispensed: false }]);
    setSelMed(''); setDosage(''); setDuration(''); setQty(0);
  };

  const handleCreate = () => {
    if (!customerName || !doctorName || rxItems.length === 0) { toast.error('أكمل البيانات المطلوبة'); return; }
    addPrescription({ customerId: customerId || undefined, customerName, doctorName, hospitalClinic, date: new Date().toISOString().split('T')[0], items: rxItems, status: 'pending', notes: rxNotes, insuranceCovered });
    toast.success('تم إضافة الوصفة');
    setDialogOpen(false); setCustomerName(''); setCustomerId(''); setDoctorName(''); setHospitalClinic(''); setInsuranceCovered(false); setRxNotes(''); setRxItems([]);
  };

  const filtered = prescriptions.filter(p =>
    p.customerName.includes(search) || p.doctorName.includes(search) || p.id.includes(search)
  );

  const getStatusBadge = (status: string) => {
    const map: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      pending: { variant: 'outline', label: 'بانتظار الصرف' },
      dispensed: { variant: 'default', label: 'تم الصرف' },
      'partially-dispensed': { variant: 'secondary', label: 'صرف جزئي' },
      cancelled: { variant: 'destructive', label: 'ملغية' },
    };
    const s = map[status] || map.pending;
    return <Badge variant={s.variant}>{s.label}</Badge>;
  };

  const viewedRx = viewId ? prescriptions.find(p => p.id === viewId) : null;

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الوصفات الطبية</h1>
          <p className="text-sm text-muted-foreground">{prescriptions.length} وصفة</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />وصفة جديدة</Button></DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>إضافة وصفة طبية</DialogTitle></DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>المريض *</Label>
                  <Select value={customerId} onValueChange={v => { setCustomerId(v); const c = customers.find(c => c.id === v); if (c) setCustomerName(c.name); }}>
                    <SelectTrigger><SelectValue placeholder="اختر أو اكتب" /></SelectTrigger>
                    <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="أو اكتب الاسم" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                </div>
                <div className="space-y-2"><Label>الطبيب *</Label><Input value={doctorName} onChange={e => setDoctorName(e.target.value)} /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>المستشفى / العيادة</Label><Input value={hospitalClinic} onChange={e => setHospitalClinic(e.target.value)} /></div>
                <div className="flex items-center gap-3 pt-6"><Switch checked={insuranceCovered} onCheckedChange={setInsuranceCovered} /><Label>مغطاة بالتأمين</Label></div>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                <Label>أدوية الوصفة</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select value={selMed} onValueChange={setSelMed}>
                    <SelectTrigger><SelectValue placeholder="الدواء" /></SelectTrigger>
                    <SelectContent>{medicines.filter(m => m.requiresPrescription).map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                  </Select>
                  <Input placeholder="الجرعة" value={dosage} onChange={e => setDosage(e.target.value)} />
                  <Input placeholder="المدة" value={duration} onChange={e => setDuration(e.target.value)} />
                  <div className="flex gap-2">
                    <Input type="number" min={1} placeholder="الكمية" value={qty || ''} onChange={e => setQty(+e.target.value)} />
                    <Button variant="outline" onClick={addRxItem}>+</Button>
                  </div>
                </div>
                {rxItems.length > 0 && (
                  <div className="space-y-2">
                    {rxItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm border rounded-lg p-2">
                        <div><p className="font-medium">{item.medicineName}</p><p className="text-xs text-muted-foreground">{item.dosage} - {item.duration} - {item.quantity} وحدة</p></div>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRxItems(prev => prev.filter((_, idx) => idx !== i))}>حذف</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="space-y-2"><Label>ملاحظات</Label><Textarea value={rxNotes} onChange={e => setRxNotes(e.target.value)} /></div>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="outline">إلغاء</Button></DialogClose>
              <Button onClick={handleCreate}>حفظ الوصفة</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-warning/10 p-3"><Clock className="h-6 w-6 text-warning" /></div><div><p className="text-sm text-muted-foreground">بانتظار الصرف</p><p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'pending').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-info/10 p-3"><Pill className="h-6 w-6 text-info" /></div><div><p className="text-sm text-muted-foreground">صرف جزئي</p><p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'partially-dispensed').length}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-success/10 p-3"><CheckCircle className="h-6 w-6 text-success" /></div><div><p className="text-sm text-muted-foreground">تم الصرف</p><p className="text-2xl font-bold">{prescriptions.filter(p => p.status === 'dispensed').length}</p></div></div></CardContent></Card>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pr-9" placeholder="بحث بالمريض أو الطبيب..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">الرقم</TableHead>
                <TableHead className="text-right">المريض</TableHead>
                <TableHead className="text-right">الطبيب</TableHead>
                <TableHead className="text-right">الأدوية</TableHead>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">التأمين</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">إجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rx, i) => (
                <motion.tr key={rx.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b hover:bg-muted/50">
                  <TableCell className="font-mono text-sm">{rx.id}</TableCell>
                  <TableCell className="font-medium text-sm">{rx.customerName}</TableCell>
                  <TableCell className="text-sm">{rx.doctorName}</TableCell>
                  <TableCell><Badge variant="secondary">{rx.items.length} دواء</Badge></TableCell>
                  <TableCell className="text-sm">{new Date(rx.date).toLocaleDateString('ar-SA')}</TableCell>
                  <TableCell>{rx.insuranceCovered ? <Badge variant="outline" className="text-xs">مؤمّن</Badge> : <span className="text-xs text-muted-foreground">-</span>}</TableCell>
                  <TableCell>{getStatusBadge(rx.status)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => setViewId(rx.id)}><Eye className="h-4 w-4" /></Button>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={!!viewId} onOpenChange={() => setViewId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>تفاصيل الوصفة الطبية</DialogTitle></DialogHeader>
          {viewedRx && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-muted-foreground">المريض</p><p className="font-medium">{viewedRx.customerName}</p></div>
                <div><p className="text-muted-foreground">الطبيب</p><p className="font-medium">{viewedRx.doctorName}</p></div>
                {viewedRx.hospitalClinic && <div><p className="text-muted-foreground">المستشفى</p><p className="font-medium">{viewedRx.hospitalClinic}</p></div>}
                <div><p className="text-muted-foreground">الحالة</p>{getStatusBadge(viewedRx.status)}</div>
              </div>
              <div className="space-y-2">
                {viewedRx.items.map(item => (
                  <div key={item.medicineId} className="flex items-center justify-between border rounded-lg p-3">
                    <div>
                      <p className="text-sm font-medium">{item.medicineName}</p>
                      <p className="text-xs text-muted-foreground">{item.dosage} • {item.duration} • {item.quantity} وحدة</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.dispensed ? (
                        <Badge variant="default" className="text-xs">تم الصرف</Badge>
                      ) : (
                        <Button size="sm" className="text-xs" onClick={() => { dispensePrescriptionItem(viewedRx.id, item.medicineId); toast.success(`تم صرف ${item.medicineName}`); }}>صرف</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {viewedRx.notes && <p className="text-sm bg-muted p-3 rounded-lg">{viewedRx.notes}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
