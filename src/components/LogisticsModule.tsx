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
  Truck, 
  Plus, 
  MapPin, 
  Clock, 
  Package, 
  Navigation,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Route,
  Fuel,
  Users,
  Calendar,
  Phone,
  Edit,
  Eye
} from "lucide-react";
import { apiService } from "../services/api";

interface Vehicle {
  id: number;
  vehicle_number: string;
  vehicle_type: 'TRUCK' | 'VAN' | 'PICKUP' | 'OTHER';
  capacity: number;
  driver_name: string;
  driver_phone: string;
  is_active: boolean;
  created_at: string;
}

interface Delivery {
  id: number;
  order_id: string;
  vehicle_id: number;
  vehicle_number: string;
  driver_name: string;
  delivery_date: string;
  delivery_time: string;
  delivery_address: string;
  contact_person: string;
  contact_phone: string;
  status: 'SCHEDULED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED';
  notes: string;
  created_at: string;
}

interface Route {
  id: number;
  route_name: string;
  start_location: string;
  end_location: string;
  distance: number;
  estimated_time: number;
  vehicle_id: number;
  delivery_ids: number[];
  status: 'PLANNED' | 'ACTIVE' | 'COMPLETED';
  created_at: string;
}

interface LogisticsMetrics {
  active_deliveries: number;
  completed_today: number;
  pending_deliveries: number;
  available_vehicles: number;
  on_route_vehicles: number;
  delivery_success_rate: number;
}

export function LogisticsModule() {
  const [activeTab, setActiveTab] = useState("deliveries");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [metrics, setMetrics] = useState<LogisticsMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    loadLogisticsData();
  }, []);

  const loadLogisticsData = async () => {
    setIsLoading(true);
    try {
      const [vehiclesData, deliveriesData, routesData, metricsData] = await Promise.all([
        apiService.request({ action: 'get_vehicles' }),
        apiService.request({ action: 'get_deliveries' }),
        apiService.request({ action: 'get_routes' }),
        apiService.request({ action: 'get_logistics_metrics' })
      ]);

      if (vehiclesData.success) setVehicles(vehiclesData.data || []);
      if (deliveriesData.success) setDeliveries(deliveriesData.data || []);
      if (routesData.success) setRoutes(routesData.data || []);
      if (metricsData.success) setMetrics(metricsData.data);
    } catch (error) {
      console.error('Error loading logistics data:', error);
      
      // Mock data for demo
      setVehicles([
        {
          id: 1,
          vehicle_number: "LAG-001-HIL",
          vehicle_type: "TRUCK",
          capacity: 5000,
          driver_name: "Emeka Johnson",
          driver_phone: "+234-800-123-4567",
          is_active: true,
          created_at: "2024-01-15"
        },
        {
          id: 2,
          vehicle_number: "LAG-002-HIL",
          vehicle_type: "VAN",
          capacity: 2000,
          driver_name: "Aisha Mohammed",
          driver_phone: "+234-800-987-6543",
          is_active: true,
          created_at: "2024-01-20"
        },
        {
          id: 3,
          vehicle_number: "LAG-003-HIL",
          vehicle_type: "TRUCK",
          capacity: 5000,
          driver_name: "David Okonkwo",
          driver_phone: "+234-800-555-0123",
          is_active: false,
          created_at: "2024-02-01"
        }
      ]);

      setDeliveries([
        {
          id: 1,
          order_id: "SO-2024-001",
          vehicle_id: 1,
          vehicle_number: "LAG-001-HIL",
          driver_name: "Emeka Johnson",
          delivery_date: "2024-03-20",
          delivery_time: "10:00",
          delivery_address: "123 Ikeja Way, Lagos",
          contact_person: "John Smith",
          contact_phone: "+234-800-111-2222",
          status: "IN_TRANSIT",
          notes: "Large order - handle with care",
          created_at: "2024-03-19"
        },
        {
          id: 2,
          order_id: "SO-2024-002",
          vehicle_id: 2,
          vehicle_number: "LAG-002-HIL",
          driver_name: "Aisha Mohammed",
          delivery_date: "2024-03-20",
          delivery_time: "14:00",
          delivery_address: "456 Victoria Island, Lagos",
          contact_person: "Sarah Johnson",
          contact_phone: "+234-800-333-4444",
          status: "DELIVERED",
          notes: "Delivery completed successfully",
          created_at: "2024-03-19"
        },
        {
          id: 3,
          order_id: "SO-2024-003",
          vehicle_id: 1,
          vehicle_number: "LAG-001-HIL",
          driver_name: "Emeka Johnson",
          delivery_date: "2024-03-21",
          delivery_time: "09:00",
          delivery_address: "789 Lekki Phase 1, Lagos",
          contact_person: "Ahmed Bello",
          contact_phone: "+234-800-555-6666",
          status: "SCHEDULED",
          notes: "Morning delivery preferred",
          created_at: "2024-03-20"
        }
      ]);

      setRoutes([
        {
          id: 1,
          route_name: "Lagos Island Route",
          start_location: "Hari Industries Warehouse",
          end_location: "Lagos Island",
          distance: 25.5,
          estimated_time: 90,
          vehicle_id: 1,
          delivery_ids: [1, 3],
          status: "ACTIVE",
          created_at: "2024-03-20"
        },
        {
          id: 2,
          route_name: "Victoria Island Route",
          start_location: "Hari Industries Warehouse",
          end_location: "Victoria Island",
          distance: 18.2,
          estimated_time: 60,
          vehicle_id: 2,
          delivery_ids: [2],
          status: "COMPLETED",
          created_at: "2024-03-20"
        }
      ]);

      setMetrics({
        active_deliveries: 2,
        completed_today: 5,
        pending_deliveries: 8,
        available_vehicles: 2,
        on_route_vehicles: 1,
        delivery_success_rate: 97.5
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SCHEDULED: { color: "bg-blue-100 text-blue-800", icon: Calendar },
      IN_TRANSIT: { color: "bg-yellow-100 text-yellow-800", icon: Navigation },
      DELIVERED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      FAILED: { color: "bg-red-100 text-red-800", icon: XCircle },
      PLANNED: { color: "bg-blue-100 text-blue-800", icon: Route },
      ACTIVE: { color: "bg-yellow-100 text-yellow-800", icon: Navigation },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Calendar;
    
    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-800"}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
      </Badge>
    );
  };

  const getVehicleTypeIcon = (type: string) => {
    switch (type) {
      case 'TRUCK': return '🚛';
      case 'VAN': return '🚐';
      case 'PICKUP': return '🛻';
      default: return '🚗';
    }
  };

  const filteredDeliveries = deliveries.filter(delivery =>
    statusFilter === "all" || delivery.status === statusFilter
  );

  const VehicleForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vehicle_number">Vehicle Number</Label>
          <Input
            id="vehicle_number"
            placeholder="e.g., LAG-004-SAJ"
            defaultValue={selectedVehicle?.vehicle_number}
          />
        </div>
        <div>
          <Label htmlFor="vehicle_type">Vehicle Type</Label>
          <Select defaultValue={selectedVehicle?.vehicle_type}>
            <SelectTrigger>
              <SelectValue placeholder="Select vehicle type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRUCK">🚛 Truck</SelectItem>
              <SelectItem value="VAN">🚐 Van</SelectItem>
              <SelectItem value="PICKUP">🛻 Pickup</SelectItem>
              <SelectItem value="OTHER">🚗 Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="capacity">Capacity (Liters)</Label>
        <Input
          id="capacity"
          type="number"
          placeholder="5000"
          defaultValue={selectedVehicle?.capacity}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="driver_name">Driver Name</Label>
          <Input
            id="driver_name"
            placeholder="Enter driver name"
            defaultValue={selectedVehicle?.driver_name}
          />
        </div>
        <div>
          <Label htmlFor="driver_phone">Driver Phone</Label>
          <Input
            id="driver_phone"
            placeholder="+234-800-000-0000"
            defaultValue={selectedVehicle?.driver_phone}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          {selectedVehicle ? "Update Vehicle" : "Add Vehicle"}
        </Button>
      </div>
    </form>
  );

  const MetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Navigation className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-xs text-gray-600">Active Deliveries</p>
              <p className="text-lg font-bold">{metrics?.active_deliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Completed Today</p>
              <p className="text-lg font-bold">{metrics?.completed_today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Pending</p>
              <p className="text-lg font-bold">{metrics?.pending_deliveries}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Truck className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Available Vehicles</p>
              <p className="text-lg font-bold">{metrics?.available_vehicles}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Route className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">On Route</p>
              <p className="text-lg font-bold">{metrics?.on_route_vehicles}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Success Rate</p>
              <p className="text-lg font-bold">{metrics?.delivery_success_rate}%</p>
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
            <p className="mt-4 text-gray-600">Loading logistics data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logistics Management</h1>
          <p className="text-gray-600">Manage vehicles, deliveries, and routes</p>
        </div>
      </div>

      <MetricsCards />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Logistics Operations</CardTitle>
            <div className="flex space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="IN_TRANSIT">In Transit</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="FAILED">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
              <TabsTrigger value="vehicles">Vehicles</TabsTrigger>
              <TabsTrigger value="routes">Routes</TabsTrigger>
            </TabsList>

            <TabsContent value="deliveries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Delivery Management</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Delivery
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Vehicle & Driver</TableHead>
                      <TableHead>Delivery Details</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDeliveries.map((delivery) => (
                      <TableRow key={delivery.id}>
                        <TableCell className="font-medium">{delivery.order_id}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.vehicle_number}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Users className="h-3 w-3 mr-1" />
                              {delivery.driver_name}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-start space-x-1">
                            <MapPin className="h-3 w-3 mt-0.5 text-gray-400" />
                            <span className="text-sm">{delivery.delivery_address}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{delivery.contact_person}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-3 w-3 mr-1" />
                              {delivery.contact_phone}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {new Date(delivery.delivery_date).toLocaleDateString()}
                            </p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="h-3 w-3 mr-1" />
                              {delivery.delivery_time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(delivery.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {delivery.status === 'SCHEDULED' && (
                              <Button variant="outline" size="sm">
                                <Navigation className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
                            {delivery.status === 'IN_TRANSIT' && (
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="vehicles" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Vehicle Fleet</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedVehicle(null)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}
                      </DialogTitle>
                    </DialogHeader>
                    <VehicleForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Vehicle Number</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Driver</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vehicles.map((vehicle) => (
                      <TableRow key={vehicle.id}>
                        <TableCell className="font-medium">{vehicle.vehicle_number}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span>{getVehicleTypeIcon(vehicle.vehicle_type)}</span>
                            <span>{vehicle.vehicle_type}</span>
                          </div>
                        </TableCell>
                        <TableCell>{vehicle.capacity.toLocaleString()}L</TableCell>
                        <TableCell>{vehicle.driver_name}</TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-3 w-3 mr-1" />
                            {vehicle.driver_phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={vehicle.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {vehicle.is_active ? "Available" : "Unavailable"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedVehicle(vehicle);
                                setIsDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Navigation className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="routes" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Delivery Routes</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Plan Route
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Start - End</TableHead>
                      <TableHead>Distance</TableHead>
                      <TableHead>Est. Time</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Deliveries</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.map((route) => (
                      <TableRow key={route.id}>
                        <TableCell className="font-medium">{route.route_name}</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{route.start_location}</div>
                            <div className="text-gray-500">→ {route.end_location}</div>
                          </div>
                        </TableCell>
                        <TableCell>{route.distance} km</TableCell>
                        <TableCell>{route.estimated_time} min</TableCell>
                        <TableCell>
                          {vehicles.find(v => v.id === route.vehicle_id)?.vehicle_number || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {route.delivery_ids.length} deliveries
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(route.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {route.status === 'PLANNED' && (
                              <Button variant="outline" size="sm">
                                <Navigation className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
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