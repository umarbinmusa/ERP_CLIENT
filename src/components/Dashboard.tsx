import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { AlertTriangle, TrendingUp, Package, Truck, DollarSign, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

const kpiData = [
  {
    title: "Daily Output",
    value: "48,750",
    target: "50,000",
    unit: "bottles",
    percentage: 97.5,
    icon: Package,
    trend: "+2.3%"
  },
  {
    title: "Quality Pass Rate",
    value: "99.7%",
    target: "99.5%",
    unit: "",
    percentage: 100,
    icon: CheckCircle,
    trend: "+0.2%"
  },
  {
    title: "Daily Revenue",
    value: "₦2,687,500",
    target: "₦2,500,000",
    unit: "",
    percentage: 107.5,
    icon: DollarSign,
    trend: "+7.5%"
  },
  {
    title: "Delivery On-Time Rate",
    value: "96.8%",
    target: "98%",
    unit: "",
    percentage: 98.8,
    icon: Truck,
    trend: "-1.2%"
  }
];

const productionData = [
  { time: "00:00", efficiency: 85 },
  { time: "04:00", efficiency: 92 },
  { time: "08:00", efficiency: 98 },
  { time: "12:00", efficiency: 95 },
  { time: "16:00", efficiency: 89 },
  { time: "20:00", efficiency: 87 },
];

const inventoryData = [
  { name: "Raw Materials", turnover: 12.5 },
  { name: "Packaging", turnover: 8.7 },
  { name: "Finished Goods", turnover: 15.2 },
  { name: "Supplies", turnover: 6.3 },
];

const financialData = [
  { month: "Jan", revenue: 75000000, target: 70000000 },
  { month: "Feb", revenue: 82000000, target: 75000000 },
  { month: "Mar", revenue: 78000000, target: 80000000 },
  { month: "Apr", revenue: 95000000, target: 85000000 },
  { month: "May", revenue: 88000000, target: 90000000 },
  { month: "Jun", revenue: 102000000, target: 95000000 },
];

const deliveryData = [
  { name: "Lagos", value: 35, color: "#2563eb" },
  { name: "Abuja", value: 25, color: "#3b82f6" },
  { name: "Kano", value: 20, color: "#60a5fa" },
  { name: "Port Harcourt", value: 15, color: "#93c5fd" },
  { name: "Others", value: 5, color: "#dbeafe" },
];

const alerts = [
  { type: "critical", message: "Raw material stock below minimum threshold", time: "2 hours ago" },
  { type: "warning", message: "Pending approval: 3 invoices awaiting MD signature", time: "4 hours ago" },
  { type: "info", message: "Scheduled delivery to Lagos depot at 2:00 PM", time: "6 hours ago" },
];

export function Dashboard() {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isPositiveTrend = kpi.trend.startsWith("+");
          
          return (
            <Card key={index} className="rounded-xl shadow-sm border-0 bg-gradient-to-br from-white to-gray-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Icon className="h-8 w-8 text-blue-600" />
                  <Badge variant={isPositiveTrend ? "default" : "destructive"} className="text-xs">
                    {kpi.trend}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500">Target: {kpi.target} {kpi.unit}</p>
                  <Progress value={kpi.percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Production Efficiency Chart */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Production Efficiency (24h)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Line type="monotone" dataKey="efficiency" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb" }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Turnover Chart */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span>Inventory Turnover</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={inventoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Bar dataKey="turnover" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Financial Performance and Logistics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Performance - spans 2 columns */}
        <Card className="rounded-xl shadow-sm border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <span>Financial Performance (6 months)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₦${value / 1000000}M`} />
                <Bar dataKey="revenue" fill="#2563eb" radius={[4, 4, 0, 0]} name="Revenue" />
                <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Routes Distribution */}
        <Card className="rounded-xl shadow-sm border-0">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-blue-600" />
              <span>Delivery Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={deliveryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  dataKey="value"
                >
                  {deliveryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {deliveryData.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span>{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Panel */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>System Alerts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <Alert key={index} className={`border-l-4 ${
                alert.type === 'critical' ? 'border-l-red-500 bg-red-50' :
                alert.type === 'warning' ? 'border-l-orange-500 bg-orange-50' :
                'border-l-blue-500 bg-blue-50'
              }`}>
                <AlertDescription className="flex justify-between items-center">
                  <span>{alert.message}</span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}