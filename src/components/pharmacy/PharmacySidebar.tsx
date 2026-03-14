import {
  LayoutDashboard, Package, ShoppingCart, FileBarChart,
  AlertTriangle, Pill,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { usePharmacy } from '@/contexts/PharmacyContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { title: 'لوحة التحكم', url: '/', icon: LayoutDashboard },
  { title: 'المخزون', url: '/inventory', icon: Package },
  { title: 'نقطة البيع', url: '/pos', icon: ShoppingCart },
  { title: 'التقارير', url: '/reports', icon: FileBarChart },
];

export function PharmacySidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { getLowStockMedicines } = usePharmacy();
  const lowStock = getLowStockMedicines().length;

  return (
    <Sidebar collapsible="icon" className="sidebar-glow border-l-0">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-6">
            <Pill className="h-6 w-6 text-sidebar-primary" />
            {!collapsed && <span className="text-lg font-bold text-sidebar-primary">فارما بلس</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/'}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold"
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!collapsed && (
                        <span className="flex-1">{item.title}</span>
                      )}
                      {!collapsed && item.url === '/inventory' && lowStock > 0 && (
                        <Badge variant="destructive" className="mr-auto text-xs px-1.5 py-0.5 min-w-[20px] justify-center">
                          {lowStock}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {!collapsed && lowStock > 0 && (
          <div className="mx-3 mt-auto mb-4 rounded-lg bg-destructive/10 p-3">
            <div className="flex items-center gap-2 text-destructive text-sm font-medium">
              <AlertTriangle className="h-4 w-4" />
              <span>{lowStock} أدوية منخفضة المخزون</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
