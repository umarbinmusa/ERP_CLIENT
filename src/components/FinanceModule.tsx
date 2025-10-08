import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Progress } from "./ui/progress";
import { toast } from "sonner";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Send, 
  Search, 
  Filter, 
  Eye,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  Printer,
  Package,
  Plus,
  Edit,
  Trash2,
  Download,
  Calendar,
  Receipt,
  Wallet,
  CreditCard,
  Building2,
  TrendingDown,
  Calculator,
  BarChart3,
  PieChart,
  FileBarChart,
  Banknote,
  ShieldCheck,
  Users
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { InvoicePrintTemplate } from "./InvoicePrintTemplate";

// ============= INTERFACES =============

interface SalesOrder {
  id: string;
  customer_name: string;
  order_date: string;
  required_date: string;
  total_amount: number;
  sales_rep_name: string;
  items: OrderItem[];
  notes?: string;
}

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Invoice {
  id: string;
  order_id: string;
  customer_name: string;
  invoice_date: string;
  due_date: string;
  total_amount: number;
  tax_amount: number;
  discount_amount: number;
  net_amount: number;
  status: 'DRAFT' | 'PENDING_MD_APPROVAL' | 'REJECTED' | 'APPROVED' | 'PAYMENT_CONFIRMED';
  rejection_reason?: string;
  finance_notes?: string;
  md_notes?: string;
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
  payment_type?: 'FULL' | 'HALF' | 'CREDIT';
  amount_paid?: number;
  balance_due?: number;
  payment_confirmed_by?: string;
  payment_confirmed_at?: string;
  items: OrderItem[];
}

interface Budget {
  id: string;
  department: string;
  category: string;
  allocated_amount: number;
  spent_amount: number;
  period: string;
  status: 'WITHIN_BUDGET' | 'APPROACHING_LIMIT' | 'OVER_BUDGET';
}

interface ExpenseClaim {
  id: string;
  employee_name: string;
  department: string;
  claim_date: string;
  amount: number;
  category: string;
  description: string;
  status: 'PENDING_FINANCE_REVIEW' | 'PENDING_MD_APPROVAL' | 'APPROVED' | 'REJECTED' | 'PAID';
  receipts: number;
  finance_notes?: string;
  md_notes?: string;
  rejection_reason?: string;
  reviewed_by?: string;
  approved_by?: string;
  approved_at?: string;
}

interface PettyCash {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'INFLOW' | 'OUTFLOW';
  balance: number;
  recorded_by: string;
}

interface VendorPayment {
  id: string;
  vendor_name: string;
  invoice_number: string;
  due_date: string;
  amount: number;
  payment_method: 'CASH' | 'TRANSFER' | 'CHEQUE';
  status: 'SCHEDULED' | 'PROCESSING' | 'PAID' | 'FAILED';
  cheque_number?: string;
}

interface Asset {
  id: string;
  name: string;
  category: string;
  purchase_date: string;
  purchase_cost: number;
  depreciation_method: 'STRAIGHT_LINE' | 'DECLINING_BALANCE';
  useful_life: number;
  current_value: number;
  status: 'ACTIVE' | 'DISPOSED' | 'RETIRED';
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  details: string;
  ip_address: string;
}

export function FinanceModule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("invoices");
  
  // Invoice Management States
  const [pendingOrders, setPendingOrders] = useState<SalesOrder[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [taxRate, setTaxRate] = useState("7.5");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [financeNotes, setFinanceNotes] = useState("");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isApprovalDialogOpen, setIsApprovalDialogOpen] = useState(false);
  const [mdNotes, setMdNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState<'FULL' | 'HALF' | 'CREDIT'>('FULL');
  const [isPaymentConfirmDialogOpen, setIsPaymentConfirmDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");

  // Budget & Forecasting States
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isBudgetDialogOpen, setIsBudgetDialogOpen] = useState(false);
  const [newBudgetDept, setNewBudgetDept] = useState("");
  const [newBudgetCategory, setNewBudgetCategory] = useState("");
  const [newBudgetAmount, setNewBudgetAmount] = useState("");
  const [newBudgetPeriod, setNewBudgetPeriod] = useState("");

  // Expense Management States
  const [expenseClaims, setExpenseClaims] = useState<ExpenseClaim[]>([]);
  const [pettyCash, setPettyCash] = useState<PettyCash[]>([]);
  const [isExpenseClaimDialogOpen, setIsExpenseClaimDialogOpen] = useState(false);
  const [isPettyCashDialogOpen, setIsPettyCashDialogOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<ExpenseClaim | null>(null);
  const [isExpenseReviewDialogOpen, setIsExpenseReviewDialogOpen] = useState(false);
  const [isExpenseApprovalDialogOpen, setIsExpenseApprovalDialogOpen] = useState(false);
  const [expenseFinanceNotes, setExpenseFinanceNotes] = useState("");
  const [expenseMdNotes, setExpenseMdNotes] = useState("");
  const [expenseRejectionReason, setExpenseRejectionReason] = useState("");

  // Payment Processing States
  const [vendorPayments, setVendorPayments] = useState<VendorPayment[]>([]);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Asset Management States
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isAssetDialogOpen, setIsAssetDialogOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Audit Trail States
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const isMD = user?.role === "Managing Director";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load Invoice Data
    const mockPendingOrders: SalesOrder[] = [
      {
        id: "SO-2024-002",
        customer_name: "Fresh Mart Supermarket",
        order_date: "2024-03-16",
        required_date: "2024-03-26",
        total_amount: 95000,
        sales_rep_name: "John Doe",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 80, unit_price: 500, total_price: 40000 },
          { id: 2, product_name: "Pure Water 75cl (12-pack)", quantity: 50, unit_price: 600, total_price: 30000 },
          { id: 3, product_name: "Pure Water 5L (Individual)", quantity: 62, unit_price: 400, total_price: 25000 }
        ]
      }
    ];

    const mockInvoices: Invoice[] = [
      {
        id: "INV-2024-001",
        order_id: "SO-2024-001",
        customer_name: "Healthy Living Stores",
        invoice_date: "2024-03-15",
        due_date: "2024-04-14",
        total_amount: 125000,
        tax_amount: 9375,
        discount_amount: 0,
        net_amount: 134375,
        status: "PENDING_MD_APPROVAL",
        finance_notes: "Priority customer - approved credit terms",
        created_by: user?.fullName || "Finance Manager",
        created_at: "2024-03-15T10:30:00",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 100, unit_price: 500, total_price: 50000 }
        ]
      },
      {
        id: "INV-2024-002",
        order_id: "SO-2024-004",
        customer_name: "Metro Supermarket",
        invoice_date: "2024-03-16",
        due_date: "2024-04-15",
        total_amount: 95000,
        tax_amount: 7125,
        discount_amount: 0,
        net_amount: 102125,
        status: "APPROVED",
        finance_notes: "Regular customer",
        created_by: user?.fullName || "Finance Manager",
        created_at: "2024-03-16T11:20:00",
        approved_by: "Managing Director",
        approved_at: "2024-03-16T15:45:00",
        payment_type: "HALF",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 80, unit_price: 500, total_price: 40000 }
        ]
      },
      {
        id: "INV-2024-003",
        order_id: "SO-2024-003",
        customer_name: "Green Valley Distributors",
        invoice_date: "2024-03-17",
        due_date: "2024-05-01",
        total_amount: 180000,
        tax_amount: 13500,
        discount_amount: 5000,
        net_amount: 188500,
        status: "PAYMENT_CONFIRMED",
        finance_notes: "Volume discount applied",
        created_by: user?.fullName || "Finance Manager",
        created_at: "2024-03-17T09:15:00",
        approved_by: "Managing Director",
        approved_at: "2024-03-17T14:30:00",
        payment_type: "FULL",
        amount_paid: 188500,
        balance_due: 0,
        payment_confirmed_by: "Finance Manager",
        payment_confirmed_at: "2024-03-17T16:00:00",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 150, unit_price: 500, total_price: 75000 }
        ]
      }
    ];

    // Load Budget Data
    const mockBudgets: Budget[] = [
      { id: "1", department: "Production", category: "Raw Materials", allocated_amount: 2000000, spent_amount: 1650000, period: "Q1 2024", status: "WITHIN_BUDGET" },
      { id: "2", department: "Sales & Marketing", category: "Advertising", allocated_amount: 500000, spent_amount: 475000, period: "Q1 2024", status: "APPROACHING_LIMIT" },
      { id: "3", department: "Logistics", category: "Transportation", allocated_amount: 800000, spent_amount: 850000, period: "Q1 2024", status: "OVER_BUDGET" },
      { id: "4", department: "Administration", category: "Office Supplies", allocated_amount: 200000, spent_amount: 125000, period: "Q1 2024", status: "WITHIN_BUDGET" },
      { id: "5", department: "Laboratory", category: "Testing Equipment", allocated_amount: 300000, spent_amount: 245000, period: "Q1 2024", status: "WITHIN_BUDGET" }
    ];

    // Load Expense Claims
    const mockExpenseClaims: ExpenseClaim[] = [
      { id: "EC-001", employee_name: "Sarah Williams", department: "Sales", claim_date: "2024-03-18", amount: 45000, category: "Travel", description: "Client visit to Abuja", status: "PENDING_FINANCE_REVIEW", receipts: 3 },
      { id: "EC-002", employee_name: "Michael Johnson", department: "Production", claim_date: "2024-03-17", amount: 12500, category: "Materials", description: "Emergency spare parts purchase", status: "PENDING_MD_APPROVAL", receipts: 2, finance_notes: "Verified receipts - approved for MD review", reviewed_by: "Finance Manager" },
      { id: "EC-003", employee_name: "David Brown", department: "Logistics", claim_date: "2024-03-16", amount: 8000, category: "Fuel", description: "Delivery fuel expenses", status: "APPROVED", receipts: 5, approved_by: "Managing Director", approved_at: "2024-03-17T10:30:00" },
      { id: "EC-004", employee_name: "Grace Okafor", department: "Administration", claim_date: "2024-03-15", amount: 5500, category: "Office Supplies", description: "Stationery and office materials", status: "PAID", receipts: 2, approved_by: "Managing Director" }
    ];

    // Load Petty Cash
    const mockPettyCash: PettyCash[] = [
      { id: "PC-001", date: "2024-03-18", description: "Cash replenishment", category: "Inflow", amount: 50000, type: "INFLOW", balance: 95000, recorded_by: "Finance Officer" },
      { id: "PC-002", date: "2024-03-18", description: "Office refreshments", category: "Office Supplies", amount: 3500, type: "OUTFLOW", balance: 91500, recorded_by: "Finance Officer" },
      { id: "PC-003", date: "2024-03-17", description: "Security tips", category: "Miscellaneous", amount: 2000, type: "OUTFLOW", balance: 89500, recorded_by: "Finance Officer" }
    ];

    // Load Vendor Payments
    const mockVendorPayments: VendorPayment[] = [
      { id: "VP-001", vendor_name: "ABC Plastics Ltd", invoice_number: "INV-PL-2024-045", due_date: "2024-03-25", amount: 450000, payment_method: "TRANSFER", status: "SCHEDULED" },
      { id: "VP-002", vendor_name: "Clean Water Chemicals", invoice_number: "INV-CH-2024-123", due_date: "2024-03-22", amount: 180000, payment_method: "CHEQUE", status: "PROCESSING", cheque_number: "CHQ-001234" },
      { id: "VP-003", vendor_name: "Power Solutions Ltd", invoice_number: "INV-PS-2024-089", due_date: "2024-03-20", amount: 75000, payment_method: "TRANSFER", status: "PAID" }
    ];

    // Load Assets
    const mockAssets: Asset[] = [
      { id: "AST-001", name: "Bottling Machine #1", category: "Production Equipment", purchase_date: "2020-01-15", purchase_cost: 5000000, depreciation_method: "STRAIGHT_LINE", useful_life: 10, current_value: 3500000, status: "ACTIVE" },
      { id: "AST-002", name: "Delivery Truck (Toyota Dyna)", category: "Vehicles", purchase_date: "2021-06-20", purchase_cost: 8500000, depreciation_method: "DECLINING_BALANCE", useful_life: 8, current_value: 6200000, status: "ACTIVE" },
      { id: "AST-003", name: "Water Purification System", category: "Production Equipment", purchase_date: "2019-03-10", purchase_cost: 3500000, depreciation_method: "STRAIGHT_LINE", useful_life: 12, current_value: 2450000, status: "ACTIVE" },
      { id: "AST-004", name: "Forklift", category: "Material Handling", purchase_date: "2022-11-05", purchase_cost: 2200000, depreciation_method: "STRAIGHT_LINE", useful_life: 7, current_value: 1850000, status: "ACTIVE" }
    ];

    // Load Audit Logs
    const mockAuditLogs: AuditLog[] = [
      { id: "1", timestamp: "2024-03-18 14:30:25", user: "Finance Manager", action: "INVOICE_APPROVED", module: "Invoice Management", details: "Approved invoice INV-2024-003", ip_address: "192.168.1.45" },
      { id: "2", timestamp: "2024-03-18 13:15:10", user: "Managing Director", action: "BUDGET_MODIFIED", module: "Budget Management", details: "Updated Production budget for Q1 2024", ip_address: "192.168.1.10" },
      { id: "3", timestamp: "2024-03-18 11:45:32", user: "Finance Officer", action: "PAYMENT_PROCESSED", module: "Payment Processing", details: "Processed payment VP-003 to Power Solutions Ltd", ip_address: "192.168.1.47" },
      { id: "4", timestamp: "2024-03-17 16:20:15", user: "Finance Manager", action: "EXPENSE_CLAIM_APPROVED", module: "Expense Management", details: "Approved expense claim EC-002 for Michael Johnson", ip_address: "192.168.1.45" }
    ];

    setPendingOrders(mockPendingOrders);
    setInvoices(mockInvoices);
    setBudgets(mockBudgets);
    setExpenseClaims(mockExpenseClaims);
    setPettyCash(mockPettyCash);
    setVendorPayments(mockVendorPayments);
    setAssets(mockAssets);
    setAuditLogs(mockAuditLogs);
  };

  // ============= INVOICE MANAGEMENT FUNCTIONS =============

  const handleGenerateInvoice = (order: SalesOrder) => {
    setSelectedOrder(order);
    setInvoiceDate(new Date().toISOString().split('T')[0]);
    setPaymentTerms("30");
    setTaxRate("7.5");
    setDiscountAmount("0");
    setFinanceNotes("");
    setIsGenerateDialogOpen(true);
  };

  const submitInvoice = () => {
    if (!selectedOrder) return;
    if (!invoiceDate) {
      toast.error("Please select an invoice date");
      return;
    }

    const dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + parseInt(paymentTerms));

    const totalAmount = selectedOrder.total_amount;
    const discountAmt = parseFloat(discountAmount) || 0;
    const taxAmt = (totalAmount - discountAmt) * (parseFloat(taxRate) / 100);
    const netAmount = totalAmount - discountAmt + taxAmt;

    const newInvoice: Invoice = {
      id: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, '0')}`,
      order_id: selectedOrder.id,
      customer_name: selectedOrder.customer_name,
      invoice_date: invoiceDate,
      due_date: dueDate.toISOString().split('T')[0],
      total_amount: totalAmount,
      tax_amount: taxAmt,
      discount_amount: discountAmt,
      net_amount: netAmount,
      status: "DRAFT",
      finance_notes: financeNotes,
      created_by: user?.fullName || "Finance Manager",
      created_at: new Date().toISOString(),
      items: selectedOrder.items
    };

    setInvoices([newInvoice, ...invoices]);
    setPendingOrders(pendingOrders.filter(o => o.id !== selectedOrder.id));
    setIsGenerateDialogOpen(false);

    toast.success("Invoice generated successfully!", {
      description: `Invoice ${newInvoice.id} has been created as draft`
    });

    logAudit("INVOICE_CREATED", "Invoice Management", `Created invoice ${newInvoice.id}`);
  };

  const handleSendToMD = (invoice: Invoice) => {
    const updatedInvoice = { ...invoice, status: 'PENDING_MD_APPROVAL' as const };
    setInvoices(invoices.map(inv => inv.id === invoice.id ? updatedInvoice : inv));
    toast.success("Invoice sent for MD approval", {
      description: `Invoice ${invoice.id} is now awaiting Managing Director approval`
    });
    logAudit("INVOICE_SENT_FOR_APPROVAL", "Invoice Management", `Sent invoice ${invoice.id} for MD approval`);
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsViewDialogOpen(true);
  };

  const handleMDApproval = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setMdNotes("");
    setRejectionReason("");
    setSelectedPaymentType('FULL'); // Default to full payment
    setIsApprovalDialogOpen(true);
  };

  const submitMDApproval = (approved: boolean) => {
    if (!selectedInvoice) return;
    if (!approved && !rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    if (approved) {
      // If approving, show payment type selection
      const updatedInvoice = {
        ...selectedInvoice,
        status: 'APPROVED' as const,
        md_notes: mdNotes,
        approved_by: user?.fullName,
        approved_at: new Date().toISOString(),
        payment_type: selectedPaymentType
      };

      setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
      setIsApprovalDialogOpen(false);
      
      toast.success(`Invoice approved with ${selectedPaymentType} payment!`, {
        description: selectedPaymentType === 'CREDIT' 
          ? "Credit invoice - no immediate payment required" 
          : "Finance can now prepare payment confirmation"
      });
      logAudit("INVOICE_APPROVED", "Invoice Management", `Approved invoice ${selectedInvoice.id} with ${selectedPaymentType} payment`);
    } else {
      const updatedInvoice = {
        ...selectedInvoice,
        status: 'REJECTED' as const,
        md_notes: rejectionReason,
        rejection_reason: rejectionReason
      };

      setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
      setIsApprovalDialogOpen(false);
      toast.error("Invoice rejected");
      logAudit("INVOICE_REJECTED", "Invoice Management", `Rejected invoice ${selectedInvoice.id}: ${rejectionReason}`);
    }
  };

  const handlePreparePayment = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount("");
    setIsPaymentConfirmDialogOpen(true);
  };

  const submitPaymentConfirmation = () => {
    if (!selectedInvoice) return;
    
    const paidAmount = parseFloat(paymentAmount);
    if (isNaN(paidAmount) || paidAmount < 0) {
      toast.error("Please enter a valid payment amount");
      return;
    }

    if (selectedInvoice.payment_type === 'FULL' && paidAmount !== selectedInvoice.net_amount) {
      toast.error("Full payment amount must match invoice total");
      return;
    }

    if (selectedInvoice.payment_type === 'HALF' && paidAmount > selectedInvoice.net_amount) {
      toast.error("Payment amount cannot exceed invoice total");
      return;
    }

    const balanceDue = selectedInvoice.net_amount - paidAmount;

    const updatedInvoice = {
      ...selectedInvoice,
      status: 'PAYMENT_CONFIRMED' as const,
      amount_paid: paidAmount,
      balance_due: balanceDue,
      payment_confirmed_by: user?.fullName,
      payment_confirmed_at: new Date().toISOString()
    };

    setInvoices(invoices.map(inv => inv.id === selectedInvoice.id ? updatedInvoice : inv));
    setIsPaymentConfirmDialogOpen(false);

    toast.success("Payment confirmed successfully!", {
      description: `Amount paid: ₦${paidAmount.toLocaleString()}${balanceDue > 0 ? ` | Balance: ₦${balanceDue.toLocaleString()}` : ''}`
    });
    
    logAudit("PAYMENT_CONFIRMED", "Invoice Management", 
      `Confirmed payment for invoice ${selectedInvoice.id}: Paid ₦${paidAmount.toLocaleString()}, Balance ₦${balanceDue.toLocaleString()}`);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // Generate HTML content for the invoice
    const invoiceHTML = generateInvoiceHTML(invoice);
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=900,height=1200');
    
    if (!printWindow) {
      toast.error("Please allow pop-ups to print invoices");
      return;
    }
    
    // Write the HTML content to the new window
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = function() {
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
    
    logAudit("INVOICE_PRINTED", "Invoice Management", `Opened invoice ${invoice.id} for printing`);
  };

  const generateInvoiceHTML = (invoice: Invoice) => {
    const logoUrl = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHJ4PSIxMiIgZmlsbD0iIzI1NjNlYiIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5IPC90ZXh0Pgo8L3N2Zz4=';
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.id} - Hari Industries Limited</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f3f4f6;
      padding: 20px;
    }
    
    .invoice-container {
      max-width: 210mm;
      margin: 0 auto;
      background: white;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    
    .header {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    
    .company-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .logo {
      width: 64px;
      height: 64px;
      background: white;
      border-radius: 8px;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    
    .company-name h1 {
      font-size: 1.5rem;
      font-weight: bold;
      margin-bottom: 0.25rem;
    }
    
    .company-tagline {
      color: #bfdbfe;
      font-size: 0.875rem;
    }
    
    .invoice-title h2 {
      font-size: 2rem;
      font-weight: bold;
      text-align: right;
    }
    
    .invoice-number {
      color: #bfdbfe;
      text-align: right;
    }
    
    .section {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .section-gray {
      background-color: #f9fafb;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
    
    .section-title {
      font-weight: 600;
      font-size: 0.875rem;
      color: #111827;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }
    
    .info-label {
      font-weight: 500;
    }
    
    .customer-box {
      background: #eff6ff;
      padding: 1rem;
      border-radius: 8px;
    }
    
    .customer-name {
      font-weight: bold;
      font-size: 1.125rem;
      color: #111827;
      margin-bottom: 0.5rem;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
    }
    
    thead {
      background-color: #f3f4f6;
    }
    
    th {
      padding: 0.75rem;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
      text-align: left;
      border-bottom: 2px solid #d1d5db;
    }
    
    th.text-center {
      text-align: center;
    }
    
    th.text-right {
      text-align: right;
    }
    
    td {
      padding: 0.75rem;
      border-bottom: 1px solid #e5e7eb;
    }
    
    td.text-center {
      text-align: center;
    }
    
    td.text-right {
      text-align: right;
    }
    
    .item-name {
      font-weight: 500;
      color: #111827;
    }
    
    .item-desc {
      font-size: 0.875rem;
      color: #6b7280;
    }
    
    .totals-section {
      display: flex;
      justify-content: flex-end;
      padding: 1.5rem 2rem;
      background-color: #f9fafb;
    }
    
    .totals-box {
      width: 400px;
    }
    
    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.75rem;
      color: #374151;
    }
    
    .total-row.discount {
      color: #16a34a;
    }
    
    .total-final {
      padding-top: 0.75rem;
      border-top: 2px solid #d1d5db;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .total-final-label {
      font-size: 1.25rem;
      font-weight: bold;
      color: #111827;
    }
    
    .total-final-amount {
      font-size: 1.5rem;
      font-weight: bold;
      color: #2563eb;
    }
    
    .payment-status-box {
      background: #eff6ff;
      padding: 1rem;
      border-radius: 8px;
      margin-top: 1rem;
    }
    
    .payment-status-title {
      font-weight: 600;
      font-size: 0.75rem;
      color: #111827;
      text-transform: uppercase;
      margin-bottom: 0.5rem;
    }
    
    .payment-type-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .payment-type-full {
      background-color: #dcfce7;
      color: #166534;
    }
    
    .payment-type-half {
      background-color: #fed7aa;
      color: #92400e;
    }
    
    .payment-type-credit {
      background-color: #fee2e2;
      color: #991b1b;
    }
    
    .payment-row {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem 0;
      font-size: 0.875rem;
    }
    
    .payment-row.border-top {
      border-top: 1px solid #d1d5db;
    }
    
    .amount-paid {
      color: #16a34a;
      font-weight: bold;
    }
    
    .balance-due {
      color: #dc2626;
      font-weight: bold;
    }
    
    .paid-full-badge {
      background-color: #dcfce7;
      padding: 0.5rem;
      border-radius: 4px;
      text-align: center;
      color: #166534;
      font-weight: 600;
      margin-top: 0.5rem;
    }
    
    .credit-warning {
      background-color: #fef2f2;
      padding: 0.75rem;
      border-radius: 4px;
      border: 1px solid: #fecaca;
      color: #991b1b;
      font-size: 0.875rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }
    
    .payment-confirmed {
      font-size: 0.75rem;
      color: #6b7280;
      padding-top: 0.5rem;
      border-top: 1px solid #d1d5db;
      margin-top: 0.5rem;
    }
    
    .footer {
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
      color: white;
      padding: 1.5rem 2rem;
      text-align: center;
    }
    
    .footer-thank-you {
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    
    .footer-note {
      font-size: 0.75rem;
      color: #bfdbfe;
      margin-top: 0.5rem;
    }
    
    .footer-company-info {
      margin-top: 1rem;
      font-size: 0.75rem;
      color: #bfdbfe;
    }
    
    /* Print Styles */
    @media print {
      @page {
        size: A4;
        margin: 10mm;
      }
      
      body {
        background-color: white;
        padding: 0;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
      
      .invoice-container {
        box-shadow: none;
        max-width: 100%;
      }
      
      .header,
      .footer,
      .section-gray,
      .customer-box,
      .payment-status-box,
      .payment-type-badge,
      .paid-full-badge,
      .credit-warning {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      
      table,
      .header,
      .footer {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <!-- Header -->
    <div class="header">
      <div class="company-info">
        <div class="logo">
          <img src="${logoUrl}" alt="Hari Industries Limited">
        </div>
        <div class="company-name">
          <h1>HARI INDUSTRIES LIMITED</h1>
          <div class="company-tagline">Excellence in Water Processing & Distribution</div>
        </div>
      </div>
      <div class="invoice-title">
        <h2>INVOICE</h2>
        <div class="invoice-number">#${invoice.id}</div>
      </div>
    </div>
    
    <!-- Company & Invoice Details -->
    <div class="section section-gray">
      <div class="grid-2">
        <div>
          <h3 class="section-title">Company Address</h3>
          <div style="color: #374151; font-size: 0.875rem;">
            <p>Kano-Kaduna Expressway</p>
            <p>Maraban Gwanda, Sabon Gari</p>
            <p>Zaria, Kaduna State</p>
            <p>Nigeria</p>
            <div style="margin-top: 1rem;">
              <p><span class="info-label">Phone:</span> +234-800-HARI-IND</p>
              <p><span class="info-label">Email:</span> info@hariindustries.com</p>
              <p><span class="info-label">Website:</span> www.hariindustries.com</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="section-title">Invoice Details</h3>
          <div class="info-row">
            <span class="info-label">Invoice Date:</span>
            <span>${new Date(invoice.invoice_date).toLocaleDateString('en-GB')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Due Date:</span>
            <span>${new Date(invoice.due_date).toLocaleDateString('en-GB')}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Order ID:</span>
            <span>${invoice.order_id}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Sales Rep:</span>
            <span>${invoice.created_by}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Customer Details -->
    <div class="section">
      <h3 class="section-title">Bill To:</h3>
      <div class="customer-box">
        <div class="customer-name">${invoice.customer_name}</div>
      </div>
    </div>
    
    <!-- Items -->
    <div class="section">
      <h3 class="section-title">Items</h3>
      <table>
        <thead>
          <tr>
            <th>DESCRIPTION</th>
            <th class="text-center">QTY</th>
            <th class="text-right">UNIT PRICE</th>
            <th class="text-right">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map(item => `
            <tr>
              <td>
                <div class="item-name">${item.product_name}</div>
                <div class="item-desc">Premium Quality Water Product</div>
              </td>
              <td class="text-center">${item.quantity}</td>
              <td class="text-right">₦${item.unit_price.toLocaleString()}</td>
              <td class="text-right"><strong>₦${item.total_price.toLocaleString()}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    
    <!-- Totals -->
    <div class="totals-section">
      <div class="totals-box">
        <div class="total-row">
          <span>Subtotal:</span>
          <span>₦${invoice.total_amount.toLocaleString()}</span>
        </div>
        ${invoice.discount_amount > 0 ? `
          <div class="total-row discount">
            <span>Discount:</span>
            <span>-₦${invoice.discount_amount.toLocaleString()}</span>
          </div>
        ` : ''}
        <div class="total-row">
          <span>VAT (7.5%):</span>
          <span>₦${invoice.tax_amount.toLocaleString()}</span>
        </div>
        <div class="total-final">
          <span class="total-final-label">TOTAL:</span>
          <span class="total-final-amount">₦${invoice.net_amount.toLocaleString()}</span>
        </div>
        
        ${invoice.payment_type ? `
          <div class="payment-status-box">
            <div class="payment-status-title">Payment Status</div>
            <div class="payment-row">
              <span class="info-label">Payment Type:</span>
              <span class="payment-type-badge ${
                invoice.payment_type === 'FULL' ? 'payment-type-full' :
                invoice.payment_type === 'HALF' ? 'payment-type-half' :
                'payment-type-credit'
              }">
                ${invoice.payment_type === 'FULL' ? 'FULL PAYMENT' :
                  invoice.payment_type === 'HALF' ? 'PARTIAL PAYMENT' :
                  'CREDIT - NO IMMEDIATE PAYMENT'}
              </span>
            </div>
            
            ${invoice.payment_type !== 'CREDIT' && invoice.amount_paid !== undefined ? `
              <div class="payment-row border-top">
                <span class="info-label">Amount Paid:</span>
                <span class="amount-paid">₦${invoice.amount_paid.toLocaleString()}</span>
              </div>
              
              ${invoice.balance_due !== undefined && invoice.balance_due > 0 ? `
                <div class="payment-row">
                  <span class="info-label">Balance Due:</span>
                  <span class="balance-due">₦${invoice.balance_due.toLocaleString()}</span>
                </div>
              ` : ''}
              
              ${invoice.balance_due === 0 ? `
                <div class="paid-full-badge">
                  ✓ PAID IN FULL
                </div>
              ` : ''}
            ` : ''}
            
            ${invoice.payment_type === 'CREDIT' ? `
              <div class="credit-warning">
                ⚠️ This invoice is on CREDIT. Full amount of ₦${invoice.net_amount.toLocaleString()} is outstanding and payable as per agreed terms.
              </div>
            ` : ''}
            
            ${invoice.payment_confirmed_by ? `
              <div class="payment-confirmed">
                <p>Payment confirmed by: ${invoice.payment_confirmed_by}</p>
                ${invoice.payment_confirmed_at ? `
                  <p>Date: ${new Date(invoice.payment_confirmed_at).toLocaleString('en-GB')}</p>
                ` : ''}
              </div>
            ` : ''}
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Payment & Terms -->
    <div class="section">
      <div class="grid-2">
        <div>
          <h3 class="section-title">Payment Information</h3>
          <div style="font-size: 0.875rem; color: #374151;">
            <p><span class="info-label">Bank:</span> First Bank of Nigeria</p>
            <p><span class="info-label">Account Name:</span> Hari Industries Limited</p>
            <p><span class="info-label">Account Number:</span> 2034567890</p>
            <p><span class="info-label">Sort Code:</span> 011-151-003</p>
          </div>
        </div>
        <div>
          <h3 class="section-title">Terms & Conditions</h3>
          <div style="font-size: 0.875rem; color: #374151;">
            <p>• Payment is due within 30 days of invoice date</p>
            <p>• Late payment may incur additional charges</p>
            <p>• All goods remain property of Hari Industries until paid</p>
            <p>• Please quote invoice number on all payments</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p class="footer-thank-you">Thank you for your business!</p>
      <p class="footer-note">
        This is a computer-generated invoice and does not require a signature.
      </p>
      <div class="footer-company-info">
        Hari Industries Limited • RC: 123456 • VAT: NG7890123456
      </div>
    </div>
  </div>
</body>
</html>
    `;
  };

  // ============= BUDGET MANAGEMENT FUNCTIONS =============

  const handleCreateBudget = () => {
    if (!newBudgetDept || !newBudgetCategory || !newBudgetAmount || !newBudgetPeriod) {
      toast.error("Please fill in all budget fields");
      return;
    }

    const newBudget: Budget = {
      id: String(budgets.length + 1),
      department: newBudgetDept,
      category: newBudgetCategory,
      allocated_amount: parseFloat(newBudgetAmount),
      spent_amount: 0,
      period: newBudgetPeriod,
      status: "WITHIN_BUDGET"
    };

    setBudgets([...budgets, newBudget]);
    setIsBudgetDialogOpen(false);
    toast.success("Budget created successfully!");
    logAudit("BUDGET_CREATED", "Budget Management", `Created budget for ${newBudgetDept} - ${newBudgetCategory}`);
    
    setNewBudgetDept("");
    setNewBudgetCategory("");
    setNewBudgetAmount("");
    setNewBudgetPeriod("");
  };

  // ============= EXPENSE MANAGEMENT FUNCTIONS =============

  const handleReviewExpense = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    setExpenseFinanceNotes("");
    setExpenseRejectionReason("");
    setIsExpenseReviewDialogOpen(true);
  };

  const submitFinanceReview = (sendToMD: boolean) => {
    if (!selectedClaim) return;
    
    if (!sendToMD && !expenseRejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const updatedClaim = {
      ...selectedClaim,
      status: sendToMD ? 'PENDING_MD_APPROVAL' as const : 'REJECTED' as const,
      finance_notes: sendToMD ? expenseFinanceNotes : undefined,
      rejection_reason: !sendToMD ? expenseRejectionReason : undefined,
      reviewed_by: user?.fullName
    };

    setExpenseClaims(expenseClaims.map(c => c.id === selectedClaim.id ? updatedClaim : c));
    setIsExpenseReviewDialogOpen(false);

    if (sendToMD) {
      toast.success("Expense claim sent to MD for approval");
      logAudit("EXPENSE_SENT_TO_MD", "Expense Management", `Sent expense claim ${selectedClaim.id} to MD for approval`);
    } else {
      toast.error("Expense claim rejected");
      logAudit("EXPENSE_REJECTED", "Expense Management", `Rejected expense claim ${selectedClaim.id}: ${expenseRejectionReason}`);
    }
  };

  const handleMDExpenseApproval = (claim: ExpenseClaim) => {
    setSelectedClaim(claim);
    setExpenseMdNotes("");
    setExpenseRejectionReason("");
    setIsExpenseApprovalDialogOpen(true);
  };

  const submitMDExpenseApproval = (approved: boolean) => {
    if (!selectedClaim) return;
    
    if (!approved && !expenseRejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    const updatedClaim = {
      ...selectedClaim,
      status: approved ? 'APPROVED' as const : 'REJECTED' as const,
      md_notes: approved ? expenseMdNotes : undefined,
      rejection_reason: !approved ? expenseRejectionReason : undefined,
      approved_by: approved ? user?.fullName : undefined,
      approved_at: approved ? new Date().toISOString() : undefined
    };

    setExpenseClaims(expenseClaims.map(c => c.id === selectedClaim.id ? updatedClaim : c));
    setIsExpenseApprovalDialogOpen(false);

    if (approved) {
      toast.success("Expense claim approved successfully!");
      logAudit("EXPENSE_APPROVED", "Expense Management", `Approved expense claim ${selectedClaim.id} for ${selectedClaim.employee_name}`);
    } else {
      toast.error("Expense claim rejected");
      logAudit("EXPENSE_REJECTED", "Expense Management", `Rejected expense claim ${selectedClaim.id}: ${expenseRejectionReason}`);
    }
  };

  const handleMarkAsPaid = (claim: ExpenseClaim) => {
    const updatedClaim = { ...claim, status: 'PAID' as const };
    setExpenseClaims(expenseClaims.map(c => c.id === claim.id ? updatedClaim : c));
    toast.success("Expense claim marked as paid");
    logAudit("EXPENSE_PAID", "Expense Management", `Marked expense claim ${claim.id} as paid`);
  };

  // ============= AUDIT TRAIL FUNCTION =============

  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: String(auditLogs.length + 1),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: user?.fullName || "Unknown User",
      action: action,
      module: module,
      details: details,
      ip_address: "192.168.1." + Math.floor(Math.random() * 255)
    };
    setAuditLogs([newLog, ...auditLogs]);
  };

  // ============= HELPER FUNCTIONS =============

  const getStatusBadge = (status: string, paymentType?: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      'DRAFT': { label: 'Draft', color: 'bg-gray-100 text-gray-800 border-gray-200', icon: FileText },
      'PENDING_MD_APPROVAL': { label: 'Pending MD Approval', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Clock },
      'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle },
      'APPROVED': { label: 'Approved - Pending Payment', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertTriangle },
      'PAYMENT_CONFIRMED': { label: 'Payment Confirmed', color: 'bg-green-100 text-green-800 border-green-200', icon: CheckCircle }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];
    const Icon = config.icon;

    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className={config.color}>
          <Icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
        {paymentType && (
          <Badge variant="outline" className={
            paymentType === 'CREDIT' ? 'bg-red-50 text-red-700 border-red-200' :
            paymentType === 'HALF' ? 'bg-orange-50 text-orange-700 border-orange-200' :
            'bg-green-50 text-green-700 border-green-200'
          }>
            {paymentType}
          </Badge>
        )}
      </div>
    );
  };

  const getBudgetStatusBadge = (status: string) => {
    const config: Record<string, { color: string; label: string }> = {
      'WITHIN_BUDGET': { color: 'bg-green-100 text-green-800 border-green-200', label: 'Within Budget' },
      'APPROACHING_LIMIT': { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'Approaching Limit' },
      'OVER_BUDGET': { color: 'bg-red-100 text-red-800 border-red-200', label: 'Over Budget' }
    };
    const { color, label } = config[status];
    return <Badge variant="outline" className={color}>{label}</Badge>;
  };

  // Calculate metrics
  const totalInvoices = invoices.length;
  const pendingMDApproval = invoices.filter(inv => inv.status === 'PENDING_MD_APPROVAL').length;
  const approvedInvoices = invoices.filter(inv => inv.status === 'APPROVED').length;
  const paymentConfirmedInvoices = invoices.filter(inv => inv.status === 'PAYMENT_CONFIRMED').length;
  const totalBudgetAllocated = budgets.reduce((sum, b) => sum + b.allocated_amount, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spent_amount, 0);
  const pendingExpenses = expenseClaims.filter(c => c.status === 'PENDING_FINANCE_REVIEW').length;
  const pendingMDExpenses = expenseClaims.filter(c => c.status === 'PENDING_MD_APPROVAL').length;
  const pettyCashBalance = pettyCash.length > 0 ? pettyCash[0].balance : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Finance Management</h1>
        <p className="text-gray-600">Comprehensive financial operations and reporting</p>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600 mb-1">Invoices</p>
                <h3 className="text-xl font-bold text-blue-900">{totalInvoices}</h3>
              </div>
              <FileText className="h-8 w-8 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-orange-600 mb-1">Awaiting Payment</p>
                <h3 className="text-xl font-bold text-orange-900">{approvedInvoices}</h3>
              </div>
              <DollarSign className="h-8 w-8 text-orange-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-green-600 mb-1">Budget Used</p>
                <h3 className="text-xl font-bold text-green-900">{Math.round((totalBudgetSpent / totalBudgetAllocated) * 100)}%</h3>
              </div>
              <PieChart className="h-8 w-8 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-purple-600 mb-1">Petty Cash</p>
                <h3 className="text-lg font-bold text-purple-900">₦{pettyCashBalance.toLocaleString()}</h3>
              </div>
              <Wallet className="h-8 w-8 text-purple-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 mb-1">Pending Claims</p>
                <h3 className="text-xl font-bold text-red-900">{pendingExpenses}</h3>
              </div>
              <Receipt className="h-8 w-8 text-red-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-600 mb-1">Total Assets</p>
                <h3 className="text-xl font-bold text-indigo-900">{assets.length}</h3>
              </div>
              <Building2 className="h-8 w-8 text-indigo-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="invoices">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="budgets">
            <Calculator className="h-4 w-4 mr-2" />
            Budgets
          </TabsTrigger>
          <TabsTrigger value="expenses">
            <Receipt className="h-4 w-4 mr-2" />
            Expenses
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="assets">
            <Building2 className="h-4 w-4 mr-2" />
            Assets
          </TabsTrigger>
          <TabsTrigger value="reports">
            <BarChart3 className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="audit">
            <ShieldCheck className="h-4 w-4 mr-2" />
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* INVOICES TAB */}
        <TabsContent value="invoices" className="space-y-4">
          <Tabs defaultValue="pending-orders">
            <TabsList>
              <TabsTrigger value="pending-orders">
                Pending Orders ({pendingOrders.length})
              </TabsTrigger>
              <TabsTrigger value="all-invoices">
                All Invoices ({totalInvoices})
              </TabsTrigger>
              <TabsTrigger value="md-approval">
                MD Approval ({pendingMDApproval})
              </TabsTrigger>
            </TabsList>

            {/* Pending Orders Sub-tab */}
            <TabsContent value="pending-orders">
              <Card>
                <CardHeader>
                  <CardTitle>Orders Awaiting Invoice Generation</CardTitle>
                </CardHeader>
                <CardContent>
                  {pendingOrders.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No pending orders</p>
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Sales Rep</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingOrders.map((order) => (
                            <TableRow key={order.id}>
                              <TableCell className="font-medium">{order.id}</TableCell>
                              <TableCell>{order.customer_name}</TableCell>
                              <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                              <TableCell>{order.sales_rep_name}</TableCell>
                              <TableCell>
                                <Button size="sm" onClick={() => handleGenerateInvoice(order)}>
                                  <Plus className="h-3 w-3 mr-1" />
                                  Generate Invoice
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Invoices Sub-tab */}
            <TabsContent value="all-invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Net Amount</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.customer_name}</TableCell>
                            <TableCell>₦{invoice.net_amount.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(invoice.status, invoice.payment_type)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {invoice.status === 'DRAFT' && (
                                  <Button variant="ghost" size="sm" onClick={() => handleSendToMD(invoice)}>
                                    <Send className="h-3 w-3 text-blue-600" />
                                  </Button>
                                )}
                                {invoice.status === 'APPROVED' && invoice.payment_type !== 'CREDIT' && (
                                  <Button size="sm" onClick={() => handlePreparePayment(invoice)}>
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    Prepare Payment
                                  </Button>
                                )}
                                {(invoice.status === 'PAYMENT_CONFIRMED' || (invoice.status === 'APPROVED' && invoice.payment_type === 'CREDIT')) && (
                                  <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(invoice)}>
                                    <Printer className="h-3 w-3 mr-1" />
                                    Print
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* MD Approval Sub-tab */}
            <TabsContent value="md-approval">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Invoices Pending MD Approval</CardTitle>
                    {!isMD && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        View Only
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Net Amount</TableHead>
                          <TableHead>Created By</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invoices.filter(inv => inv.status === 'PENDING_MD_APPROVAL').map((invoice) => (
                          <TableRow key={invoice.id}>
                            <TableCell className="font-medium">{invoice.id}</TableCell>
                            <TableCell>{invoice.customer_name}</TableCell>
                            <TableCell>₦{invoice.net_amount.toLocaleString()}</TableCell>
                            <TableCell>{invoice.created_by}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleViewInvoice(invoice)}>
                                  <Eye className="h-3 w-3" />
                                </Button>
                                {isMD && (
                                  <Button size="sm" onClick={() => handleMDApproval(invoice)}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* BUDGETS TAB */}
        <TabsContent value="budgets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Departmental Budgets - Q1 2024</CardTitle>
                <Button onClick={() => setIsBudgetDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Budget
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.map((budget) => {
                  const percentage = (budget.spent_amount / budget.allocated_amount) * 100;
                  return (
                    <Card key={budget.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-semibold">{budget.department} - {budget.category}</h4>
                            <p className="text-sm text-gray-600">{budget.period}</p>
                          </div>
                          {getBudgetStatusBadge(budget.status)}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Allocated: ₦{budget.allocated_amount.toLocaleString()}</span>
                            <span>Spent: ₦{budget.spent_amount.toLocaleString()}</span>
                          </div>
                          <Progress value={percentage} className="h-2" />
                          <p className="text-xs text-right text-gray-600">
                            {percentage.toFixed(1)}% utilized
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXPENSES TAB */}
        <TabsContent value="expenses" className="space-y-4">
          <Tabs defaultValue="expense-claims">
            <TabsList>
              <TabsTrigger value="expense-claims">
                Expense Claims ({pendingExpenses})
              </TabsTrigger>
              <TabsTrigger value="md-expense-approval">
                MD Approval ({pendingMDExpenses})
              </TabsTrigger>
              <TabsTrigger value="petty-cash">Petty Cash</TabsTrigger>
            </TabsList>

            <TabsContent value="expense-claims">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Expense Claims & Reimbursements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Claim ID</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead>Department</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenseClaims.map((claim) => (
                          <TableRow key={claim.id}>
                            <TableCell className="font-medium">{claim.id}</TableCell>
                            <TableCell>{claim.employee_name}</TableCell>
                            <TableCell>{claim.department}</TableCell>
                            <TableCell>{claim.category}</TableCell>
                            <TableCell>₦{claim.amount.toLocaleString()}</TableCell>
                            <TableCell>{new Date(claim.claim_date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge variant={
                                claim.status === 'APPROVED' ? 'default' :
                                claim.status === 'REJECTED' ? 'destructive' :
                                claim.status === 'PAID' ? 'default' :
                                'outline'
                              } className={
                                claim.status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
                                claim.status === 'PAID' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                claim.status === 'PENDING_FINANCE_REVIEW' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                                claim.status === 'PENDING_MD_APPROVAL' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : ''
                              }>
                                {claim.status === 'PENDING_FINANCE_REVIEW' ? 'Pending Review' :
                                 claim.status === 'PENDING_MD_APPROVAL' ? 'Pending MD' :
                                 claim.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                {claim.status === 'PENDING_FINANCE_REVIEW' && (
                                  <Button size="sm" onClick={() => handleReviewExpense(claim)}>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Review
                                  </Button>
                                )}
                                {claim.status === 'APPROVED' && (
                                  <Button size="sm" variant="outline" onClick={() => handleMarkAsPaid(claim)}>
                                    <Banknote className="h-3 w-3 mr-1" />
                                    Mark Paid
                                  </Button>
                                )}
                                {claim.status === 'PAID' && (
                                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="md-expense-approval">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Expense Claims Pending MD Approval</CardTitle>
                    {!isMD && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Clock className="h-3 w-3 mr-1" />
                        View Only - Awaiting MD Review
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {expenseClaims.filter(c => c.status === 'PENDING_MD_APPROVAL').length === 0 ? (
                    <div className="text-center py-12">
                      <CheckCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No expense claims pending MD approval</p>
                      <p className="text-sm text-gray-400 mt-2">
                        {isMD ? "Expense claims sent for approval will appear here" : "Track claims you've sent for MD approval"}
                      </p>
                    </div>
                  ) : (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Claim ID</TableHead>
                            <TableHead>Employee</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Reviewed By</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenseClaims.filter(c => c.status === 'PENDING_MD_APPROVAL').map((claim) => (
                            <TableRow key={claim.id}>
                              <TableCell className="font-medium">{claim.id}</TableCell>
                              <TableCell>{claim.employee_name}</TableCell>
                              <TableCell>{claim.department}</TableCell>
                              <TableCell>{claim.category}</TableCell>
                              <TableCell>₦{claim.amount.toLocaleString()}</TableCell>
                              <TableCell>{claim.reviewed_by}</TableCell>
                              <TableCell>
                                <div className="flex items-center space-x-2">
                                  {isMD ? (
                                    <Button size="sm" onClick={() => handleMDExpenseApproval(claim)}>
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Review
                                    </Button>
                                  ) : (
                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Awaiting MD
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="petty-cash">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Petty Cash Tracking</CardTitle>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Current Balance</p>
                      <p className="text-2xl font-bold text-green-600">₦{pettyCashBalance.toLocaleString()}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Inflow</TableHead>
                          <TableHead>Outflow</TableHead>
                          <TableHead>Balance</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {pettyCash.map((entry) => (
                          <TableRow key={entry.id}>
                            <TableCell>{new Date(entry.date).toLocaleDateString()}</TableCell>
                            <TableCell>{entry.description}</TableCell>
                            <TableCell>{entry.category}</TableCell>
                            <TableCell className="text-green-600">
                              {entry.type === 'INFLOW' ? `₦${entry.amount.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="text-red-600">
                              {entry.type === 'OUTFLOW' ? `₦${entry.amount.toLocaleString()}` : '-'}
                            </TableCell>
                            <TableCell className="font-medium">₦{entry.balance.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* PAYMENTS TAB */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Payment Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Invoice</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vendorPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.id}</TableCell>
                        <TableCell>{payment.vendor_name}</TableCell>
                        <TableCell>{payment.invoice_number}</TableCell>
                        <TableCell>{new Date(payment.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>₦{payment.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {payment.payment_method}
                            {payment.cheque_number && ` - ${payment.cheque_number}`}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            payment.status === 'PAID' ? 'default' :
                            payment.status === 'FAILED' ? 'destructive' :
                            'outline'
                          } className={
                            payment.status === 'PAID' ? 'bg-green-100 text-green-800 border-green-200' :
                            payment.status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                            payment.status === 'SCHEDULED' ? 'bg-orange-100 text-orange-800 border-orange-200' : ''
                          }>
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSETS TAB */}
        <TabsContent value="assets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Asset & Depreciation Tracking</CardTitle>
                <Button onClick={() => setIsAssetDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Asset
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Purchase Cost</TableHead>
                      <TableHead>Current Value</TableHead>
                      <TableHead>Depreciation</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => {
                      const depreciationAmount = asset.purchase_cost - asset.current_value;
                      const depreciationPercent = (depreciationAmount / asset.purchase_cost) * 100;
                      
                      return (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">{asset.id}</TableCell>
                          <TableCell>{asset.name}</TableCell>
                          <TableCell>{asset.category}</TableCell>
                          <TableCell>₦{asset.purchase_cost.toLocaleString()}</TableCell>
                          <TableCell>₦{asset.current_value.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">₦{depreciationAmount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{depreciationPercent.toFixed(1)}%</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={asset.status === 'ACTIVE' ? 'default' : 'outline'}
                              className={asset.status === 'ACTIVE' ? 'bg-green-100 text-green-800 border-green-200' : ''}>
                              {asset.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* REPORTS TAB */}
        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <FileBarChart className="h-12 w-12 mx-auto text-blue-600" />
                  <h3 className="font-semibold">Profit & Loss Statement</h3>
                  <p className="text-sm text-gray-600">Comprehensive income and expense analysis</p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <BarChart3 className="h-12 w-12 mx-auto text-green-600" />
                  <h3 className="font-semibold">Balance Sheet</h3>
                  <p className="text-sm text-gray-600">Assets, liabilities, and equity overview</p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <TrendingUp className="h-12 w-12 mx-auto text-purple-600" />
                  <h3 className="font-semibold">Cash Flow Statement</h3>
                  <p className="text-sm text-gray-600">Operating, investing, and financing activities</p>
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AUDIT TRAIL TAB */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail & Compliance Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-sm">{log.timestamp}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Users className="h-3 w-3 text-gray-500" />
                            <span>{log.user}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.module}</TableCell>
                        <TableCell className="text-sm">{log.details}</TableCell>
                        <TableCell className="text-sm text-gray-500">{log.ip_address}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOGS - Invoice Generation */}
      <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Generate Invoice</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Configure invoice parameters. Invoice will be saved as draft.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Date</Label>
                  <Input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
                </div>
                <div>
                  <Label>Payment Terms (Days)</Label>
                  <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 Days</SelectItem>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="45">45 Days</SelectItem>
                      <SelectItem value="60">60 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input type="number" step="0.1" value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                </div>
                <div>
                  <Label>Discount Amount (₦)</Label>
                  <Input type="number" value={discountAmount} onChange={(e) => setDiscountAmount(e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Finance Notes</Label>
                <Textarea value={financeNotes} onChange={(e) => setFinanceNotes(e.target.value)} rows={3} />
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsGenerateDialogOpen(false)}>Cancel</Button>
                <Button onClick={submitInvoice}>Generate Invoice</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Budget Creation Dialog */}
      <Dialog open={isBudgetDialogOpen} onOpenChange={setIsBudgetDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Department Budget</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select value={newBudgetDept} onValueChange={setNewBudgetDept}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Sales & Marketing">Sales & Marketing</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Laboratory">Laboratory</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Category</Label>
              <Input value={newBudgetCategory} onChange={(e) => setNewBudgetCategory(e.target.value)} placeholder="e.g., Raw Materials" />
            </div>
            <div>
              <Label>Allocated Amount (₦)</Label>
              <Input type="number" value={newBudgetAmount} onChange={(e) => setNewBudgetAmount(e.target.value)} />
            </div>
            <div>
              <Label>Period</Label>
              <Select value={newBudgetPeriod} onValueChange={setNewBudgetPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Q1 2024">Q1 2024</SelectItem>
                  <SelectItem value="Q2 2024">Q2 2024</SelectItem>
                  <SelectItem value="Q3 2024">Q3 2024</SelectItem>
                  <SelectItem value="Q4 2024">Q4 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setIsBudgetDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateBudget}>Create Budget</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MD Approval Dialog - Invoice */}
      <Dialog open={isApprovalDialogOpen} onOpenChange={setIsApprovalDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>MD Approval Review - Invoice</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice ID</p>
                    <p className="font-medium">{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedInvoice.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-medium text-lg">₦{selectedInvoice.total_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Net Amount (with tax)</p>
                    <p className="font-medium text-lg text-blue-600">₦{selectedInvoice.net_amount.toLocaleString()}</p>
                  </div>
                </div>
                {selectedInvoice.finance_notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Finance Notes</p>
                    <p className="font-medium text-sm">{selectedInvoice.finance_notes}</p>
                  </div>
                )}
              </div>

              <Tabs defaultValue="approve" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="approve">Approve</TabsTrigger>
                  <TabsTrigger value="reject">Reject</TabsTrigger>
                </TabsList>
                <TabsContent value="approve" className="space-y-4">
                  {/* Payment Type Selection */}
                  <div>
                    <Label>Payment Type *</Label>
                    <Select value={selectedPaymentType} onValueChange={(value: 'FULL' | 'HALF' | 'CREDIT') => setSelectedPaymentType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>Full Payment</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="HALF">
                          <div className="flex items-center space-x-2">
                            <TrendingDown className="h-4 w-4 text-orange-600" />
                            <span>Partial Payment (Half or Custom)</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="CREDIT">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="h-4 w-4 text-red-600" />
                            <span>Credit (No Immediate Payment)</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Credit Alert */}
                  {selectedPaymentType === 'CREDIT' && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-sm text-red-800">
                        <strong>Credit Invoice Warning:</strong> This invoice will be marked as credit with no immediate payment required. The full amount of ₦{selectedInvoice.net_amount.toLocaleString()} will be outstanding.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Half Payment Info */}
                  {selectedPaymentType === 'HALF' && (
                    <Alert className="bg-orange-50 border-orange-200">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <AlertDescription className="text-sm text-orange-800">
                        <strong>Partial Payment:</strong> Finance will specify the exact payment amount. A balance will be outstanding after initial payment.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Full Payment Info */}
                  {selectedPaymentType === 'FULL' && (
                    <Alert className="bg-green-50 border-green-200">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-sm text-green-800">
                        <strong>Full Payment:</strong> Complete payment of ₦{selectedInvoice.net_amount.toLocaleString()} will be required.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label>MD Approval Notes (Optional)</Label>
                    <Textarea value={mdNotes} onChange={(e) => setMdNotes(e.target.value)} placeholder="Add approval notes..." rows={3} />
                  </div>
                  
                  <Button onClick={() => submitMDApproval(true)} className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Invoice with {selectedPaymentType} Payment
                  </Button>
                </TabsContent>
                <TabsContent value="reject" className="space-y-4">
                  <div>
                    <Label>Rejection Reason *</Label>
                    <Textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Reason for rejection..." rows={4} />
                  </div>
                  <Button variant="destructive" onClick={() => submitMDApproval(false)} className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Invoice
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payment Confirmation Dialog - Finance */}
      <Dialog open={isPaymentConfirmDialogOpen} onOpenChange={setIsPaymentConfirmDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Prepare Payment Confirmation</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-6">
              {/* Invoice Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Invoice ID</p>
                    <p className="font-medium">{selectedInvoice.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="font-medium">{selectedInvoice.customer_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Invoice Amount</p>
                    <p className="font-medium text-xl text-blue-600">₦{selectedInvoice.net_amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Type (MD Approved)</p>
                    <Badge variant="outline" className={
                      selectedInvoice.payment_type === 'FULL' ? 'bg-green-50 text-green-700 border-green-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }>
                      {selectedInvoice.payment_type}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Payment Amount Instructions */}
              {selectedInvoice.payment_type === 'FULL' && (
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-sm text-blue-800">
                    <strong>Full Payment Required:</strong> Enter the complete invoice amount of ₦{selectedInvoice.net_amount.toLocaleString()}
                  </AlertDescription>
                </Alert>
              )}

              {selectedInvoice.payment_type === 'HALF' && (
                <Alert className="bg-orange-50 border-orange-200">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-sm text-orange-800">
                    <strong>Partial Payment:</strong> Enter the amount received. The remaining balance will be tracked automatically.
                  </AlertDescription>
                </Alert>
              )}

              {/* Payment Amount Input */}
              <div>
                <Label>Amount Paid (₦) *</Label>
                <Input 
                  type="number" 
                  value={paymentAmount} 
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  placeholder={selectedInvoice.payment_type === 'FULL' 
                    ? selectedInvoice.net_amount.toString()
                    : selectedInvoice.payment_type === 'HALF'
                    ? (selectedInvoice.net_amount / 2).toString()
                    : "0"
                  }
                  min="0"
                  max={selectedInvoice.net_amount}
                  step="0.01"
                />
                {paymentAmount && (
                  <p className="text-sm text-gray-600 mt-2">
                    Balance Due: ₦{(selectedInvoice.net_amount - parseFloat(paymentAmount || "0")).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setIsPaymentConfirmDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitPaymentConfirmation} className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Confirm Payment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Finance Review Dialog - Expense Claim */}
      <Dialog open={isExpenseReviewDialogOpen} onOpenChange={setIsExpenseReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Finance Review - Expense Claim</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              {/* Claim Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Claim ID</p>
                    <p className="font-medium">{selectedClaim.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee</p>
                    <p className="font-medium">{selectedClaim.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedClaim.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedClaim.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium text-lg">₦{selectedClaim.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Receipts</p>
                    <p className="font-medium">{selectedClaim.receipts} attached</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Description</p>
                  <p className="font-medium">{selectedClaim.description}</p>
                </div>
              </div>

              <Tabs defaultValue="approve" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="approve">Send to MD</TabsTrigger>
                  <TabsTrigger value="reject">Reject</TabsTrigger>
                </TabsList>
                <TabsContent value="approve" className="space-y-4">
                  <div>
                    <Label>Finance Review Notes</Label>
                    <Textarea 
                      value={expenseFinanceNotes} 
                      onChange={(e) => setExpenseFinanceNotes(e.target.value)} 
                      placeholder="Add notes for MD review (optional)..." 
                      rows={3} 
                    />
                  </div>
                  <Button onClick={() => submitFinanceReview(true)} className="w-full bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send to MD for Approval
                  </Button>
                </TabsContent>
                <TabsContent value="reject" className="space-y-4">
                  <div>
                    <Label>Rejection Reason *</Label>
                    <Textarea 
                      value={expenseRejectionReason} 
                      onChange={(e) => setExpenseRejectionReason(e.target.value)} 
                      placeholder="Reason for rejection..." 
                      rows={4} 
                    />
                  </div>
                  <Button variant="destructive" onClick={() => submitFinanceReview(false)} className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Expense Claim
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MD Approval Dialog - Expense Claim */}
      <Dialog open={isExpenseApprovalDialogOpen} onOpenChange={setIsExpenseApprovalDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>MD Approval Review - Expense Claim</DialogTitle>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-6">
              {/* Claim Details */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Claim ID</p>
                    <p className="font-medium">{selectedClaim.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employee</p>
                    <p className="font-medium">{selectedClaim.employee_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedClaim.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Category</p>
                    <p className="font-medium">{selectedClaim.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-medium text-lg text-blue-600">₦{selectedClaim.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reviewed By</p>
                    <p className="font-medium">{selectedClaim.reviewed_by}</p>
                  </div>
                </div>
                {selectedClaim.finance_notes && (
                  <div className="pt-2 border-t">
                    <p className="text-sm text-gray-600">Finance Notes</p>
                    <p className="font-medium text-sm">{selectedClaim.finance_notes}</p>
                  </div>
                )}
              </div>

              <Tabs defaultValue="approve" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="approve">Approve</TabsTrigger>
                  <TabsTrigger value="reject">Reject</TabsTrigger>
                </TabsList>
                <TabsContent value="approve" className="space-y-4">
                  <div>
                    <Label>MD Approval Notes (Optional)</Label>
                    <Textarea 
                      value={expenseMdNotes} 
                      onChange={(e) => setExpenseMdNotes(e.target.value)} 
                      placeholder="Add approval notes..." 
                      rows={3} 
                    />
                  </div>
                  <Button onClick={() => submitMDExpenseApproval(true)} className="w-full bg-green-600 hover:bg-green-700">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve Expense Claim
                  </Button>
                </TabsContent>
                <TabsContent value="reject" className="space-y-4">
                  <div>
                    <Label>Rejection Reason *</Label>
                    <Textarea 
                      value={expenseRejectionReason} 
                      onChange={(e) => setExpenseRejectionReason(e.target.value)} 
                      placeholder="Reason for rejection..." 
                      rows={4} 
                    />
                  </div>
                  <Button variant="destructive" onClick={() => submitMDExpenseApproval(false)} className="w-full">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Expense Claim
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
