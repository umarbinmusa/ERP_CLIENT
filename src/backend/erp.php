<?php
/**
 * SAJ Foods Limited ERP System
 * Main API Endpoint
 * 
 * This file handles all API requests from the React frontend
 */

// Define access constant
define('ERP_ACCESS', true);

// Include configuration
require_once 'configuration.php';

// Handle CORS
handleCORS();

// Set content type
header('Content-Type: application/json');

try {
    // Get request method
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method !== 'POST') {
        sendResponse(false, 'Only POST method is allowed');
    }
    
    // Get JSON input
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (!$data || !isset($data['action'])) {
        sendResponse(false, 'Invalid request format');
    }
    
    $action = $data['action'];
    
    // Route to appropriate handler
    switch ($action) {
        // Authentication endpoints
        case 'login':
            handleLogin($data);
            break;
        case 'logout':
            handleLogout();
            break;
        case 'validate_token':
            handleValidateToken();
            break;
            
        // User management endpoints
        case 'get_users':
            handleGetUsers();
            break;
        case 'create_user':
            handleCreateUser($data);
            break;
        case 'update_user':
            handleUpdateUser($data);
            break;
        case 'delete_user':
            handleDeleteUser($data);
            break;
            
        // Dashboard endpoints
        case 'get_dashboard_data':
            handleGetDashboardData();
            break;
            
        // Inventory endpoints
        case 'get_inventory':
            handleGetInventory();
            break;
        case 'update_inventory_item':
            handleUpdateInventoryItem($data);
            break;
            
        // Finance endpoints
        case 'get_finance_data':
            handleGetFinanceData();
            break;
        case 'approve_invoice':
            handleApproveInvoice($data);
            break;
        case 'reject_invoice':
            handleRejectInvoice($data);
            break;
            
        // Reports endpoints
        case 'generate_report':
            handleGenerateReport($data);
            break;
            
        // Activity logs
        case 'get_activity_logs':
            handleGetActivityLogs($data);
            break;
        case 'log_activity':
            handleLogActivity($data);
            break;
            
        default:
            sendResponse(false, 'Unknown action: ' . $action);
    }
    
} catch (Exception $e) {
    error_log("ERP API Error: " . $e->getMessage());
    sendResponse(false, DEBUG_MODE ? $e->getMessage() : 'Internal server error');
}

// =====================================================
// AUTHENTICATION HANDLERS
// =====================================================

function handleLogin($data) {
    if (!isset($data['username']) || !isset($data['password'])) {
        sendResponse(false, 'Username and password are required');
    }
    
    $username = sanitizeInput($data['username']);
    $password = $data['password'];
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Check for login attempts
        $stmt = $db->prepare("
            SELECT id, username, password, full_name, email, role, permissions, 
                   is_active, login_attempts, locked_until 
            FROM users 
            WHERE username = ?
        ");
        $stmt->execute([$username]);
        $user = $stmt->fetch();
        
        if (!$user) {
            sendResponse(false, 'Invalid credentials');
        }
        
        // Check if account is locked
        if ($user['locked_until'] && strtotime($user['locked_until']) > time()) {
            sendResponse(false, 'Account is temporarily locked. Please try again later.');
        }
        
        // Check if account is active
        if (!$user['is_active']) {
            sendResponse(false, 'Account is disabled. Please contact administrator.');
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            // Increment login attempts
            $attempts = $user['login_attempts'] + 1;
            $lockUntil = null;
            
            if ($attempts >= MAX_LOGIN_ATTEMPTS) {
                $lockUntil = date('Y-m-d H:i:s', time() + LOGIN_LOCKOUT_TIME);
            }
            
            $stmt = $db->prepare("
                UPDATE users 
                SET login_attempts = ?, locked_until = ? 
                WHERE id = ?
            ");
            $stmt->execute([$attempts, $lockUntil, $user['id']]);
            
            sendResponse(false, 'Invalid credentials');
        }
        
        // Reset login attempts on successful login
        $stmt = $db->prepare("
            UPDATE users 
            SET login_attempts = 0, locked_until = NULL, last_login = NOW() 
            WHERE id = ?
        ");
        $stmt->execute([$user['id']]);
        
        // Generate JWT token
        $payload = [
            'user_id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + JWT_EXPIRY
        ];
        
        $token = generateJWT($payload);
        
        // Store session
        $stmt = $db->prepare("
            INSERT INTO user_sessions (user_id, token, ip_address, user_agent, expires_at) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $user['id'],
            $token,
            $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            $_SERVER['HTTP_USER_AGENT'] ?? 'unknown',
            date('Y-m-d H:i:s', time() + JWT_EXPIRY)
        ]);
        
        // Log activity
        logActivity($user['id'], 'User Login', [
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ]);
        
        // Prepare user data
        $userData = [
            'id' => $user['id'],
            'username' => $user['username'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'permissions' => json_decode($user['permissions'] ?? '[]', true)
        ];
        
        sendResponse(true, 'Login successful', null, $token, $userData);
        
    } catch (Exception $e) {
        error_log("Login error: " . $e->getMessage());
        sendResponse(false, 'Login failed');
    }
}

function handleLogout() {
    $user = getCurrentUser();
    if (!$user) {
        sendResponse(false, 'Not authenticated');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Get token from header
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
            $token = $matches[1];
            
            // Delete session
            $stmt = $db->prepare("DELETE FROM user_sessions WHERE token = ?");
            $stmt->execute([$token]);
        }
        
        // Log activity
        logActivity($user['id'], 'User Logout');
        
        sendResponse(true, 'Logout successful');
        
    } catch (Exception $e) {
        error_log("Logout error: " . $e->getMessage());
        sendResponse(false, 'Logout failed');
    }
}

function handleValidateToken() {
    $user = getCurrentUser();
    if (!$user) {
        sendResponse(false, 'Invalid token');
    }
    
    $userData = [
        'id' => $user['id'],
        'username' => $user['username'],
        'full_name' => $user['full_name'],
        'email' => $user['email'],
        'role' => $user['role'],
        'permissions' => json_decode($user['permissions'] ?? '[]', true)
    ];
    
    sendResponse(true, 'Token is valid', null, null, $userData);
}

// =====================================================
// USER MANAGEMENT HANDLERS
// =====================================================

function handleGetUsers() {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'user_management')) {
        sendResponse(false, 'Access denied');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT id, username, full_name, email, role, permissions, 
                   is_active, created_at, last_login 
            FROM users 
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $users = $stmt->fetchAll();
        
        // Format the data
        $formattedUsers = array_map(function($user) {
            return [
                'id' => $user['id'],
                'username' => $user['username'],
                'fullName' => $user['full_name'],
                'email' => $user['email'],
                'role' => $user['role'],
                'permissions' => json_decode($user['permissions'] ?? '[]', true),
                'isActive' => (bool)$user['is_active'],
                'createdAt' => $user['created_at'],
                'lastLogin' => $user['last_login']
            ];
        }, $users);
        
        sendResponse(true, null, $formattedUsers);
        
    } catch (Exception $e) {
        error_log("Get users error: " . $e->getMessage());
        sendResponse(false, 'Failed to fetch users');
    }
}

function handleCreateUser($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'user_management')) {
        sendResponse(false, 'Access denied');
    }
    
    // Validate required fields
    $required = ['username', 'password', 'fullName', 'email', 'role'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || empty($data[$field])) {
            sendResponse(false, "Field '$field' is required");
        }
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Check if username or email already exists
        $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$data['username'], $data['email']]);
        if ($stmt->fetchColumn() > 0) {
            sendResponse(false, 'Username or email already exists');
        }
        
        // Hash password
        $hashedPassword = password_hash($data['password'], PASSWORD_DEFAULT);
        
        // Insert new user
        $stmt = $db->prepare("
            INSERT INTO users (username, password, full_name, email, role, permissions, 
                              is_active, created_by) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $stmt->execute([
            sanitizeInput($data['username']),
            $hashedPassword,
            sanitizeInput($data['fullName']),
            sanitizeInput($data['email']),
            sanitizeInput($data['role']),
            json_encode($data['permissions'] ?? []),
            $data['isActive'] ?? true,
            $user['id']
        ]);
        
        $newUserId = $db->lastInsertId();
        
        // Log activity
        logActivity($user['id'], 'User Created', [
            'new_user_id' => $newUserId,
            'username' => $data['username'],
            'role' => $data['role']
        ]);
        
        sendResponse(true, 'User created successfully', ['id' => $newUserId]);
        
    } catch (Exception $e) {
        error_log("Create user error: " . $e->getMessage());
        sendResponse(false, 'Failed to create user');
    }
}

function handleUpdateUser($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'user_management')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['user_id'])) {
        sendResponse(false, 'User ID is required');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Build update query dynamically
        $updateFields = [];
        $params = [];
        
        if (isset($data['fullName'])) {
            $updateFields[] = "full_name = ?";
            $params[] = sanitizeInput($data['fullName']);
        }
        
        if (isset($data['email'])) {
            $updateFields[] = "email = ?";
            $params[] = sanitizeInput($data['email']);
        }
        
        if (isset($data['role'])) {
            $updateFields[] = "role = ?";
            $params[] = sanitizeInput($data['role']);
        }
        
        if (isset($data['permissions'])) {
            $updateFields[] = "permissions = ?";
            $params[] = json_encode($data['permissions']);
        }
        
        if (isset($data['isActive'])) {
            $updateFields[] = "is_active = ?";
            $params[] = $data['isActive'] ? 1 : 0;
        }
        
        if (isset($data['password']) && !empty($data['password'])) {
            $updateFields[] = "password = ?";
            $params[] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        if (empty($updateFields)) {
            sendResponse(false, 'No fields to update');
        }
        
        $updateFields[] = "updated_at = NOW()";
        $params[] = $data['user_id'];
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        // Log activity
        logActivity($user['id'], 'User Updated', [
            'updated_user_id' => $data['user_id'],
            'fields_updated' => array_keys($data)
        ]);
        
        sendResponse(true, 'User updated successfully');
        
    } catch (Exception $e) {
        error_log("Update user error: " . $e->getMessage());
        sendResponse(false, 'Failed to update user');
    }
}

function handleDeleteUser($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'user_management')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['user_id'])) {
        sendResponse(false, 'User ID is required');
    }
    
    // Prevent self-deletion
    if ($data['user_id'] == $user['id']) {
        sendResponse(false, 'Cannot delete your own account');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Check if user exists
        $stmt = $db->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->execute([$data['user_id']]);
        $targetUser = $stmt->fetch();
        
        if (!$targetUser) {
            sendResponse(false, 'User not found');
        }
        
        // Soft delete - set as inactive instead of actually deleting
        $stmt = $db->prepare("UPDATE users SET is_active = 0, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$data['user_id']]);
        
        // Log activity
        logActivity($user['id'], 'User Deleted', [
            'deleted_user_id' => $data['user_id'],
            'username' => $targetUser['username']
        ]);
        
        sendResponse(true, 'User deleted successfully');
        
    } catch (Exception $e) {
        error_log("Delete user error: " . $e->getMessage());
        sendResponse(false, 'Failed to delete user');
    }
}

// =====================================================
// DASHBOARD HANDLERS
// =====================================================

function handleGetDashboardData() {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'dashboard')) {
        sendResponse(false, 'Access denied');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Get various dashboard metrics
        $data = [];
        
        // Total sales (last 30 days)
        $stmt = $db->prepare("
            SELECT COALESCE(SUM(total_amount), 0) as total_sales 
            FROM invoices 
            WHERE invoice_type = 'SALES' 
            AND invoice_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            AND status != 'CANCELLED'
        ");
        $stmt->execute();
        $data['total_sales'] = $stmt->fetchColumn();
        
        // Pending invoices
        $stmt = $db->prepare("
            SELECT COUNT(*) as pending_invoices 
            FROM invoices 
            WHERE status = 'PENDING'
        ");
        $stmt->execute();
        $data['pending_invoices'] = $stmt->fetchColumn();
        
        // Low stock items
        $stmt = $db->prepare("
            SELECT COUNT(*) as low_stock_items 
            FROM inventory 
            WHERE current_stock <= min_threshold 
            AND status != 'Discontinued'
        ");
        $stmt->execute();
        $data['low_stock_items'] = $stmt->fetchColumn();
        
        // Active customers
        $stmt = $db->prepare("
            SELECT COUNT(*) as active_customers 
            FROM customers_vendors 
            WHERE type IN ('CUSTOMER', 'BOTH') 
            AND is_active = 1
        ");
        $stmt->execute();
        $data['active_customers'] = $stmt->fetchColumn();
        
        // Recent activity
        $stmt = $db->prepare("
            SELECT al.action, al.created_at, u.full_name 
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC 
            LIMIT 10
        ");
        $stmt->execute();
        $data['recent_activity'] = $stmt->fetchAll();
        
        // Sales chart data (last 7 days)
        $stmt = $db->prepare("
            SELECT 
                DATE(invoice_date) as date,
                SUM(total_amount) as amount
            FROM invoices 
            WHERE invoice_type = 'SALES' 
            AND invoice_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)
            AND status != 'CANCELLED'
            GROUP BY DATE(invoice_date)
            ORDER BY date
        ");
        $stmt->execute();
        $data['sales_chart'] = $stmt->fetchAll();
        
        sendResponse(true, null, $data);
        
    } catch (Exception $e) {
        error_log("Dashboard data error: " . $e->getMessage());
        sendResponse(false, 'Failed to fetch dashboard data');
    }
}

// =====================================================
// INVENTORY HANDLERS
// =====================================================

function handleGetInventory() {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'inventory')) {
        sendResponse(false, 'Access denied');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            SELECT i.*, pc.name as category_name
            FROM inventory i
            LEFT JOIN product_categories pc ON i.category_id = pc.id
            ORDER BY i.name
        ");
        $stmt->execute();
        $inventory = $stmt->fetchAll();
        
        sendResponse(true, null, $inventory);
        
    } catch (Exception $e) {
        error_log("Get inventory error: " . $e->getMessage());
        sendResponse(false, 'Failed to fetch inventory');
    }
}

function handleUpdateInventoryItem($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'inventory')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['item_id'])) {
        sendResponse(false, 'Item ID is required');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        // Build update query
        $updateFields = [];
        $params = [];
        
        if (isset($data['current_stock'])) {
            $updateFields[] = "current_stock = ?";
            $params[] = $data['current_stock'];
        }
        
        if (isset($data['min_threshold'])) {
            $updateFields[] = "min_threshold = ?";
            $params[] = $data['min_threshold'];
        }
        
        if (isset($data['status'])) {
            $updateFields[] = "status = ?";
            $params[] = $data['status'];
        }
        
        if (empty($updateFields)) {
            sendResponse(false, 'No fields to update');
        }
        
        $updateFields[] = "updated_at = NOW()";
        $params[] = $data['item_id'];
        
        $sql = "UPDATE inventory SET " . implode(', ', $updateFields) . " WHERE id = ?";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        // Log activity
        logActivity($user['id'], 'Inventory Updated', [
            'item_id' => $data['item_id'],
            'fields_updated' => array_keys($data)
        ]);
        
        sendResponse(true, 'Inventory updated successfully');
        
    } catch (Exception $e) {
        error_log("Update inventory error: " . $e->getMessage());
        sendResponse(false, 'Failed to update inventory');
    }
}

// =====================================================
// FINANCE HANDLERS
// =====================================================

function handleGetFinanceData() {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'finance')) {
        sendResponse(false, 'Access denied');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $data = [];
        
        // Pending invoices
        $stmt = $db->prepare("
            SELECT i.*, cv.company_name
            FROM invoices i
            JOIN customers_vendors cv ON i.customer_vendor_id = cv.id
            WHERE i.status = 'PENDING'
            ORDER BY i.invoice_date DESC
        ");
        $stmt->execute();
        $data['pending_invoices'] = $stmt->fetchAll();
        
        // Financial summary
        $stmt = $db->prepare("
            SELECT 
                SUM(CASE WHEN invoice_type = 'SALES' THEN total_amount ELSE 0 END) as total_sales,
                SUM(CASE WHEN invoice_type = 'PURCHASE' THEN total_amount ELSE 0 END) as total_purchases,
                SUM(CASE WHEN status = 'PENDING' THEN balance_amount ELSE 0 END) as pending_amount
            FROM invoices
            WHERE MONTH(invoice_date) = MONTH(NOW()) 
            AND YEAR(invoice_date) = YEAR(NOW())
        ");
        $stmt->execute();
        $data['summary'] = $stmt->fetch();
        
        sendResponse(true, null, $data);
        
    } catch (Exception $e) {
        error_log("Get finance data error: " . $e->getMessage());
        sendResponse(false, 'Failed to fetch finance data');
    }
}

function handleApproveInvoice($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'finance')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['invoice_id'])) {
        sendResponse(false, 'Invoice ID is required');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            UPDATE invoices 
            SET status = 'APPROVED', approved_by = ?, approved_at = NOW() 
            WHERE id = ? AND status = 'PENDING'
        ");
        $stmt->execute([$user['id'], $data['invoice_id']]);
        
        if ($stmt->rowCount() == 0) {
            sendResponse(false, 'Invoice not found or already processed');
        }
        
        // Log activity
        logActivity($user['id'], 'Invoice Approved', [
            'invoice_id' => $data['invoice_id']
        ]);
        
        sendResponse(true, 'Invoice approved successfully');
        
    } catch (Exception $e) {
        error_log("Approve invoice error: " . $e->getMessage());
        sendResponse(false, 'Failed to approve invoice');
    }
}

function handleRejectInvoice($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'finance')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['invoice_id'])) {
        sendResponse(false, 'Invoice ID is required');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $stmt = $db->prepare("
            UPDATE invoices 
            SET status = 'CANCELLED', notes = CONCAT(COALESCE(notes, ''), '\nRejected: ', ?)
            WHERE id = ? AND status = 'PENDING'
        ");
        $stmt->execute([$data['reason'] ?? 'No reason provided', $data['invoice_id']]);
        
        if ($stmt->rowCount() == 0) {
            sendResponse(false, 'Invoice not found or already processed');
        }
        
        // Log activity
        logActivity($user['id'], 'Invoice Rejected', [
            'invoice_id' => $data['invoice_id'],
            'reason' => $data['reason'] ?? 'No reason provided'
        ]);
        
        sendResponse(true, 'Invoice rejected successfully');
        
    } catch (Exception $e) {
        error_log("Reject invoice error: " . $e->getMessage());
        sendResponse(false, 'Failed to reject invoice');
    }
}

// =====================================================
// REPORTS HANDLERS
// =====================================================

function handleGenerateReport($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'reports')) {
        sendResponse(false, 'Access denied');
    }
    
    if (!isset($data['report_type'])) {
        sendResponse(false, 'Report type is required');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $reportType = $data['report_type'];
        $dateRange = $data['date_range'] ?? 'last_30_days';
        
        // Calculate date range
        $dateCondition = getDateRangeCondition($dateRange);
        
        $reportData = [];
        
        switch ($reportType) {
            case 'sales':
                $stmt = $db->prepare("
                    SELECT i.*, cv.company_name
                    FROM invoices i
                    JOIN customers_vendors cv ON i.customer_vendor_id = cv.id
                    WHERE i.invoice_type = 'SALES' AND $dateCondition
                    ORDER BY i.invoice_date DESC
                ");
                $stmt->execute();
                $reportData = $stmt->fetchAll();
                break;
                
            case 'inventory':
                $stmt = $db->prepare("
                    SELECT i.*, pc.name as category_name
                    FROM inventory i
                    LEFT JOIN product_categories pc ON i.category_id = pc.id
                    ORDER BY i.name
                ");
                $stmt->execute();
                $reportData = $stmt->fetchAll();
                break;
                
            case 'financial':
                $stmt = $db->prepare("
                    SELECT 
                        DATE(invoice_date) as date,
                        SUM(CASE WHEN invoice_type = 'SALES' THEN total_amount ELSE 0 END) as sales,
                        SUM(CASE WHEN invoice_type = 'PURCHASE' THEN total_amount ELSE 0 END) as purchases
                    FROM invoices
                    WHERE $dateCondition
                    GROUP BY DATE(invoice_date)
                    ORDER BY date
                ");
                $stmt->execute();
                $reportData = $stmt->fetchAll();
                break;
                
            default:
                sendResponse(false, 'Unknown report type');
        }
        
        // Log activity
        logActivity($user['id'], 'Report Generated', [
            'report_type' => $reportType,
            'date_range' => $dateRange
        ]);
        
        sendResponse(true, null, $reportData);
        
    } catch (Exception $e) {
        error_log("Generate report error: " . $e->getMessage());
        sendResponse(false, 'Failed to generate report');
    }
}

// =====================================================
// ACTIVITY LOG HANDLERS
// =====================================================

function handleGetActivityLogs($data) {
    $user = getCurrentUser();
    if (!$user || !hasPermission($user, 'activity_logs')) {
        sendResponse(false, 'Access denied');
    }
    
    try {
        $db = DatabaseConnection::getInstance()->getConnection();
        
        $page = $data['page'] ?? 1;
        $limit = $data['limit'] ?? 50;
        $offset = ($page - 1) * $limit;
        
        $stmt = $db->prepare("
            SELECT al.*, u.full_name, u.username
            FROM activity_logs al
            LEFT JOIN users u ON al.user_id = u.id
            ORDER BY al.created_at DESC
            LIMIT ? OFFSET ?
        ");
        $stmt->execute([$limit, $offset]);
        $logs = $stmt->fetchAll();
        
        // Get total count
        $stmt = $db->prepare("SELECT COUNT(*) FROM activity_logs");
        $stmt->execute();
        $total = $stmt->fetchColumn();
        
        sendResponse(true, null, [
            'logs' => $logs,
            'total' => $total,
            'page' => $page,
            'pages' => ceil($total / $limit)
        ]);
        
    } catch (Exception $e) {
        error_log("Get activity logs error: " . $e->getMessage());
        sendResponse(false, 'Failed to fetch activity logs');
    }
}

function handleLogActivity($data) {
    $user = getCurrentUser();
    if (!$user) {
        sendResponse(false, 'Not authenticated');
    }
    
    if (!isset($data['activity'])) {
        sendResponse(false, 'Activity description is required');
    }
    
    logActivity($user['id'], $data['activity'], $data['details'] ?? null);
    sendResponse(true, 'Activity logged successfully');
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

function getDateRangeCondition($dateRange) {
    switch ($dateRange) {
        case 'today':
            return "DATE(invoice_date) = CURDATE()";
        case 'yesterday':
            return "DATE(invoice_date) = DATE_SUB(CURDATE(), INTERVAL 1 DAY)";
        case 'last_7_days':
            return "invoice_date >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
        case 'last_30_days':
            return "invoice_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
        case 'this_month':
            return "MONTH(invoice_date) = MONTH(NOW()) AND YEAR(invoice_date) = YEAR(NOW())";
        case 'last_month':
            return "invoice_date >= DATE_SUB(DATE_SUB(NOW(), INTERVAL DAY(NOW())-1 DAY), INTERVAL 1 MONTH) 
                    AND invoice_date < DATE_SUB(NOW(), INTERVAL DAY(NOW())-1 DAY)";
        case 'this_year':
            return "YEAR(invoice_date) = YEAR(NOW())";
        default:
            return "invoice_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
    }
}

?>