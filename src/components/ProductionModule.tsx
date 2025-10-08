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
import { Calendar } from "./ui/calendar";
import { Progress } from "./ui/progress";
import { 
  Factory, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  BarChart3,
  Package
} from "lucide-react";
import { apiService } from "../services/api";

interface ProductionSchedule {
  id: number;
  schedule_date: string;
  shift: 'MORNING' | 'AFTERNOON' | 'NIGHT';
  product_id: string;
  product_name: string;
  planned_quantity: number;
  actual_quantity: number;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  supervisor_id: number;
  supervisor_name: string;
  notes: string;
  created_at: string;
}

interface QualityTest {
  id: number;
  batch_number: string;
  product_id: string;
  product_name: string;
  production_date: string;
  test_date: string;
  ph_level: number;
  tds_level: number;
  chlorine_level: number;
  microbiological_test: 'PASS' | 'FAIL' | 'PENDING';
  chemical_test: 'PASS' | 'FAIL' | 'PENDING';
  physical_test: 'PASS' | 'FAIL' | 'PENDING';
  overall_result: 'PASS' | 'FAIL' | 'PENDING';
  tested_by: string;
  notes: string;
}

interface ProductionMetrics {
  today_production: number;
  planned_production: number;
  efficiency_rate: number;
  quality_pass_rate: number;
  active_batches: number;
  pending_tests: number;
}

export function ProductionModule() {
  const [activeTab, setActiveTab] = useState("schedule");
  const [schedules, setSchedules] = useState<ProductionSchedule[]>([]);
  const [qualityTests, setQualityTests] = useState<QualityTest[]>([]);
  const [metrics, setMetrics] = useState<ProductionMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedShift, setSelectedShift] = useState("all");

  useEffect(() => {
    loadProductionData();
  }, []);

  const loadProductionData = async () => {
    setIsLoading(true);
    try {
      const [schedulesData, testsData, metricsData] = await Promise.all([
        apiService.request({ action: 'get_production_schedules' }),
        apiService.request({ action: 'get_quality_tests' }),
        apiService.request({ action: 'get_production_metrics' })
      ]);

      if (schedulesData.success) setSchedules(schedulesData.data || []);
      if (testsData.success) setQualityTests(testsData.data || []);
      if (metricsData.success) setMetrics(metricsData.data);
    } catch (error) {
      console.error('Error loading production data:', error);
      
      // Mock data for demo
      setSchedules([
        {
          id: 1,
          schedule_date: "2024-03-20",
          shift: "MORNING",
          product_id: "WB-500ML",
          product_name: "500ml Water Bottle",
          planned_quantity: 10000,
          actual_quantity: 9850,
          status: "COMPLETED",
          supervisor_id: 1,
          supervisor_name: "John Supervisor",
          notes: "Normal production run",
          created_at: "2024-03-19"
        },
        {
          id: 2,
          schedule_date: "2024-03-20",
          shift: "AFTERNOON",
          product_id: "WB-1L",
          product_name: "1L Water Bottle",
          planned_quantity: 5000,
          actual_quantity: 3200,
          status: "IN_PROGRESS",
          supervisor_id: 2,
          supervisor_name: "Sarah Manager",
          notes: "Machine maintenance at 2 PM",
          created_at: "2024-03-19"
        },
        {
          id: 3,
          schedule_date: "2024-03-21",
          shift: "MORNING",
          product_id: "WB-500ML",
          product_name: "500ml Water Bottle",
          planned_quantity: 12000,
          actual_quantity: 0,
          status: "PLANNED",
          supervisor_id: 1,
          supervisor_name: "John Supervisor",
          notes: "High demand order",
          created_at: "2024-03-20"
        }
      ]);

      setQualityTests([
        {
          id: 1,
          batch_number: "B2024-0320-001",
          product_id: "WB-500ML",
          product_name: "500ml Water Bottle",
          production_date: "2024-03-20",
          test_date: "2024-03-20",
          ph_level: 7.2,
          tds_level: 45.8,
          chlorine_level: 0.02,
          microbiological_test: "PASS",
          chemical_test: "PASS",
          physical_test: "PASS",
          overall_result: "PASS",
          tested_by: "Dr. Amina Yusuf",
          notes: "All parameters within acceptable range"
        },
        {
          id: 2,
          batch_number: "B2024-0320-002",
          product_id: "WB-1L",
          product_name: "1L Water Bottle",
          production_date: "2024-03-20",
          test_date: "2024-03-20",
          ph_level: 7.1,
          tds_level: 48.2,
          chlorine_level: 0.03,
          microbiological_test: "PENDING",
          chemical_test: "PASS",
          physical_test: "PASS",
          overall_result: "PENDING",
          tested_by: "Dr. Amina Yusuf",
          notes: "Awaiting microbiological results"
        }
      ]);

      setMetrics({
        today_production: 13050,
        planned_production: 15000,
        efficiency_rate: 87.0,
        quality_pass_rate: 98.5,
        active_batches: 3,
        pending_tests: 2
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PLANNED: { color: "bg-blue-100 text-blue-800", icon: CalendarIcon },
      IN_PROGRESS: { color: "bg-yellow-100 text-yellow-800", icon: Play },
      COMPLETED: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      CANCELLED: { color: "bg-red-100 text-red-800", icon: XCircle },
      PASS: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      FAIL: { color: "bg-red-100 text-red-800", icon: XCircle },
      PENDING: { color: "bg-yellow-100 text-yellow-800", icon: Clock }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    
    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-800"}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' ')}
      </Badge>
    );
  };

  const getShiftIcon = (shift: string) => {
    switch (shift) {
      case 'MORNING': return '🌅';
      case 'AFTERNOON': return '☀️';
      case 'NIGHT': return '🌙';
      default: return '⏰';
    }
  };

  const getEfficiencyColor = (planned: number, actual: number) => {
    const efficiency = (actual / planned) * 100;
    if (efficiency >= 95) return "text-green-600";
    if (efficiency >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesShift = selectedShift === "all" || schedule.shift === selectedShift;
    const matchesDate = schedule.schedule_date === selectedDate.toISOString().split('T')[0];
    return matchesShift;
  });

  const ProductionForm = () => (
    <form className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="schedule_date">Production Date</Label>
          <Input
            id="schedule_date"
            type="date"
            defaultValue={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <Label htmlFor="shift">Shift</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MORNING">🌅 Morning (6 AM - 2 PM)</SelectItem>
              <SelectItem value="AFTERNOON">☀️ Afternoon (2 PM - 10 PM)</SelectItem>
              <SelectItem value="NIGHT">🌙 Night (10 PM - 6 AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="product_id">Product</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WB-500ML">500ml Water Bottle</SelectItem>
              <SelectItem value="WB-1L">1L Water Bottle</SelectItem>
              <SelectItem value="WB-1.5L">1.5L Water Bottle</SelectItem>
              <SelectItem value="WB-5L">5L Water Bottle</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="planned_quantity">Planned Quantity</Label>
          <Input
            id="planned_quantity"
            type="number"
            placeholder="Enter planned quantity"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="supervisor">Supervisor</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select supervisor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">John Supervisor</SelectItem>
            <SelectItem value="2">Sarah Manager</SelectItem>
            <SelectItem value="3">Michael Production</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Input
          id="notes"
          placeholder="Enter any special notes or instructions"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </Button>
        <Button type="submit">
          Schedule Production
        </Button>
      </div>
    </form>
  );

  const MetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Factory className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Today's Production</p>
              <p className="text-lg font-bold">{metrics?.today_production.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Planned</p>
              <p className="text-lg font-bold">{metrics?.planned_production.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Efficiency</p>
              <p className="text-lg font-bold">{metrics?.efficiency_rate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Quality Pass Rate</p>
              <p className="text-lg font-bold">{metrics?.quality_pass_rate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-orange-600" />
            <div>
              <p className="text-xs text-gray-600">Active Batches</p>
              <p className="text-lg font-bold">{metrics?.active_batches}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-6 w-6 text-yellow-600" />
            <div>
              <p className="text-xs text-gray-600">Pending Tests</p>
              <p className="text-lg font-bold">{metrics?.pending_tests}</p>
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
            <p className="mt-4 text-gray-600">Loading production data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Production Scheduling</h1>
          <p className="text-gray-600">Plan and monitor production activities</p>
        </div>
      </div>

      <MetricsCards />

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <CardTitle>Production Management</CardTitle>
            <div className="flex space-x-2">
              <Select value={selectedShift} onValueChange={setSelectedShift}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by shift" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="MORNING">Morning</SelectItem>
                  <SelectItem value="AFTERNOON">Afternoon</SelectItem>
                  <SelectItem value="NIGHT">Night</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="schedule">Production Schedule</TabsTrigger>
              <TabsTrigger value="quality">Quality Control</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="schedule" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Production Schedule</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Schedule Production
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Schedule New Production</DialogTitle>
                    </DialogHeader>
                    <ProductionForm />
                  </DialogContent>
                </Dialog>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Shift</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Planned Qty</TableHead>
                      <TableHead>Actual Qty</TableHead>
                      <TableHead>Efficiency</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSchedules.map((schedule) => (
                      <TableRow key={schedule.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">
                              {new Date(schedule.schedule_date).toLocaleDateString()}
                            </p>
                            <div className="text-sm text-gray-500">
                              {getShiftIcon(schedule.shift)} {schedule.shift.toLowerCase()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{schedule.product_name}</TableCell>
                        <TableCell>{schedule.planned_quantity.toLocaleString()}</TableCell>
                        <TableCell>{schedule.actual_quantity.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className={`text-sm font-medium ${getEfficiencyColor(schedule.planned_quantity, schedule.actual_quantity)}`}>
                              {schedule.planned_quantity > 0 ? 
                                Math.round((schedule.actual_quantity / schedule.planned_quantity) * 100) : 0}%
                            </div>
                            <Progress 
                              value={schedule.planned_quantity > 0 ? 
                                (schedule.actual_quantity / schedule.planned_quantity) * 100 : 0} 
                              className="h-2" 
                            />
                          </div>
                        </TableCell>
                        <TableCell>{schedule.supervisor_name}</TableCell>
                        <TableCell>{getStatusBadge(schedule.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {schedule.status === 'PLANNED' && (
                              <Button variant="outline" size="sm">
                                <Play className="h-3 w-3 mr-1" />
                                Start
                              </Button>
                            )}
                            {schedule.status === 'IN_PROGRESS' && (
                              <Button variant="outline" size="sm">
                                <Pause className="h-3 w-3 mr-1" />
                                Update
                              </Button>
                            )}
                            <Button variant="outline" size="sm">
                              <BarChart3 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Quality Control Tests</h3>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Test
                </Button>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Production Date</TableHead>
                      <TableHead>pH Level</TableHead>
                      <TableHead>TDS Level</TableHead>
                      <TableHead>Chlorine</TableHead>
                      <TableHead>Test Results</TableHead>
                      <TableHead>Overall</TableHead>
                      <TableHead>Tested By</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qualityTests.map((test) => (
                      <TableRow key={test.id}>
                        <TableCell className="font-medium">{test.batch_number}</TableCell>
                        <TableCell>{test.product_name}</TableCell>
                        <TableCell>{new Date(test.production_date).toLocaleDateString()}</TableCell>
                        <TableCell>{test.ph_level}</TableCell>
                        <TableCell>{test.tds_level} ppm</TableCell>
                        <TableCell>{test.chlorine_level} mg/L</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center space-x-1">
                              <span>Micro:</span>
                              {getStatusBadge(test.microbiological_test)}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Chemical:</span>
                              {getStatusBadge(test.chemical_test)}
                            </div>
                            <div className="flex items-center space-x-1">
                              <span>Physical:</span>
                              {getStatusBadge(test.physical_test)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(test.overall_result)}</TableCell>
                        <TableCell>{test.tested_by}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Production Efficiency Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-gray-500">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 mx-auto mb-2" />
                        <p>Chart component would be rendered here</p>
                        <p className="text-sm">Showing weekly efficiency trends</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quality Control Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Pass Rate</span>
                        <span className="text-green-600 font-semibold">98.5%</span>
                      </div>
                      <Progress value={98.5} className="h-3" />
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <p className="text-2xl font-bold text-green-600">156</p>
                          <p className="text-sm text-gray-600">Tests Passed</p>
                        </div>
                        <div className="text-center p-3 bg-red-50 rounded-lg">
                          <p className="text-2xl font-bold text-red-600">3</p>
                          <p className="text-sm text-gray-600">Tests Failed</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}