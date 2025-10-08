import React from 'react';
//import hariLogo from 'figma:asset/ad406061768cec8b94278ec1e0a653ae70cc6965.png';

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

interface InvoicePrintTemplateProps {
  invoice: Invoice;
  customerDetails?: {
    address: string;
    city: string;
    state: string;
    phone: string;
    email: string;
  };
}

export function InvoicePrintTemplate({ invoice, customerDetails }: InvoicePrintTemplateProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Invoice Container - Optimized for A4 */}
      <div className="max-w-[210mm] mx-auto bg-white p-6 print:p-0">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
          <div className="flex justify-between items-start">
            {/* Company Logo and Info */}
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-lg p-2 flex items-center justify-center">
                
              </div>
              <div>
                <h1 className="text-2xl font-bold">HARI INDUSTRIES LIMITED</h1>
                <p className="text-blue-100 text-sm">Excellence in Water Processing & Distribution</p>
              </div>
            </div>
            
            {/* Invoice Title */}
            <div className="text-right">
              <h2 className="text-3xl font-bold">INVOICE</h2>
              <p className="text-blue-100">#{invoice.id}</p>
            </div>
          </div>
        </div>

        {/* Company Address Section */}
        <div className="bg-gray-50 p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">COMPANY ADDRESS</h3>
              <div className="text-gray-700 space-y-1">
                <p>Kano-Kaduna Expressway</p>
                <p>Marabn Gwanda, Sabon Gari</p>
                <p>Zaria, Kaduna State</p>
                <p>Nigeria</p>
                <div className="mt-3 space-y-1">
                  <p><span className="font-medium">Phone:</span> +234-800-HARI-IND</p>
                  <p><span className="font-medium">Email:</span> info@hariindustries.com</p>
                  <p><span className="font-medium">Website:</span> www.hariindustries.com</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">INVOICE DETAILS</h3>
              <div className="text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium">Invoice Date:</span>
                  <span>{new Date(invoice.invoice_date).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Due Date:</span>
                  <span>{new Date(invoice.due_date).toLocaleDateString('en-GB')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Order ID:</span>
                  <span>{invoice.order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sales Rep:</span>
                  <span>{invoice.created_by}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-6 border-b">
          <h3 className="font-semibold text-gray-900 mb-3">BILL TO:</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-bold text-lg text-gray-900">{invoice.customer_name}</h4>
            {customerDetails && (
              <div className="mt-2 text-gray-700 space-y-1">
                <p>{customerDetails.address}</p>
                <p>{customerDetails.city}, {customerDetails.state}</p>
                {customerDetails.phone && <p><span className="font-medium">Phone:</span> {customerDetails.phone}</p>}
                {customerDetails.email && <p><span className="font-medium">Email:</span> {customerDetails.email}</p>}
              </div>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">ITEMS</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                  <th className="text-left p-3 font-semibold text-gray-700">DESCRIPTION</th>
                  <th className="text-center p-3 font-semibold text-gray-700">QTY</th>
                  <th className="text-right p-3 font-semibold text-gray-700">UNIT PRICE</th>
                  <th className="text-right p-3 font-semibold text-gray-700">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={item.id || index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <div className="font-medium text-gray-900">{item.product_name}</div>
                      <div className="text-sm text-gray-500">Premium Quality Water Product</div>
                    </td>
                    <td className="text-center p-3 text-gray-700">{item.quantity}</td>
                    <td className="text-right p-3 text-gray-700">₦{item.unit_price.toLocaleString()}</td>
                    <td className="text-right p-3 font-medium text-gray-900">₦{item.total_price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals Section */}
        <div className="bg-gray-50 p-6">
          <div className="flex justify-end">
            <div className="w-80">
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span>₦{invoice.total_amount.toLocaleString()}</span>
                </div>
                {invoice.discount_amount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount:</span>
                    <span>-₦{invoice.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-700">
                  <span>VAT (7.5%):</span>
                  <span>₦{invoice.tax_amount.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">TOTAL:</span>
                    <span className="text-2xl font-bold text-blue-600">₦{invoice.net_amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment Details */}
                {invoice.payment_type && (
                  <div className="border-t-2 border-gray-400 pt-3 mt-4">
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <h4 className="font-semibold text-gray-900 text-sm uppercase">Payment Status</h4>
                      
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-700">Payment Type:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          invoice.payment_type === 'FULL' ? 'bg-green-100 text-green-800' :
                          invoice.payment_type === 'HALF' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {invoice.payment_type === 'FULL' ? 'FULL PAYMENT' :
                           invoice.payment_type === 'HALF' ? 'PARTIAL PAYMENT' :
                           'CREDIT - NO IMMEDIATE PAYMENT'}
                        </span>
                      </div>

                      {invoice.payment_type !== 'CREDIT' && invoice.amount_paid !== undefined && (
                        <>
                          <div className="flex justify-between text-gray-700 border-t pt-2">
                            <span className="font-medium">Amount Paid:</span>
                            <span className="text-green-600 font-bold">₦{invoice.amount_paid.toLocaleString()}</span>
                          </div>
                          
                          {invoice.balance_due !== undefined && invoice.balance_due > 0 && (
                            <div className="flex justify-between text-gray-700">
                              <span className="font-medium">Balance Due:</span>
                              <span className="text-red-600 font-bold">₦{invoice.balance_due.toLocaleString()}</span>
                            </div>
                          )}

                          {invoice.balance_due === 0 && (
                            <div className="bg-green-100 p-2 rounded text-center">
                              <span className="text-green-800 font-semibold">✓ PAID IN FULL</span>
                            </div>
                          )}
                        </>
                      )}

                      {invoice.payment_type === 'CREDIT' && (
                        <div className="bg-red-50 p-3 rounded border border-red-200">
                          <p className="text-red-800 text-sm font-medium">
                            ⚠️ This invoice is on CREDIT. Full amount of ₦{invoice.net_amount.toLocaleString()} is outstanding and payable as per agreed terms.
                          </p>
                        </div>
                      )}

                      {invoice.payment_confirmed_by && (
                        <div className="text-xs text-gray-600 border-t pt-2">
                          <p>Payment confirmed by: {invoice.payment_confirmed_by}</p>
                          {invoice.payment_confirmed_at && (
                            <p>Date: {new Date(invoice.payment_confirmed_at).toLocaleString('en-GB')}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Payment & Terms Section */}
        <div className="p-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">PAYMENT INFORMATION</h3>
              <div className="text-sm text-gray-700 space-y-2">
                <p><span className="font-medium">Bank:</span> First Bank of Nigeria</p>
                <p><span className="font-medium">Account Name:</span> Hari Industries Limited</p>
                <p><span className="font-medium">Account Number:</span> 2034567890</p>
                <p><span className="font-medium">Sort Code:</span> 011-151-003</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">TERMS & CONDITIONS</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Payment is due within 30 days of invoice date</p>
                <p>• Late payment may incur additional charges</p>
                <p>• All goods remain property of Hari Industries until paid</p>
                <p>• Please quote invoice number on all payments</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 text-center">
          <p className="text-sm">Thank you for your business!</p>
          <p className="text-xs text-blue-100 mt-2">
            This is a computer-generated invoice and does not require a signature.
          </p>
          <div className="mt-4 text-xs text-blue-100">
            Hari Industries Limited • RC: 123456 • VAT: NG7890123456
          </div>
        </div>
      </div>

      {/* Print Styles */}
    
    </div>
  );
}

export default InvoicePrintTemplate;