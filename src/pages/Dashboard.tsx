import { DollarSign, Package, ShoppingCart, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { StatCard } from '@/components/pharmacy/StatCard';
import { usePharmacy } from '@/contexts/PharmacyContext';
import { monthlySalesData, categorySalesData } from '@/data/pharmacyData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const {
    medicines, sales, getTodaySales, getTodayRevenue,
    getLowStockMedicines, getExpiringMedicines
  } = usePharmacy();

  const todaySales = getTodaySales();
  const todayRevenue = getTodayRevenue();
  const lowStock = getLowStockMedicines();
  const expiring = getExpiringMedicines();
  const totalItems = medicines.reduce((sum, m) => sum + m.stock, 0);

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">لوحة التحكم</h1>
        <p className="text-muted-foreground text-sm">نظرة عامة على أداء الصيدلية</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="إيرادات اليوم" value={`${todayRevenue.toLocaleString()} ر.س`} icon={DollarSign} color="success" trend={{ value: 12.5, label: 'عن أمس' }} />
        <StatCard title="مبيعات اليوم" value={todaySales.length} icon={ShoppingCart} color="primary" trend={{ value: 8, label: 'عن أمس' }} />
        <StatCard title="إجمالي المخزون" value={totalItems.toLocaleString()} icon={Package} color="info" />
        <StatCard title="تنبيهات المخزون" value={lowStock.length} icon={AlertTriangle} color="destructive" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              المبيعات والأرباح الشهرية
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlySalesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="sales" name="المبيعات" stroke="hsl(var(--chart-1))" fillOpacity={1} fill="url(#colorSales)" />
                <Area type="monotone" dataKey="profit" name="الأرباح" stroke="hsl(var(--chart-2))" fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">المبيعات حسب الفئة</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categorySalesData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name} ${value}%`}>
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base text-destructive">
              <AlertTriangle className="h-5 w-5" />
              أدوية منخفضة المخزون
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {lowStock.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">لا توجد تنبيهات</p>
              ) : (
                lowStock.map((med) => (
                  <motion.div key={med.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                    <div>
                      <p className="font-medium text-sm">{med.name}</p>
                      <p className="text-xs text-muted-foreground">الحد الأدنى: {med.minStock} {med.unit}</p>
                    </div>
                    <Badge variant="destructive">{med.stock} متبقي</Badge>
                  </motion.div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent sales */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-primary" />
              آخر المبيعات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[250px] overflow-y-auto">
              {sales.slice(0, 5).map((sale) => (
                <div key={sale.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium text-sm">{sale.invoiceNumber}</p>
                    <p className="text-xs text-muted-foreground">{sale.items.length} منتج • {new Date(sale.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sm">{sale.total.toLocaleString()} ر.س</p>
                    <Badge variant={sale.paymentMethod === 'cash' ? 'default' : sale.paymentMethod === 'card' ? 'secondary' : 'outline'} className="text-xs">
                      {sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'تأمين'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
