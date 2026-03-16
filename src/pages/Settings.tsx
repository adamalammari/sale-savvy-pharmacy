import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, Building2, Receipt, Printer, Shield, Database, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { user, logout } = useAuth();

  const handleSave = () => toast.success('تم حفظ الإعدادات بنجاح');

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="grid grid-cols-3 items-center gap-4">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="col-span-2">{children}</div>
    </div>
  );

  const SwitchField = ({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><SettingsIcon className="h-6 w-6 text-primary" />الإعدادات</h1>
          <p className="text-sm text-muted-foreground">إعدادات النظام والصيدلية</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
            <User className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{user?.username}</span>
            <span className="text-xs text-muted-foreground">({user?.role})</span>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="gap-1 text-destructive hover:text-destructive">
            <LogOut className="h-4 w-4" />تسجيل خروج
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pharmacy" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-5">
          <TabsTrigger value="pharmacy">الصيدلية</TabsTrigger>
          <TabsTrigger value="tax">الضرائب</TabsTrigger>
          <TabsTrigger value="invoice">الفواتير</TabsTrigger>
          <TabsTrigger value="inventory">المخزون</TabsTrigger>
          <TabsTrigger value="system">النظام</TabsTrigger>
        </TabsList>

        {/* Pharmacy Info */}
        <TabsContent value="pharmacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Building2 className="h-5 w-5 text-primary" />بيانات الصيدلية</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="اسم الصيدلية (عربي)">
                <Input value={settings.pharmacyName} onChange={e => updateSettings({ pharmacyName: e.target.value })} />
              </Field>
              <Field label="اسم الصيدلية (إنجليزي)">
                <Input value={settings.pharmacyNameEn} onChange={e => updateSettings({ pharmacyNameEn: e.target.value })} dir="ltr" />
              </Field>
              <Field label="رقم الترخيص">
                <Input value={settings.licenseNumber} onChange={e => updateSettings({ licenseNumber: e.target.value })} />
              </Field>
              <Field label="رقم الهاتف">
                <Input value={settings.phone} onChange={e => updateSettings({ phone: e.target.value })} dir="ltr" />
              </Field>
              <Field label="البريد الإلكتروني">
                <Input value={settings.email} onChange={e => updateSettings({ email: e.target.value })} dir="ltr" />
              </Field>
              <Field label="العنوان">
                <Input value={settings.address} onChange={e => updateSettings({ address: e.target.value })} />
              </Field>
              <Field label="المدينة">
                <Input value={settings.city} onChange={e => updateSettings({ city: e.target.value })} />
              </Field>
              <Separator />
              <div className="flex justify-end"><Button onClick={handleSave}>حفظ التغييرات</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax */}
        <TabsContent value="tax">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Receipt className="h-5 w-5 text-primary" />إعدادات الضرائب</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="الرقم الضريبي">
                <Input value={settings.vatNumber} onChange={e => updateSettings({ vatNumber: e.target.value })} dir="ltr" />
              </Field>
              <Field label="نسبة الضريبة (%)">
                <Input type="number" value={settings.vatRate} onChange={e => updateSettings({ vatRate: +e.target.value })} min={0} max={100} />
              </Field>
              <Field label="العملة">
                <Input value={settings.currency} onChange={e => updateSettings({ currency: e.target.value })} />
              </Field>
              <SwitchField
                label="إظهار الضريبة في الفاتورة"
                description="عرض تفاصيل ضريبة القيمة المضافة في الفواتير المطبوعة"
                checked={settings.showVatOnInvoice}
                onChange={v => updateSettings({ showVatOnInvoice: v })}
              />
              <Separator />
              <div className="flex justify-end"><Button onClick={handleSave}>حفظ التغييرات</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoice / Print */}
        <TabsContent value="invoice">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Printer className="h-5 w-5 text-primary" />إعدادات الفواتير والطباعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="بادئة رقم الفاتورة">
                <Input value={settings.invoicePrefix} onChange={e => updateSettings({ invoicePrefix: e.target.value })} dir="ltr" />
              </Field>
              <Field label="حجم الورق">
                <Select value={settings.paperSize} onValueChange={v => updateSettings({ paperSize: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A5">A5</SelectItem>
                    <SelectItem value="thermal">حراري (80mm)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="تذييل الفاتورة">
                <Input value={settings.invoiceFooter} onChange={e => updateSettings({ invoiceFooter: e.target.value })} />
              </Field>
              <SwitchField
                label="طباعة تلقائية"
                description="طباعة الفاتورة تلقائياً بعد إتمام البيع"
                checked={settings.printAutomatically}
                onChange={v => updateSettings({ printAutomatically: v })}
              />
              <SwitchField
                label="إظهار الشعار"
                description="عرض شعار الصيدلية في الفواتير المطبوعة"
                checked={settings.showLogo}
                onChange={v => updateSettings({ showLogo: v })}
              />
              <Separator />
              <div className="flex justify-end"><Button onClick={handleSave}>حفظ التغييرات</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Shield className="h-5 w-5 text-primary" />إعدادات المخزون</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="حد التنبيه للمخزون المنخفض">
                <Input type="number" value={settings.lowStockThreshold} onChange={e => updateSettings({ lowStockThreshold: +e.target.value })} min={1} />
              </Field>
              <Field label="تنبيه انتهاء الصلاحية (أيام)">
                <Input type="number" value={settings.expiryWarningDays} onChange={e => updateSettings({ expiryWarningDays: +e.target.value })} min={1} />
              </Field>
              <SwitchField
                label="السماح بالمخزون السالب"
                description="السماح بالبيع حتى عند نفاد المخزون"
                checked={settings.allowNegativeStock}
                onChange={v => updateSettings({ allowNegativeStock: v })}
              />
              <SwitchField
                label="إلزام الوصفة الطبية"
                description="منع بيع الأدوية التي تتطلب وصفة بدون إدخال بيانات الوصفة"
                checked={settings.requirePrescription}
                onChange={v => updateSettings({ requirePrescription: v })}
              />
              <Separator />
              <div className="flex justify-end"><Button onClick={handleSave}>حفظ التغييرات</Button></div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base"><Database className="h-5 w-5 text-primary" />إعدادات النظام</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Field label="تكرار النسخ الاحتياطي">
                <Select value={settings.backupFrequency} onValueChange={v => updateSettings({ backupFrequency: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">يومي</SelectItem>
                    <SelectItem value="weekly">أسبوعي</SelectItem>
                    <SelectItem value="monthly">شهري</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">إعادة ضبط الإعدادات</p>
                  <p className="text-xs text-muted-foreground">إرجاع جميع الإعدادات للقيم الافتراضية</p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => { resetSettings(); toast.success('تم إعادة ضبط الإعدادات'); }}>
                  إعادة ضبط
                </Button>
              </div>
              <Separator />
              <div className="rounded-lg bg-muted/50 p-4 text-sm space-y-1">
                <p className="font-medium">معلومات النظام</p>
                <p className="text-muted-foreground">الإصدار: 1.0.0</p>
                <p className="text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString('ar-SA')}</p>
                <p className="text-muted-foreground">قاعدة البيانات: محلية (ذاكرة المتصفح)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
