import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  color: 'primary' | 'accent' | 'success' | 'info' | 'destructive';
}

const colorMap = {
  primary: 'bg-primary/12 text-primary ring-1 ring-primary/20',
  accent: 'bg-accent/12 text-accent ring-1 ring-accent/20',
  success: 'bg-success/12 text-success ring-1 ring-success/20',
  info: 'bg-info/12 text-info ring-1 ring-info/20',
  destructive: 'bg-destructive/12 text-destructive ring-1 ring-destructive/20',
};

export function StatCard({ title, value, icon: Icon, trend, color }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {trend && (
            <p className={`text-xs mt-1 ${trend.value >= 0 ? 'text-success' : 'text-destructive'}`}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
            </p>
          )}
        </div>
        <div className={`rounded-xl p-3 ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
}
