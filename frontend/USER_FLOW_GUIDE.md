# 🔐 Banking Microservices - Complete User Flow Guide

## 📋 Table of Contents
1. [Initial Setup](#initial-setup)
2. [Admin Flow](#admin-flow)
3. [Customer Flow](#customer-flow)
4. [Authentication Details](#authentication-details)
5. [Page-by-Page Navigation](#page-by-page-navigation)

---

## 🚀 Initial Setup

### **IMPORTANT: Database is Empty!**
- No users exist initially
- **First user must register** before anyone can login
- You can create both ADMIN and CUSTOMER accounts

---

## 👨‍💼 ADMIN FLOW

### **Step 1: Create Admin Account**

#### **1.1 Navigate to Registration**
```
URL: http://localhost:3000
Click: "Register here" link
```

#### **1.2 Fill Registration Form**
- **Username**: `admin` (or any username you prefer)
- **Email**: `admin@banking.com`
- **Password**: `admin123` (minimum 6 characters)
- **Confirm Password**: `admin123`
- **Account Type**: Select **"Administrator Account"**
- Click: **"Create Account"**

#### **1.3 Automatic Login & Redirect**
After successful registration:
- ✅ User is automatically logged in
- ✅ JWT token is stored in localStorage
- ✅ Redirected to `/dashboard`

---

### **Step 2: Admin Dashboard** (`/dashboard`)

#### **What Admin Sees:**
```
┌─────────────────────────────────────────────────┐
│  Welcome back, admin!                           │
│  Here's your account overview                   │
├─────────────────────────────────────────────────┤
│  📊 Total Balance    | 🏦 Active Accounts       │
│  $0                 | 0                         │
├─────────────────────────────────────────────────┤
│  Your Accounts                                  │
│  (Empty - Admin can create accounts)            │
├─────────────────────────────────────────────────┤
│  Quick Actions:                                 │
│  - Transfer Money                               │
│  - Open Account                                 │
│  - Apply for Credit                             │
│  - Payment History                              │
└─────────────────────────────────────────────────┘
```

#### **Admin-Specific Navigation**
Admin sees extra menu item in navbar:
- 🛡️ **Admin** (not visible to customers)

---

### **Step 3: Admin Features**

#### **3.1 User Management** (`/admin/users`)
Click: **Admin** → **User Management**

**What Admin Can Do:**
- ✅ **View All Users**: List of all registered users
- ✅ **Update User Roles**: Change CUSTOMER ↔ ADMIN
- ✅ **Enable/Disable Users**: Activate or deactivate accounts
- ✅ **Delete Users**: Remove user accounts
- ✅ **View User Details**: Email, role, status, created date

**Features:**
```javascript
// API Calls Admin Can Make:
GET    /auth/users           // Get all users
GET    /auth/users/{id}      // Get specific user
PUT    /auth/users/{id}      // Update user (role, email, enabled status)
DELETE /auth/users/{id}      // Delete user
```

#### **3.2 Admin Dashboard** (`/admin`)
Click: **Admin** → **Dashboard**

**Admin Analytics:**
- Total users count
- Customer count vs Admin count
- Active vs inactive accounts
- System statistics
- Recent activities

---

### **Step 4: Admin Can Also Use Customer Features**

Admin has **ALL PERMISSIONS**, including:
- ✅ Create bank accounts
- ✅ Transfer money
- ✅ Apply for credit products
- ✅ View payment history
- ✅ Manage their own profile

**Why?** Admin role includes everything a customer can do, PLUS admin-specific features.

---

## 👤 CUSTOMER FLOW

### **Step 1: Create Customer Account**

#### **1.1 Navigate to Registration**
```
URL: http://localhost:3000
Click: "Register here" link
```

#### **1.2 Fill Registration Form**
- **Username**: `john` (your choice)
- **Email**: `john@example.com`
- **Password**: `password123`
- **Confirm Password**: `password123`
- **Account Type**: Select **"Customer Account"** (default)
- Click: **"Create Account"**

#### **1.3 Automatic Login & Redirect**
- ✅ Logged in automatically
- ✅ Redirected to `/dashboard`

---

### **Step 2: Customer Dashboard** (`/dashboard`)

#### **What Customer Sees:**
```
┌─────────────────────────────────────────────────┐
│  Welcome back, john!                            │
│  Here's your account overview                   │
├─────────────────────────────────────────────────┤
│  📊 Total Balance: $0                           │
│  🏦 Active Accounts: 0                          │
│  ⚡ Quick Actions: [Transfer Money]             │
├─────────────────────────────────────────────────┤
│  Your Accounts                                  │
│  ┌───────────────────────────────────────┐     │
│  │  No accounts yet                      │     │
│  │  [Create Account]                     │     │
│  └───────────────────────────────────────┘     │
├─────────────────────────────────────────────────┤
│  Quick Actions:                                 │
│  - [Transfer Money]                             │
│  - [Open Account]                               │
│  - [Apply for Credit]                           │
│  - [Payment History]                            │
└─────────────────────────────────────────────────┘
```

---

### **Step 3: Open a Bank Account** (`/accounts/create`)

#### **Navigate:**
- Click: **"Open Account"** button
- OR: **Accounts** → **Create Account**

#### **Fill Account Creation Form:**
```
Customer ID: 1 (auto-filled from customer service)
Account Type: 
  - SAVINGS
  - CHECKING
  - BUSINESS

Currency: USD (default)
Initial Deposit: $1000 (optional)

[Create Account Button]
```

#### **Backend Process:**
1. Frontend sends request to `/accounts`
2. Account Service creates account with status: `PENDING`
3. Account number is auto-generated
4. Returns to accounts list

#### **Account Status Flow:**
```
PENDING → (Admin approval) → ACTIVE
                           ↓
                        SUSPENDED (if issues)
                           ↓
                        CLOSED (when closed)
```

---

### **Step 4: View Accounts** (`/accounts`)

#### **Accounts List:**
```
┌─────────────────────────────────────────────────┐
│  My Accounts                                    │
├─────────────────────────────────────────────────┤
│  💳 SAVINGS Account                             │
│  Account #: 1234567890                          │
│  Balance: $1,000.00                             │
│  Status: ACTIVE                                 │
│  [View Details]                                 │
├─────────────────────────────────────────────────┤
│  💳 CHECKING Account                            │
│  Account #: 0987654321                          │
│  Balance: $500.00                               │
│  Status: ACTIVE                                 │
│  [View Details]                                 │
└─────────────────────────────────────────────────┘
```

---

### **Step 5: Transfer Money** (`/transfer`)

#### **Navigate:**
- Click: **Transfer** in navbar
- OR: Dashboard → **"Transfer Money"**

#### **Transfer Form:**
```
From Account: [Select your account ▼]
  - Savings (****7890) - $1,000.00

To Account Number: 0987654321

Amount: $100.00

Description: Payment for services

[Transfer Button]
```

#### **Backend Process:**
1. Validates from/to accounts exist
2. Checks sufficient balance
3. Creates payment with status: `PENDING`
4. Processes payment → status: `COMPLETED` or `FAILED`
5. Updates both account balances

---

### **Step 6: Payment History** (`/payments`)

#### **View All Transactions:**
```
┌─────────────────────────────────────────────────┐
│  Payment History                                │
├─────────────────────────────────────────────────┤
│  Date       | Type     | Amount   | Status      │
│  2024-01-15 | TRANSFER | -$100.00 | COMPLETED   │
│  2024-01-14 | TRANSFER | +$50.00  | COMPLETED   │
│  2024-01-10 | DEPOSIT  | +$500.00 | COMPLETED   │
└─────────────────────────────────────────────────┘
```

**Filter Options:**
- By date range
- By payment type (TRANSFER, BILL_PAYMENT, WITHDRAWAL)
- By status (PENDING, COMPLETED, FAILED)

---

### **Step 7: Apply for Credit** (`/credit`)

#### **Navigate:**
- Click: **Credit** in navbar

#### **Credit Products:**
```
┌─────────────────────────────────────────────────┐
│  Credit Products                                │
├─────────────────────────────────────────────────┤
│  💳 Credit Card                                 │
│  Credit Limit: Up to $10,000                    │
│  Interest Rate: 18% APR                         │
│  [Apply Now]                                    │
├─────────────────────────────────────────────────┤
│  💰 Personal Loan                               │
│  Amount: $1,000 - $50,000                       │
│  Interest Rate: 8-15% APR                       │
│  Term: 12-60 months                             │
│  [Apply Now]                                    │
└─────────────────────────────────────────────────┘
```

#### **Application Process:**
1. Click **Apply Now** → `/credit/loan/apply`
2. Fill application form:
   - Product Type: LOAN or CREDIT_CARD
   - Amount (for loans) OR Credit Limit (for cards)
   - Interest Rate
   - Term (months, for loans)
3. Submit → Status: `PENDING`
4. Admin reviews → `APPROVED` or `REJECTED`
5. If approved → Status: `ACTIVE`

---

### **Step 8: Profile Management** (`/profile`)

#### **View/Edit Profile:**
```
┌─────────────────────────────────────────────────┐
│  My Profile                                     │
├─────────────────────────────────────────────────┤
│  Username: john                                 │
│  Email: john@example.com                        │
│  Role: CUSTOMER                                 │
│  Account Status: Active                         │
│  Member Since: Jan 15, 2024                     │
│                                                 │
│  [Edit Profile] [Change Password]               │
└─────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Details

### **How Login Works**

#### **1. User Enters Credentials**
```javascript
// Login Form:
{
  username: "john",
  password: "password123"
}
```

#### **2. Frontend Sends to Backend**
```javascript
POST /auth/signin
Body: {
  "username": "john",
  "password": "password123"
}
```

#### **3. Backend Validates**
```java
// AuthController checks:
1. User exists?
2. Password matches? (BCrypt verification)
3. Account enabled?
4. Account not locked?
```

#### **4. Backend Returns JWT Token**
```javascript
Response: {
  "token": "eyJhbGciOiJSUzI1NiJ9...",
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000",
  "username": "john",
  "email": "john@example.com",
  "role": "CUSTOMER"
}
```

#### **5. Frontend Stores Token**
```javascript
localStorage.setItem('authToken', token);
localStorage.setItem('user', JSON.stringify(user));
```

#### **6. Every Subsequent Request**
```javascript
// Axios interceptor adds token:
headers: {
  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiJ9...'
}
```

#### **7. Backend Validates Token**
```java
// SecurityConfig verifies:
1. Token signature valid?
2. Token not expired?
3. User still exists?
4. User still enabled?
```

---

### **Token Expiration & Refresh**

#### **Access Token:**
- **Expires**: 24 hours
- **Purpose**: Authenticate API requests
- **Storage**: localStorage

#### **Refresh Token:**
- **Expires**: 7 days
- **Purpose**: Get new access token
- **Storage**: Database + localStorage

#### **Refresh Flow:**
```
Access Token Expires → 401 Error
  ↓
Frontend intercepts 401
  ↓
Sends refresh token to /auth/refresh
  ↓
Backend validates refresh token
  ↓
Returns new access token
  ↓
Retry original request
```

---

## 📱 Page-by-Page Navigation

### **Public Pages** (No Authentication Required)
| URL | Page | Who Can Access |
|-----|------|----------------|
| `/login` | Login Page | Everyone (redirects if logged in) |
| `/register` | Registration | Everyone (redirects if logged in) |

---

### **Customer Pages** (Authentication Required)
| URL | Page | Permissions | Purpose |
|-----|------|-------------|---------|
| `/dashboard` | Customer Dashboard | CUSTOMER, ADMIN | View account overview |
| `/accounts` | Accounts List | CUSTOMER, ADMIN | View all accounts |
| `/accounts/:id` | Account Details | CUSTOMER, ADMIN | View single account |
| `/accounts/create` | Create Account | CUSTOMER, ADMIN | Open new account |
| `/transfer` | Money Transfer | CUSTOMER, ADMIN | Send money |
| `/payments` | Payment History | CUSTOMER, ADMIN | View transactions |
| `/credit` | Credit Products | CUSTOMER, ADMIN | View credit options |
| `/credit/loan/apply` | Loan Application | CUSTOMER, ADMIN | Apply for loan/card |
| `/profile` | User Profile | CUSTOMER, ADMIN | View/edit profile |

---

### **Admin Pages** (Admin Only)
| URL | Page | Permissions | Purpose |
|-----|------|-------------|---------|
| `/admin` | Admin Dashboard | ADMIN only | System analytics |
| `/admin/users` | User Management | ADMIN only | Manage all users |

---

### **Error Pages**
| URL | Page | When Shown |
|-----|------|------------|
| `/forbidden` | 403 Forbidden | User lacks permission |
| `*` (any invalid) | 404 Not Found | Page doesn't exist |

---

## 🔄 Complete User Journey Examples

### **Example 1: New Customer Signs Up**
```
1. Visit http://localhost:3000
2. Click "Register here"
3. Fill form (username: john, email: john@email.com, role: CUSTOMER)
4. Click "Create Account"
5. Auto-redirected to /dashboard
6. See "No accounts yet" message
7. Click "Open Account"
8. Create SAVINGS account with $1000
9. Account created with status: PENDING
10. (Admin needs to approve → ACTIVE)
11. Once active, see balance on dashboard
```

### **Example 2: Admin Manages Users**
```
1. Register as ADMIN
2. Login → /dashboard
3. Click "Admin" in navbar
4. Click "User Management"
5. See list of all users
6. Click on a user
7. Change role from CUSTOMER to ADMIN
8. Click "Update"
9. User now has admin privileges
```

### **Example 3: Customer Transfers Money**
```
1. Login as customer
2. Dashboard shows 2 accounts:
   - Savings: $1000
   - Checking: $500
3. Click "Transfer Money"
4. Select "From: Savings"
5. Enter "To: [checking account number]"
6. Enter Amount: $200
7. Click "Transfer"
8. Payment created (PENDING)
9. Backend processes → COMPLETED
10. Balances updated:
    - Savings: $800
    - Checking: $700
```

---

## 🎯 Key Differences: Admin vs Customer

| Feature | Customer | Admin |
|---------|----------|-------|
| **Login/Register** | ✅ Yes | ✅ Yes |
| **View Own Dashboard** | ✅ Yes | ✅ Yes |
| **Create Bank Accounts** | ✅ Yes | ✅ Yes |
| **Transfer Money** | ✅ Yes | ✅ Yes |
| **Apply for Credit** | ✅ Yes | ✅ Yes |
| **View Own Profile** | ✅ Yes | ✅ Yes |
| **View ALL Users** | ❌ No | ✅ Yes |
| **Modify Other Users** | ❌ No | ✅ Yes |
| **Delete Users** | ❌ No | ✅ Yes |
| **Access Admin Dashboard** | ❌ No | ✅ Yes |
| **Approve/Reject Applications** | ❌ No | ✅ Yes |
| **View System Analytics** | ❌ No | ✅ Yes |

---

## 🛡️ Security Features

### **Route Protection**
```javascript
// RequireRole component checks:
<Route path="/admin" element={
  <RequireRole allowedRoles={['ADMIN']}>
    <AdminDashboard />
  </RequireRole>
} />
```

**If user tries to access /admin without ADMIN role:**
1. RequireRole checks user.role
2. Not in allowedRoles → Redirect to `/forbidden`

### **API Protection**
```java
// Backend validates every request:
1. Token present?
2. Token valid?
3. User has required role?
4. User owns the resource? (for non-admin)
```

### **Example: Customer trying to access another user's account**
```javascript
// Customer (ID: 1) tries: GET /accounts/customer/2
Backend checks:
- Token valid? ✅
- User authenticated? ✅
- User ID matches requested ID? ❌
→ 403 Forbidden
```

---

## 📊 Complete Flow Diagram

```
                    START
                      ↓
            ┌─────────────────┐
            │  Visit Website  │
            │ localhost:3000  │
            └────────┬────────┘
                     ↓
            ┌─────────────────┐
            │  Has Account?   │
            └────────┬────────┘
                     ↓
         ┌──────────┴──────────┐
         │                     │
    NO   │                     │  YES
         ↓                     ↓
  ┌─────────────┐      ┌─────────────┐
  │  REGISTER   │      │    LOGIN    │
  └──────┬──────┘      └──────┬──────┘
         │                    │
         │  Choose Role:      │
         │  - CUSTOMER        │
         │  - ADMIN           │
         │                    │
         └──────────┬─────────┘
                    ↓
         ┌──────────────────┐
         │   AUTO LOGIN      │
         │  Save JWT Token   │
         └─────────┬─────────┘
                   ↓
         ┌──────────────────┐
         │   DASHBOARD       │
         │  (All Users)      │
         └─────────┬─────────┘
                   ↓
         ┌─────────┴─────────┐
         │                   │
   CUSTOMER                ADMIN
         │                   │
         ↓                   ↓
   ┌──────────┐      ┌──────────────┐
   │ Banking  │      │ ALL Customer │
   │ Features │      │   Features   │
   │          │      │     +        │
   │ - Accts  │      │ Admin Panel  │
   │ - Trans  │      │ - Users Mgmt │
   │ - Credit │      │ - Analytics  │
   │ - Profile│      │ - Approvals  │
   └──────────┘      └──────────────┘
```

---

## 🚀 Quick Start Checklist

### **For Testing:**

✅ **Step 1**: Start backend services
```powershell
cd "D:\Wipro project\banking-microservices\Banking-microservices"
.\scripts\Start-Dev.ps1
```

✅ **Step 2**: Start frontend
```powershell
cd frontend
npm start
```

✅ **Step 3**: Create Admin Account
- Go to http://localhost:3000/register
- Username: `admin`
- Email: `admin@bank.com`
- Password: `admin123`
- Role: **Administrator Account**
- Click "Create Account"

✅ **Step 4**: Create Customer Account
- Logout (if logged in as admin)
- Register again with Role: **Customer Account**
- Or use admin panel to create customers

✅ **Step 5**: Test Features
- Create bank accounts
- Transfer money
- Apply for credit
- View payments

---

## 🎉 You're All Set!

The application is now fully functional with complete user flows for both Admin and Customer roles!

