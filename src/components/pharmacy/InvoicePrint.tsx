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
    <div ref={ref} className="bg-white text-black p-8 max-w-[210mm] mx-auto" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-4 mb-4">
        <h1 className="text-2xl font-bold">{settings.pharmacyName}</h1>
        <p className="text-sm text-gray-600">{settings.pharmacyNameEn}</p>
        <p className="text-xs mt-1">{settings.address}، {settings.city}</p>
        <p className="text-xs">هاتف: {settings.phone} | بريد: {settings.email}</p>
        {settings.vatNumber && <p className="text-xs mt-1">الرقم الضريبي: {settings.vatNumber}</p>}
        <p className="text-xs">رقم الترخيص: {settings.licenseNumber}</p>
      </div>

      {/* Invoice Info */}
      <div className="flex justify-between mb-4 text-sm">
        <div>
          <p><strong>رقم الفاتورة:</strong> {sale.invoiceNumber}</p>
          <p><strong>التاريخ:</strong> {new Date(sale.date).toLocaleDateString('ar-SA')}</p>
          <p><strong>الوقت:</strong> {new Date(sale.date).toLocaleTimeString('ar-SA')}</p>
        </div>
        <div className="text-left">
          {sale.customerName && <p><strong>العميل:</strong> {sale.customerName}</p>}
          <p><strong>طريقة الدفع:</strong> {sale.paymentMethod === 'cash' ? 'نقدي' : sale.paymentMethod === 'card' ? 'بطاقة' : 'تأمين'}</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-right text-xs">#</th>
            <th className="border border-gray-300 p-2 text-right text-xs">المنتج</th>
            <th className="border border-gray-300 p-2 text-center text-xs">الكمية</th>
            <th className="border border-gray-300 p-2 text-center text-xs">السعر</th>
            <th className="border border-gray-300 p-2 text-center text-xs">الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {sale.items.map((item, i) => (
            <tr key={item.medicineId}>
              <td className="border border-gray-300 p-2 text-xs">{i + 1}</td>
              <td className="border border-gray-300 p-2 text-xs">{item.medicineName}</td>
              <td className="border border-gray-300 p-2 text-center text-xs">{item.quantity}</td>
              <td className="border border-gray-300 p-2 text-center text-xs">{item.price} {settings.currency}</td>
              <td className="border border-gray-300 p-2 text-center text-xs">{item.total} {settings.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="border-t-2 border-black pt-3 space-y-1 text-sm w-64 mr-auto">
        <div className="flex justify-between"><span>المجموع الفرعي:</span><span>{subtotal} {settings.currency}</span></div>
        {sale.discount > 0 && <div className="flex justify-between text-red-600"><span>الخصم:</span><span>-{sale.discount} {settings.currency}</span></div>}
        {settings.showVatOnInvoice && (
          <div className="flex justify-between"><span>ضريبة القيمة المضافة ({settings.vatRate}%):</span><span>{vatAmount.toFixed(2)} {settings.currency}</span></div>
        )}
        <div className="flex justify-between font-bold text-lg border-t border-gray-400 pt-1">
          <span>الإجمالي النهائي:</span>
          <span>{(sale.total + vatAmount).toFixed(2)} {settings.currency}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-4">
        <p>{settings.invoiceFooter}</p>
        <p className="mt-1">تمت الطباعة بواسطة نظام فارما بلس - {new Date().toLocaleDateString('ar-SA')}</p>
      </div>
    </div>
  );
});

InvoicePrint.displayName = 'InvoicePrint';
