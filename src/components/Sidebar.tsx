import { 
  LayoutDashboard, 
  Package, 
  Archive, 
  DollarSign, 
  Users, 
  ShoppingCart, 
  Calendar, 
  Truck, 
  TestTube, 
  UserCog, 
  Activity, 
  BarChart3, 
  Settings,
  Menu,
  X
} from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

import { useAuth } from "./AuthContext";

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, permission: "dashboard" },
  { id: "inventory", label: "Inventory", icon: Package, permission: "inventory" },
  { id: "finished-bay", label: "Finished Bay", icon: Archive, permission: "inventory" },
  { id: "finance", label: "Finance", icon: DollarSign, permission: "finance" },
  { id: "sales-crm", label: "Sales & CRM", icon: Users, permission: "sales" },
  { id: "procurement", label: "Procurement", icon: ShoppingCart, permission: "procurement" },
  { id: "production", label: "Production Scheduling", icon: Calendar, permission: "production" },
  { id: "logistics", label: "Logistics", icon: Truck, permission: "logistics" },
  { id: "laboratory", label: "Laboratory", icon: TestTube, permission: "laboratory" },
  { id: "user-management", label: "User Management", icon: UserCog, permission: "user_management" },
  { id: "activity-logs", label: "Activity Logs", icon: Activity, permission: "activity_logs" },
  { id: "reports", label: "Reports & Analytics", icon: BarChart3, permission: "reports" },
  { id: "settings", label: "Settings", icon: Settings, permission: "settings" },
];

export function Sidebar({ activeModule, onModuleChange }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const filteredMenuItems = menuItems.filter(item => 
    hasPermission(item.permission)
  );

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Hamburger Menu */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto
        md:relative md:top-0 md:h-full md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <nav className="space-y-2">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className="w-full justify-start space-x-3 h-12"
                  onClick={() => {
                    onModuleChange(item.id);
                    setIsOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}