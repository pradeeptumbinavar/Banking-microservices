# 🚀 Quick Reference Guide

## ✅ What's Been Implemented

### 1. **Customer-Only Registration**
- No admin option in registration form
- All registrations create CUSTOMER role
- Admin accounts created manually

### 2. **Auto Customer Profile Creation**
- After signup, customer profile auto-created
- Uses `POST /customers` endpoint
- Stores customerId and kycStatus in user object

### 3. **KYC Approval Gate**
- New page: `/kyc-pending`
- Customers with PENDING KYC cannot access dashboard
- Admins bypass KYC check
- After admin approves KYC, customer can access dashboard

### 4. **Navbar with Logout**
- Already implemented
- Shows on all authenticated pages
- User dropdown with Profile & Logout

### 5. **MFA Components** (Not fully integrated yet)
- `MFASetup.jsx` - Shows QR code
- `MFAInput.jsx` - 6-digit code entry
- Ready to integrate when needed

---

## 🔄 Current User Flow

### **New Customer Registration**:
```
Register (no role selection)
  ↓
Signup (role = CUSTOMER)
  ↓
Create Customer Profile
  ↓
Check KYC Status (PENDING)
  ↓
Redirect to /kyc-pending
  ↓
Show "KYC Approval Pending" message
  ↓
Only logout available
```

### **After KYC Approval**:
```
Login
  ↓
Fetch Customer Profile
  ↓
Check KYC Status (APPROVED)
  ↓
Redirect to /dashboard
  ↓
Full banking features available
```

### **Admin Login**:
```
Login
  ↓
Role = ADMIN
  ↓
Skip KYC check
  ↓
Direct to /dashboard
  ↓
All features + Admin panel
```

---

## 🛠️ Backend Changes

### **Customer Service**

#### **New Endpoint**:
```java
@GetMapping("/user/{userId}")
public ResponseEntity<CustomerResponse> getCustomerByUserId(@PathVariable("userId") Long userId)
```

#### **New Service Method**:
```java
public CustomerResponse getCustomerByUserId(Long userId)
```

**Rebuild & Restart**:
```bash
cd services/customer-service
mvn clean package -DskipTests
mvn spring-boot:run
```

---

## 📝 User Object Structure

### **After Registration/Login**:
```javascript
{
  id: 11,                    // User ID
  username: "john",
  email: "john@test.com",
  role: "CUSTOMER",          // or "ADMIN"
  customerId: 5,             // Customer profile ID
  kycStatus: "PENDING"       // or "APPROVED", "REJECTED"
}
```

---

## 🧪 Testing Steps

### **1. Clear Storage**
```javascript
localStorage.clear();
location.reload();
```

### **2. Register New Customer**
- Go to `/register`
- Fill form (NO role selection visible)
- Submit

**Expected**:
- ✅ Redirected to `/kyc-pending`
- ✅ Message: "KYC Approval Pending"
- ✅ Only logout button available

### **3. Approve KYC (as Admin)**

**Option A - Direct Database**:
```sql
UPDATE customers 
SET kycStatus = 'APPROVED' 
WHERE userId = 11;
```

**Option B - Via API (Admin)**:
```bash
PATCH /customers/{customerId}/status
Body: { "status": "APPROVED" }
```

### **4. Login Again**
- Logout from KYC pending page
- Login with same credentials

**Expected**:
- ✅ Redirected to `/dashboard`
- ✅ Full access to all features
- ✅ Can create accounts, transfer money, etc.

---

## 🎯 Admin Creation (Manual)

### **Option 1: Direct Database**:
```sql
INSERT INTO users (username, email, password, role, enabled, account_non_locked, created_at, updated_at)
VALUES (
  'admin', 
  'admin@bank.com', 
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5gyFUHBla', -- BCrypt for 'admin123'
  'ADMIN', 
  1, 
  1, 
  NOW(), 
  NOW()
);
```

### **Option 2: Via Postman**:
```
POST http://localhost:8080/auth/signup
{
  "username": "admin",
  "email": "admin@bank.com",
  "password": "admin123",
  "role": "ADMIN"
}
```

Then manually update role in database:
```sql
UPDATE users SET role = 'ADMIN' WHERE username = 'admin';
```

---

## 🐛 Troubleshooting

### **Issue: "user.id is undefined"**
**Fix**: Clear localStorage and register again
```javascript
localStorage.clear();
location.reload();
```

### **Issue: "Cannot access dashboard"**
**Check**: KYC status
```javascript
// In browser console:
console.log(JSON.parse(localStorage.getItem('user')));
// Should show kycStatus
```

### **Issue: "Customer not found"**
**Cause**: Customer profile not created
**Fix**: Check backend logs, ensure Customer Service is running

### **Issue: "405 Method Not Allowed"**
**Cause**: Endpoint doesn't exist
**Fix**: Rebuild Customer Service with new endpoint

---

## 📊 Files Modified Summary

### **Frontend**:
1. `src/context/AuthContext.jsx` - Auto customer creation, KYC check
2. `src/services/authService.js` - New methods
3. `src/pages/auth/Register.jsx` - Removed role selection, KYC routing
4. `src/pages/auth/Login.jsx` - KYC check on login
5. `src/components/auth/RequireRole.jsx` - KYC gate
6. `src/App.jsx` - KYC pending route
7. `src/pages/common/KYCPendingPage.jsx` - NEW
8. `src/components/auth/MFASetup.jsx` - NEW
9. `src/components/auth/MFAInput.jsx` - NEW
10. `src/pages/dashboard/CustomerDashboard.jsx` - Fixed API call
11. `src/pages/accounts/AccountsPage.jsx` - Fixed API call
12. `src/pages/payments/TransferPage.jsx` - Fixed API call

### **Backend**:
1. `services/customer-service/src/main/java/com/banking/customer/controller/CustomerController.java`
2. `services/customer-service/src/main/java/com/banking/customer/service/CustomerService.java`
3. `services/auth-service/src/main/java/com/banking/auth_service/controller/AuthController.java`
4. `services/auth-service/src/main/java/com/banking/auth_service/config/SecurityConfig.java`
5. `infra/api-gateway/src/main/java/com/banking/gateway/config/CorsConfig.java`
6. `infra/api-gateway/src/main/java/com/banking/gateway/config/SecurityConfig.java`

---

## ✅ Ready to Test!

**Restart Backend**:
```bash
# Customer Service (REQUIRED)
cd services/customer-service
mvn spring-boot:run

# Auth Service (if changed)
cd services/auth-service  
mvn spring-boot:run

# API Gateway (if changed)
cd infra/api-gateway
mvn spring-boot:run
```

**Frontend** (already running with hot reload):
- Changes are live automatically
- No restart needed

**Clear browser storage and test registration flow!** 🎉

