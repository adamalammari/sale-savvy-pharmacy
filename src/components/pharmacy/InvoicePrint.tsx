import { forwardRef } from 'react';
import { Sale } from '@/data/pharmacyData';
import { useSettings } from '@/contexts/SettingsContext';

interface InvoicePrintProps {
  sale: Sale;
}

export const InvoicePrint = forwardRef<HTMLDivElement, InvoicePrintProps>(({ sale }, ref) => {
  const { settings } = useSettings();
  const subtotal = sale.total + sale.discount;
  const vatAmount = settings.showVatOnInvoice ? (sale.total * settings.vatRate) / 100 : 0;

  return (
    <div ref={ref} className="mx-auto max-w-[210mm] bg-card p-8 text-card-foreground" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header */}
      <div className="mb-4 border-b-2 border-border pb-4 text-center">
        <h1 className="text-2xl font-bold">{settings.pharmacyName}</h1>
        <p className="text-sm text-muted-foreground">{settings.pharmacyNameEn}</p>
        <p className="mt-1 text-xs">{settings.address}، {settings.city}</p>
        <p className="text-xs">هاتف: {settings.phone} | بريد: {settings.email}</p>
        {settings.vatNumber && <p className="mt-1 text-xs">الرقم الضريبي: {settings.vatNumber}</p>}
        <p className="text-xs">رقم الترخيص: {settings.licenseNumber}</p>
      </div>

      {/* Invoice Info */}
      <div className="mb-4 flex justify-between text-sm">
        <div>
          <p><strong>رقم الفاتورة:</strong> {sale.invoiceNumber}</p>
          <p><strong>التاريخ:</strong> {new Date(sale.date).toLocaleDateString('ar-SA')}</p>
          <p><strong>الوقت:</strong> {new Date(sale.date).toLocaleTimeString('ar-SA')}</p>
        </div>
        <div className="text-end">
          {sale.customerName && <p><strong>العميل:</strong> {sale.customerName}</p>}
          <p><strong>طريقة الدفع:</strong> {sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'تأمين'}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="mb-4 w-full border-collapse">
        <thead>
          <tr className="bg-muted/70">
            <th className="border border-border p-2 text-right text-xs">#</th>
            <th className="border border-border p-2 text-right text-xs">المنتج</th>
            <th className="border border-border p-2 text-center text-xs">الكمية</th>
            <th className="border border-border p-2 text-center text-xs">السعر</th>
            <th className="border border-border p-2 text-center text-xs">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, i) => (
            <tr key={item.medicineId}>
              <td className="border border-border p-2 text-xs">{i + 1}</td>
              <td className="border border-border p-2 text-xs">{item.medicineName}</td>
              <td className="border border-border p-2 text-center text-xs">{item.quantity}</td>
              <td className="border border-border p-2 text-center text-xs">{item.price} {settings.currency}</td>
              <td className="border border-border p-2 text-center text-xs">{item.total} {settings.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="mr-auto w-64 space-y-1 border-t-2 border-border pt-3 text-sm">
        <div className="flex justify-between"><span>المجموع الفرعي:</span><span>{subtotal} {settings.currency}</span></div>
        {sale.discount > 0 && <div className="flex justify-between text-destructive"><span>الخصم:</span><span>-{sale.discount} {settings.currency}</span></div>}
        {settings.showVatOnInvoice && (
          <div className="flex justify-between"><span>ضريبة القيمة المضافة ({settings.vatRate}%):</span><span>{vatAmount.toFixed(2)} {settings.currency}</span></div>
        )}
        <div className="flex justify-between border-t border-border pt-1 text-lg font-bold">
          <span>الإجمالي النهائي:</span>
          <span>{(sale.total + vatAmount).toFixed(2)} {settings.currency}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <p>{settings.invoiceFooter}</p>
        <p className="mt-1">تمت الطباعة بواسطة نظام فارما بلس - {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';
