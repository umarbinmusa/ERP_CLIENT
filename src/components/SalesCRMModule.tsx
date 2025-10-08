import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { toast } from "sonner";
import { 
  Users, 
  Plus, 
  ShoppingCart, 
  Phone, 
  Mail, 
  MapPin,
  TrendingUp,
  DollarSign,
  Package,
  Search,
  Filter,
  FileText,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertTriangle,
  Printer,
  XCircle
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { InvoicePrintTemplate } from "./InvoicePrintTemplate";

interface Customer {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  credit_limit: number;
  payment_terms: number;
  is_active: boolean;
}

interface SalesOrder {
  id: string;
  customer_id: number;
  customer_name: string;
  order_date: string;
  required_date: string;
  total_amount: number;
  status: 'DRAFT' | 'PENDING_INVOICE' | 'INVOICE_GENERATED' | 'APPROVED' | 'COMPLETED' | 'CANCELLED';
  sales_rep_name: string;
  items: OrderItem[];
  notes?: string;
  invoice_id?: string;
  invoice_status?: string;
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
  status: 'PENDING_FINANCE_REVIEW' | 'PENDING_MD_APPROVAL' | 'REJECTED' | 'APPROVED';
  items: OrderItem[];
}

// Mock customers
const mockCustomers: Customer[] = [
  {
    id: 1,
    company_name: "Healthy Living Stores",
    contact_person: "John Smith",
    email: "john@healthyliving.com",
    phone: "+234-803-123-4567",
    address: "15 Marina Road",
    city: "Lagos",
    state: "Lagos",
    credit_limit: 500000,
    payment_terms: 30,
    is_active: true
  },
  {
    id: 2,
    company_name: "Fresh Mart Supermarket",
    contact_person: "Sarah Johnson",
    email: "sarah@freshmart.com",
    phone: "+234-805-234-5678",
    address: "42 Allen Avenue",
    city: "Ikeja",
    state: "Lagos",
    credit_limit: 750000,
    payment_terms: 30,
    is_active: true
  },
  {
    id: 3,
    company_name: "Green Valley Distributors",
    contact_person: "Michael Brown",
    email: "michael@greenvalley.com",
    phone: "+234-807-345-6789",
    address: "28 Adeola Odeku",
    city: "Victoria Island",
    state: "Lagos",
    credit_limit: 1000000,
    payment_terms: 45,
    is_active: true
  }
];

// Mock products
const mockProducts = [
  { id: 1, name: "Pure Water 500ml (24-pack)", price: 500 },
  { id: 2, name: "Pure Water 75cl (12-pack)", price: 600 },
  { id: 3, name: "Pure Water 1L (12-pack)", price: 800 },
  { id: 4, name: "Pure Water 1.5L (6-pack)", price: 500 },
  { id: 5, name: "Pure Water 5L (Individual)", price: 400 }
];

export function SalesCRMModule() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // New Order Dialog States
  const [isNewOrderDialogOpen, setIsNewOrderDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiredDate, setRequiredDate] = useState("");
  const [orderNotes, setOrderNotes] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // View Order Dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);

  // Invoice Print Dialog
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false);
  const [invoiceToPrint, setInvoiceToPrint] = useState<Invoice | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    // Mock orders with different statuses
    const mockOrders: SalesOrder[] = [
      {
        id: "SO-2024-001",
        customer_id: 1,
        customer_name: "Healthy Living Stores",
        order_date: "2024-03-15",
        required_date: "2024-03-25",
        total_amount: 125000,
        status: "INVOICE_GENERATED",
        sales_rep_name: user?.fullName || "Sales Rep",
        invoice_id: "INV-2024-001",
        invoice_status: "PENDING_MD_APPROVAL",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 100, unit_price: 500, total_price: 50000 },
          { id: 2, product_name: "Pure Water 1L (12-pack)", quantity: 75, unit_price: 800, total_price: 60000 },
          { id: 3, product_name: "Pure Water 1.5L (6-pack)", quantity: 30, unit_price: 500, total_price: 15000 }
        ],
        notes: "Regular monthly order"
      },
      {
        id: "SO-2024-002",
        customer_id: 2,
        customer_name: "Fresh Mart Supermarket",
        order_date: "2024-03-16",
        required_date: "2024-03-26",
        total_amount: 95000,
        status: "PENDING_INVOICE",
        sales_rep_name: user?.fullName || "Sales Rep",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 80, unit_price: 500, total_price: 40000 },
          { id: 2, product_name: "Pure Water 75cl (12-pack)", quantity: 50, unit_price: 600, total_price: 30000 },
          { id: 3, product_name: "Pure Water 5L (Individual)", quantity: 62, unit_price: 400, total_price: 25000 }
        ]
      },
      {
        id: "SO-2024-003",
        customer_id: 3,
        customer_name: "Green Valley Distributors",
        order_date: "2024-03-17",
        required_date: "2024-03-27",
        total_amount: 180000,
        status: "APPROVED",
        sales_rep_name: user?.fullName || "Sales Rep",
        invoice_id: "INV-2024-003",
        invoice_status: "APPROVED",
        items: [
          { id: 1, product_name: "Pure Water 500ml (24-pack)", quantity: 150, unit_price: 500, total_price: 75000 },
          { id: 2, product_name: "Pure Water 1L (12-pack)", quantity: 100, unit_price: 800, total_price: 80000 },
          { id: 3, product_name: "Pure Water 1.5L (6-pack)", quantity: 50, unit_price: 500, total_price: 25000 }
        ],
        notes: "Large order - priority delivery"
      }
    ];

    setOrders(mockOrders);
  };

  const handleNewOrder = () => {
    setSelectedCustomer(null);
    setOrderDate(new Date().toISOString().split('T')[0]);
    setRequiredDate("");
    setOrderNotes("");
    setOrderItems([{ id: 1, product_name: "", quantity: 0, unit_price: 0, total_price: 0 }]);
    setIsNewOrderDialogOpen(true);
  };

  const addOrderItem = () => {
    const newId = orderItems.length > 0 ? Math.max(...orderItems.map(item => item.id)) + 1 : 1;
    setOrderItems([...orderItems, { id: newId, product_name: "", quantity: 0, unit_price: 0, total_price: 0 }]);
  };

  const removeOrderItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id));
    }
  };

  const updateOrderItem = (id: number, field: string, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Auto-calculate total price
        if (field === 'quantity' || field === 'unit_price') {
          updatedItem.total_price = updatedItem.quantity * updatedItem.unit_price;
        }

        // Auto-fill price when product is selected
        if (field === 'product_name') {
          const product = mockProducts.find(p => p.name === value);
          if (product) {
            updatedItem.unit_price = product.price;
            updatedItem.total_price = updatedItem.quantity * product.price;
          }
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  const submitOrder = () => {
    // Validation
    if (!selectedCustomer) {
      toast.error("Please select a customer");
      return;
    }

    if (!requiredDate) {
      toast.error("Please select a required delivery date");
      return;
    }

    if (orderItems.length === 0 || orderItems.some(item => !item.product_name || item.quantity <= 0)) {
      toast.error("Please add at least one valid product");
      return;
    }

    const customer = customers.find(c => c.id === selectedCustomer);
    const totalAmount = orderItems.reduce((sum, item) => sum + item.total_price, 0);

    const newOrder: SalesOrder = {
      id: `SO-${new Date().getFullYear()}-${String(orders.length + 1).padStart(3, '0')}`,
      customer_id: selectedCustomer,
      customer_name: customer?.company_name || "",
      order_date: orderDate,
      required_date: requiredDate,
      total_amount: totalAmount,
      status: "PENDING_INVOICE",
      sales_rep_name: user?.fullName || "Sales Rep",
      items: orderItems.filter(item => item.product_name && item.quantity > 0),
      notes: orderNotes
    };

    setOrders([newOrder, ...orders]);
    setIsNewOrderDialogOpen(false);

    toast.success("Order created successfully!", {
      description: `Order ${newOrder.id} is now pending invoice generation by Finance`
    });
  };

  const viewOrder = (order: SalesOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handlePrintInvoice = (order: SalesOrder) => {
    // Create invoice object for printing
    const invoice: Invoice = {
      id: order.invoice_id || "",
      order_id: order.id,
      customer_name: order.customer_name,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      total_amount: order.total_amount,
      tax_amount: order.total_amount * 0.075, // 7.5% VAT
      discount_amount: 0,
      net_amount: order.total_amount * 1.075,
      status: "APPROVED",
      items: order.items
    };

    setInvoiceToPrint(invoice);
    setIsPrintDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: any; icon: any }> = {
      'DRAFT': { label: 'Draft', variant: 'outline', icon: FileText },
      'PENDING_INVOICE': { label: 'Awaiting Invoice', variant: 'outline', icon: Clock },
      'INVOICE_GENERATED': { label: 'Invoice Generated', variant: 'outline', icon: FileText },
      'APPROVED': { label: 'Approved', variant: 'default', icon: CheckCircle },
      'COMPLETED': { label: 'Completed', variant: 'default', icon: CheckCircle },
      'CANCELLED': { label: 'Cancelled', variant: 'destructive', icon: XCircle }
    };

    const config = statusConfig[status] || statusConfig['DRAFT'];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={
        status === 'PENDING_INVOICE' ? 'bg-orange-100 text-orange-800 border-orange-200' :
        status === 'INVOICE_GENERATED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
        status === 'APPROVED' ? 'bg-green-100 text-green-800 border-green-200' :
        ''
      }>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getInvoiceStatusBadge = (status?: string) => {
    if (!status) return null;

    const statusConfig: Record<string, { label: string; color: string }> = {
      'PENDING_FINANCE_REVIEW': { label: 'Finance Review', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      'PENDING_MD_APPROVAL': { label: 'MD Approval', color: 'bg-blue-100 text-blue-800 border-blue-200' },
      'REJECTED': { label: 'Rejected', color: 'bg-red-100 text-red-800 border-red-200' },
      'APPROVED': { label: 'Approved', color: 'bg-green-100 text-green-800 border-green-200' }
    };

    const config = statusConfig[status];
    if (!config) return null;

    return (
      <Badge variant="outline" className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalOrders = orders.length;
  const pendingInvoice = orders.filter(o => o.status === 'PENDING_INVOICE').length;
  const approvedOrders = orders.filter(o => o.status === 'APPROVED').length;
  const totalValue = orders.reduce((sum, o) => sum + o.total_amount, 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales & CRM</h1>
          <p className="text-gray-600">Manage customers and sales orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handleNewOrder}>
            <Plus className="h-4 w-4 mr-2" />
            New Order
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Orders</p>
                <h3 className="text-2xl font-bold text-blue-900">{totalOrders}</h3>
              </div>
              <ShoppingCart className="h-10 w-10 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">Awaiting Invoice</p>
                <h3 className="text-2xl font-bold text-orange-900">{pendingInvoice}</h3>
              </div>
              <Clock className="h-10 w-10 text-orange-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Approved Orders</p>
                <h3 className="text-2xl font-bold text-green-900">{approvedOrders}</h3>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Total Value</p>
                <h3 className="text-2xl font-bold text-purple-900">₦{totalValue.toLocaleString()}</h3>
              </div>
              <DollarSign className="h-10 w-10 text-purple-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sales Orders</CardTitle>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10 w-64"
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING_INVOICE">Awaiting Invoice</SelectItem>
                  <SelectItem value="INVOICE_GENERATED">Invoice Generated</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Required Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Order Status</TableHead>
                  <TableHead>Invoice Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                      No orders found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer_name}</TableCell>
                      <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.required_date).toLocaleDateString()}</TableCell>
                      <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>
                        {order.invoice_status ? getInvoiceStatusBadge(order.invoice_status) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => viewOrder(order)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          {order.status === 'APPROVED' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintInvoice(order)}
                            >
                              <Printer className="h-3 w-3 text-blue-600" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* New Order Dialog */}
      <Dialog open={isNewOrderDialogOpen} onOpenChange={setIsNewOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5 text-blue-600" />
              <span>Create New Sales Order</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-sm text-blue-800">
                Orders will be sent to Finance for invoice generation. You can track the status in the orders table.
              </AlertDescription>
            </Alert>

            {/* Customer Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Customer <span className="text-red-500">*</span></Label>
                <Select
                  value={selectedCustomer?.toString() || ""}
                  onValueChange={(value) => setSelectedCustomer(parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.company_name} - {customer.contact_person}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Order Date</Label>
                <Input
                  type="date"
                  value={orderDate}
                  onChange={(e) => setOrderDate(e.target.value)}
                />
              </div>

              <div>
                <Label>Required Delivery Date <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Order Items <span className="text-red-500">*</span></Label>
                <Button type="button" size="sm" variant="outline" onClick={addOrderItem}>
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="border rounded-lg p-4 space-y-3">
                {orderItems.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-12 gap-3 items-end">
                    <div className="col-span-5">
                      <Label className="text-xs">Product</Label>
                      <Select
                        value={item.product_name}
                        onValueChange={(value) => updateOrderItem(item.id, 'product_name', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockProducts.map((product) => (
                            <SelectItem key={product.id} value={product.name}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity || ""}
                        onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Unit Price</Label>
                      <Input
                        type="number"
                        value={item.unit_price || ""}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label className="text-xs">Total</Label>
                      <Input
                        type="number"
                        value={item.total_price || ""}
                        readOnly
                        className="bg-gray-100"
                      />
                    </div>

                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeOrderItem(item.id)}
                        disabled={orderItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-3 border-t">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount:</p>
                  <p className="text-xl font-bold text-gray-900">
                    ₦{orderItems.reduce((sum, item) => sum + item.total_price, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label>Order Notes</Label>
              <Textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Special instructions or notes..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsNewOrderDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={submitOrder}>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Order Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Order ID</Label>
                  <p className="font-medium">{selectedOrder.id}</p>
                </div>
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <p className="font-medium">{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Required Date</Label>
                  <p className="font-medium">{new Date(selectedOrder.required_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>{getStatusBadge(selectedOrder.status)}</div>
                </div>
                {selectedOrder.invoice_status && (
                  <div>
                    <Label>Invoice Status</Label>
                    <div>{getInvoiceStatusBadge(selectedOrder.invoice_status)}</div>
                  </div>
                )}
              </div>

              <div>
                <Label className="mb-3">Order Items</Label>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Unit Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.product_name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₦{item.unit_price.toLocaleString()}</TableCell>
                          <TableCell>₦{item.total_price.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-medium">Total:</TableCell>
                        <TableCell className="font-bold">₦{selectedOrder.total_amount.toLocaleString()}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {selectedOrder.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status === 'APPROVED' && (
                  <Button onClick={() => {
                    setIsViewDialogOpen(false);
                    handlePrintInvoice(selectedOrder);
                  }}>
                    <Printer className="h-4 w-4 mr-2" />
                    Print Invoice
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Print Invoice Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Print Invoice</DialogTitle>
          </DialogHeader>
          {invoiceToPrint && <InvoicePrintTemplate invoice={invoiceToPrint} />}
          <div className="flex justify-end space-x-3 mt-4">
            <Button variant="outline" onClick={() => setIsPrintDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
