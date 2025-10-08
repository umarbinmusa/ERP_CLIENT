import { useEffect, useState } from 'react';
import { InvoicePrintTemplate } from './InvoicePrintTemplate';

interface InvoiceItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Invoice {
  id: string;
  order_id: string;
  customer_id?: number;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  net_amount: number;
  status: string;
  created_by: string;
  created_at: string;
  payment_type?: 'FULL' | 'HALF' | 'CREDIT';
  amount_paid?: number;
  balance_due?: number;
  payment_confirmed_by?: string;
  payment_confirmed_at?: string;
  items: InvoiceItem[];
}

export function InvoicePrintPage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    // Retrieve invoice data from sessionStorage
    const invoiceData = sessionStorage.getItem('invoice-to-print');
    
    if (invoiceData) {
      try {
        const parsedInvoice = JSON.parse(invoiceData);
        setInvoice(parsedInvoice);
        
        // Auto-trigger print dialog after a short delay to ensure rendering is complete
        setTimeout(() => {
          window.print();
        }, 500);
      } catch (error) {
        console.error('Error parsing invoice data:', error);
      }
    } else {
      // No invoice data found
      document.body.innerHTML = '<div style="padding: 2rem; text-align: center;"><h1>No invoice data found</h1><p>Please go back and try again.</p></div>';
    }
  }, []);

  if (!invoice) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Loading invoice...</h2>
          <p className="text-gray-600">Please wait while we prepare your invoice for printing.</p>
        </div>
      </div>
    );
  }

  return <InvoicePrintTemplate invoice={invoice} />;
}

export default InvoicePrintPage;
