/**
 * Centralized API Endpoint Configuration
 * All services accessible via API Gateway on port 8080
 * 
 * Total Endpoints: 52
 * - Public: 4 (no auth required)
 * - Protected: 48 (JWT required)
 */

export const API_ENDPOINTS = {
  // =============================================================================
  // AUTH SERVICE (Port: 8081) - Via Gateway: /auth/**
  // =============================================================================
  AUTH: {
    // Public Endpoints
    SIGNUP: '/auth/signup',                     // POST - Register new user
    SIGNIN: '/auth/signin',                     // POST - Login with username/password
    REFRESH: '/auth/refresh',                   // POST - Refresh access token
    PUBLIC_KEY: '/auth/public-key',             // GET - Get RSA public key
    
    // Protected Endpoints
    LOGOUT: '/auth/logout',                     // POST - Logout and invalidate token
    ME: '/auth/me',                             // GET - Get current user info
    VALIDATE: '/auth/validate',                 // POST - Validate JWT token
    
    // User Management (Protected)
    USERS: '/auth/users',                       // GET - Get all users (Admin only)
    USER_BY_ID: (id) => `/auth/users/${id}`,    // GET/PUT/DELETE - User by ID
  },

  // =============================================================================
  // CUSTOMER SERVICE (Port: 8082) - Via Gateway: /customers/**
  // =============================================================================
  CUSTOMERS: {
    // CRUD Operations
    CREATE: '/customers',                       // POST - Create customer profile
    GET_ALL: '/customers',                      // GET - Get all customers (Admin)
    BY_ID: (id) => `/customers/${id}`,          // GET/PUT/DELETE - Customer by ID
    
    // KYC Operations
    KYC_SUBMIT: (id) => `/customers/${id}/kyc`, // POST - Submit KYC documents
    UPDATE_STATUS: (id) => `/customers/${id}/status`, // PATCH - Update status
    
    // Admin Operations
    APPROVALS: '/customers/approvals',          // GET - Get pending KYC approvals
    BULK_APPROVE: '/customers/approvals/bulk',  // POST - Bulk approve/reject
    
    // Search
    SEARCH: '/customers/search',                // GET - Search by name/email/phone
  },

  // =============================================================================
  // ACCOUNT SERVICE (Port: 8083) - Via Gateway: /accounts/**
  // =============================================================================
  ACCOUNTS: {
    // CRUD Operations
    CREATE: '/accounts',                        // POST - Create bank account
    GET_ALL: '/accounts',                       // GET - Get all accounts (Admin)
    BY_ID: (id) => `/accounts/${id}`,           // GET/PUT/DELETE - Account by ID
    
    // Balance & User Accounts
    BALANCE: (id) => `/accounts/${id}/balance`, // GET - Get account balance
    BY_USER: (userId) => `/accounts/user/${userId}`, // GET - Get user's accounts
    
    // Admin Operations
    APPROVALS: '/accounts/approvals',           // GET - Get pending approvals
    BULK_APPROVE: '/accounts/approvals/bulk',   // POST - Bulk approve/reject
  },

  // =============================================================================
  // CREDIT SERVICE (Port: 8084) - Via Gateway: /credits/**
  // =============================================================================
  CREDITS: {
    // Application Operations
    APPLY_LOAN: '/credits/loans',               // POST - Apply for loan
    APPLY_CARD: '/credits/cards',               // POST - Apply for credit card
    BY_ID: (id) => `/credits/${id}`,            // GET/PUT/DELETE - Credit by ID
    
    // User Operations
    BY_USER: (userId) => `/credits/user/${userId}`, // GET - Get user's credits
    
    // Admin Operations
    APPROVALS: '/credits/approvals',            // GET - Get pending approvals
    BULK_APPROVE: '/credits/approvals/bulk',    // POST - Bulk approve/reject
  },

  // =============================================================================
  // PAYMENT SERVICE (Port: 8085) - Via Gateway: /payments/**
  // =============================================================================
  PAYMENTS: {
    // Transaction Operations
    TRANSFER: '/payments/transfer',             // POST - Create fund transfer
    BY_ID: (id) => `/payments/${id}`,           // GET/PUT/DELETE - Payment by ID
    
    // User Operations
    BY_USER: (userId) => `/payments/user/${userId}`, // GET - Get user's payments
    
    // Admin Operations
    APPROVALS: '/payments/approvals',           // GET - Get pending approvals
    BULK_APPROVE: '/payments/approvals/bulk',   // POST - Bulk approve/reject
  },

  // =============================================================================
  // NOTIFICATION SERVICE (Port: 8086) - Via Gateway: /notifications/**
  // =============================================================================
  NOTIFICATIONS: {
    SEND: '/notifications/send',                // POST - Send notification
    BY_ID: (id) => `/notifications/${id}`,      // GET - Get notification by ID
  },

  // =============================================================================
  // ADMIN SERVICE (Port: 8087) - Via Gateway: /admin/**
  // Aggregated admin operations across all services
  // =============================================================================
  ADMIN: {
    // Customer Approvals
    CUSTOMER_APPROVALS: '/admin/customers/approvals',     // GET
    CUSTOMER_BULK: '/admin/customers/approvals/bulk',     // POST
    
    // Account Approvals
    ACCOUNT_APPROVALS: '/admin/accounts/approvals',       // GET
    ACCOUNT_BULK: '/admin/accounts/approvals/bulk',       // POST
    
    // Credit Approvals
    CREDIT_APPROVALS: '/admin/credits/approvals',         // GET
    CREDIT_BULK: '/admin/credits/approvals/bulk',         // POST
    
    // Payment Approvals
    PAYMENT_APPROVALS: '/admin/payments/approvals',       // GET
    PAYMENT_BULK: '/admin/payments/approvals/bulk',       // POST

    // Insights - Fetch all entities (Admin)
    CUSTOMERS_ALL: '/admin/customers/all',
    ACCOUNTS_ALL: '/admin/accounts/all',
    PAYMENTS_ALL: '/admin/payments/all',
    CREDITS_ALL: '/admin/credits/all',
  },
};

/**
 * Service Port Mapping (for direct access if needed)
 */
export const SERVICE_PORTS = {
  API_GATEWAY: 8080,
  EUREKA: 8761,
  AUTH: 8081,
  CUSTOMER: 8082,
  ACCOUNT: 8083,
  CREDIT: 8084,
  PAYMENT: 8085,
  NOTIFICATION: 8086,
  ADMIN: 8087,
};

/**
 * Build full URL for direct service access (dev/debugging only)
 * In production, always use API Gateway
 */
export const buildDirectUrl = (service, port) => {
  return `http://localhost:${port}${service}`;
};

/**
 * Endpoint Statistics
 */
export const ENDPOINT_STATS = {
  TOTAL: 52,
  PUBLIC: 4,
  PROTECTED: 48,
  ADMIN_ONLY: 16,
  SERVICES: 7,
};

export default API_ENDPOINTS;

