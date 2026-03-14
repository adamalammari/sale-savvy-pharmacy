import { usePharmacy } from '@/contexts/PharmacyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, AlertTriangle, Calendar, Truck, RotateCcw, Info, CheckCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  'low-stock': AlertTriangle,
  expiry: Calendar,
  order: Truck,
  return: RotateCcw,
  general: Info,
};

const colorMap = {
  'low-stock': 'text-destructive',
  expiry: 'text-warning',
  order: 'text-info',
  return: 'text-primary',
  general: 'text-muted-foreground',
};

export default function Notifications() {
  const { notifications, markNotificationRead, markAllNotificationsRead, unreadNotificationsCount } = usePharmacy();

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">التنبيهات</h1>
          <p className="text-sm text-muted-foreground">{unreadNotificationsCount} تنبيه غير مقروء</p>
        </div>
        {unreadNotificationsCount > 0 && (
          <Button variant="outline" className="gap-2" onClick={markAllNotificationsRead}>
            <CheckCheck className="h-4 w-4" />تحديد الكل كمقروء
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((n, i) => {
          const Icon = iconMap[n.type] || Info;
          return (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className={`transition-all cursor-pointer hover:shadow-md ${!n.read ? 'border-primary/30 bg-primary/5' : ''}`} onClick={() => markNotificationRead(n.id)}>
                <CardContent className="flex items-start gap-4 p-4">
                  <div className={`rounded-xl p-2.5 ${n.read ? 'bg-muted' : 'bg-primary/10'}`}>
                    <Icon className={`h-5 w-5 ${colorMap[n.type]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm ${!n.read ? 'font-bold' : 'font-medium'}`}>{n.title}</p>
                      {!n.read && <div className="h-2 w-2 rounded-full bg-primary" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.date).toLocaleString('ar-SA')}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {notifications.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <BellOff className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>لا توجد تنبيهات</p>
          </div>
        )}
      </div>
    </div>
  );
}
