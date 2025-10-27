# 🔌 API Integration Guide - Banking Microservices

## 📋 Overview

**Total Endpoints**: 52  
**Public Endpoints**: 4 (no authentication)  
**Protected Endpoints**: 48 (JWT required)  
**Admin-Only Endpoints**: 16  
**Services**: 7 microservices  

**All requests go through API Gateway**: `http://localhost:8080`

---

## 🚀 Quick Start

### **1. Import API Endpoints**
```javascript
import API_ENDPOINTS from '../services/apiEndpoints';
import api from '../services/api';
```

### **2. Make API Call**
```javascript
// Example: Get all users (Admin)
const response = await api.get(API_ENDPOINTS.AUTH.USERS);

// Example: Get user by ID
const userId = 123;
const response = await api.get(API_ENDPOINTS.AUTH.USER_BY_ID(userId));

// Example: Create customer
const customerData = { firstName: 'John', lastName: 'Doe', ... };
const response = await api.post(API_ENDPOINTS.CUSTOMERS.CREATE, customerData);
```

---

## 🔐 Authentication Flow

### **1. Register New User**
```javascript
POST /auth/signup
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "role": "CUSTOMER"  // or "ADMIN"
}

Response:
{
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "refreshToken": "uuid-here",
  "username": "john",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

### **2. Login**
```javascript
POST /auth/signin
{
  "username": "john",
  "password": "password123"
}

Response: (same as signup)
```

### **3. Use Token in Requests**
```javascript
// Axios automatically adds token via interceptor
// Headers: { Authorization: "Bearer <token>" }
```

### **4. Refresh Token**
```javascript
POST /auth/refresh
{
  "refreshToken": "uuid-here"
}

Response:
{
  "token": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

---

## 📊 Complete Endpoint Reference

### **AUTH SERVICE** (8081 → Gateway: /auth/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/auth/signup` | ❌ | - | Register new user |
| POST | `/auth/signin` | ❌ | - | Login |
| POST | `/auth/refresh` | ❌ | - | Refresh token |
| GET | `/auth/public-key` | ❌ | - | Get RSA public key |
| POST | `/auth/logout` | ✅ | ANY | Logout |
| GET | `/auth/me` | ✅ | ANY | Get current user |
| POST | `/auth/validate` | ✅ | ANY | Validate token |
| GET | `/auth/users` | ✅ | ADMIN | Get all users |
| GET | `/auth/users/{id}` | ✅ | ANY | Get user by ID |
| PUT | `/auth/users/{id}` | ✅ | ANY/ADMIN | Update user |
| DELETE | `/auth/users/{id}` | ✅ | ADMIN | Delete user |

---

### **CUSTOMER SERVICE** (8082 → Gateway: /customers/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/customers` | ✅ | ANY | Create profile |
| GET | `/customers/{id}` | ✅ | ANY | Get customer |
| PUT | `/customers/{id}` | ✅ | ANY | Update customer |
| DELETE | `/customers/{id}` | ✅ | ANY | Delete customer |
| POST | `/customers/{id}/kyc` | ✅ | ANY | Submit KYC |
| PATCH | `/customers/{id}/status` | ✅ | ANY | Update status |
| GET | `/customers/approvals` | ✅ | ADMIN | Get pending KYC |
| POST | `/customers/approvals/bulk` | ✅ | ADMIN | Bulk approve |
| GET | `/customers/search` | ✅ | ANY | Search customers |

---

### **ACCOUNT SERVICE** (8083 → Gateway: /accounts/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/accounts` | ✅ | ANY | Create account |
| GET | `/accounts/{id}` | ✅ | ANY | Get account |
| PUT | `/accounts/{id}` | ✅ | ANY | Update account |
| DELETE | `/accounts/{id}` | ✅ | ANY | Close account |
| GET | `/accounts/{id}/balance` | ✅ | ANY | Get balance |
| GET | `/accounts/user/{userId}` | ✅ | ANY | Get user accounts |
| GET | `/accounts/approvals` | ✅ | ADMIN | Get pending |
| POST | `/accounts/approvals/bulk` | ✅ | ADMIN | Bulk approve |

---

### **CREDIT SERVICE** (8084 → Gateway: /credits/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/credits/loans` | ✅ | ANY | Apply for loan |
| POST | `/credits/cards` | ✅ | ANY | Apply for card |
| GET | `/credits/{id}` | ✅ | ANY | Get credit product |
| PUT | `/credits/{id}` | ✅ | ANY | Update credit |
| DELETE | `/credits/{id}` | ✅ | ANY | Close credit |
| GET | `/credits/user/{userId}` | ✅ | ANY | Get user credits |
| GET | `/credits/approvals` | ✅ | ADMIN | Get pending |
| POST | `/credits/approvals/bulk` | ✅ | ADMIN | Bulk approve |

---

### **PAYMENT SERVICE** (8085 → Gateway: /payments/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/payments/transfer` | ✅ | ANY | Create transfer |
| GET | `/payments/{id}` | ✅ | ANY | Get payment |
| PUT | `/payments/{id}` | ✅ | ANY | Update payment |
| DELETE | `/payments/{id}` | ✅ | ANY | Cancel payment |
| GET | `/payments/user/{userId}` | ✅ | ANY | Get user payments |
| GET | `/payments/approvals` | ✅ | ADMIN | Get pending |
| POST | `/payments/approvals/bulk` | ✅ | ADMIN | Bulk approve |

---

### **NOTIFICATION SERVICE** (8086 → Gateway: /notifications/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/notifications/send` | ✅ | ANY | Send notification |
| GET | `/notifications/{id}` | ✅ | ANY | Get notification |

---

### **ADMIN SERVICE** (8087 → Gateway: /admin/**)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/admin/customers/approvals` | ✅ | ADMIN | Customer KYC |
| POST | `/admin/customers/approvals/bulk` | ✅ | ADMIN | Bulk KYC |
| GET | `/admin/accounts/approvals` | ✅ | ADMIN | Account approvals |
| POST | `/admin/accounts/approvals/bulk` | ✅ | ADMIN | Bulk accounts |
| GET | `/admin/credits/approvals` | ✅ | ADMIN | Credit approvals |
| POST | `/admin/credits/approvals/bulk` | ✅ | ADMIN | Bulk credits |
| GET | `/admin/payments/approvals` | ✅ | ADMIN | Payment approvals |
| POST | `/admin/payments/approvals/bulk` | ✅ | ADMIN | Bulk payments |

---

## 💡 Usage Examples

### **Customer Flow**

#### **1. Create Customer Profile**
```javascript
const createCustomer = async () => {
  const data = {
    userId: 123,
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St"
  };
  
  const response = await api.post(API_ENDPOINTS.CUSTOMERS.CREATE, data);
  return response.data;
};
```

#### **2. Submit KYC Documents**
```javascript
const submitKYC = async (customerId) => {
  const kycData = {
    kycDocumentType: "PASSPORT",
    kycDocumentNumber: "AB1234567"
  };
  
  const response = await api.post(
    API_ENDPOINTS.CUSTOMERS.KYC_SUBMIT(customerId),
    kycData
  );
  return response.data;
};
```

#### **3. Search Customers**
```javascript
const searchCustomers = async (query) => {
  const response = await api.get(API_ENDPOINTS.CUSTOMERS.SEARCH, {
    params: {
      name: query,      // Optional
      email: query,     // Optional
      phone: query      // Optional
    }
  });
  return response.data;
};
```

---

### **Account Flow**

#### **1. Create Bank Account**
```javascript
const createAccount = async () => {
  const data = {
    customerId: 1,
    accountType: "SAVINGS",  // SAVINGS, CHECKING, BUSINESS
    currency: "USD",
    balance: 1000.00
  };
  
  const response = await api.post(API_ENDPOINTS.ACCOUNTS.CREATE, data);
  return response.data;
};
```

#### **2. Get User's Accounts**
```javascript
const getUserAccounts = async (userId) => {
  const response = await api.get(API_ENDPOINTS.ACCOUNTS.BY_USER(userId));
  return response.data;
};
```

#### **3. Check Account Balance**
```javascript
const getBalance = async (accountId) => {
  const response = await api.get(API_ENDPOINTS.ACCOUNTS.BALANCE(accountId));
  return response.data.balance;
};
```

---

### **Payment Flow**

#### **1. Transfer Money**
```javascript
const transferMoney = async () => {
  const data = {
    fromAccountId: 1,
    toAccountId: 2,
    amount: 100.00,
    currency: "USD",
    paymentType: "TRANSFER",  // TRANSFER, BILL_PAYMENT, WITHDRAWAL
    description: "Payment for services"
  };
  
  const response = await api.post(API_ENDPOINTS.PAYMENTS.TRANSFER, data);
  return response.data;
};
```

#### **2. Get Payment History**
```javascript
const getPaymentHistory = async (userId) => {
  const response = await api.get(API_ENDPOINTS.PAYMENTS.BY_USER(userId));
  return response.data;
};
```

---

### **Credit Flow**

#### **1. Apply for Loan**
```javascript
const applyForLoan = async () => {
  const data = {
    customerId: 1,
    productType: "LOAN",
    amount: 5000.00,
    interestRate: 8.5,
    termMonths: 36
  };
  
  const response = await api.post(API_ENDPOINTS.CREDITS.APPLY_LOAN, data);
  return response.data;
};
```

#### **2. Apply for Credit Card**
```javascript
const applyForCard = async () => {
  const data = {
    customerId: 1,
    productType: "CREDIT_CARD",
    creditLimit: 10000.00,
    interestRate: 18.0
  };
  
  const response = await api.post(API_ENDPOINTS.CREDITS.APPLY_CARD, data);
  return response.data;
};
```

---

### **Admin Flow**

#### **1. Get Pending Approvals**
```javascript
const getPendingApprovals = async () => {
  const [customers, accounts, credits, payments] = await Promise.all([
    api.get(API_ENDPOINTS.ADMIN.CUSTOMER_APPROVALS),
    api.get(API_ENDPOINTS.ADMIN.ACCOUNT_APPROVALS),
    api.get(API_ENDPOINTS.ADMIN.CREDIT_APPROVALS),
    api.get(API_ENDPOINTS.ADMIN.PAYMENT_APPROVALS),
  ]);
  
  return {
    customers: customers.data,
    accounts: accounts.data,
    credits: credits.data,
    payments: payments.data,
  };
};
```

#### **2. Bulk Approve Accounts**
```javascript
const bulkApproveAccounts = async (accountIds) => {
  const data = {
    ids: accountIds,
    status: "APPROVED"  // or "REJECTED"
  };
  
  const response = await api.post(
    API_ENDPOINTS.ADMIN.ACCOUNT_BULK,
    data
  );
  return response.data;
};
```

---

## 🔧 Error Handling

```javascript
try {
  const response = await api.get(API_ENDPOINTS.AUTH.USERS);
  return response.data;
} catch (error) {
  if (error.response) {
    // Server responded with error
    switch (error.response.status) {
      case 401:
        // Unauthorized - token expired
        // Handled automatically by axios interceptor
        break;
      case 403:
        // Forbidden - insufficient permissions
        toast.error('Access denied');
        break;
      case 404:
        // Not found
        toast.error('Resource not found');
        break;
      case 500:
        // Server error
        toast.error('Server error');
        break;
      default:
        toast.error(error.response.data.message || 'An error occurred');
    }
  } else if (error.request) {
    // Request made but no response
    toast.error('Network error - please check your connection');
  } else {
    // Something else happened
    toast.error('An unexpected error occurred');
  }
  throw error;
}
```

---

## 🎯 Summary

### **Key Points:**
1. ✅ All 52 endpoints centralized in `apiEndpoints.js`
2. ✅ All requests go through API Gateway (port 8080)
3. ✅ JWT authentication handled automatically
4. ✅ Error handling via axios interceptors
5. ✅ Token refresh on 401 errors
6. ✅ Role-based access control (CUSTOMER/ADMIN)

### **Best Practices:**
1. Always use `API_ENDPOINTS` constants
2. Let axios interceptors handle auth headers
3. Use try/catch for error handling
4. Show user-friendly error messages
5. Test with both CUSTOMER and ADMIN roles

### **Next Steps:**
1. Update all service files to use `apiEndpoints.js`
2. Add missing endpoints to existing services
3. Create admin approval dashboard
4. Implement notification center
5. Add search functionality

🎉 **All APIs are now documented and ready to use!**

