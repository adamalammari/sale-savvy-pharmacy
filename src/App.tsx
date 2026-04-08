import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { PharmacyProvider } from "@/contexts/PharmacyContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { PharmacySidebar } from "@/components/pharmacy/PharmacySidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import POS from "./pages/POS";
import Reports from "./pages/Reports";
import Suppliers from "./pages/Suppliers";
import Customers from "./pages/Customers";
import PurchaseOrders from "./pages/PurchaseOrders";
import Prescriptions from "./pages/Prescriptions";
import Returns from "./pages/Returns";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import ActivityLog from "./pages/ActivityLog";
import ExpiredMedicines from "./pages/ExpiredMedicines";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-xl">
      {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-yellow-400" />}
    </Button>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Login />;

  return (
    <PharmacyProvider>
      <SettingsProvider>
        <SidebarProvider>
          <div className="min-h-dvh flex w-full overflow-hidden bg-background">
            <PharmacySidebar />
            <div className="flex min-w-0 flex-1 flex-col">
              <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border/70 bg-card/90 px-3 backdrop-blur supports-[backdrop-filter]:bg-card/80">
                <div className="flex items-center gap-2">
                  <SidebarTrigger className="mr-1" />
                  <span className="text-sm font-medium text-muted-foreground">نظام إدارة الصيدلية المتكامل</span>
                </div>
                <ThemeToggle />
              </header>
              <main className="flex-1 overflow-y-auto bg-muted/20">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/inventory" element={<Inventory />} />
                  <Route path="/pos" element={<POS />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/suppliers" element={<Suppliers />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/purchase-orders" element={<PurchaseOrders />} />
                  <Route path="/prescriptions" element={<Prescriptions />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/activity-log" element={<ActivityLog />} />
                  <Route path="/expired-medicines" element={<ExpiredMedicines />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </SettingsProvider>
    </PharmacyProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
