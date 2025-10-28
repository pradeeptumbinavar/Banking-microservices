# 🎯 Backend Enums Reference - Banking Microservices

## 📋 Complete List of All Enums Used in Backend

---

## 🔐 **AUTH SERVICE**

### **1. UserRole**
**File**: `auth-service/.../enums/UserRole.java`  
**Used In**: `users` table, `role` field

| Value | Display Name | Description | Access Level |
|-------|--------------|-------------|--------------|
| `CUSTOMER` | Customer Account | Regular banking user | Standard features |
| `ADMIN` | Administrator Account | System administrator | Full access + admin panel |

**Frontend Usage**:
- ❌ Registration form (removed as per requirements)
- ✅ Admin user management (role switching)
- ✅ Route protection (RequireRole)

**Dropdown Example**:
```jsx
<Form.Select name="role">
  <option value="CUSTOMER">👤 Customer Account</option>
  <option value="ADMIN">🛡️ Administrator Account</option>
</Form.Select>
```

---

## 👤 **CUSTOMER SERVICE**

### **2. KYCStatus**
**File**: `customer-service/.../enums/KYCStatus.java`  
**Used In**: `customers` table, `kycStatus` field

| Value | Display Name | Color | Icon | Description |
|-------|--------------|-------|------|-------------|
| `PENDING` | Pending Approval | ⚠️ Yellow/Warning | `bi-hourglass-split` | KYC documents submitted, awaiting review |
| `APPROVED` | Approved | ✅ Green/Success | `bi-check-circle` | KYC verified, full access granted |
| `REJECTED` | Rejected | ❌ Red/Danger | `bi-x-circle` | KYC verification failed |

**Frontend Usage**:
- ✅ KYC status badges (view only)
- ✅ Admin approval actions (dropdown)
- ✅ Routing logic (PENDING → /kyc-pending)

**Dropdown Example (Admin)**:
```jsx
<Form.Select name="kycStatus">
  <option value="PENDING">⏳ Pending Approval</option>
  <option value="APPROVED">✅ Approved</option>
  <option value="REJECTED">❌ Rejected</option>
</Form.Select>
```

**Status Badge Example**:
```jsx
const kycBadgeVariant = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger'
};

<Badge bg={kycBadgeVariant[status]}>{status}</Badge>
```

---

## 💳 **ACCOUNT SERVICE**

### **3. AccountType**
**File**: `account-service/.../enums/AccountType.java`  
**Used In**: `accounts` table, `accountType` field

| Value | Display Name | Icon | Description | Features |
|-------|--------------|------|-------------|----------|
| `SAVINGS` | Savings Account | 💰 `bi-piggy-bank` | Personal savings with interest | Interest earning, withdrawal limits |
| `CHECKING` | Checking Account | 💳 `bi-credit-card-2-front` | Day-to-day transactions | No withdrawal limits, lower interest |
| `BUSINESS` | Business Account | 🏢 `bi-building` | Business banking needs | Higher limits, business features |

**Frontend Usage**:
- ✅ Account creation form (dropdown - **REQUIRED**)
- ✅ Account list display (badges)
- ✅ Filtering accounts by type

**Dropdown Example**:
```jsx
<Form.Select name="accountType" required>
  <option value="">Select Account Type</option>
  <option value="SAVINGS">💰 Savings Account - Earn interest</option>
  <option value="CHECKING">💳 Checking Account - Daily transactions</option>
  <option value="BUSINESS">🏢 Business Account - Business needs</option>
</Form.Select>
```

### **4. AccountStatus**
**File**: `account-service/.../enums/AccountStatus.java`  
**Used In**: `accounts` table, `status` field

| Value | Display Name | Color | Icon | Description |
|-------|--------------|-------|------|-------------|
| `PENDING` | Pending Approval | ⚠️ Yellow | `bi-hourglass-split` | Account created, awaiting admin approval |
| `ACTIVE` | Active | ✅ Green | `bi-check-circle-fill` | Account approved and operational |
| `SUSPENDED` | Suspended | 🔴 Red | `bi-pause-circle` | Account temporarily disabled |
| `CLOSED` | Closed | ⚫ Gray | `bi-x-circle-fill` | Account permanently closed |

**Frontend Usage**:
- ✅ Account status badges (view only)
- ✅ Admin approval actions (dropdown)
- ✅ Account list filtering

**Dropdown Example (Admin)**:
```jsx
<Form.Select name="accountStatus">
  <option value="PENDING">⏳ Pending Approval</option>
  <option value="ACTIVE">✅ Active</option>
  <option value="SUSPENDED">⏸️ Suspended</option>
  <option value="CLOSED">🚫 Closed</option>
</Form.Select>
```

**Status Badge Variant**:
```jsx
const accountStatusVariant = {
  PENDING: 'warning',
  ACTIVE: 'success',
  SUSPENDED: 'danger',
  CLOSED: 'secondary'
};
```

---

## 💰 **CREDIT SERVICE**

### **5. CreditProductType**
**File**: `credit-service/.../enums/CreditProductType.java`  
**Used In**: `credit_products` table, `productType` field

| Value | Display Name | Icon | Description |
|-------|--------------|------|-------------|
| `LOAN` | Personal Loan | 💵 `bi-cash-stack` | Fixed amount loan with term |
| `CREDIT_CARD` | Credit Card | 💳 `bi-credit-card` | Revolving credit line |

**Frontend Usage**:
- ✅ Credit application form (radio buttons - **REQUIRED**)
- ✅ Credit products display
- ✅ Conditional form fields (loan shows term, card shows limit)

**Radio Button Example**:
```jsx
<Form.Check
  type="radio"
  name="productType"
  value="LOAN"
  label="💵 Personal Loan - Fixed amount with repayment term"
/>
<Form.Check
  type="radio"
  name="productType"
  value="CREDIT_CARD"
  label="💳 Credit Card - Revolving credit line"
/>
```

### **6. CreditProductStatus**
**File**: `credit-service/.../enums/CreditProductStatus.java`  
**Used In**: `credit_products` table, `status` field

| Value | Display Name | Color | Icon | Description |
|-------|--------------|-------|------|-------------|
| `PENDING` | Pending Review | ⚠️ Yellow | `bi-hourglass-split` | Application submitted, under review |
| `APPROVED` | Approved | ✅ Green | `bi-check-circle` | Application approved, not yet active |
| `REJECTED` | Rejected | ❌ Red | `bi-x-circle` | Application denied |
| `ACTIVE` | Active | 💚 Success | `bi-lightning-fill` | Credit product is active |
| `CLOSED` | Closed | ⚫ Gray | `bi-lock-fill` | Credit product closed |

**Frontend Usage**:
- ✅ Credit status badges
- ✅ Admin approval actions
- ✅ Credit product list filtering

**Dropdown Example (Admin)**:
```jsx
<Form.Select name="creditStatus">
  <option value="PENDING">⏳ Pending Review</option>
  <option value="APPROVED">✅ Approved</option>
  <option value="REJECTED">❌ Rejected</option>
  <option value="ACTIVE">⚡ Active</option>
  <option value="CLOSED">🔒 Closed</option>
</Form.Select>
```

---

## 💸 **PAYMENT SERVICE**

### **7. PaymentType**
**File**: `payment-service/.../enums/PaymentType.java`  
**Used In**: `payments` table, `paymentType` field

| Value | Display Name | Icon | Description |
|-------|--------------|------|-------------|
| `TRANSFER` | Fund Transfer | 🔄 `bi-arrow-left-right` | Transfer between accounts |
| `BILL_PAYMENT` | Bill Payment | 📄 `bi-receipt` | Pay bills/utilities |
| `WITHDRAWAL` | Cash Withdrawal | 💵 `bi-cash` | Withdraw cash from account |

**Frontend Usage**:
- ✅ Transfer form (auto-set to TRANSFER)
- ✅ Payment type selector (dropdown)
- ✅ Payment history filtering

**Dropdown Example**:
```jsx
<Form.Select name="paymentType">
  <option value="TRANSFER">🔄 Fund Transfer</option>
  <option value="BILL_PAYMENT">📄 Bill Payment</option>
  <option value="WITHDRAWAL">💵 Cash Withdrawal</option>
</Form.Select>
```

### **8. PaymentStatus**
**File**: `payment-service/.../enums/PaymentStatus.java`  
**Used In**: `payments` table, `status` field

| Value | Display Name | Color | Icon | Description |
|-------|--------------|-------|------|-------------|
| `PENDING` | Processing | ⚠️ Yellow | `bi-hourglass-split` | Payment initiated, processing |
| `COMPLETED` | Completed | ✅ Green | `bi-check-circle-fill` | Payment successful |
| `FAILED` | Failed | ❌ Red | `bi-exclamation-triangle` | Payment failed |
| `REJECTED` | Rejected | 🔴 Danger | `bi-x-circle` | Payment rejected by admin |

**Frontend Usage**:
- ✅ Payment status badges
- ✅ Payment history display
- ✅ Status filtering

**Status Badge Example**:
```jsx
const paymentStatusVariant = {
  PENDING: 'warning',
  COMPLETED: 'success',
  FAILED: 'danger',
  REJECTED: 'danger'
};

const paymentStatusIcon = {
  PENDING: 'hourglass-split',
  COMPLETED: 'check-circle-fill',
  FAILED: 'exclamation-triangle',
  REJECTED: 'x-circle'
};
```

---

## 🔔 **NOTIFICATION SERVICE**

### **9. NotificationType**
**File**: `notification-service/.../enums/NotificationType.java`  
**Used In**: `notifications` table, `type` field

| Value | Display Name | Icon | Description |
|-------|--------------|------|-------------|
| `EMAIL` | Email Notification | 📧 `bi-envelope` | Send via email |
| `SMS` | SMS Notification | 📱 `bi-phone` | Send via SMS |
| `PUSH` | Push Notification | 🔔 `bi-bell` | In-app push notification |

**Frontend Usage**:
- ✅ Notification preferences (checkboxes)
- ✅ Notification type badges
- ⚠️ Currently not implemented in frontend

**Checkbox Example**:
```jsx
<Form.Check
  type="checkbox"
  name="emailNotifications"
  label="📧 Email Notifications"
/>
<Form.Check
  type="checkbox"
  name="smsNotifications"
  label="📱 SMS Notifications"
/>
<Form.Check
  type="checkbox"
  name="pushNotifications"
  label="🔔 Push Notifications"
/>
```

### **10. NotificationStatus**
**File**: `notification-service/.../enums/NotificationStatus.java`  
**Used In**: `notifications` table, `status` field

| Value | Display Name | Color | Icon | Description |
|-------|--------------|-------|------|-------------|
| `PENDING` | Pending | ⚠️ Yellow | `bi-hourglass-split` | Queued for sending |
| `SENT` | Sent | ✅ Green | `bi-check-circle` | Successfully sent |
| `FAILED` | Failed | ❌ Red | `bi-x-circle` | Delivery failed |

**Frontend Usage**:
- ✅ Notification status display
- ⚠️ Currently not implemented in frontend

---

## 📊 **Summary Table**

| Service | Enum Name | Values Count | Frontend Usage |
|---------|-----------|--------------|----------------|
| Auth | UserRole | 2 | Admin only |
| Customer | KYCStatus | 3 | View + Admin |
| Account | AccountType | 3 | ✅ **Dropdown** |
| Account | AccountStatus | 4 | View + Admin |
| Credit | CreditProductType | 2 | ✅ **Radio** |
| Credit | CreditProductStatus | 5 | View + Admin |
| Payment | PaymentType | 3 | ✅ **Dropdown** |
| Payment | PaymentStatus | 4 | View only |
| Notification | NotificationType | 3 | Not implemented |
| Notification | NotificationStatus | 3 | Not implemented |

**Total Enums**: 10  
**Total Enum Values**: 32

---

## 🎨 **Frontend Implementation Priority**

### **CRITICAL (User Input Required)**
1. ✅ **AccountType** - Required in account creation form
2. ✅ **CreditProductType** - Required in credit application
3. ✅ **PaymentType** - Required in payment forms

### **HIGH (Admin Actions)**
4. ✅ **KYCStatus** - Admin approval dropdown
5. ✅ **AccountStatus** - Admin approval dropdown
6. ✅ **CreditProductStatus** - Admin approval dropdown

### **MEDIUM (Display Only)**
7. ✅ **PaymentStatus** - Status badges in payment history
8. ✅ **UserRole** - User management

### **LOW (Future Features)**
9. ⏳ **NotificationType** - Notification preferences
10. ⏳ **NotificationStatus** - Notification center

---

## 🛠️ **Next Steps**

1. Create JavaScript constants file with all enum values
2. Create reusable dropdown components
3. Create status badge component with color mapping
4. Add enum validation in forms
5. Update API integration to use enum constants

---

**All backend enums documented and ready for frontend integration!** 🎉

