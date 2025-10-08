import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Package, AlertTriangle, Plus, Search, Download, Filter, RotateCcw } from "lucide-react";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";

const inventoryData = [
  {
    id: "RM-001",
    name: "Purified Water",
    category: "Raw Materials",
    currentStock: 15000,
    minThreshold: 20000,
    maxCapacity: 100000,
    unit: "Liters",
    lastRestocked: "2024-01-10",
    status: "critical"
  },
  {
    id: "PK-001",
    name: "500ml PET Bottles",
    category: "Packaging",
    currentStock: 85000,
    minThreshold: 50000,
    maxCapacity: 200000,
    unit: "Pieces",
    lastRestocked: "2024-01-12",
    status: "good"
  },
  {
    id: "PK-002",
    name: "Bottle Caps",
    category: "Packaging",
    currentStock: 45000,
    minThreshold: 40000,
    maxCapacity: 150000,
    unit: "Pieces",
    lastRestocked: "2024-01-11",
    status: "warning"
  },
  {
    id: "PK-003",
    name: "Product Labels",
    category: "Packaging",
    currentStock: 75000,
    minThreshold: 30000,
    maxCapacity: 120000,
    unit: "Pieces",
    lastRestocked: "2024-01-13",
    status: "good"
  },
  {
    id: "RM-002",
    name: "Sanitizing Chemicals",
    category: "Raw Materials",
    currentStock: 500,
    minThreshold: 200,
    maxCapacity: 2000,
    unit: "Liters",
    lastRestocked: "2024-01-09",
    status: "good"
  },
  {
    id: "PK-004",
    name: "Shrink Wrap Film",
    category: "Packaging",
    currentStock: 25,
    minThreshold: 30,
    maxCapacity: 100,
    unit: "Rolls",
    lastRestocked: "2024-01-08",
    status: "critical"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "critical":
      return <Badge variant="destructive">Critical</Badge>;
    case "warning":
      return <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50">Low Stock</Badge>;
    case "good":
      return <Badge variant="default" className="text-green-600 border-green-200 bg-green-50">Good</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getStockPercentage = (current: number, max: number) => {
  return (current / max) * 100;
};

const criticalItems = inventoryData.filter(item => item.status === "critical");
const lowStockItems = inventoryData.filter(item => item.status === "warning");

export function InventoryModule() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-600">Track stock levels, manage reorders, and monitor inventory health</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add New Item
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Auto Reorder
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalItems.length > 0 && (
        <Alert className="border-l-4 border-l-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <span className="font-semibold text-red-800">Critical Stock Alert:</span> {criticalItems.length} item(s) below minimum threshold require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Items</p>
                <p className="text-2xl font-bold text-blue-900">{inventoryData.length}</p>
                <p className="text-xs text-blue-600">Active stock items</p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-red-50 to-red-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Critical Stock</p>
                <p className="text-2xl font-bold text-red-900">{criticalItems.length}</p>
                <p className="text-xs text-red-600">Below minimum</p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 mb-1">Low Stock</p>
                <p className="text-2xl font-bold text-orange-900">{lowStockItems.length}</p>
                <p className="text-xs text-orange-600">Need attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Good Stock</p>
                <p className="text-2xl font-bold text-green-900">{inventoryData.filter(item => item.status === "good").length}</p>
                <p className="text-xs text-green-600">Healthy levels</p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5 text-blue-600" />
            <span>Stock Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search inventory..." className="pl-10" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raw-materials">Raw Materials</SelectItem>
                <SelectItem value="packaging">Packaging</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Low Stock</SelectItem>
                <SelectItem value="good">Good</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Stock Table */}
          <div className="rounded-lg border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Item ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Stock Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Restocked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inventoryData.map((item) => {
                  const stockPercentage = getStockPercentage(item.currentStock, item.maxCapacity);
                  
                  return (
                    <TableRow key={item.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{item.currentStock.toLocaleString()}</span>
                        <span className="text-gray-500 text-sm ml-1">{item.unit}</span>
                      </TableCell>
                      <TableCell className="w-32">
                        <div className="space-y-1">
                          <Progress value={stockPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{item.minThreshold.toLocaleString()}</span>
                            <span>{item.maxCapacity.toLocaleString()}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">{item.lastRestocked}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {item.status === "critical" ? (
                            <Button size="sm" variant="destructive" className="h-8">
                              <Plus className="h-3 w-3 mr-1" />
                              Urgent Reorder
                            </Button>
                          ) : item.status === "warning" ? (
                            <Button size="sm" variant="outline" className="h-8">
                              <Plus className="h-3 w-3 mr-1" />
                              Reorder
                            </Button>
                          ) : (
                            <Button size="sm" variant="ghost" className="h-8">
                              View Details
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}