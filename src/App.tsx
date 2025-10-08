import { useState } from "react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { LoginForm } from "./components/LoginForm";
import { TopNavigation } from "./components/TopNavigation";
import { Sidebar } from "./components/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { FinanceModule } from "./components/FinanceModule";
import { InventoryModule } from "./components/InventoryModule";
import { ReportsModule } from "./components/ReportsModule";
import { UserManagementModule } from "./components/UserManagementModule";
import { SalesCRMModule } from "./components/SalesCRMModule";
import { ProductionModule } from "./components/ProductionModule";
import { LogisticsModule } from "./components/LogisticsModule";
import { LaboratoryModule } from "./components/LaboratoryModule";
import { ActivityLogsModule } from "./components/ActivityLogsModule";
import { SystemSettingsModule } from "./components/SystemSettingsModule";
import { ProcurementModule } from "./components/ProcurementModule";
import { FinishedBayModule } from "./components/FinishedBayModule";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const { isAuthenticated, login } = useAuth();
  const [activeModule, setActiveModule] = useState("dashboard");

  if (!isAuthenticated) {
    return <LoginForm onLogin={login} />;
  }

  const renderModule = () => {
    switch (activeModule) {
      case "dashboard":
        return <Dashboard />;
      case "finance":
        return <FinanceModule />;
      case "inventory":
        return <InventoryModule />;
      case "reports":
        return <ReportsModule />;
      case "finished-bay":
        return <FinishedBayModule />;
      case "sales-crm":
        return <SalesCRMModule />;
      case "procurement":
        return <ProcurementModule />;
      case "production":
        return <ProductionModule />;
      case "logistics":
        return <LogisticsModule />;
      case "laboratory":
        return <LaboratoryModule />;
      case "user-management":
        return <UserManagementModule />;
      case "activity-logs":
        return <ActivityLogsModule />;
      case "settings":
        return <SystemSettingsModule />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top Navigation */}
      <TopNavigation />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          activeModule={activeModule} 
          onModuleChange={setActiveModule}
        />
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto md:ml-64">
          <div className="h-full">
            {renderModule()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  );
}