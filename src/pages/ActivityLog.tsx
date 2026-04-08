import { usePharmacy } from '@/contexts/PharmacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Activity, ShoppingCart, Package, RotateCcw, FileText, Clock } from 'lucide-react';

export default function ActivityLog() {
  const { sales, returns, prescriptions } = usePharmacy();

  const activities = [
    ...sales.map(s => ({
      id: s.id,
      type: 'sale' as const,
      title: `بيع - ${s.invoiceNumber}`,
      description: `${s.items.length} منتج • ${s.total.toLocaleString()} ر.س`,
      date: s.date,
      icon: ShoppingCart,
      color: 'text-success',
    })),
    ...returns.map(r => ({
      id: r.id,
      type: 'return' as const,
      title: `مرتجع - ${r.invoiceNumber}`,
      description: `${r.items.length} منتج • ${r.reason}`,
      date: r.date,
      icon: RotateCcw,
      color: 'text-warning',
    })),
    ...prescriptions.map(p => ({
      id: p.id,
      type: 'prescription' as const,
      title: `وصفة - ${p.customerName}`,
      description: `د. ${p.doctorName} • ${p.items.length} دواء`,
      date: p.date,
      icon: FileText,
      color: 'text-info',
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sale': return <Badge className="bg-success/10 text-success border-success/20">بيع</Badge>;
      case 'return': return <Badge className="bg-warning/10 text-warning border-warning/20">مرتجع</Badge>;
      case 'prescription': return <Badge className="bg-info/10 text-info border-info/20">وصفة</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          سجل النشاط
        </h1>
        <p className="text-sm text-muted-foreground">جميع العمليات والأنشطة في النظام</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            آخر الأنشطة ({activities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-250px)]">
            <div className="space-y-3">
              {activities.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start gap-3 rounded-lg border border-border/70 p-3 transition-colors hover:bg-muted/50">
                    <div className={`mt-0.5 rounded-lg bg-muted p-2 ${activity.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{activity.title}</p>
                        {getTypeBadge(activity.type)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(activity.date).toLocaleDateString('ar-SA')} {new Date(activity.date).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
              {activities.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-10 w-10 mx-auto mb-2 opacity-30" />
                  <p>لا توجد أنشطة بعد</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
