import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { BarChart3, Download, Share, Calendar, Filter, FileText, TrendingUp, PieChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from "recharts";
import { useState } from "react";

const reportTypes = [
  { value: "production", label: "Production Reports" },
  { value: "finance", label: "Financial Reports" },
  { value: "sales", label: "Sales Reports" },
  { value: "inventory", label: "Inventory Reports" },
];

const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 3 months" },
  { value: "1y", label: "Last year" },
  { value: "custom", label: "Custom range" },
];

const productionData = [
  { date: "Jan 1", production: 48500, target: 50000 },
  { date: "Jan 2", production: 51200, target: 50000 },
  { date: "Jan 3", production: 49800, target: 50000 },
  { date: "Jan 4", production: 52100, target: 50000 },
  { date: "Jan 5", production: 48900, target: 50000 },
  { date: "Jan 6", production: 50500, target: 50000 },
  { date: "Jan 7", production: 51800, target: 50000 },
];

const salesData = [
  { region: "Lagos", sales: 3500000, target: 3200000 },
  { region: "Abuja", sales: 2800000, target: 2900000 },
  { region: "Kano", sales: 2200000, target: 2100000 },
  { region: "Port Harcourt", sales: 1900000, target: 1800000 },
  { region: "Ibadan", sales: 1600000, target: 1700000 },
];

const inventoryPieData = [
  { name: "Raw Materials", value: 35, color: "#2563eb" },
  { name: "Packaging", value: 45, color: "#3b82f6" },
  { name: "Finished Goods", value: 15, color: "#60a5fa" },
  { name: "Supplies", value: 5, color: "#93c5fd" },
];

const reportTemplates = [
  {
    id: "daily-production",
    name: "Daily Production Summary",
    description: "Production output, efficiency, and quality metrics",
    type: "production",
    lastGenerated: "2 hours ago"
  },
  {
    id: "weekly-finance",
    name: "Weekly Financial Report",
    description: "Revenue, expenses, and profit analysis",
    type: "finance",
    lastGenerated: "1 day ago"
  },
  {
    id: "monthly-sales",
    name: "Monthly Sales Performance",
    description: "Sales by region, customer, and product",
    type: "sales",
    lastGenerated: "3 days ago"
  },
  {
    id: "inventory-status",
    name: "Inventory Status Report",
    description: "Stock levels, turnover, and reorder alerts",
    type: "inventory",
    lastGenerated: "5 hours ago"
  }
];

export function ReportsModule() {
  const [selectedType, setSelectedType] = useState("production");
  const [selectedRange, setSelectedRange] = useState("30d");

  const renderChart = () => {
    switch (selectedType) {
      case "production":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `${value / 1000}K`} />
              <Line type="monotone" dataKey="production" stroke="#2563eb" strokeWidth={3} name="Production" />
              <Line type="monotone" dataKey="target" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" name="Target" />
            </LineChart>
          </ResponsiveContainer>
        );
      
      case "sales":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="region" stroke="#64748b" />
              <YAxis stroke="#64748b" tickFormatter={(value) => `₦${value / 1000000}M`} />
              <Bar dataKey="sales" fill="#2563eb" radius={[4, 4, 0, 0]} name="Sales" />
              <Bar dataKey="target" fill="#e2e8f0" radius={[4, 4, 0, 0]} name="Target" />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case "inventory":
        return (
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={inventoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {inventoryPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        );
      
      default:
        return (
          <div className="h-300 flex items-center justify-center text-gray-500">
            Select a report type to view data visualization
          </div>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate comprehensive reports and analyze business performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-2" />
            Share with MD
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      {/* Report Controls */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span>Report Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Report Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  {dateRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end space-x-2">
              <Button className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Chart
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Excel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Visualization */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>{reportTypes.find(t => t.value === selectedType)?.label} - {dateRanges.find(r => r.value === selectedRange)?.label}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              Last updated: {new Date().toLocaleTimeString()}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderChart()}
        </CardContent>
      </Card>

      {/* Report Templates */}
      <Card className="rounded-xl shadow-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>Quick Report Templates</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {reportTypes.find(t => t.value === template.type)?.label.split(' ')[0]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Last generated: {template.lastGenerated}</span>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" className="h-8">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}