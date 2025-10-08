import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { toast } from "sonner";

import {
  Package2,
  Truck,
  CheckCircle,
  AlertTriangle,
  Clock,
  Thermometer,
  Search,
  Filter,
  Plus,
  Eye,
  Send,
  BarChart3,
  Calendar,
  MapPin,
  PackageCheck,
  Warehouse,
  TrendingUp,
  AlertCircle,
  FileText,
  Edit,
  Trash2,
  Settings
} from "lucide-react";

// Mock data for finished goods
const finishedGoodsData = [
  {
    id: "FG-2024-001",
    batchNumber: "BATCH-240115-001",
    productName: "Pure Water 500ml",
    productType: "Bottled Water",
    quantity: 12000,
    packagingType: "24-pack Cases",
    unitsPerCase: 24,
    totalCases: 500,
    productionDate: "2024-01-15",
    expiryDate: "2024-07-15",
    qualityStatus: "approved",
    storageLocation: "Bay-A-01",
    temperature: "18°C",
    humidity: "45%",
    qcInspector: "Sarah Johnson",
    dispatchStatus: "ready",
    reservedForOrder: "SO-2024-089",
    daysToExpiry: 156
  },
  {
    id: "FG-2024-002",
    batchNumber: "BATCH-240115-002",
    productName: "Pure Water 1L",
    productType: "Bottled Water",
    quantity: 8000,
    packagingType: "12-pack Cases",
    unitsPerCase: 12,
    totalCases: 667,
    productionDate: "2024-01-15",
    expiryDate: "2024-07-15",
    qualityStatus: "pending",
    storageLocation: "Bay-A-02",
    temperature: "17°C",
    humidity: "42%",
    qcInspector: "Pending",
    dispatchStatus: "hold",
    reservedForOrder: null,
    daysToExpiry: 156
  },
  {
    id: "FG-2024-003",
    batchNumber: "BATCH-240114-001",
    productName: "Pure Water 1.5L",
    productType: "Bottled Water",
    quantity: 6000,
    packagingType: "6-pack Cases",
    unitsPerCase: 6,
    totalCases: 1000,
    productionDate: "2024-01-14",
    expiryDate: "2024-07-14",
    qualityStatus: "approved",
    storageLocation: "Bay-B-01",
    temperature: "19°C",
    humidity: "48%",
    qcInspector: "Michael Chen",
    dispatchStatus: "dispatched",
    reservedForOrder: "SO-2024-087",
    daysToExpiry: 155
  },
  {
    id: "FG-2024-004",
    batchNumber: "BATCH-240113-001",
    productName: "Pure Water 5L",
    productType: "Bottled Water",
    quantity: 2000,
    packagingType: "Individual Units",
    unitsPerCase: 1,
    totalCases: 2000,
    productionDate: "2024-01-13",
    expiryDate: "2024-07-13",
    qualityStatus: "rejected",
    storageLocation: "Bay-C-01",
    temperature: "20°C",
    humidity: "50%",
    qcInspector: "Sarah Johnson",
    dispatchStatus: "quarantine",
    reservedForOrder: null,
    daysToExpiry: 154
  },
  {
    id: "FG-2024-005",
    batchNumber: "BATCH-240112-001",
    productName: "Pure Water 75cl",
    productType: "Bottled Water",
    quantity: 15000,
    packagingType: "12-pack Cases",
    unitsPerCase: 12,
    totalCases: 1250,
    productionDate: "2024-01-12",
    expiryDate: "2024-07-12",
    qualityStatus: "approved",
    storageLocation: "Bay-A-03",
    temperature: "18°C",
    humidity: "44%",
    qcInspector: "Michael Chen",
    dispatchStatus: "ready",
    reservedForOrder: null,
    daysToExpiry: 153
  }
];

// Storage locations data (will be managed in state)
const initialStorageLocations = [
  { id: "Bay-A-01", name: "Bay A - Section 01", capacity: 1000, occupied: 500, temperature: "18°C", humidity: "45%" },
  { id: "Bay-A-02", name: "Bay A - Section 02", capacity: 1000, occupied: 667, temperature: "17°C", humidity: "42%" },
  { id: "Bay-A-03", name: "Bay A - Section 03", capacity: 1500, occupied: 1250, temperature: "18°C", humidity: "44%" },
  { id: "Bay-B-01", name: "Bay B - Section 01", capacity: 1200, occupied: 1000, temperature: "19°C", humidity: "48%" },
  { id: "Bay-C-01", name: "Bay C - Section 01", capacity: 2500, occupied: 2000, temperature: "20°C", humidity: "50%" },
];

// Product registry - initial products
const initialProducts = [
  { 
    id: "PROD-001", 
    productType: "Bottled Water", 
    productName: "Pure Water 500ml", 
    defaultPackaging: "24-pack Cases",
    defaultUnitsPerCase: 24,
    shelfLifeDays: 180,
    sku: "PW-500ML"
  },
  { 
    id: "PROD-002", 
    productType: "Bottled Water", 
    productName: "Pure Water 75cl", 
    defaultPackaging: "12-pack Cases",
    defaultUnitsPerCase: 12,
    shelfLifeDays: 180,
    sku: "PW-75CL"
  },
  { 
    id: "PROD-003", 
    productType: "Bottled Water", 
    productName: "Pure Water 1L", 
    defaultPackaging: "12-pack Cases",
    defaultUnitsPerCase: 12,
    shelfLifeDays: 180,
    sku: "PW-1L"
  },
  { 
    id: "PROD-004", 
    productType: "Bottled Water", 
    productName: "Pure Water 1.5L", 
    defaultPackaging: "6-pack Cases",
    defaultUnitsPerCase: 6,
    shelfLifeDays: 180,
    sku: "PW-1.5L"
  },
  { 
    id: "PROD-005", 
    productType: "Bottled Water", 
    productName: "Pure Water 5L", 
    defaultPackaging: "Individual Units",
    defaultUnitsPerCase: 1,
    shelfLifeDays: 180,
    sku: "PW-5L"
  },
];

const getQualityStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending QC</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getDispatchStatusBadge = (status: string) => {
  switch (status) {
    case "ready":
      return <Badge variant="default" className="bg-blue-100 text-blue-800 border-blue-200">Ready</Badge>;
    case "dispatched":
      return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Dispatched</Badge>;
    case "hold":
      return <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-200">On Hold</Badge>;
    case "quarantine":
      return <Badge variant="destructive">Quarantine</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const getExpiryStatusBadge = (daysToExpiry: number) => {
  if (daysToExpiry <= 30) {
    return <Badge variant="destructive">Expires Soon</Badge>;
  } else if (daysToExpiry <= 60) {
    return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Monitor</Badge>;
  } else {
    return <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">Good</Badge>;
  }
};

export function FinishedBayModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [qualityFilter, setQualityFilter] = useState("all");
  const [dispatchFilter, setDispatchFilter] = useState("all");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isQcDialogOpen, setIsQcDialogOpen] = useState(false);
  const [isDispatchDialogOpen, setIsDispatchDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("inventory");
  const [qcResult, setQcResult] = useState("");
  const [qcNotes, setQcNotes] = useState("");
  const [dispatchQuantity, setDispatchQuantity] = useState("");
  const [dispatchDestination, setDispatchDestination] = useState("");
  const [dispatchDriver, setDispatchDriver] = useState("");
  const [dispatchNotes, setDispatchNotes] = useState("");
  
  // Storage locations state
  const [storageLocations, setStorageLocations] = useState(initialStorageLocations);
  
  // Product registry state
  const [registeredProducts, setRegisteredProducts] = useState(initialProducts);
  
  // New Receipt Dialog States
  const [isNewReceiptDialogOpen, setIsNewReceiptDialogOpen] = useState(false);
  const [isNewStorageDialogOpen, setIsNewStorageDialogOpen] = useState(false);
  const [isProductRegistryDialogOpen, setIsProductRegistryDialogOpen] = useState(false);
  const [isNewProductDialogOpen, setIsNewProductDialogOpen] = useState(false);
  const [isStorageManagementDialogOpen, setIsStorageManagementDialogOpen] = useState(false);
  const [isEditStorageDialogOpen, setIsEditStorageDialogOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState<any>(null);
  
  // New Receipt Form States
  const [newReceiptBatchNumber, setNewReceiptBatchNumber] = useState("");
  const [newReceiptProductType, setNewReceiptProductType] = useState("");
  const [newReceiptProductName, setNewReceiptProductName] = useState("");
  const [newReceiptQuantity, setNewReceiptQuantity] = useState("");
  const [newReceiptPackagingType, setNewReceiptPackagingType] = useState("");
  const [newReceiptUnitsPerCase, setNewReceiptUnitsPerCase] = useState("");
  const [newReceiptProductionDate, setNewReceiptProductionDate] = useState("");
  const [newReceiptExpiryDate, setNewReceiptExpiryDate] = useState("");
  const [newReceiptStorageLocation, setNewReceiptStorageLocation] = useState("");
  const [newReceiptQualityStatus, setNewReceiptQualityStatus] = useState("pending");
  const [newReceiptTemperature, setNewReceiptTemperature] = useState("");
  const [newReceiptHumidity, setNewReceiptHumidity] = useState("");
  const [newReceiptNotes, setNewReceiptNotes] = useState("");
  
  // New Storage Location Form States
  const [newStorageBayId, setNewStorageBayId] = useState("");
  const [newStorageName, setNewStorageName] = useState("");
  const [newStorageCapacity, setNewStorageCapacity] = useState("");
  const [newStorageTemperature, setNewStorageTemperature] = useState("18");
  const [newStorageHumidity, setNewStorageHumidity] = useState("45");

  // New Product Form States
  const [newProductType, setNewProductType] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [newProductSku, setNewProductSku] = useState("");
  const [newProductPackaging, setNewProductPackaging] = useState("");
  const [newProductUnitsPerCase, setNewProductUnitsPerCase] = useState("");
  const [newProductShelfLife, setNewProductShelfLife] = useState("180");
  const [newProductDescription, setNewProductDescription] = useState("");

  // Calculate KPIs
  const totalItems = finishedGoodsData.length;
  const approvedItems = finishedGoodsData.filter(item => item.qualityStatus === "approved").length;
  const readyForDispatch = finishedGoodsData.filter(item => item.dispatchStatus === "ready").length;
  const expiringItems = finishedGoodsData.filter(item => item.daysToExpiry <= 30).length;
  const totalQuantity = finishedGoodsData.reduce((sum, item) => sum + item.quantity, 0);
  const storageUtilization = Math.round((storageLocations.reduce((sum, loc) => sum + loc.occupied, 0) / 
                                      storageLocations.reduce((sum, loc) => sum + loc.capacity, 0)) * 100);

  // Check for environmental alerts
  const environmentalAlerts = storageLocations.filter(loc => {
    const temp = parseInt(loc.temperature);
    const humidity = parseInt(loc.humidity);
    return temp > 20 || humidity > 50;
  });

  const filteredData = finishedGoodsData.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.storageLocation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = qualityFilter === "all" || item.qualityStatus === qualityFilter;
    const matchesDispatch = dispatchFilter === "all" || item.dispatchStatus === dispatchFilter;
    return matchesSearch && matchesQuality && matchesDispatch;
  });

  const handleQualityCheck = (item: any) => {
    setSelectedItem(item);
    setQcResult("");
    setQcNotes("");
    setIsQcDialogOpen(true);
  };

  const handleDispatch = (item: any) => {
    setSelectedItem(item);
    setDispatchQuantity("");
    setDispatchDestination("");
    setDispatchDriver("");
    setDispatchNotes("");
    setIsDispatchDialogOpen(true);
  };

  const submitQualityCheck = () => {
    if (!qcResult) {
      toast.error("Please select a QC result");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      if (qcResult === "approved") {
        toast.success(`Batch ${selectedItem?.batchNumber} approved for dispatch`, {
          description: "Quality control passed. Ready for dispatch operations."
        });
      } else {
        toast.error(`Batch ${selectedItem?.batchNumber} rejected`, {
          description: "Quality control failed. Batch moved to quarantine."
        });
      }
      setIsQcDialogOpen(false);
    }, 1000);
  };

  const submitDispatch = () => {
    if (!dispatchQuantity || !dispatchDestination || !dispatchDriver) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`Dispatch initiated for batch ${selectedItem?.batchNumber}`, {
        description: `${dispatchQuantity} units dispatched to ${dispatchDestination}`
      });
      setIsDispatchDialogOpen(false);
    }, 1000);
  };

  const generateReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 2000)),
      {
        loading: "Generating finished bay report...",
        success: "Report generated successfully",
        error: "Failed to generate report"
      }
    );
  };

  const handleNewReceipt = () => {
    // Auto-generate batch number
    const today = new Date();
    const dateStr = today.toISOString().slice(2, 10).replace(/-/g, '');
    const batchNum = `BATCH-${dateStr}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    setNewReceiptBatchNumber(batchNum);
    
    // Reset form
    setNewReceiptProductType("");
    setNewReceiptProductName("");
    setNewReceiptQuantity("");
    setNewReceiptPackagingType("");
    setNewReceiptUnitsPerCase("");
    setNewReceiptProductionDate(today.toISOString().split('T')[0]);
    setNewReceiptExpiryDate("");
    setNewReceiptStorageLocation("");
    setNewReceiptQualityStatus("pending");
    setNewReceiptTemperature("18");
    setNewReceiptHumidity("45");
    setNewReceiptNotes("");
    
    setIsNewReceiptDialogOpen(true);
  };

  const handleProductSelection = (productId: string) => {
    const product = registeredProducts.find(p => p.id === productId);
    if (product) {
      setNewReceiptProductType(product.productType);
      setNewReceiptProductName(product.productName);
      setNewReceiptPackagingType(product.defaultPackaging);
      setNewReceiptUnitsPerCase(product.defaultUnitsPerCase.toString());
      
      // Calculate expiry date based on shelf life
      if (newReceiptProductionDate) {
        const productionDate = new Date(newReceiptProductionDate);
        const expiryDate = new Date(productionDate);
        expiryDate.setDate(expiryDate.getDate() + product.shelfLifeDays);
        setNewReceiptExpiryDate(expiryDate.toISOString().split('T')[0]);
      }
      
      toast.success(`Product selected: ${product.productName}`, {
        description: `Default packaging: ${product.defaultPackaging}`
      });
    }
  };

  const submitNewReceipt = () => {
    // Validation
    if (!newReceiptProductType || !newReceiptProductName || !newReceiptQuantity || 
        !newReceiptPackagingType || !newReceiptProductionDate || !newReceiptExpiryDate || 
        !newReceiptStorageLocation) {
      toast.error("Please fill in all required fields");
      return;
    }

    const quantity = parseInt(newReceiptQuantity);
    const unitsPerCase = parseInt(newReceiptUnitsPerCase) || 1;
    const totalCases = Math.ceil(quantity / unitsPerCase);

    // Check storage capacity
    const selectedStorage = storageLocations.find(loc => loc.id === newReceiptStorageLocation);
    if (selectedStorage) {
      const availableSpace = selectedStorage.capacity - selectedStorage.occupied;
      if (totalCases > availableSpace) {
        toast.error("Insufficient storage capacity", {
          description: `Selected location has only ${availableSpace} cases available, but you need ${totalCases} cases.`
        });
        return;
      }
    }

    // Simulate API call
    setTimeout(() => {
      toast.success(`New finished goods receipt created`, {
        description: `Batch ${newReceiptBatchNumber} - ${quantity.toLocaleString()} units of ${newReceiptProductName}`
      });
      
      // Update storage location occupied space
      setStorageLocations(prev => prev.map(loc => 
        loc.id === newReceiptStorageLocation 
          ? { ...loc, occupied: loc.occupied + totalCases }
          : loc
      ));
      
      setIsNewReceiptDialogOpen(false);
    }, 1000);
  };

  const handleCreateNewStorage = () => {
    setNewStorageBayId("");
    setNewStorageName("");
    setNewStorageCapacity("");
    setNewStorageTemperature("18");
    setNewStorageHumidity("45");
    setIsNewStorageDialogOpen(true);
  };

  const submitNewStorage = () => {
    // Validation
    if (!newStorageBayId || !newStorageName || !newStorageCapacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if storage ID already exists
    if (storageLocations.find(loc => loc.id === newStorageBayId)) {
      toast.error("Storage location ID already exists");
      return;
    }

    const newStorage = {
      id: newStorageBayId,
      name: newStorageName,
      capacity: parseInt(newStorageCapacity),
      occupied: 0,
      temperature: `${newStorageTemperature}°C`,
      humidity: `${newStorageHumidity}%`
    };

    setStorageLocations(prev => [...prev, newStorage]);
    
    toast.success(`New storage location created`, {
      description: `${newStorageName} with capacity of ${newStorageCapacity} cases`
    });

    // If creating from receipt dialog, select it automatically
    if (isNewReceiptDialogOpen) {
      setNewReceiptStorageLocation(newStorageBayId);
    }

    setIsNewStorageDialogOpen(false);
  };

  const handleOpenProductRegistry = () => {
    setIsProductRegistryDialogOpen(true);
  };

  const handleAddNewProduct = () => {
    setNewProductType("");
    setNewProductName("");
    setNewProductSku("");
    setNewProductPackaging("");
    setNewProductUnitsPerCase("");
    setNewProductShelfLife("180");
    setNewProductDescription("");
    setIsNewProductDialogOpen(true);
  };

  const submitNewProduct = () => {
    // Validation
    if (!newProductType || !newProductName || !newProductSku || !newProductPackaging || !newProductUnitsPerCase) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if SKU already exists
    if (registeredProducts.find(p => p.sku === newProductSku)) {
      toast.error("Product SKU already exists");
      return;
    }

    const newProduct = {
      id: `PROD-${String(registeredProducts.length + 1).padStart(3, '0')}`,
      productType: newProductType,
      productName: newProductName,
      sku: newProductSku,
      defaultPackaging: newProductPackaging,
      defaultUnitsPerCase: parseInt(newProductUnitsPerCase),
      shelfLifeDays: parseInt(newProductShelfLife),
      description: newProductDescription
    };

    setRegisteredProducts(prev => [...prev, newProduct]);
    
    toast.success("New product registered successfully", {
      description: `${newProductName} (${newProductSku})`
    });

    setIsNewProductDialogOpen(false);
  };

  const handleDeleteProduct = (productId: string) => {
    const product = registeredProducts.find(p => p.id === productId);
    if (product) {
      setRegisteredProducts(prev => prev.filter(p => p.id !== productId));
      toast.success(`Product removed: ${product.productName}`);
    }
  };

  const handleOpenStorageManagement = () => {
    setIsStorageManagementDialogOpen(true);
  };

  const handleEditStorage = (storage: any) => {
    setSelectedStorage(storage);
    setNewStorageBayId(storage.id);
    setNewStorageName(storage.name);
    setNewStorageCapacity(storage.capacity.toString());
    setNewStorageTemperature(storage.temperature.replace('°C', ''));
    setNewStorageHumidity(storage.humidity.replace('%', ''));
    setIsEditStorageDialogOpen(true);
  };

  const submitEditStorage = () => {
    // Validation
    if (!newStorageBayId || !newStorageName || !newStorageCapacity) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Check if changing ID to one that already exists
    if (newStorageBayId !== selectedStorage.id && 
        storageLocations.find(loc => loc.id === newStorageBayId)) {
      toast.error("Storage location ID already exists");
      return;
    }

    // Check if new capacity is sufficient for current inventory
    const newCapacity = parseInt(newStorageCapacity);
    if (newCapacity < selectedStorage.occupied) {
      toast.error("Capacity cannot be less than current inventory", {
        description: `Current inventory: ${selectedStorage.occupied} cases. New capacity must be at least ${selectedStorage.occupied}.`
      });
      return;
    }

    const updatedStorage = {
      id: newStorageBayId,
      name: newStorageName,
      capacity: newCapacity,
      occupied: selectedStorage.occupied, // Keep the same occupied value
      temperature: `${newStorageTemperature}°C`,
      humidity: `${newStorageHumidity}%`
    };

    setStorageLocations(prev => prev.map(loc => 
      loc.id === selectedStorage.id ? updatedStorage : loc
    ));
    
    toast.success("Storage location updated successfully", {
      description: `${newStorageName} details have been updated`
    });

    setIsEditStorageDialogOpen(false);
    setSelectedStorage(null);
  };

  const handleDeleteStorage = (storageId: string) => {
    const storage = storageLocations.find(loc => loc.id === storageId);
    if (storage) {
      if (storage.occupied > 0) {
        toast.error("Cannot delete storage location", {
          description: `${storage.name} contains ${storage.occupied} cases. Please empty it first.`
        });
        return;
      }
      
      setStorageLocations(prev => prev.filter(loc => loc.id !== storageId));
      toast.success(`Storage location removed: ${storage.name}`);
    }
  };

  const SummaryCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 mb-1">Total Finished Goods</p>
              <p className="text-2xl font-bold text-blue-900">{totalQuantity.toLocaleString()}</p>
              <p className="text-xs text-blue-600">{totalItems} batches</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
              <Package2 className="h-6 w-6 text-blue-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-green-50 to-green-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 mb-1">Ready for Dispatch</p>
              <p className="text-2xl font-bold text-green-900">{readyForDispatch}</p>
              <p className="text-xs text-green-600">Quality approved</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-green-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-orange-50 to-orange-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 mb-1">Expiring Soon</p>
              <p className="text-2xl font-bold text-orange-900">{expiringItems}</p>
              <p className="text-xs text-orange-600">Within 30 days</p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-orange-700" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-purple-50 to-purple-100">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 mb-1">Storage Utilization</p>
              <p className="text-2xl font-bold text-purple-900">{storageUtilization}%</p>
              <p className="text-xs text-purple-600">Warehouse capacity</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">
              <Warehouse className="h-6 w-6 text-purple-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Finished Bay Management</h1>
            <p className="text-gray-600">Monitor finished goods, quality control, and dispatch operations</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleOpenProductRegistry}>
              <Settings className="h-4 w-4 mr-2" />
              Manage Products
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenStorageManagement}>
              <Warehouse className="h-4 w-4 mr-2" />
              Manage Storage
            </Button>
            <Button variant="outline" size="sm" onClick={generateReport}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm" onClick={handleNewReceipt}>
              <Plus className="h-4 w-4 mr-2" />
              New Receipt
            </Button>
          </div>
        </div>

        <SummaryCards />

        {/* Alerts */}
        {expiringItems > 0 && (
          <Alert className="border-l-4 border-l-orange-500 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <span className="font-semibold text-orange-800">Expiry Alert:</span> {expiringItems} batch(es) will expire within 30 days. Please prioritize dispatch.
              <Button 
                variant="link" 
                size="sm" 
                className="ml-2 p-0 h-auto text-orange-800"
                onClick={() => toast.warning(`${expiringItems} batches expiring soon`, {
                  description: "Consider prioritizing these items for immediate dispatch",
                  action: {
                    label: "View Items",
                    onClick: () => {
                      setQualityFilter("approved");
                      setActiveTab("inventory");
                    }
                  }
                })}
              >
                Show Details
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        {storageUtilization >= 90 && (
          <Alert className="border-l-4 border-l-red-500 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription>
              <span className="font-semibold text-red-800">Storage Critical:</span> Warehouse capacity at {storageUtilization}%. Immediate dispatch required.
            </AlertDescription>
          </Alert>
        )}

        {environmentalAlerts.length > 0 && (
          <Alert className="border-l-4 border-l-yellow-500 bg-yellow-50">
            <Thermometer className="h-4 w-4 text-yellow-600" />
            <AlertDescription>
              <span className="font-semibold text-yellow-800">Environmental Alert:</span> {environmentalAlerts.length} storage location(s) have suboptimal conditions.
              <Button 
                variant="link" 
                size="sm" 
                className="ml-2 p-0 h-auto text-yellow-800"
                onClick={() => {
                  setActiveTab("storage");
                  toast.warning("Environmental conditions need attention", {
                    description: `${environmentalAlerts.map(loc => loc.name).join(", ")} - Check temperature/humidity`,
                  });
                }}
              >
                Check Storage
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Finished Goods Inventory</TabsTrigger>
            <TabsTrigger value="storage">Storage Management</TabsTrigger>
            <TabsTrigger value="quality">Quality Control</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package2 className="h-5 w-5 text-blue-600" />
                  <span>Finished Goods Inventory</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search by product, batch, or location..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Select value={qualityFilter} onValueChange={setQualityFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Quality Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Quality Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending QC</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={dispatchFilter} onValueChange={setDispatchFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Dispatch Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dispatch Status</SelectItem>
                      <SelectItem value="ready">Ready</SelectItem>
                      <SelectItem value="hold">On Hold</SelectItem>
                      <SelectItem value="dispatched">Dispatched</SelectItem>
                      <SelectItem value="quarantine">Quarantine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Inventory Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Production Date</TableHead>
                        <TableHead>Expiry</TableHead>
                        <TableHead>Quality Status</TableHead>
                        <TableHead>Storage Location</TableHead>
                        <TableHead>Dispatch Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.batchNumber}</p>
                              <p className="text-sm text-gray-500">{item.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.productName}</p>
                              <p className="text-sm text-gray-500">{item.packagingType}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.quantity.toLocaleString()} units</p>
                              <p className="text-sm text-gray-500">{item.totalCases} cases</p>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(item.productionDate).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="text-sm">{new Date(item.expiryDate).toLocaleDateString()}</p>
                              {getExpiryStatusBadge(item.daysToExpiry)}
                            </div>
                          </TableCell>
                          <TableCell>{getQualityStatusBadge(item.qualityStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-sm">{item.storageLocation}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getDispatchStatusBadge(item.dispatchStatus)}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setIsDialogOpen(true);
                                  toast.info(`Viewing details for batch ${item.batchNumber}`);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {item.qualityStatus === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQualityCheck(item)}
                                >
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  QC
                                </Button>
                              )}
                              {item.qualityStatus === "approved" && item.dispatchStatus === "ready" && (
                                <Button
                                  variant="default"
                                  size="sm"
                                  onClick={() => handleDispatch(item)}
                                >
                                  <Send className="h-3 w-3 mr-1" />
                                  Dispatch
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

          <TabsContent value="storage" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  <span>Storage Location Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {storageLocations.map((location) => {
                    const utilizationPercent = (location.occupied / location.capacity) * 100;
                    const getUtilizationColor = () => {
                      if (utilizationPercent >= 90) return "bg-red-500";
                      if (utilizationPercent >= 75) return "bg-orange-500";
                      return "bg-green-500";
                    };

                    return (
                      <Card 
                        key={location.id} 
                        className="border-2 cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          if (utilizationPercent >= 90) {
                            toast.error(`${location.name} is at critical capacity`, {
                              description: "Immediate action required to free up space"
                            });
                          } else if (utilizationPercent >= 75) {
                            toast.warning(`${location.name} is nearing capacity`, {
                              description: "Consider planning dispatch operations"
                            });
                          } else {
                            toast.info(`${location.name} - ${location.occupied}/${location.capacity} cases`, {
                              description: `Temperature: ${location.temperature}, Humidity: ${location.humidity}`
                            });
                          }
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{location.name}</h3>
                              <p className="text-sm text-gray-500">{location.id}</p>
                            </div>
                            <Badge variant={utilizationPercent >= 90 ? "destructive" : "outline"}>
                              {Math.round(utilizationPercent)}%
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Capacity Utilization</span>
                              <span>{location.occupied}/{location.capacity} cases</span>
                            </div>
                            <Progress value={utilizationPercent} className="h-2" />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <Thermometer className="h-4 w-4 mx-auto text-blue-600 mb-1" />
                              <p className="text-sm font-medium">{location.temperature}</p>
                              <p className="text-xs text-gray-500">Temperature</p>
                            </div>
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <BarChart3 className="h-4 w-4 mx-auto text-green-600 mb-1" />
                              <p className="text-sm font-medium">{location.humidity}</p>
                              <p className="text-xs text-gray-500">Humidity</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quality" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  <span>Quality Control Dashboard</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-900">{approvedItems}</p>
                      <p className="text-sm text-green-600">Approved Batches</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-4 text-center">
                      <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-yellow-900">
                        {finishedGoodsData.filter(item => item.qualityStatus === "pending").length}
                      </p>
                      <p className="text-sm text-yellow-600">Pending QC</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-4 text-center">
                      <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-900">
                        {finishedGoodsData.filter(item => item.qualityStatus === "rejected").length}
                      </p>
                      <p className="text-sm text-red-600">Rejected Batches</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Number</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Production Date</TableHead>
                        <TableHead>QC Inspector</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {finishedGoodsData.filter(item => item.qualityStatus !== "approved").map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.batchNumber}</TableCell>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{new Date(item.productionDate).toLocaleDateString()}</TableCell>
                          <TableCell>{item.qcInspector || "Not Assigned"}</TableCell>
                          <TableCell>{getQualityStatusBadge(item.qualityStatus)}</TableCell>
                          <TableCell>
                            {item.qualityStatus === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQualityCheck(item)}
                              >
                                <PackageCheck className="h-3 w-3 mr-1" />
                                Inspect
                              </Button>
                            )}
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

        {/* Item Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Finished Goods Details</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Batch Number</Label>
                    <p className="font-medium">{selectedItem.batchNumber}</p>
                  </div>
                  <div>
                    <Label>Product Name</Label>
                    <p className="font-medium">{selectedItem.productName}</p>
                  </div>
                  <div>
                    <Label>Total Quantity</Label>
                    <p className="font-medium">{selectedItem.quantity.toLocaleString()} units</p>
                  </div>
                  <div>
                    <Label>Storage Location</Label>
                    <p className="font-medium">{selectedItem.storageLocation}</p>
                  </div>
                  <div>
                    <Label>Production Date</Label>
                    <p className="font-medium">{new Date(selectedItem.productionDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Expiry Date</Label>
                    <p className="font-medium">{new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label>Temperature</Label>
                    <p className="font-medium">{selectedItem.temperature}</p>
                  </div>
                  <div>
                    <Label>Humidity</Label>
                    <p className="font-medium">{selectedItem.humidity}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quality Status</Label>
                    <div className="mt-1">{getQualityStatusBadge(selectedItem.qualityStatus)}</div>
                  </div>
                  <div>
                    <Label>Dispatch Status</Label>
                    <div className="mt-1">{getDispatchStatusBadge(selectedItem.dispatchStatus)}</div>
                  </div>
                </div>

                {selectedItem.reservedForOrder && (
                  <div>
                    <Label>Reserved for Order</Label>
                    <p className="font-medium">{selectedItem.reservedForOrder}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Quality Check Dialog */}
        <Dialog open={isQcDialogOpen} onOpenChange={setIsQcDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quality Control Inspection</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div>
                  <Label>Batch Number</Label>
                  <Input value={selectedItem.batchNumber} disabled />
                </div>
                <div>
                  <Label>Product</Label>
                  <Input value={selectedItem.productName} disabled />
                </div>
                <div>
                  <Label>QC Result</Label>
                  <Select value={qcResult} onValueChange={setQcResult}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select QC result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Inspector Notes</Label>
                  <Textarea 
                    placeholder="Enter inspection notes..." 
                    value={qcNotes}
                    onChange={(e) => setQcNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsQcDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitQualityCheck}>
                    Submit QC Result
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Dispatch Dialog */}
        <Dialog open={isDispatchDialogOpen} onOpenChange={setIsDispatchDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dispatch Preparation</DialogTitle>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-4">
                <div>
                  <Label>Batch Number</Label>
                  <Input value={selectedItem.batchNumber} disabled />
                </div>
                <div>
                  <Label>Product</Label>
                  <Input value={selectedItem.productName} disabled />
                </div>
                <div>
                  <Label>Quantity to Dispatch</Label>
                  <Input 
                    type="number" 
                    placeholder="Enter quantity" 
                    value={dispatchQuantity}
                    onChange={(e) => setDispatchQuantity(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Input 
                    placeholder="Enter delivery destination" 
                    value={dispatchDestination}
                    onChange={(e) => setDispatchDestination(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Driver/Vehicle</Label>
                  <Select value={dispatchDriver} onValueChange={setDispatchDriver}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver/vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="driver1">Driver 1 - Vehicle A</SelectItem>
                      <SelectItem value="driver2">Driver 2 - Vehicle B</SelectItem>
                      <SelectItem value="driver3">Driver 3 - Vehicle C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Dispatch Notes</Label>
                  <Textarea 
                    placeholder="Enter dispatch instructions..." 
                    value={dispatchNotes}
                    onChange={(e) => setDispatchNotes(e.target.value)}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDispatchDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={submitDispatch}>
                    Confirm Dispatch
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* New Receipt Dialog */}
        <Dialog open={isNewReceiptDialogOpen} onOpenChange={setIsNewReceiptDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package2 className="h-5 w-5 text-blue-600" />
                <span>New Finished Goods Receipt</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Batch Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Batch Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Batch Number <span className="text-red-500">*</span></Label>
                    <Input 
                      value={newReceiptBatchNumber}
                      onChange={(e) => setNewReceiptBatchNumber(e.target.value)}
                      placeholder="BATCH-XXXXXX-XXX"
                    />
                  </div>
                  <div>
                    <Label>Production Date <span className="text-red-500">*</span></Label>
                    <Input 
                      type="date"
                      value={newReceiptProductionDate}
                      onChange={(e) => setNewReceiptProductionDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Product Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Package2 className="h-4 w-4" />
                    <span>Product Details</span>
                  </h3>
                  <Button 
                    variant="link" 
                    size="sm"
                    className="text-blue-600"
                    onClick={handleOpenProductRegistry}
                  >
                    <Settings className="h-3 w-3 mr-1" />
                    Manage Products
                  </Button>
                </div>
                
                <div>
                  <Label>Select Registered Product <span className="text-red-500">*</span></Label>
                  <Select onValueChange={handleProductSelection}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose from registered products" />
                    </SelectTrigger>
                    <SelectContent>
                      {registeredProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          <div className="flex items-center justify-between w-full">
                            <span>{product.productName}</span>
                            <Badge variant="outline" className="ml-2 text-xs">
                              {product.sku}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select a product from the registry or manage products to add new ones
                  </p>
                </div>

                {newReceiptProductName && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-sm text-green-800">
                      <strong>Selected:</strong> {newReceiptProductName} ({newReceiptProductType})
                      {newReceiptPackagingType && ` - ${newReceiptPackagingType}`}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Quantity Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <PackageCheck className="h-4 w-4" />
                  <span>Quantity Information</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Total Quantity (Units) <span className="text-red-500">*</span></Label>
                    <Input 
                      type="number"
                      value={newReceiptQuantity}
                      onChange={(e) => setNewReceiptQuantity(e.target.value)}
                      placeholder="e.g., 12000"
                    />
                  </div>
                  <div>
                    <Label>Total Cases</Label>
                    <div className="h-10 flex items-center px-3 bg-gray-100 border border-gray-200 rounded-md">
                      {newReceiptQuantity && newReceiptUnitsPerCase ? (
                        <span className="font-medium text-gray-900">
                          {Math.ceil(parseInt(newReceiptQuantity) / parseInt(newReceiptUnitsPerCase))} cases
                        </span>
                      ) : (
                        <span className="text-gray-500">Select product first</span>
                      )}
                    </div>
                    {newReceiptUnitsPerCase && (
                      <p className="text-xs text-gray-500 mt-1">
                        {newReceiptUnitsPerCase} units per case ({newReceiptPackagingType})
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Expiry & Quality */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Expiry & Quality Control</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Expiry Date <span className="text-red-500">*</span></Label>
                    <Input 
                      type="date"
                      value={newReceiptExpiryDate}
                      onChange={(e) => setNewReceiptExpiryDate(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Initial Quality Status</Label>
                    <Select value={newReceiptQualityStatus} onValueChange={setNewReceiptQualityStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending QC</SelectItem>
                        <SelectItem value="approved">Pre-Approved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Storage Location */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                    <Warehouse className="h-4 w-4" />
                    <span>Storage Location</span>
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCreateNewStorage}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    New Location
                  </Button>
                </div>
                <div>
                  <Label>Select Storage Location <span className="text-red-500">*</span></Label>
                  <Select value={newReceiptStorageLocation} onValueChange={setNewReceiptStorageLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select storage location" />
                    </SelectTrigger>
                    <SelectContent>
                      {storageLocations.map((location) => {
                        const availableSpace = location.capacity - location.occupied;
                        const utilizationPercent = (location.occupied / location.capacity) * 100;
                        return (
                          <SelectItem key={location.id} value={location.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{location.name}</span>
                              <span className="text-xs text-gray-500 ml-2">
                                ({availableSpace} available, {Math.round(utilizationPercent)}% used)
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {newReceiptStorageLocation && storageLocations.find(l => l.id === newReceiptStorageLocation) && (
                    <Alert className="mt-2 bg-blue-50 border-blue-200">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-sm text-blue-800">
                        Selected: {storageLocations.find(l => l.id === newReceiptStorageLocation)?.name} - 
                        Temp: {storageLocations.find(l => l.id === newReceiptStorageLocation)?.temperature}, 
                        Humidity: {storageLocations.find(l => l.id === newReceiptStorageLocation)?.humidity}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>

              {/* Environmental Conditions */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                  <Thermometer className="h-4 w-4" />
                  <span>Initial Environmental Conditions</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Temperature (°C)</Label>
                    <Input 
                      type="number"
                      value={newReceiptTemperature}
                      onChange={(e) => setNewReceiptTemperature(e.target.value)}
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <Label>Humidity (%)</Label>
                    <Input 
                      type="number"
                      value={newReceiptHumidity}
                      onChange={(e) => setNewReceiptHumidity(e.target.value)}
                      placeholder="45"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Additional Notes</Label>
                <Textarea 
                  placeholder="Enter any additional notes about this receipt..."
                  value={newReceiptNotes}
                  onChange={(e) => setNewReceiptNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewReceiptDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={submitNewReceipt}>
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Create Receipt
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Storage Location Dialog */}
        <Dialog open={isNewStorageDialogOpen} onOpenChange={setIsNewStorageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Warehouse className="h-5 w-5 text-blue-600" />
                <span>Create New Storage Location</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Storage Location ID <span className="text-red-500">*</span></Label>
                <Input 
                  value={newStorageBayId}
                  onChange={(e) => setNewStorageBayId(e.target.value)}
                  placeholder="e.g., Bay-D-01"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for the storage location</p>
              </div>
              
              <div>
                <Label>Storage Location Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={newStorageName}
                  onChange={(e) => setNewStorageName(e.target.value)}
                  placeholder="e.g., Bay D - Section 01"
                />
              </div>

              <div>
                <Label>Total Capacity (Cases) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  value={newStorageCapacity}
                  onChange={(e) => setNewStorageCapacity(e.target.value)}
                  placeholder="e.g., 1000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Initial Temperature (°C)</Label>
                  <Input 
                    type="number"
                    value={newStorageTemperature}
                    onChange={(e) => setNewStorageTemperature(e.target.value)}
                    placeholder="18"
                  />
                </div>
                <div>
                  <Label>Initial Humidity (%)</Label>
                  <Input 
                    type="number"
                    value={newStorageHumidity}
                    onChange={(e) => setNewStorageHumidity(e.target.value)}
                    placeholder="45"
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  This storage location will be available immediately for finished goods allocation.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewStorageDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={submitNewStorage}>
                  <Warehouse className="h-4 w-4 mr-2" />
                  Create Location
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Product Registry Dialog */}
        <Dialog open={isProductRegistryDialogOpen} onOpenChange={setIsProductRegistryDialogOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Package2 className="h-5 w-5 text-blue-600" />
                  <span>Product Registry</span>
                </div>
                <Button size="sm" onClick={handleAddNewProduct}>
                  <Plus className="h-4 w-4 mr-2" />
                  Register New Product
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Register products here to ensure consistency when creating finished goods receipts. 
                  All product details including packaging and shelf life will be pre-configured.
                </AlertDescription>
              </Alert>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SKU</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Default Packaging</TableHead>
                      <TableHead>Units/Case</TableHead>
                      <TableHead>Shelf Life</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                          No products registered yet. Click "Register New Product" to add one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      registeredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <Badge variant="outline">{product.sku}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{product.productName}</TableCell>
                          <TableCell>{product.productType}</TableCell>
                          <TableCell>{product.defaultPackaging}</TableCell>
                          <TableCell>{product.defaultUnitsPerCase}</TableCell>
                          <TableCell>{product.shelfLifeDays} days</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toast.info(`Editing ${product.productName}`, {
                                  description: "Edit functionality coming soon"
                                })}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (confirm(`Are you sure you want to remove ${product.productName}?`)) {
                                    handleDeleteProduct(product.id);
                                  }
                                }}
                              >
                                <Trash2 className="h-3 w-3 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Total registered products: <span className="font-medium">{registeredProducts.length}</span>
                </p>
                <Button variant="outline" onClick={() => setIsProductRegistryDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* New Product Dialog */}
        <Dialog open={isNewProductDialogOpen} onOpenChange={setIsNewProductDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Package2 className="h-5 w-5 text-blue-600" />
                <span>Register New Product</span>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Product Type <span className="text-red-500">*</span></Label>
                  <Select value={newProductType} onValueChange={setNewProductType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bottled Water">Bottled Water</SelectItem>
                      <SelectItem value="Purified Water">Purified Water</SelectItem>
                      <SelectItem value="Spring Water">Spring Water</SelectItem>
                      <SelectItem value="Distilled Water">Distilled Water</SelectItem>
                      <SelectItem value="Mineral Water">Mineral Water</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Product Name <span className="text-red-500">*</span></Label>
                  <Input 
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="e.g., Pure Water 500ml"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>SKU/Product Code <span className="text-red-500">*</span></Label>
                  <Input 
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value.toUpperCase())}
                    placeholder="e.g., PW-500ML"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique product identifier</p>
                </div>

                <div>
                  <Label>Shelf Life (Days) <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    value={newProductShelfLife}
                    onChange={(e) => setNewProductShelfLife(e.target.value)}
                    placeholder="180"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Packaging <span className="text-red-500">*</span></Label>
                  <Select value={newProductPackaging} onValueChange={setNewProductPackaging}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select packaging type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24-pack Cases">24-pack Cases</SelectItem>
                      <SelectItem value="12-pack Cases">12-pack Cases</SelectItem>
                      <SelectItem value="6-pack Cases">6-pack Cases</SelectItem>
                      <SelectItem value="Individual Units">Individual Units</SelectItem>
                      <SelectItem value="Bulk Pack">Bulk Pack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Units per Case <span className="text-red-500">*</span></Label>
                  <Input 
                    type="number"
                    value={newProductUnitsPerCase}
                    onChange={(e) => setNewProductUnitsPerCase(e.target.value)}
                    placeholder="e.g., 24"
                  />
                </div>
              </div>

              <div>
                <Label>Product Description</Label>
                <Textarea 
                  value={newProductDescription}
                  onChange={(e) => setNewProductDescription(e.target.value)}
                  placeholder="Optional description or notes about this product..."
                  rows={3}
                />
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Once registered, this product will be available in the receipt form with all default values pre-configured.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => setIsNewProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={submitNewProduct}>
                  <PackageCheck className="h-4 w-4 mr-2" />
                  Register Product
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Storage Location Management Dialog */}
        <Dialog open={isStorageManagementDialogOpen} onOpenChange={setIsStorageManagementDialogOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Warehouse className="h-5 w-5 text-blue-600" />
                  <span>Storage Location Management</span>
                </div>
                <Button size="sm" onClick={handleCreateNewStorage}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Location
                </Button>
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Manage all storage locations in the finished bay warehouse. Monitor capacity utilization and environmental conditions.
                </AlertDescription>
              </Alert>

              {/* Storage Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-blue-600 mb-1">Total Locations</p>
                      <p className="text-2xl font-bold text-blue-900">{storageLocations.length}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-green-600 mb-1">Total Capacity</p>
                      <p className="text-2xl font-bold text-green-900">
                        {storageLocations.reduce((sum, loc) => sum + loc.capacity, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-orange-600 mb-1">Cases Stored</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {storageLocations.reduce((sum, loc) => sum + loc.occupied, 0).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-purple-600 mb-1">Utilization</p>
                      <p className="text-2xl font-bold text-purple-900">{storageUtilization}%</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Location ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Occupied</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Utilization</TableHead>
                      <TableHead>Temperature</TableHead>
                      <TableHead>Humidity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {storageLocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                          No storage locations available. Click "Add New Location" to create one.
                        </TableCell>
                      </TableRow>
                    ) : (
                      storageLocations.map((location) => {
                        const utilizationPercent = (location.occupied / location.capacity) * 100;
                        const available = location.capacity - location.occupied;
                        
                        return (
                          <TableRow key={location.id}>
                            <TableCell>
                              <Badge variant="outline">{location.id}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{location.name}</TableCell>
                            <TableCell>{location.capacity.toLocaleString()} cases</TableCell>
                            <TableCell>{location.occupied.toLocaleString()} cases</TableCell>
                            <TableCell>
                              <span className={available < 100 ? "text-orange-600 font-medium" : ""}>
                                {available.toLocaleString()} cases
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${
                                      utilizationPercent >= 90 ? 'bg-red-500' :
                                      utilizationPercent >= 75 ? 'bg-orange-500' :
                                      'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                                  />
                                </div>
                                <Badge 
                                  variant={
                                    utilizationPercent >= 90 ? "destructive" :
                                    utilizationPercent >= 75 ? "outline" :
                                    "default"
                                  }
                                  className={
                                    utilizationPercent >= 90 ? "" :
                                    utilizationPercent >= 75 ? "bg-orange-100 text-orange-800 border-orange-200" :
                                    "bg-green-100 text-green-800 border-green-200"
                                  }
                                >
                                  {Math.round(utilizationPercent)}%
                                </Badge>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <Thermometer className="h-3 w-3 text-blue-500" />
                                <span>{location.temperature}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1">
                                <BarChart3 className="h-3 w-3 text-green-500" />
                                <span>{location.humidity}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditStorage(location)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    if (confirm(`Are you sure you want to delete ${location.name}?`)) {
                                      handleDeleteStorage(location.id);
                                    }
                                  }}
                                  disabled={location.occupied > 0}
                                >
                                  <Trash2 className={`h-3 w-3 ${location.occupied > 0 ? 'text-gray-400' : 'text-red-600'}`} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <p className="text-sm text-gray-500">
                  Total storage locations: <span className="font-medium">{storageLocations.length}</span>
                </p>
                <Button variant="outline" onClick={() => setIsStorageManagementDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Storage Location Dialog */}
        <Dialog open={isEditStorageDialogOpen} onOpenChange={setIsEditStorageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Warehouse className="h-5 w-5 text-blue-600" />
                <span>Edit Storage Location</span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Storage Location ID <span className="text-red-500">*</span></Label>
                <Input 
                  value={newStorageBayId}
                  onChange={(e) => setNewStorageBayId(e.target.value)}
                  placeholder="e.g., Bay-D-01"
                />
                <p className="text-xs text-gray-500 mt-1">Unique identifier for the storage location</p>
              </div>
              
              <div>
                <Label>Storage Location Name <span className="text-red-500">*</span></Label>
                <Input 
                  value={newStorageName}
                  onChange={(e) => setNewStorageName(e.target.value)}
                  placeholder="e.g., Bay D - Section 01"
                />
              </div>

              <div>
                <Label>Total Capacity (Cases) <span className="text-red-500">*</span></Label>
                <Input 
                  type="number"
                  value={newStorageCapacity}
                  onChange={(e) => setNewStorageCapacity(e.target.value)}
                  placeholder="e.g., 1000"
                />
                {selectedStorage && (
                  <p className="text-xs text-orange-600 mt-1">
                    Currently storing {selectedStorage.occupied} cases. New capacity must be at least {selectedStorage.occupied}.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Temperature (°C)</Label>
                  <Input 
                    type="number"
                    value={newStorageTemperature}
                    onChange={(e) => setNewStorageTemperature(e.target.value)}
                    placeholder="18"
                  />
                </div>
                <div>
                  <Label>Humidity (%)</Label>
                  <Input 
                    type="number"
                    value={newStorageHumidity}
                    onChange={(e) => setNewStorageHumidity(e.target.value)}
                    placeholder="45"
                  />
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-sm text-blue-800">
                  Changes will be applied immediately. Ensure the new capacity is sufficient for current inventory.
                </AlertDescription>
              </Alert>

              <div className="flex justify-end space-x-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditStorageDialogOpen(false);
                    setSelectedStorage(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={submitEditStorage}>
                  <Warehouse className="h-4 w-4 mr-2" />
                  Update Location
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}