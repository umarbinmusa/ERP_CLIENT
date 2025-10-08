import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { 
  Activity, 
  Search, 
  Filter, 
  Calendar as CalendarIcon,
  User,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  Eye,
  RefreshCw,
  Database,
  Settings,
  Users,
  Package,
  FileText,
  Truck
} from "lucide-react";
import { apiService } from "../services/api";
// import { format } from "date-fns";

interface ActivityLog {
  id: number;
  user_id: number;
  user_name: string;
  username: string;
  action: string;
  module: string;
  details: any;
  ip_address: string;
  user_agent: string;
  created_at: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface ActivityMetrics {
  total_activities_today: number;
  active_users_today: number;
  failed_login_attempts: number;
  system_changes: number;
  security_events: number;
  data_modifications: number;
}

interface SecurityEvent {
  id: number;
  event_type: 'LOGIN_FAILED' | 'UNAUTHORIZED_ACCESS' | 'DATA_BREACH' | 'SYSTEM_ERROR';
  user_id: number;
  user_name: string;
  description: string;
  ip_address: string;
  created_at: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED';
}

export function ActivityLogsModule() {
  const [activeTab, setActiveTab] = useState("activities");
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [metrics, setMetrics] = useState<ActivityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [dateRange, setDateRange] = useState("today");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    loadActivityData();
  }, []);

  const loadActivityData = async () => {
    setIsLoading(true);
    try {
      const [logsData, securityData, metricsData] = await Promise.all([
        apiService.request({ action: 'get_activity_logs' }),
        apiService.request({ action: 'get_security_events' }),
        apiService.request({ action: 'get_activity_metrics' })
      ]);

      if (logsData.success) setActivities(logsData.data || []);
      if (securityData.success) setSecurityEvents(securityData.data || []);
      if (metricsData.success) setMetrics(metricsData.data);
    } catch (error) {
      console.error('Error loading activity data:', error);
      
      // Mock data for demo
      setActivities([
        {
          id: 1,
          user_id: 1,
          user_name: "John Adebayo",
          username: "admin",
          action: "User Login",
          module: "Authentication",
          details: { ip_address: "192.168.1.100", user_agent: "Chrome/91.0" },
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: "2024-03-20T08:30:15Z",
          severity: "LOW"
        },
        {
          id: 2,
          user_id: 2,
          user_name: "Sarah Johnson",
          username: "finance",
          action: "Invoice Approved",
          module: "Finance",
          details: { invoice_id: "INV-2024-001", amount: 125000 },
          ip_address: "192.168.1.101",
          user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
          created_at: "2024-03-20T09:15:22Z",
          severity: "MEDIUM"
        },
        {
          id: 3,
          user_id: 1,
          user_name: "John Adebayo",
          username: "admin",
          action: "User Created",
          module: "User Management",
          details: { new_user: "test_user", role: "General Manager" },
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: "2024-03-20T10:45:10Z",
          severity: "HIGH"
        },
        {
          id: 4,
          user_id: 3,
          user_name: "Michael Chen",
          username: "general",
          action: "Inventory Updated",
          module: "Inventory",
          details: { item_id: "WB-500ML", old_stock: 5000, new_stock: 4500 },
          ip_address: "192.168.1.102",
          user_agent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15",
          created_at: "2024-03-20T11:20:33Z",
          severity: "MEDIUM"
        },
        {
          id: 5,
          user_id: 1,
          user_name: "John Adebayo",
          username: "admin",
          action: "System Settings Modified",
          module: "Settings",
          details: { setting: "max_login_attempts", old_value: 3, new_value: 5 },
          ip_address: "192.168.1.100",
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          created_at: "2024-03-20T12:00:45Z",
          severity: "CRITICAL"
        }
      ]);

      setSecurityEvents([
        {
          id: 1,
          event_type: "LOGIN_FAILED",
          user_id: 0,
          user_name: "Unknown",
          description: "Multiple failed login attempts from suspicious IP",
          ip_address: "203.0.113.42",
          created_at: "2024-03-20T07:45:12Z",
          status: "INVESTIGATING"
        },
        {
          id: 2,
          event_type: "UNAUTHORIZED_ACCESS",
          user_id: 5,
          user_name: "Test User",
          description: "Attempted to access admin panel without permission",
          ip_address: "192.168.1.200",
          created_at: "2024-03-20T14:30:00Z",
          status: "RESOLVED"
        }
      ]);

      setMetrics({
        total_activities_today: 127,
        active_users_today: 8,
        failed_login_attempts: 3,
        system_changes: 2,
        security_events: 1,
        data_modifications: 15
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    const actionIcons = {
      "User Login": User,
      "User Logout": User,
      "User Created": Users,
      "User Updated": Users,
      "User Deleted": Users,
      "Invoice Approved": CheckCircle,
      "Invoice Rejected": XCircle,
      "Inventory Updated": Package,
      "System Settings Modified": Settings,
      "Report Generated": FileText,
      "Delivery Scheduled": Truck,
      "Data Export": Download,
      "Backup Created": Database
    };

    const Icon = actionIcons[action as keyof typeof actionIcons] || Activity;
    return <Icon className="h-4 w-4" />;
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      LOW: { color: "bg-blue-100 text-blue-800", label: "Low" },
      MEDIUM: { color: "bg-yellow-100 text-yellow-800", label: "Medium" },
      HIGH: { color: "bg-orange-100 text-orange-800", label: "High" },
      CRITICAL: { color: "bg-red-100 text-red-800", label: "Critical" }
    };

    const config = severityConfig[severity as keyof typeof severityConfig] || severityConfig.LOW;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getEventTypeBadge = (eventType: string) => {
    const eventConfig = {
      LOGIN_FAILED: { color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
      UNAUTHORIZED_ACCESS: { color: "bg-red-100 text-red-800", icon: Shield },
      DATA_BREACH: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      SYSTEM_ERROR: { color: "bg-orange-100 text-orange-800", icon: XCircle }
    };

    const config = eventConfig[eventType as keyof typeof eventConfig];
    const Icon = config?.icon || AlertTriangle;
    
    return (
      <Badge className={config?.color || "bg-gray-100 text-gray-800"}>
        <Icon className="h-3 w-3 mr-1" />
        {eventType.replace('_', ' ')}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      OPEN: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      INVESTIGATING: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      RESOLVED: { color: "bg-green-100 text-green-800", icon: CheckCircle }
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

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.module.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = userFilter === "all" || activity.username === userFilter;
    const matchesModule = moduleFilter === "all" || activity.module === moduleFilter;
    const matchesSeverity = severityFilter === "all" || activity.severity === severityFilter;
    
    return matchesSearch && matchesUser && matchesModule && matchesSeverity;
  });

  const uniqueUsers = [...new Set(activities.map(a => a.username))];
  const uniqueModules = [...new Set(activities.map(a => a.module))];

  const MetricsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Activities Today</p>
              <p className="text-lg font-bold">{metrics?.total_activities_today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-6 w-6 text-green-600" />
            <div>
              <p className="text-xs text-gray-600">Active Users</p>
              <p className="text-lg font-bold">{metrics?.active_users_today}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <XCircle className="h-6 w-6 text-red-600" />
            <div>
              <p className="text-xs text-gray-600">Failed Logins</p>
              <p className="text-lg font-bold">{metrics?.failed_login_attempts}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-orange-600" />
            <div>
              <p className="text-xs text-gray-600">System Changes</p>
              <p className="text-lg font-bold">{metrics?.system_changes}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Security Events</p>
              <p className="text-lg font-bold">{metrics?.security_events}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Database className="h-6 w-6 text-indigo-600" />
            <div>
              <p className="text-xs text-gray-600">Data Changes</p>
              <p className="text-lg font-bold">{metrics?.data_modifications}</p>
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
            <p className="mt-4 text-gray-600">Loading activity logs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">Monitor system activities and security events</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => loadActivityData()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <MetricsCards />

      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <CardTitle>System Activity Monitor</CardTitle>
            <div className="flex flex-wrap gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="User" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(user => (
                    <SelectItem key={user} value={user}>{user}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  {uniqueModules.map(module => (
                    <SelectItem key={module} value={module}>{module}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="CRITICAL">Critical</SelectItem>
                </SelectContent>
              </Select>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {selectedDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setSelectedDate(date);
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="activities">Activity Logs</TabsTrigger>
              <TabsTrigger value="security">Security Events</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
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
                      <TableHead>Severity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredActivities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(activity.created_at).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(activity.created_at).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <div>
                              <div className="font-medium">{activity.user_name}</div>
                              <div className="text-sm text-gray-500">@{activity.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getActionIcon(activity.action)}
                            <span>{activity.action}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{activity.module}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {typeof activity.details === 'object' 
                              ? JSON.stringify(activity.details).slice(0, 50) + '...'
                              : activity.details?.toString().slice(0, 50) + '...'
                            }
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{activity.ip_address}</TableCell>
                        <TableCell>{getSeverityBadge(activity.severity)}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Security Events</h3>
                <div className="text-sm text-gray-500">
                  {securityEvents.filter(e => e.status !== 'RESOLVED').length} open events
                </div>
              </div>

              <div className="border rounded-lg">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {securityEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(event.created_at).toLocaleDateString()}</div>
                            <div className="text-gray-500">{new Date(event.created_at).toLocaleTimeString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>{getEventTypeBadge(event.event_type)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-400" />
                            <span>{event.user_name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {event.description}
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{event.ip_address}</TableCell>
                        <TableCell>{getStatusBadge(event.status)}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-3 w-3" />
                            </Button>
                            {event.status !== 'RESOLVED' && (
                              <Button variant="outline" size="sm">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Resolve
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