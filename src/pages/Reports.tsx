import { useRef, useState } from 'react';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { useSettings } from '@/contexts/SettingsContext';
import { monthlySalesData, categorySalesData } from '@/data/pharmacyData';
import { InvoicePrint } from '@/components/pharmacy/InvoicePrint';
import { printElement, exportElementToPDF } from '@/lib/pdfExport';
import { Sale } from '@/data/pharmacyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from 'recharts';
import { FileBarChart, TrendingUp, Package, DollarSign, AlertTriangle, Calendar, Printer, FileDown, Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function Reports() {
  const { medicines, sales, getLowStockMedicines, getExpiringMedicines } = usePharmacy();
  const { settings } = useSettings();
  const reportRef = useRef<HTMLDivElement>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const totalRevenue = sales.reduce((s, sale) => s + sale.total, 0);
  const totalCost = sales.reduce((s, sale) => s + sale.items.reduce((sum, item) => {
    const med = medicines.find(m => m.id === item.medicineId);
    return sum + (med ? med.costPrice * item.quantity : 0);
  }, 0), 0);
  const totalProfit = totalRevenue - totalCost;

  const paymentBreakdown = [
    { name: 'نقدي', value: sales.filter(s => s.paymentMethod === 'cash').length, fill: 'hsl(var(--chart-1))' },
    { name: 'بطاقة', value: sales.filter(s => s.paymentMethod === 'card').length, fill: 'hsl(var(--chart-2))' },
    { name: 'تأمين', value: sales.filter(s => s.paymentMethod === 'insurance').length, fill: 'hsl(var(--chart-3))' },
  ];

  const topSelling = medicines
    .map(m => {
      const qty = sales.reduce((s, sale) => s + sale.items.filter(i => i.medicineId === m.id).reduce((q, i) => q + i.quantity, 0), 0);
      return { ...m, soldQty: qty };
    })
    .filter(m => m.soldQty > 0)
    .sort((a, b) => b.soldQty - a.soldQty)
    .slice(0, 10);

  const lowStock = getLowStockMedicines();
  const expiring = getExpiringMedicines();

  const handleExportReport = async () => {
    if (reportRef.current) {
      await exportElementToPDF(reportRef.current, `تقرير-${new Date().toLocaleDateString('ar-SA')}.pdf`);
      toast.success('تم تصدير التقرير بصيغة PDF');
    }
  };

  const handleViewInvoice = (sale: Sale) => {
    setSelectedSale(sale);
    setShowInvoice(true);
  };

  const handlePrintInvoice = () => {
    if (invoiceRef.current) printElement(invoiceRef.current);
  };

  const handleExportInvoicePDF = async () => {
    if (invoiceRef.current && selectedSale) {
      await exportElementToPDF(invoiceRef.current, `فاتورة-${selectedSale.invoiceNumber}.pdf`);
      toast.success('تم تصدير الفاتورة');
    }
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التقارير</h1>
          <p className="text-sm text-muted-foreground">تقارير مفصلة عن أداء الصيدلية</p>
        </div>
        <Button className="gap-2" onClick={handleExportReport}>
          <FileDown className="h-4 w-4" />تصدير التقرير PDF
        </Button>
      </div>

      <div ref={reportRef}>
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full max-w-lg grid-cols-4">
            <TabsTrigger value="sales">المبيعات</TabsTrigger>
            <TabsTrigger value="inventory">المخزون</TabsTrigger>
            <TabsTrigger value="profit">الأرباح</TabsTrigger>
            <TabsTrigger value="expiry">الصلاحية</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-primary/10 p-3"><DollarSign className="h-6 w-6 text-primary" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                      <p className="text-2xl font-bold">{totalRevenue.toLocaleString()} {settings.currency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-success/10 p-3"><TrendingUp className="h-6 w-6 text-success" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">صافي الأرباح</p>
                      <p className="text-2xl font-bold">{totalProfit.toLocaleString()} {settings.currency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-info/10 p-3"><FileBarChart className="h-6 w-6 text-info" /></div>
                    <div>
                      <p className="text-sm text-muted-foreground">عدد الفواتير</p>
                      <p className="text-2xl font-bold">{sales.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">المبيعات الشهرية</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                      <Bar dataKey="sales" name="المبيعات" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base">طرق الدفع</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={paymentBreakdown} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                        {paymentBreakdown.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader><CardTitle className="text-base">سجل الفواتير</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">رقم الفاتورة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">العميل</TableHead>
                      <TableHead className="text-right">المنتجات</TableHead>
                      <TableHead className="text-right">الدفع</TableHead>
                      <TableHead className="text-right">الإجمالي</TableHead>
                      <TableHead className="text-right">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sales.map(sale => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{sale.invoiceNumber}</TableCell>
                        <TableCell>{new Date(sale.date).toLocaleDateString('ar-SA')}</TableCell>
                        <TableCell>{sale.customerName || '-'}</TableCell>
                        <TableCell>{sale.items.length}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'تأمين'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold">{sale.total} {settings.currency}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewInvoice(sale)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader><CardTitle className="text-base">المبيعات حسب الفئة</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={50} outerRadius={100} dataKey="value" label>
                        {categorySalesData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="text-base flex items-center gap-2"><Package className="h-5 w-5 text-primary" />الأكثر مبيعاً</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topSelling.map((med, i) => (
                      <div key={med.id} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-muted-foreground w-6">{i + 1}</span>
                        <div className="flex-1"><p className="text-sm font-medium">{med.name}</p><p className="text-xs text-muted-foreground">{med.category}</p></div>
                        <Badge variant="secondary">{med.soldQty} مباع</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />أدوية تحتاج إعادة طلب ({lowStock.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-right">الدواء</TableHead><TableHead className="text-right">المخزون</TableHead><TableHead className="text-right">الحد الأدنى</TableHead><TableHead className="text-right">المورد</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {lowStock.map(med => (
                      <TableRow key={med.id}><TableCell className="font-medium">{med.name}</TableCell><TableCell><Badge variant="destructive">{med.stock}</Badge></TableCell><TableCell>{med.minStock}</TableCell><TableCell className="text-sm">{med.supplier}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profit" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base">الأرباح الشهرية</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: '8px' }} />
                    <Legend />
                    <Line type="monotone" dataKey="sales" name="المبيعات" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="profit" name="الأرباح" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                  <div><p className="text-sm text-muted-foreground">متوسط قيمة الفاتورة</p><p className="text-3xl font-bold text-primary">{sales.length > 0 ? Math.round(totalRevenue / sales.length) : 0} {settings.currency}</p></div>
                  <div><p className="text-sm text-muted-foreground">هامش الربح</p><p className="text-3xl font-bold text-success">{totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0}%</p></div>
                  <div><p className="text-sm text-muted-foreground">إجمالي الخصومات</p><p className="text-3xl font-bold text-warning">{sales.reduce((s, sale) => s + sale.discount, 0)} {settings.currency}</p></div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expiry" className="space-y-6">
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Calendar className="h-5 w-5 text-warning" />أدوية قريبة الانتهاء (خلال 3 أشهر) - {expiring.length} دواء</CardTitle></CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader><TableRow><TableHead className="text-right">الدواء</TableHead><TableHead className="text-right">الفئة</TableHead><TableHead className="text-right">المخزون</TableHead><TableHead className="text-right">تاريخ الانتهاء</TableHead><TableHead className="text-right">المورد</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {expiring.map(med => {
                      const daysLeft = Math.ceil((new Date(med.expiryDate).getTime() - Date.now()) / 86400000);
                      return (
                        <TableRow key={med.id}><TableCell className="font-medium">{med.name}</TableCell><TableCell><Badge variant="outline">{med.category}</Badge></TableCell><TableCell>{med.stock} {med.unit}</TableCell><TableCell><Badge variant={daysLeft <= 30 ? 'destructive' : 'secondary'}>{new Date(med.expiryDate).toLocaleDateString('ar-SA')}</Badge></TableCell><TableCell className="text-sm">{med.supplier}</TableCell></TableRow>
                      );
                    })}
                    {expiring.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">لا توجد أدوية قريبة الانتهاء</TableCell></TableRow>}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Invoice Dialog */}
      <Dialog open={showInvoice} onOpenChange={setShowInvoice}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>فاتورة {selectedSale?.invoiceNumber}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="gap-1" onClick={handlePrintInvoice}><Printer className="h-4 w-4" />طباعة</Button>
                <Button size="sm" className="gap-1" onClick={handleExportInvoicePDF}><FileDown className="h-4 w-4" />تصدير PDF</Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          {selectedSale && <InvoicePrint ref={invoiceRef} sale={selectedSale} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
