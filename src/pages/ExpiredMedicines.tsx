import { usePharmacy } from '@/contexts/PharmacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Calendar, Package } from 'lucide-react';

export default function ExpiredMedicines() {
  const { medicines } = usePharmacy();
  const now = new Date();
  const threeMonths = new Date();
  threeMonths.setMonth(threeMonths.getMonth() + 3);

  const expired = medicines.filter(m => new Date(m.expiryDate) <= now);
  const expiringSoon = medicines.filter(m => {
    const exp = new Date(m.expiryDate);
    return exp > now && exp <= threeMonths;
  });

  const getStatusBadge = (expiryDate: string) => {
    const exp = new Date(expiryDate);
    if (exp <= now) return <Badge variant="destructive">منتهي الصلاحية</Badge>;
    const daysLeft = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 30) return <Badge className="bg-destructive/80 text-destructive-foreground">أقل من شهر</Badge>;
    return <Badge className="bg-warning/10 text-warning border-warning/20">قارب الانتهاء</Badge>;
  };

  const allItems = [...expired, ...expiringSoon];

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Calendar className="h-6 w-6 text-destructive" />
          الأدوية المنتهية والقاربة
        </h1>
        <p className="text-sm text-muted-foreground">متابعة تواريخ انتهاء صلاحية الأدوية</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-destructive/10 p-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{expired.length}</p>
                <p className="text-xs text-muted-foreground">منتهي الصلاحية</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-warning/10 p-3">
                <Calendar className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{expiringSoon.length}</p>
                <p className="text-xs text-muted-foreground">قارب الانتهاء (3 أشهر)</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{medicines.length - expired.length - expiringSoon.length}</p>
                <p className="text-xs text-muted-foreground">صالح</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">قائمة الأدوية ({allItems.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right min-w-[160px]">الدواء</TableHead>
                  <TableHead className="text-right min-w-[80px]">الفئة</TableHead>
                  <TableHead className="text-right min-w-[80px]">المخزون</TableHead>
                  <TableHead className="text-right min-w-[100px]">تاريخ الانتهاء</TableHead>
                  <TableHead className="text-right min-w-[100px]">الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allItems.map(med => (
                  <TableRow key={med.id}>
                    <TableCell>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-muted-foreground">{med.genericName}</p>
                    </TableCell>
                    <TableCell><Badge variant="outline" className="text-xs">{med.category}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap">{med.stock} {med.unit}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(med.expiryDate).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>{getStatusBadge(med.expiryDate)}</TableCell>
                  </TableRow>
                ))}
                {allItems.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد أدوية منتهية أو قاربة الانتهاء 🎉
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
