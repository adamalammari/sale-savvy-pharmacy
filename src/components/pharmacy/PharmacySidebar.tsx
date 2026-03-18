import {
  LayoutDashboard, Package, ShoppingCart, FileBarChart,
  AlertTriangle, Pill, Truck, Users, ClipboardList, FileText, RotateCcw, Bell, Settings,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { usePharmacy } from '@/contexts/PharmacyContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { title: 'لوحة التحكم', url: '/', icon: LayoutDashboard },
  { title: 'نقطة البيع', url: '/pos', icon: ShoppingCart },
  { title: 'المخزون', url: '/inventory', icon: Package },
  { title: 'الوصفات الطبية', url: '/prescriptions', icon: FileText },
];

const managementNav = [
  { title: 'الموردين', url: '/suppliers', icon: Truck },
  { title: 'العملاء', url: '/customers', icon: Users },
  { title: 'طلبات الشراء', url: '/purchase-orders', icon: ClipboardList },
  { title: 'المرتجعات', url: '/returns', icon: RotateCcw },
];

const otherNav = [
  { title: 'التقارير', url: '/reports', icon: FileBarChart },
  { title: 'التنبيهات', url: '/notifications', icon: Bell },
  { title: 'الإعدادات', url: '/settings', icon: Settings },
];

export function PharmacySidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { getLowStockMedicines, unreadNotificationsCount } = usePharmacy();
  const lowStock = getLowStockMedicines().length;

  const renderNavItems = (items: typeof mainNav, badges?: Record<string, number>) => (
    <SidebarMenu>
      {items.map((item) => {
        const badgeCount = badges?.[item.url] || 0;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <NavLink
                to={item.url}
                end={item.url === '/'}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sidebar-foreground/85 transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-semibold shadow-sm"
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.title}</span>}
                {!collapsed && badgeCount > 0 && (
                  <Badge variant="destructive" className="mr-auto min-w-[20px] justify-center px-1.5 py-0.5 text-xs">
                    {badgeCount}
                  </Badge>
                )}
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <Sidebar side="right" collapsible="icon" className="sidebar-glow border-l border-sidebar-border/70">
      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-6">
            <Pill className="h-6 w-6 text-sidebar-primary" />
            {!collapsed && <span className="text-lg font-bold tracking-tight text-sidebar-primary">فارما بلس</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderNavItems(mainNav, { '/inventory': lowStock })}
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && <Separator className="mx-3 bg-sidebar-border/70" />}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="px-4 text-xs text-sidebar-foreground/60">الإدارة</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderNavItems(managementNav)}
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && <Separator className="mx-3 bg-sidebar-border/70" />}

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="px-4 text-xs text-sidebar-foreground/60">أخرى</SidebarGroupLabel>}
          <SidebarGroupContent>
            {renderNavItems(otherNav, { '/notifications': unreadNotificationsCount })}
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && lowStock > 0 && (
          <div className="mx-3 mb-4 mt-auto rounded-xl border border-destructive/20 bg-destructive/10 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span>{lowStock} أدوية منخفضة المخزون</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
