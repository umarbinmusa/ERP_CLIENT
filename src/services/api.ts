// API service for communicating with PHP backend

const API_BASE_URL = "https://bottling.com/database/erp.php";

interface APIResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: any;
}

class APIService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("auth_token");
    return {
      "Content-Type": "application/json",
      ...(token && { "Authorization": `Bearer ${token}` })
    };
  }

  async request<T = any>(data: any): Promise<APIResponse<T>> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(username: string, password: string) {
    return this.request({
      action: "login",
      username,
      password
    });
  }

  async logout() {
    return this.request({
      action: "logout"
    });
  }

  async validateToken() {
    return this.request({
      action: "validate_token"
    });
  }

  // User management endpoints
  async getUsers() {
    return this.request({
      action: "get_users"
    });
  }

  async createUser(userData: any) {
    return this.request({
      action: "create_user",
      ...userData
    });
  }

  async updateUser(userId: number, userData: any) {
    return this.request({
      action: "update_user",
      user_id: userId,
      ...userData
    });
  }

  async deleteUser(userId: number) {
    return this.request({
      action: "delete_user",
      user_id: userId
    });
  }

  // Dashboard data endpoints
  async getDashboardData() {
    return this.request({
      action: "get_dashboard_data"
    });
  }

  // Inventory endpoints
  async getInventoryData() {
    return this.request({
      action: "get_inventory"
    });
  }

  async updateInventoryItem(itemId: string, data: any) {
    return this.request({
      action: "update_inventory_item",
      item_id: itemId,
      ...data
    });
  }

  // Finance endpoints
  async getFinanceData() {
    return this.request({
      action: "get_finance_data"
    });
  }

  async approveInvoice(invoiceId: string) {
    return this.request({
      action: "approve_invoice",
      invoice_id: invoiceId
    });
  }

  async rejectInvoice(invoiceId: string, reason?: string) {
    return this.request({
      action: "reject_invoice",
      invoice_id: invoiceId,
      reason
    });
  }

  // Reports endpoints
  async generateReport(reportType: string, dateRange: string, filters?: any) {
    return this.request({
      action: "generate_report",
      report_type: reportType,
      date_range: dateRange,
      filters
    });
  }

  // Activity logs
  async getActivityLogs(page = 1, limit = 50) {
    return this.request({
      action: "get_activity_logs",
      page,
      limit
    });
  }

  async logActivity(activity: string, details?: any) {
    return this.request({
      action: "log_activity",
      activity,
      details
    });
  }
}

export const apiService = new APIService();

// Database schema for reference
/* 
Expected MySQL tables structure:

1. users table:
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - username (VARCHAR(50), UNIQUE)
   - password (VARCHAR(255), hashed)
   - full_name (VARCHAR(100))
   - email (VARCHAR(100))
   - role (VARCHAR(50))
   - permissions (JSON or TEXT)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)
   - is_active (BOOLEAN)

2. user_sessions table:
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - user_id (INT, FOREIGN KEY)
   - token (VARCHAR(255))
   - expires_at (TIMESTAMP)
   - created_at (TIMESTAMP)

3. activity_logs table:
   - id (INT, PRIMARY KEY, AUTO_INCREMENT)
   - user_id (INT, FOREIGN KEY)
   - action (VARCHAR(100))
   - details (JSON or TEXT)
   - ip_address (VARCHAR(45))
   - created_at (TIMESTAMP)

4. inventory table:
   - id (VARCHAR(20), PRIMARY KEY)
   - name (VARCHAR(100))
   - category (VARCHAR(50))
   - current_stock (INT)
   - min_threshold (INT)
   - max_capacity (INT)
   - unit (VARCHAR(20))
   - last_restocked (DATE)
   - status (VARCHAR(20))
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)

5. invoices table:
   - id (VARCHAR(20), PRIMARY KEY)
   - customer_vendor (VARCHAR(100))
   - amount (DECIMAL(10,2))
   - currency (VARCHAR(3))
   - date (DATE)
   - status (VARCHAR(20))
   - type (VARCHAR(20))
   - approved_by (INT, FOREIGN KEY)
   - created_at (TIMESTAMP)
   - updated_at (TIMESTAMP)
*/