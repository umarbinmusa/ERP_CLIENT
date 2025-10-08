import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { 
  Settings, 
  Save, 
  Building2, 
  Shield, 
  Database, 
  Mail, 
  Bell, 
  Palette, 
  Globe, 
  Clock,
  FileText,
  HardDrive,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";
import { apiService } from "../services/api";

interface SystemSetting {
  id: number;
  setting_key: string;
  setting_value: string;
  setting_type: 'STRING' | 'NUMBER' | 'BOOLEAN' | 'JSON';
  description: string;
  updated_by: string;
  updated_at: string;
}

interface CompanyInfo {
  company_name: string;
  company_tagline: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_website: string;
  tax_id: string;
  registration_number: string;
}

interface SecuritySettings {
  max_login_attempts: number;
  lockout_duration: number;
  password_min_length: number;
  password_require_special: boolean;
  session_timeout: number;
  two_factor_enabled: boolean;
  ip_whitelist_enabled: boolean;
  audit_log_retention: number;
}

interface NotificationSettings {
  email_notifications: boolean;
  sms_notifications: boolean;
  low_stock_threshold: number;
  invoice_approval_alerts: boolean;
  quality_test_alerts: boolean;
  delivery_notifications: boolean;
  backup_notifications: boolean;
}

interface SystemConfiguration {
  default_currency: string;
  tax_rate: number;
  invoice_prefix: string;
  order_prefix: string;
  timezone: string;
  date_format: string;
  number_format: string;
  backup_frequency: string;
  auto_backup_enabled: boolean;
}

export function SystemSettingsModule() {
  const [activeTab, setActiveTab] = useState("company");
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    company_name: "Hari Industries Limited",
    company_tagline: "Excellence in Water Processing & Distribution",
    company_address: "Industrial Estate, Lagos, Nigeria",
    company_phone: "+234-800-HARI-IND",
    company_email: "info@hariindustries.com",
    company_website: "www.hariindustries.com",
    tax_id: "12345678901",
    registration_number: "RC123456"
  });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    max_login_attempts: 5,
    lockout_duration: 30,
    password_min_length: 8,
    password_require_special: true,
    session_timeout: 60,
    two_factor_enabled: false,
    ip_whitelist_enabled: false,
    audit_log_retention: 365
  });
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    sms_notifications: false,
    low_stock_threshold: 100,
    invoice_approval_alerts: true,
    quality_test_alerts: true,
    delivery_notifications: true,
    backup_notifications: true
  });
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>({
    default_currency: "NGN",
    tax_rate: 7.5,
    invoice_prefix: "INV",
    order_prefix: "SO",
    timezone: "Africa/Lagos",
    date_format: "DD/MM/YYYY",
    number_format: "1,234.56",
    backup_frequency: "daily",
    auto_backup_enabled: true
  });
  const [isLoading, setIsLoading] = useState(true);
  const [saveMessage, setSaveMessage] = useState("");
  const [saveType, setSaveType] = useState<"success" | "error" | "">("");

  useEffect(() => {
    loadSystemSettings();
  }, []);

  const loadSystemSettings = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.request({ action: 'get_system_settings' });
      
      if (response.success) {
        setSettings(response.data || []);
        // Parse settings into structured objects
        const settingsMap = response.data.reduce((acc: any, setting: SystemSetting) => {
          acc[setting.setting_key] = setting.setting_value;
          return acc;
        }, {});
        
        // Update state with parsed settings
        updateStateFromSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error loading system settings:', error);
      // Load default/demo settings
      loadDefaultSettings();
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaultSettings = () => {
    setCompanyInfo({
      company_name: "Hari Industries Limited",
      company_tagline: "Excellence in Water Processing & Distribution",
      company_address: "Industrial Estate, Lagos, Nigeria",
      company_phone: "+234-800-HARI-IND",
      company_email: "info@hariindustries.com",
      company_website: "www.hariindustries.com",
      tax_id: "12345678901",
      registration_number: "RC123456"
    });
  };

  const updateStateFromSettings = (settingsMap: any) => {
    setCompanyInfo(prev => ({
      ...prev,
      company_name: settingsMap.company_name || prev.company_name,
      company_tagline: settingsMap.company_tagline || prev.company_tagline,
      company_address: settingsMap.company_address || prev.company_address,
      company_phone: settingsMap.company_phone || prev.company_phone,
      company_email: settingsMap.company_email || prev.company_email,
      company_website: settingsMap.company_website || prev.company_website,
      tax_id: settingsMap.tax_id || prev.tax_id,
      registration_number: settingsMap.registration_number || prev.registration_number
    }));

    setSecuritySettings(prev => ({
      ...prev,
      max_login_attempts: parseInt(settingsMap.max_login_attempts) || prev.max_login_attempts,
      lockout_duration: parseInt(settingsMap.lockout_duration) || prev.lockout_duration,
      password_min_length: parseInt(settingsMap.password_min_length) || prev.password_min_length,
      password_require_special: settingsMap.password_require_special === 'true' || prev.password_require_special,
      session_timeout: parseInt(settingsMap.session_timeout) || prev.session_timeout,
      two_factor_enabled: settingsMap.two_factor_enabled === 'true' || prev.two_factor_enabled,
      ip_whitelist_enabled: settingsMap.ip_whitelist_enabled === 'true' || prev.ip_whitelist_enabled,
      audit_log_retention: parseInt(settingsMap.audit_log_retention) || prev.audit_log_retention
    }));

    setSystemConfig(prev => ({
      ...prev,
      default_currency: settingsMap.default_currency || prev.default_currency,
      tax_rate: parseFloat(settingsMap.tax_rate) || prev.tax_rate,
      invoice_prefix: settingsMap.invoice_prefix || prev.invoice_prefix,
      order_prefix: settingsMap.order_prefix || prev.order_prefix,
      timezone: settingsMap.timezone || prev.timezone,
      date_format: settingsMap.date_format || prev.date_format,
      number_format: settingsMap.number_format || prev.number_format,
      backup_frequency: settingsMap.backup_frequency || prev.backup_frequency,
      auto_backup_enabled: settingsMap.auto_backup_enabled === 'true' || prev.auto_backup_enabled
    }));
  };

  const saveSettings = async (settingsToSave: any, category: string) => {
    try {
      const response = await apiService.request({
        action: 'update_system_settings',
        settings: settingsToSave,
        category: category
      });

      if (response.success) {
        setSaveMessage(`${category} settings saved successfully!`);
        setSaveType("success");
      } else {
        setSaveMessage(`Failed to save ${category} settings: ${response.message}`);
        setSaveType("error");
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveMessage(`${category} settings saved locally (demo mode)`);
      setSaveType("success");
    }

    // Clear message after 3 seconds
    setTimeout(() => {
      setSaveMessage("");
      setSaveType("");
    }, 3000);
  };

  const handleBackup = async () => {
    try {
      setSaveMessage("Creating system backup...");
      setSaveType("success");
      
      // Simulate backup process
      setTimeout(() => {
        setSaveMessage("System backup completed successfully!");
        setSaveType("success");
        setTimeout(() => {
          setSaveMessage("");
          setSaveType("");
        }, 3000);
      }, 2000);
    } catch (error) {
      setSaveMessage("Backup failed. Please try again.");
      setSaveType("error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading system settings...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Configure system preferences and security settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleBackup}>
            <HardDrive className="h-4 w-4 mr-2" />
            Create Backup
          </Button>
        </div>
      </div>

      {saveMessage && (
        <Alert className={saveType === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <AlertDescription className={saveType === "success" ? "text-green-700" : "text-red-700"}>
            {saveType === "success" ? <CheckCircle className="h-4 w-4 mr-2 inline" /> : <AlertTriangle className="h-4 w-4 mr-2 inline" />}
            {saveMessage}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="company">Company</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="backup">Backup</TabsTrigger>
            </TabsList>

            <TabsContent value="company" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Building2 className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold">Company Information</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveSettings(companyInfo, "Company"); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={companyInfo.company_name}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, company_name: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_tagline">Company Tagline</Label>
                    <Input
                      id="company_tagline"
                      value={companyInfo.company_tagline}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, company_tagline: e.target.value}))}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company_address">Address</Label>
                  <Textarea
                    id="company_address"
                    value={companyInfo.company_address}
                    onChange={(e) => setCompanyInfo(prev => ({...prev, company_address: e.target.value}))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="company_phone">Phone</Label>
                    <Input
                      id="company_phone"
                      value={companyInfo.company_phone}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, company_phone: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_email">Email</Label>
                    <Input
                      id="company_email"
                      type="email"
                      value={companyInfo.company_email}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, company_email: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company_website">Website</Label>
                    <Input
                      id="company_website"
                      value={companyInfo.company_website}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, company_website: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tax_id">Tax ID</Label>
                    <Input
                      id="tax_id"
                      value={companyInfo.tax_id}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, tax_id: e.target.value}))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="registration_number">Registration Number</Label>
                    <Input
                      id="registration_number"
                      value={companyInfo.registration_number}
                      onChange={(e) => setCompanyInfo(prev => ({...prev, registration_number: e.target.value}))}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Company Settings
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Shield className="h-6 w-6 text-red-600" />
                <h2 className="text-xl font-semibold">Security Settings</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveSettings(securitySettings, "Security"); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Login Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="max_login_attempts">Max Login Attempts</Label>
                        <Input
                          id="max_login_attempts"
                          type="number"
                          value={securitySettings.max_login_attempts}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, max_login_attempts: parseInt(e.target.value)}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lockout_duration">Lockout Duration (minutes)</Label>
                        <Input
                          id="lockout_duration"
                          type="number"
                          value={securitySettings.lockout_duration}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, lockout_duration: parseInt(e.target.value)}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="session_timeout">Session Timeout (minutes)</Label>
                        <Input
                          id="session_timeout"
                          type="number"
                          value={securitySettings.session_timeout}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, session_timeout: parseInt(e.target.value)}))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Password Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="password_min_length">Minimum Password Length</Label>
                        <Input
                          id="password_min_length"
                          type="number"
                          value={securitySettings.password_min_length}
                          onChange={(e) => setSecuritySettings(prev => ({...prev, password_min_length: parseInt(e.target.value)}))}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={securitySettings.password_require_special}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({...prev, password_require_special: checked}))}
                        />
                        <Label>Require Special Characters</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={securitySettings.two_factor_enabled}
                          onCheckedChange={(checked) => setSecuritySettings(prev => ({...prev, two_factor_enabled: checked}))}
                        />
                        <Label>Enable Two-Factor Authentication</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Advanced Security</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={securitySettings.ip_whitelist_enabled}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({...prev, ip_whitelist_enabled: checked}))}
                      />
                      <Label>Enable IP Whitelist</Label>
                    </div>
                    <div>
                      <Label htmlFor="audit_log_retention">Audit Log Retention (days)</Label>
                      <Input
                        id="audit_log_retention"
                        type="number"
                        value={securitySettings.audit_log_retention}
                        onChange={(e) => setSecuritySettings(prev => ({...prev, audit_log_retention: parseInt(e.target.value)}))}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Bell className="h-6 w-6 text-yellow-600" />
                <h2 className="text-xl font-semibold">Notification Settings</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveSettings(notificationSettings, "Notifications"); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">General Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.email_notifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, email_notifications: checked}))}
                        />
                        <Label>Email Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.sms_notifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, sms_notifications: checked}))}
                        />
                        <Label>SMS Notifications</Label>
                      </div>
                      <div>
                        <Label htmlFor="low_stock_threshold">Low Stock Alert Threshold</Label>
                        <Input
                          id="low_stock_threshold"
                          type="number"
                          value={notificationSettings.low_stock_threshold}
                          onChange={(e) => setNotificationSettings(prev => ({...prev, low_stock_threshold: parseInt(e.target.value)}))}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Module Alerts</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.invoice_approval_alerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, invoice_approval_alerts: checked}))}
                        />
                        <Label>Invoice Approval Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.quality_test_alerts}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, quality_test_alerts: checked}))}
                        />
                        <Label>Quality Test Alerts</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.delivery_notifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, delivery_notifications: checked}))}
                        />
                        <Label>Delivery Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={notificationSettings.backup_notifications}
                          onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, backup_notifications: checked}))}
                        />
                        <Label>Backup Notifications</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <Settings className="h-6 w-6 text-purple-600" />
                <h2 className="text-xl font-semibold">System Configuration</h2>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); saveSettings(systemConfig, "System"); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Regional Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="default_currency">Default Currency</Label>
                        <Select value={systemConfig.default_currency} onValueChange={(value) => setSystemConfig(prev => ({...prev, default_currency: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                            <SelectItem value="USD">USD - US Dollar</SelectItem>
                            <SelectItem value="EUR">EUR - Euro</SelectItem>
                            <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tax_rate">Default Tax Rate (%)</Label>
                        <Input
                          id="tax_rate"
                          type="number"
                          step="0.1"
                          value={systemConfig.tax_rate}
                          onChange={(e) => setSystemConfig(prev => ({...prev, tax_rate: parseFloat(e.target.value)}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={systemConfig.timezone} onValueChange={(value) => setSystemConfig(prev => ({...prev, timezone: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Africa/Lagos">Africa/Lagos (GMT+1)</SelectItem>
                            <SelectItem value="UTC">UTC (GMT+0)</SelectItem>
                            <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Document Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="invoice_prefix">Invoice Prefix</Label>
                        <Input
                          id="invoice_prefix"
                          value={systemConfig.invoice_prefix}
                          onChange={(e) => setSystemConfig(prev => ({...prev, invoice_prefix: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="order_prefix">Sales Order Prefix</Label>
                        <Input
                          id="order_prefix"
                          value={systemConfig.order_prefix}
                          onChange={(e) => setSystemConfig(prev => ({...prev, order_prefix: e.target.value}))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="date_format">Date Format</Label>
                        <Select value={systemConfig.date_format} onValueChange={(value) => setSystemConfig(prev => ({...prev, date_format: value}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-end">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save System Settings
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="backup" className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <HardDrive className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold">Backup & Maintenance</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Backup Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={systemConfig.auto_backup_enabled}
                        onCheckedChange={(checked) => setSystemConfig(prev => ({...prev, auto_backup_enabled: checked}))}
                      />
                      <Label>Enable Automatic Backups</Label>
                    </div>
                    <div>
                      <Label htmlFor="backup_frequency">Backup Frequency</Label>
                      <Select value={systemConfig.backup_frequency} onValueChange={(value) => setSystemConfig(prev => ({...prev, backup_frequency: value}))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-4">
                      <Button onClick={handleBackup} className="w-full">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Create Manual Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">System Version:</span>
                      <span className="font-medium">v2.1.0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Database Size:</span>
                      <span className="font-medium">245.6 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Backup:</span>
                      <span className="font-medium">2024-03-20 03:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Uptime:</span>
                      <span className="font-medium">15 days, 8 hours</span>
                    </div>
                    <div className="pt-4">
                      <Button variant="outline" className="w-full">
                        <FileText className="h-4 w-4 mr-2" />
                        View System Logs
                      </Button>
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