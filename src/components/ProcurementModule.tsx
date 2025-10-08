import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { 
  ShoppingCart, 
  Plus, 
  Building, 
  FileText, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Package,
  Phone,
  Mail,
  MapPin,
  Edit,
  Eye,
  Search
} from "lucide-react";
import { apiService } from "../services/api";

interface Supplier {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  payment_terms: number;
  is_active: boolean;
  rating: number;
  total_orders: number;
  total_spent: number;
  created_at: string;
}

interface PurchaseOrder {
  id: string;
  supplier_id: number;
  supplier_name: string;
  order_date: string;
  expected_date: string;
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'ORDERED' | 'RECEIVED' | 'CANCELLED';
  created_by: string;
  approved_by: string;
  notes: string;
  items: PurchaseOrderItem[];
}

interface PurchaseOrderItem {
  id: number;
  item_name: string;
  description: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  received_quantity: number;
}

interface ProcurementMetrics {
  pending_orders: number;
  total_spent_month: number;
  active_suppliers: number;
  overdue_orders: number;
  approval_pending: number;
  average_lead_time: number;
}

export function ProcurementModule() {
  const [activeTab, setActiveTab] = useState("purchase-orders");
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [metrics, setMetrics] = useState<ProcurementMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProcurementData();
  }, []);

  const loadProcurementData = async () => {
    setIsLoading(true);
    try {
      const [suppliersData, ordersData, metricsData] = await Promise.all([
        apiService.request({ action: 'get_suppliers' }),
        apiService.request({ action: 'get_purchase_orders' }),
        apiService.request({ action: 'get_procurement_metrics' })
      ]);

      if (suppliersData.success) setSuppliers(suppliersData.data || []);
      if (ordersData.success) setPurchaseOrders(ordersData.data || []);
      if (metricsData.success) setMetrics(metricsData.data);
    } catch (error) {
      console.error('Error loading procurement data:', error);
      
      // Mock data for demo
      setSuppliers([
        {
          id: 1,
          company_name: "AquaPure Technologies Ltd",
          contact_person: "Dr. Ibrahim Hassan",
          email: "ibrahim@aquapure.ng",
          phone: "+234-800-123-4567",
          address: "Industrial Estate Phase 2",
          city: "Kano",
          state: "Kano",
          payment_terms: 30,
          is_active: true,
          rating: 4.8,
          total_orders: 45,
          total_spent: 12500000,
          created_at: "2024-01-15"
        },
        {
          id: 2,
          company_name: "Crystal Clear Supplies",
          contact_person: "Mrs. Adaora Okafor",
          email: "adaora@crystalclear.ng",
          phone: "+234-800-987-6543",
          address: "Plot 15, Ikeja Industrial Layout",
          city: "Lagos",
          state: "Lagos",
          payment_terms: 15,
          is_active: true,
          rating: 4.5,
          total_orders: 32,
          total_spent: 8750000,
          created_at: "2024-02-01"
        },
        {
          id: 3,
          company_name: "Premium Packaging Co.",
          contact_person: "Mr. Chukwu Emeka",
          email: "chukwu@premiumpkg.com",
          phone: "+234-800-555-0123",
          address: "Onitsha Main Market",
          city: "Onitsha",
          state: "Anambra",
          payment_terms: 45,
          is_active: true,
          rating: 4.2,
          total_orders: 28,
          total_spent: 6200000,
          created_at: "2024-01-20"
        }
      ]);

      setPurchaseOrders([
        {
          id: "PO-2024-001",
          supplier_id: 1,
          supplier_name: "AquaPure Technologies Ltd",
          order_date: "2024-03-20",
          expected_date: "2024-03-25",
          subtotal: 850000,
          tax_amount: 63750,
          total_amount: 913750,
          status: "PENDING",
          created_by: "John Adebayo",
          approved_by: "",
          notes: "Urgent order for production line",
          items: [
            {
              id: 1,
              item_name: "Water Filtration Cartridges",
              description: "High-capacity sediment filters",
              quantity: 50,
              unit_price: 15000,
              total_price: 750000,
              received_quantity: 0
            },
            {
              id: 2,
              item_name: "UV Sterilizer Bulbs",
              description: "UV-C germicidal lamps",
              quantity: 10,
              unit_price: 10000,
              total_price: 100000,
              received_quantity: 0
            }
          ]
        },
        {
          id: "PO-2024-002",
          supplier_id: 2,
          supplier_name: "Crystal Clear Supplies",
          order_date: "2024-03-18",
          expected_date: "2024-03-22",
          subtotal: 425000,
          tax_amount: 31875,
          total_amount: 456875,
          status: "APPROVED",
          created_by: "Sarah Johnson",
          approved_by: "John Adebayo",
          notes: "Monthly bottle order",
          items: [
            {
              id: 3,
              item_name: "500ml PET Bottles",
              description: "Clear plastic bottles with caps",
              quantity: 10000,
              unit_price: 35,
              total_price: 350000,
              received_quantity: 0
            },
            {
              id: 4,
              item_name: "Bottle Labels",
              description: "Waterproof adhesive labels",
              quantity: 10000,
              unit_price: 7.5,
              total_price: 75000,
              received_quantity: 0
            }
          ]
        },
        {
          id: "PO-2024-003",
          supplier_id: 3,
          supplier_name: "Premium Packaging Co.",
          order_date: "2024-03-15",
          expected_date: "2024-03-20",
          subtotal: 280000,
          tax_amount: 21000,
          total_amount: 301000,
          status: "RECEIVED",
          created_by: "Michael Chen",
          approved_by: "John Adebayo",
          notes: "Packaging materials for 1L bottles",
          items: [
            {
              id: 5,
              item_name: "Shrink Wrap Film",
              description: "Clear polyethylene wrap",
              quantity: 20,
              unit_price: 12000,
              total_price: 240000,
              received_quantity: 20
            },
            {
              id: 6,
              item_name: "Carton Boxes",
              description: "Corrugated boxes for shipping",
              quantity: 200,
              unit_price: 200,
              total_price: 40000,
              received_quantity: 200
            }
          ]
        }
      ]);

      setMetrics({
        pending_orders: 5,
        total_spent_month: 2850000,
        active_suppliers: 12,
        overdue_orders: 2,
        approval_pending: 3,
        average_lead_time: 5.2
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { color: "bg-gray-100 text-gray-800", icon: FileText },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      APPROVED: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      ORDERED: { color: "bg-purple-100 text-purple-800", icon: ShoppingCart },
      RECEIVED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-800"}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  const filteredPurchaseOrders = purchaseOrders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const SupplierForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            placeholder="Enter company name"
            defaultValue={selectedSupplier?.company_name}
          />
        </div>
        <div>
          <Label htmlFor="contact_person">Contact Person</Label>
          <Input
            id="contact_person"
            placeholder="Enter contact person"
            defaultValue={selectedSupplier?.contact_person}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter email"
            defaultValue={selectedSupplier?.email}
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Enter phone number"
            defaultValue={selectedSupplier?.phone}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          placeholder="Enter full address"
          defaultValue={selectedSupplier?.address}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Enter city"
            defaultValue={selectedSupplier?.city}
          />
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            placeholder="Enter state"
            defaultValue={selectedSupplier?.state}
          />
        </div>
        <div>
          <Label htmlFor="payment_terms">Payment Terms (Days)</Label>
          <Input
            id="payment_terms"
            type="number"
            placeholder="30"
            defaultValue={selectedSupplier?.payment_terms}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {selectedSupplier ? "Update Supplier" : "Add Supplier"}
        </Button>
      </div>
    </form>
  );

  const PurchaseOrderForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplier">Supplier</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select supplier" />
            </SelectTrigger>
            <SelectContent>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id.toString()}>
                  {supplier.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="expected_date">Expected Delivery Date</Label>
          <Input
            id="expected_date"
            type="date"
            defaultValue={selectedPO?.expected_date}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Enter order notes or special instructions"
          defaultValue={selectedPO?.notes}
        />
      </div>

      <div>
        <Label>Order Items</Label>
        <div className="border rounded-lg p-4 space-y-3">
          {[1, 2].map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input placeholder="Item name" />
              <Input type="number" placeholder="Quantity" />
              <Input type="number" placeholder="Unit price" />
              <Button variant="outline" size="sm">Remove</Button>
            </div>
          ))}
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {selectedPO ? "Update Order" : "Create Purchase Order"}
        </Button>
      </div>
    </form>
  );

  const MetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-xs text-gray-600">Pending Orders</p>
              <p className="text-lg font-bold">{metrics?.pending_orders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Monthly Spend</p>
              <p className="text-lg font-bold">₦{(metrics?.total_spent_month || 0 / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Building className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Active Suppliers</p>
              <p className="text-lg font-bold">{metrics?.active_suppliers}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-xs text-gray-600">Overdue Orders</p>
              <p className="text-lg font-bold">{metrics?.overdue_orders}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <FileText className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Awaiting Approval</p>
              <p className="text-lg font-bold">{metrics?.approval_pending}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-600">Avg Lead Time</p>
              <p className="text-lg font-bold">{metrics?.average_lead_time} days</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading procurement data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600">Manage suppliers, purchase orders, and procurement processes</p>
        </div>
      </div>

      <MetricsCards />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Procurement Operations</CardTitle>
            <div className="flex space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="ORDERED">Ordered</SelectItem>
                  <SelectItem value="RECEIVED">Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
            </TabsList>

            <TabsContent value="purchase-orders" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Purchase Orders</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedPO(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      New Purchase Order
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedPO ? "Edit Purchase Order" : "Create New Purchase Order"}
                      </DialogTitle>
                    </DialogHeader>
                    <PurchaseOrderForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead>Expected Date</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created By</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPurchaseOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.supplier_name}</TableCell>
                        <TableCell>{new Date(order.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(order.expected_date).toLocaleDateString()}</TableCell>
                        <TableCell>₦{order.total_amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.created_by}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {order.status === 'PENDING' && (
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedPO(order);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="suppliers" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Supplier Management</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedSupplier(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Supplier
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedSupplier ? "Edit Supplier" : "Add New Supplier"}
                      </DialogTitle>
                    </DialogHeader>
                    <SupplierForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company</TableHead>
                      <TableHead>Contact Person</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Orders</TableHead>
                      <TableHead>Total Spent</TableHead>
                      <TableHead>Payment Terms</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{supplier.company_name}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Mail className="h-3 w-3 mr-1" />
                              {supplier.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{supplier.contact_person}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {supplier.phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {supplier.city}, {supplier.state}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <div className="flex">{getRatingStars(supplier.rating)}</div>
                            <span className="text-sm text-gray-600">({supplier.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{supplier.total_orders} orders</Badge>
                        </TableCell>
                        <TableCell>₦{supplier.total_spent.toLocaleString()}</TableCell>
                        <TableCell>{supplier.payment_terms} days</TableCell>
                        <TableCell>
                          <Badge className={supplier.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {supplier.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSupplier(supplier);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Package className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}