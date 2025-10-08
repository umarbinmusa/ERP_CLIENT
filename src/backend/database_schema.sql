-- SAJ Foods Limited ERP System Database Schema
-- MySQL Database Structure
-- 
-- Run this script to create the complete database structure for the ERP system

-- Create database
CREATE DATABASE IF NOT EXISTS saj_foods_erp CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE saj_foods_erp;

-- =====================================================
-- USERS AND AUTHENTICATION TABLES
-- =====================================================

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL,
    permissions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_active (is_active),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- User sessions table
CREATE TABLE user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(500) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_token (token),
    INDEX idx_user_id (user_id),
    INDEX idx_expires (expires_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity logs table
CREATE TABLE activity_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INVENTORY MANAGEMENT TABLES
-- =====================================================

-- Product categories
CREATE TABLE product_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Inventory items
CREATE TABLE inventory (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    unit VARCHAR(20) NOT NULL,
    current_stock DECIMAL(10,2) DEFAULT 0,
    min_threshold DECIMAL(10,2) DEFAULT 0,
    max_capacity DECIMAL(10,2),
    unit_cost DECIMAL(10,2),
    last_restocked DATE,
    status ENUM('In Stock', 'Low Stock', 'Out of Stock', 'Discontinued') DEFAULT 'In Stock',
    location VARCHAR(100),
    supplier_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category (category_id),
    INDEX idx_status (status),
    INDEX idx_stock_level (current_stock),
    FOREIGN KEY (category_id) REFERENCES product_categories(id) ON DELETE SET NULL
);

-- Stock movements
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id VARCHAR(20) NOT NULL,
    movement_type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_cost DECIMAL(10,2),
    total_cost DECIMAL(10,2),
    reference_id VARCHAR(50),
    reference_type VARCHAR(50),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_inventory (inventory_id),
    INDEX idx_type (movement_type),
    INDEX idx_date (created_at),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- FINANCIAL MANAGEMENT TABLES
-- =====================================================

-- Chart of accounts
CREATE TABLE chart_of_accounts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    account_code VARCHAR(20) NOT NULL UNIQUE,
    account_name VARCHAR(100) NOT NULL,
    account_type ENUM('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE') NOT NULL,
    parent_id INT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_code (account_code),
    INDEX idx_type (account_type),
    FOREIGN KEY (parent_id) REFERENCES chart_of_accounts(id) ON DELETE SET NULL
);

-- Customers and vendors
CREATE TABLE customers_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('CUSTOMER', 'VENDOR', 'BOTH') NOT NULL,
    company_name VARCHAR(100) NOT NULL,
    contact_person VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    state VARCHAR(50),
    country VARCHAR(50),
    tax_id VARCHAR(50),
    payment_terms INT DEFAULT 30,
    credit_limit DECIMAL(12,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_type (type),
    INDEX idx_company (company_name),
    INDEX idx_active (is_active)
);

-- Invoices
CREATE TABLE invoices (
    id VARCHAR(20) PRIMARY KEY,
    customer_vendor_id INT NOT NULL,
    invoice_type ENUM('SALES', 'PURCHASE', 'CREDIT_NOTE', 'DEBIT_NOTE') NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) DEFAULT 0,
    balance_amount DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    status ENUM('DRAFT', 'PENDING', 'APPROVED', 'PAID', 'OVERDUE', 'CANCELLED') DEFAULT 'DRAFT',
    payment_status ENUM('UNPAID', 'PARTIAL', 'PAID') DEFAULT 'UNPAID',
    notes TEXT,
    terms_conditions TEXT,
    approved_by INT,
    approved_at TIMESTAMP NULL,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer_vendor (customer_vendor_id),
    INDEX idx_type (invoice_type),
    INDEX idx_status (status),
    INDEX idx_date (invoice_date),
    INDEX idx_due_date (due_date),
    FOREIGN KEY (customer_vendor_id) REFERENCES customers_vendors(id) ON DELETE RESTRICT,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Invoice line items
CREATE TABLE invoice_line_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(20) NOT NULL,
    inventory_id VARCHAR(20),
    description TEXT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    
    INDEX idx_invoice (invoice_id),
    INDEX idx_inventory (inventory_id),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE SET NULL
);

-- Payments
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id VARCHAR(20) NOT NULL,
    payment_method ENUM('CASH', 'BANK_TRANSFER', 'CHEQUE', 'CREDIT_CARD', 'OTHER') NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    payment_date DATE NOT NULL,
    reference_number VARCHAR(100),
    bank_account VARCHAR(100),
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_invoice (invoice_id),
    INDEX idx_date (payment_date),
    INDEX idx_method (payment_method),
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- PRODUCTION MANAGEMENT TABLES
-- =====================================================

-- Production schedules
CREATE TABLE production_schedules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    schedule_date DATE NOT NULL,
    shift ENUM('MORNING', 'AFTERNOON', 'NIGHT') NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    planned_quantity DECIMAL(10,2) NOT NULL,
    actual_quantity DECIMAL(10,2) DEFAULT 0,
    status ENUM('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED') DEFAULT 'PLANNED',
    supervisor_id INT,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_date (schedule_date),
    INDEX idx_shift (shift),
    INDEX idx_product (product_id),
    INDEX idx_status (status),
    FOREIGN KEY (product_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Quality control
CREATE TABLE quality_control (
    id INT AUTO_INCREMENT PRIMARY KEY,
    batch_number VARCHAR(50) NOT NULL,
    product_id VARCHAR(20) NOT NULL,
    production_date DATE NOT NULL,
    test_date DATE NOT NULL,
    ph_level DECIMAL(4,2),
    tds_level DECIMAL(6,2),
    chlorine_level DECIMAL(6,3),
    microbiological_test ENUM('PASS', 'FAIL', 'PENDING') DEFAULT 'PENDING',
    chemical_test ENUM('PASS', 'FAIL', 'PENDING') DEFAULT 'PENDING',
    physical_test ENUM('PASS', 'FAIL', 'PENDING') DEFAULT 'PENDING',
    overall_result ENUM('PASS', 'FAIL', 'PENDING') DEFAULT 'PENDING',
    tested_by INT,
    approved_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_batch (batch_number),
    INDEX idx_product (product_id),
    INDEX idx_test_date (test_date),
    INDEX idx_result (overall_result),
    FOREIGN KEY (product_id) REFERENCES inventory(id) ON DELETE CASCADE,
    FOREIGN KEY (tested_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- SALES AND CRM TABLES
-- =====================================================

-- Sales orders
CREATE TABLE sales_orders (
    id VARCHAR(20) PRIMARY KEY,
    customer_id INT NOT NULL,
    order_date DATE NOT NULL,
    required_date DATE,
    shipped_date DATE,
    delivery_address TEXT,
    subtotal DECIMAL(12,2) NOT NULL,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    shipping_amount DECIMAL(12,2) DEFAULT 0,
    total_amount DECIMAL(12,2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    sales_rep_id INT,
    notes TEXT,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_customer (customer_id),
    INDEX idx_status (status),
    INDEX idx_order_date (order_date),
    INDEX idx_sales_rep (sales_rep_id),
    FOREIGN KEY (customer_id) REFERENCES customers_vendors(id) ON DELETE RESTRICT,
    FOREIGN KEY (sales_rep_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Sales order line items
CREATE TABLE sales_order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    inventory_id VARCHAR(20) NOT NULL,
    quantity DECIMAL(10,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(12,2) NOT NULL,
    delivered_quantity DECIMAL(10,2) DEFAULT 0,
    
    INDEX idx_order (order_id),
    INDEX idx_inventory (inventory_id),
    FOREIGN KEY (order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id) ON DELETE RESTRICT
);

-- =====================================================
-- LOGISTICS TABLES
-- =====================================================

-- Vehicles
CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_number VARCHAR(20) NOT NULL UNIQUE,
    vehicle_type ENUM('TRUCK', 'VAN', 'PICKUP', 'OTHER') NOT NULL,
    capacity DECIMAL(10,2),
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_number (vehicle_number),
    INDEX idx_active (is_active)
);

-- Deliveries
CREATE TABLE deliveries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id VARCHAR(20) NOT NULL,
    vehicle_id INT,
    delivery_date DATE NOT NULL,
    delivery_time TIME,
    delivery_address TEXT NOT NULL,
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    status ENUM('SCHEDULED', 'IN_TRANSIT', 'DELIVERED', 'FAILED') DEFAULT 'SCHEDULED',
    notes TEXT,
    delivered_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_order (order_id),
    INDEX idx_vehicle (vehicle_id),
    INDEX idx_date (delivery_date),
    INDEX idx_status (status),
    FOREIGN KEY (order_id) REFERENCES sales_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL,
    FOREIGN KEY (delivered_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    description TEXT,
    updated_by INT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key),
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- File uploads
CREATE TABLE file_uploads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    upload_type VARCHAR(50),
    reference_id VARCHAR(50),
    reference_type VARCHAR(50),
    uploaded_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_reference (reference_type, reference_id),
    INDEX idx_uploaded_by (uploaded_by),
    FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

-- =====================================================
-- INSERT DEFAULT DATA
-- =====================================================

-- Insert default product categories
INSERT INTO product_categories (name, description) VALUES
('Raw Materials', 'Raw materials for production'),
('Finished Products', 'Finished bottled water products'),
('Packaging Materials', 'Bottles, labels, caps, etc.'),
('Maintenance Supplies', 'Equipment maintenance supplies'),
('Office Supplies', 'General office supplies');

-- Insert default chart of accounts
INSERT INTO chart_of_accounts (account_code, account_name, account_type) VALUES
('1000', 'ASSETS', 'ASSET'),
('1100', 'Current Assets', 'ASSET'),
('1110', 'Cash and Bank', 'ASSET'),
('1120', 'Accounts Receivable', 'ASSET'),
('1130', 'Inventory', 'ASSET'),
('2000', 'LIABILITIES', 'LIABILITY'),
('2100', 'Current Liabilities', 'LIABILITY'),
('2110', 'Accounts Payable', 'LIABILITY'),
('3000', 'EQUITY', 'EQUITY'),
('3100', 'Owner\'s Equity', 'EQUITY'),
('4000', 'REVENUE', 'REVENUE'),
('4100', 'Sales Revenue', 'REVENUE'),
('5000', 'EXPENSES', 'EXPENSE'),
('5100', 'Cost of Goods Sold', 'EXPENSE'),
('5200', 'Operating Expenses', 'EXPENSE');

-- Insert default admin user (password: admin123)
INSERT INTO users (username, password, full_name, email, role, permissions, created_by) VALUES
('admin', '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewvBjfP6/7Kes.Hq', 'System Administrator', 'admin@sajfoods.com', 'Managing Director', '["all"]', 1);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description) VALUES
('company_name', 'SAJ Foods Limited', 'STRING', 'Company name'),
('company_tagline', 'Sagheer+ Lab – Innovation, Technology, Impact', 'STRING', 'Company tagline'),
('default_currency', 'NGN', 'STRING', 'Default currency'),
('tax_rate', '7.5', 'NUMBER', 'Default VAT rate'),
('invoice_prefix', 'INV', 'STRING', 'Invoice number prefix'),
('order_prefix', 'SO', 'STRING', 'Sales order prefix');

-- Create indexes for better performance
CREATE INDEX idx_users_role_active ON users(role, is_active);
CREATE INDEX idx_inventory_category_status ON inventory(category_id, status);
CREATE INDEX idx_invoices_date_status ON invoices(invoice_date, status);
CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at);

-- Create views for common queries
CREATE VIEW active_users AS
SELECT id, username, full_name, email, role, permissions, last_login, created_at
FROM users 
WHERE is_active = 1;

CREATE VIEW inventory_summary AS
SELECT 
    i.id,
    i.name,
    pc.name as category_name,
    i.current_stock,
    i.min_threshold,
    i.status,
    CASE 
        WHEN i.current_stock <= 0 THEN 'Out of Stock'
        WHEN i.current_stock <= i.min_threshold THEN 'Low Stock'
        ELSE 'In Stock'
    END as stock_status
FROM inventory i
LEFT JOIN product_categories pc ON i.category_id = pc.id;

CREATE VIEW pending_invoices AS
SELECT 
    i.id,
    i.invoice_type,
    cv.company_name,
    i.total_amount,
    i.balance_amount,
    i.invoice_date,
    i.due_date,
    i.status
FROM invoices i
JOIN customers_vendors cv ON i.customer_vendor_id = cv.id
WHERE i.status IN ('PENDING', 'APPROVED') AND i.balance_amount > 0;