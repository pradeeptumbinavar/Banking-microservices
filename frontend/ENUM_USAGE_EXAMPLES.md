# 📝 Enum Usage Examples - Frontend Implementation

## 🎯 How to Use Enums in Frontend

---

## 📦 **1. Import Enums**

```javascript
// Import specific enums
import { 
  AccountType, 
  AccountTypeOptions,
  AccountStatus,
  AccountStatusVariant,
  PaymentType,
  PaymentTypeOptions,
  getStatusVariant,
  getStatusDetails
} from '../constants/enums';

// Or import all
import ENUMS from '../constants/enums';
```

---

## 🎨 **2. Dropdown Components**

### **Example 1: Account Type Dropdown**

```jsx
import { AccountTypeOptions } from '../constants/enums';

const AccountForm = () => {
  const [formData, setFormData] = useState({
    accountType: ''
  });

  return (
    <Form.Group>
      <Form.Label>Account Type</Form.Label>
      <Form.Select 
        name="accountType"
        value={formData.accountType}
        onChange={handleChange}
        required
      >
        <option value="">Select Account Type</option>
        {AccountTypeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Form.Select>
      <Form.Text className="text-muted">
        {AccountTypeOptions.find(opt => opt.value === formData.accountType)?.description}
      </Form.Text>
    </Form.Group>
  );
};
```

### **Example 2: Payment Type Dropdown**

```jsx
import { PaymentTypeOptions } from '../constants/enums';

<Form.Group>
  <Form.Label>Payment Type</Form.Label>
  <Form.Select name="paymentType" defaultValue="TRANSFER">
    {PaymentTypeOptions.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Form.Select>
</Form.Group>
```

### **Example 3: Admin Status Update Dropdown**

```jsx
import { KYCStatusOptions } from '../constants/enums';

<Form.Group>
  <Form.Label>Update KYC Status</Form.Label>
  <Form.Select 
    name="kycStatus" 
    value={customer.kycStatus}
    onChange={handleStatusUpdate}
  >
    {KYCStatusOptions.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </Form.Select>
</Form.Group>
```

---

## 🎚️ **3. Radio Button Groups**

### **Example: Credit Product Type Selection**

```jsx
import { CreditProductType, CreditProductTypeOptions } from '../constants/enums';

const CreditApplicationForm = () => {
  const [productType, setProductType] = useState(CreditProductType.LOAN);

  return (
    <Form.Group>
      <Form.Label className="fw-semibold mb-3">Select Credit Product</Form.Label>
      {CreditProductTypeOptions.map(option => (
        <div key={option.value} className="mb-3">
          <Form.Check
            type="radio"
            name="productType"
            id={`productType-${option.value}`}
            value={option.value}
            checked={productType === option.value}
            onChange={(e) => setProductType(e.target.value)}
            label={
              <div>
                <div className="fw-semibold">{option.label}</div>
                <small className="text-muted">{option.description}</small>
              </div>
            }
          />
        </div>
      ))}
    </Form.Group>
  );
};
```

---

## 🏷️ **4. Status Badges**

### **Example 1: Simple Status Badge**

```jsx
import { AccountStatusVariant } from '../constants/enums';
import { Badge } from 'react-bootstrap';

const AccountStatusBadge = ({ status }) => (
  <Badge bg={AccountStatusVariant[status]}>
    {status}
  </Badge>
);

// Usage
<AccountStatusBadge status="ACTIVE" />
<AccountStatusBadge status="PENDING" />
```

### **Example 2: Status Badge with Icon**

```jsx
import { getStatusDetails } from '../constants/enums';
import { Badge } from 'react-bootstrap';

const StatusBadge = ({ status, type }) => {
  const details = getStatusDetails(status, type);
  
  return (
    <Badge bg={details.variant} className="d-flex align-items-center gap-1">
      <i className={`bi bi-${details.icon}`}></i>
      {details.label}
    </Badge>
  );
};

// Usage
<StatusBadge status="APPROVED" type="kyc" />
<StatusBadge status="COMPLETED" type="payment" />
<StatusBadge status="ACTIVE" type="account" />
```

### **Example 3: Reusable Status Badge Component**

```jsx
// src/components/common/StatusBadge.jsx
import React from 'react';
import { Badge } from 'react-bootstrap';
import { getStatusDetails } from '../../constants/enums';

const StatusBadge = ({ status, type, showIcon = true, size = 'md' }) => {
  const details = getStatusDetails(status, type);
  
  const sizeClasses = {
    sm: 'badge-sm',
    md: '',
    lg: 'badge-lg'
  };
  
  return (
    <Badge 
      bg={details.variant} 
      className={`${sizeClasses[size]} d-inline-flex align-items-center gap-1`}
    >
      {showIcon && <i className={`bi bi-${details.icon}`}></i>}
      <span>{details.label}</span>
    </Badge>
  );
};

export default StatusBadge;

// Usage across the app
import StatusBadge from './components/common/StatusBadge';

<StatusBadge status="PENDING" type="kyc" />
<StatusBadge status="ACTIVE" type="account" showIcon={false} />
<StatusBadge status="COMPLETED" type="payment" size="lg" />
```

---

## 📋 **5. Filtering with Enums**

### **Example: Filter Accounts by Type**

```jsx
import { AccountType, AccountTypeOptions } from '../constants/enums';

const AccountsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('ALL');
  
  const filteredAccounts = accounts.filter(account => 
    filter === 'ALL' || account.accountType === filter
  );
  
  return (
    <div>
      <div className="mb-4">
        <Form.Label>Filter by Account Type</Form.Label>
        <Form.Select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="ALL">All Accounts</option>
          {AccountTypeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      </div>
      
      {filteredAccounts.map(account => (
        <AccountCard key={account.id} account={account} />
      ))}
    </div>
  );
};
```

---

## ✅ **6. Form Validation with Enums**

### **Example: Validate Enum Values**

```jsx
import { isValidEnumValue, AccountType, PaymentType } from '../constants/enums';

const validateForm = (formData) => {
  const errors = {};
  
  // Validate account type
  if (!isValidEnumValue(formData.accountType, AccountType)) {
    errors.accountType = 'Invalid account type selected';
  }
  
  // Validate payment type
  if (!isValidEnumValue(formData.paymentType, PaymentType)) {
    errors.paymentType = 'Invalid payment type selected';
  }
  
  return errors;
};
```

---

## 🎯 **7. Conditional Rendering Based on Enum**

### **Example: Show Different Forms Based on Credit Type**

```jsx
import { CreditProductType } from '../constants/enums';

const CreditApplicationForm = () => {
  const [productType, setProductType] = useState(CreditProductType.LOAN);
  
  return (
    <div>
      {/* Radio buttons for product type selection */}
      
      {productType === CreditProductType.LOAN && (
        <div>
          <Form.Group>
            <Form.Label>Loan Amount</Form.Label>
            <Form.Control type="number" name="amount" />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Term (Months)</Form.Label>
            <Form.Control type="number" name="termMonths" />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Interest Rate (%)</Form.Label>
            <Form.Control type="number" step="0.01" name="interestRate" />
          </Form.Group>
        </div>
      )}
      
      {productType === CreditProductType.CREDIT_CARD && (
        <div>
          <Form.Group>
            <Form.Label>Credit Limit</Form.Label>
            <Form.Control type="number" name="creditLimit" />
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Interest Rate (%)</Form.Label>
            <Form.Control type="number" step="0.01" name="interestRate" />
          </Form.Group>
        </div>
      )}
    </div>
  );
};
```

---

## 🎨 **8. Card Variants Based on Status**

### **Example: Account Card with Status Styling**

```jsx
import { AccountStatusVariant } from '../constants/enums';
import { Card } from 'react-bootstrap';

const AccountCard = ({ account }) => {
  const borderColor = {
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    secondary: '#6c757d'
  };
  
  const variant = AccountStatusVariant[account.status];
  
  return (
    <Card 
      className="mb-3"
      style={{ 
        borderLeft: `4px solid ${borderColor[variant]}`,
        borderRadius: '0.75rem'
      }}
    >
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5>{account.accountType} Account</h5>
            <p className="text-muted mb-0">{account.accountNumber}</p>
          </div>
          <StatusBadge status={account.status} type="account" />
        </div>
        <div className="mt-3">
          <h3>${account.balance.toFixed(2)}</h3>
        </div>
      </Card.Body>
    </Card>
  );
};
```

---

## 🔍 **9. Search/Filter with Multiple Enums**

### **Example: Advanced Payment History Filter**

```jsx
import { 
  PaymentType, 
  PaymentStatus, 
  PaymentTypeOptions, 
  PaymentStatusOptions 
} from '../constants/enums';

const PaymentHistoryPage = () => {
  const [filters, setFilters] = useState({
    type: 'ALL',
    status: 'ALL',
    dateFrom: '',
    dateTo: ''
  });
  
  const [payments, setPayments] = useState([]);
  
  const filteredPayments = payments.filter(payment => {
    const typeMatch = filters.type === 'ALL' || payment.paymentType === filters.type;
    const statusMatch = filters.status === 'ALL' || payment.status === filters.status;
    return typeMatch && statusMatch;
  });
  
  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Payment Type</Form.Label>
                <Form.Select 
                  value={filters.type}
                  onChange={(e) => setFilters({...filters, type: e.target.value})}
                >
                  <option value="ALL">All Types</option>
                  {PaymentTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select 
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="ALL">All Statuses</option>
                  {PaymentStatusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      <div>
        {filteredPayments.map(payment => (
          <PaymentCard key={payment.id} payment={payment} />
        ))}
      </div>
    </div>
  );
};
```

---

## 🛠️ **10. Complete Form Example with Multiple Enums**

### **Example: Create Account Form**

```jsx
import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { AccountType, AccountTypeOptions } from '../constants/enums';
import api from '../services/api';

const CreateAccountForm = ({ customerId }) => {
  const [formData, setFormData] = useState({
    customerId: customerId,
    accountType: AccountType.SAVINGS,
    currency: 'USD',
    balance: 0
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/accounts', formData);
      console.log('Account created:', response.data);
      // Redirect or show success
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };
  
  const selectedAccountType = AccountTypeOptions.find(
    opt => opt.value === formData.accountType
  );
  
  return (
    <Card>
      <Card.Body>
        <h3 className="mb-4">Open New Account</h3>
        
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Account Type</Form.Label>
            <Form.Select 
              name="accountType"
              value={formData.accountType}
              onChange={handleChange}
              required
            >
              {AccountTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            {selectedAccountType && (
              <Form.Text className="text-muted">
                <i className={`bi bi-${selectedAccountType.icon} me-1`}></i>
                {selectedAccountType.description}
              </Form.Text>
            )}
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Currency</Form.Label>
            <Form.Select name="currency" value={formData.currency} onChange={handleChange}>
              <option value="USD">🇺🇸 USD - US Dollar</option>
              <option value="EUR">🇪🇺 EUR - Euro</option>
              <option value="GBP">🇬🇧 GBP - British Pound</option>
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Initial Deposit (Optional)</Form.Label>
            <Form.Control
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </Form.Group>
          
          <Button 
            variant="primary" 
            type="submit" 
            disabled={loading}
            className="w-100"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateAccountForm;
```

---

## 🎉 **Summary**

### **Key Takeaways**:
1. ✅ Always import enums from `constants/enums.js`
2. ✅ Use `*Options` arrays for dropdowns and radio buttons
3. ✅ Use `*Variant` objects for status badge colors
4. ✅ Use helper functions for dynamic status handling
5. ✅ Validate enum values before sending to backend
6. ✅ Create reusable components for common patterns

### **Next Steps**:
1. Update existing forms to use enum constants
2. Replace hardcoded status strings with enum values
3. Create shared StatusBadge component
4. Add enum validation to all forms
5. Update API calls to use enum constants

**All enum usage patterns documented and ready for implementation!** 🚀

