/**
 * Backend Enums Constants
 * 
 * All enum values from backend microservices.
 * Use these constants in dropdowns, radio buttons, and status badges.
 * 
 * IMPORTANT: These values must match exactly with backend enum values (case-sensitive)
 */

// ==================== AUTH SERVICE ====================

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN'
};

export const UserRoleOptions = [
  { value: UserRole.CUSTOMER, label: '👤 Customer Account', description: 'Regular banking services' },
  { value: UserRole.ADMIN, label: '🛡️ Administrator Account', description: 'Full system access' }
];

// ==================== CUSTOMER SERVICE ====================

export const KYCStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED'
};

export const KYCStatusOptions = [
  { value: KYCStatus.PENDING, label: '⏳ Pending Approval', variant: 'warning', icon: 'hourglass-split' },
  { value: KYCStatus.APPROVED, label: '✅ Approved', variant: 'success', icon: 'check-circle' },
  { value: KYCStatus.REJECTED, label: '❌ Rejected', variant: 'danger', icon: 'x-circle' }
];

export const KYCStatusVariant = {
  [KYCStatus.PENDING]: 'warning',
  [KYCStatus.APPROVED]: 'success',
  [KYCStatus.REJECTED]: 'danger'
};

// KYC Document Types
export const KycDocumentType = {
  AADHAAR: 'AADHAAR',
  PAN: 'PAN'
};

export const KycDocumentTypeOptions = [
  { value: KycDocumentType.AADHAAR, label: 'AADHAAR' },
  { value: KycDocumentType.PAN, label: 'PAN' }
];

export const KycDocumentPlaceholders = {
  [KycDocumentType.AADHAAR]: '1234 XXXX XXXX',
  [KycDocumentType.PAN]: 'ABCDE1234F'
};

export const KycDocumentRegex = {
  // 12 digits, allow optional spaces: 1234 5678 9012
  [KycDocumentType.AADHAAR]: /^\d{4}\s?\d{4}\s?\d{4}$/,
  // 5 letters + 4 digits + 1 letter
  [KycDocumentType.PAN]: /^[A-Z]{5}[0-9]{4}[A-Z]$/
};

// ==================== ACCOUNT SERVICE ====================

export const AccountType = {
  SAVINGS: 'SAVINGS',
  CHECKING: 'CHECKING',
  BUSINESS: 'BUSINESS'
};

export const AccountTypeOptions = [
  { 
    value: AccountType.SAVINGS, 
    label: '💰 Savings Account', 
    description: 'Earn interest on your savings',
    icon: 'piggy-bank'
  },
  { 
    value: AccountType.CHECKING, 
    label: '💳 Checking Account', 
    description: 'Day-to-day transactions',
    icon: 'credit-card-2-front'
  },
  { 
    value: AccountType.BUSINESS, 
    label: '🏢 Business Account', 
    description: 'Business banking needs',
    icon: 'building'
  }
];

export const AccountStatus = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  CLOSED: 'CLOSED'
};

export const AccountStatusOptions = [
  { value: AccountStatus.PENDING, label: '⏳ Pending Approval', variant: 'warning', icon: 'hourglass-split' },
  { value: AccountStatus.ACTIVE, label: '✅ Active', variant: 'success', icon: 'check-circle-fill' },
  { value: AccountStatus.SUSPENDED, label: '⏸️ Suspended', variant: 'danger', icon: 'pause-circle' },
  { value: AccountStatus.CLOSED, label: '🚫 Closed', variant: 'secondary', icon: 'x-circle-fill' }
];

export const AccountStatusVariant = {
  [AccountStatus.PENDING]: 'warning',
  [AccountStatus.ACTIVE]: 'success',
  [AccountStatus.SUSPENDED]: 'danger',
  [AccountStatus.CLOSED]: 'secondary'
};

// ==================== CREDIT SERVICE ====================

export const CreditProductType = {
  LOAN: 'LOAN',
  CREDIT_CARD: 'CREDIT_CARD'
};

export const CreditProductTypeOptions = [
  { 
    value: CreditProductType.LOAN, 
    label: '💵 Personal Loan', 
    description: 'Fixed amount loan with repayment term',
    icon: 'cash-stack'
  },
  { 
    value: CreditProductType.CREDIT_CARD, 
    label: '💳 Credit Card', 
    description: 'Revolving credit line',
    icon: 'credit-card'
  }
];

export const CreditProductStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED'
};

export const CreditProductStatusOptions = [
  { value: CreditProductStatus.PENDING, label: '⏳ Pending Review', variant: 'warning', icon: 'hourglass-split' },
  { value: CreditProductStatus.APPROVED, label: '✅ Approved', variant: 'success', icon: 'check-circle' },
  { value: CreditProductStatus.REJECTED, label: '❌ Rejected', variant: 'danger', icon: 'x-circle' },
  { value: CreditProductStatus.ACTIVE, label: '⚡ Active', variant: 'success', icon: 'lightning-fill' },
  { value: CreditProductStatus.CLOSED, label: '🔒 Closed', variant: 'secondary', icon: 'lock-fill' }
];

export const CreditProductStatusVariant = {
  [CreditProductStatus.PENDING]: 'warning',
  [CreditProductStatus.APPROVED]: 'success',
  [CreditProductStatus.REJECTED]: 'danger',
  [CreditProductStatus.ACTIVE]: 'success',
  [CreditProductStatus.CLOSED]: 'secondary'
};

// ==================== PAYMENT SERVICE ====================

export const PaymentType = {
  TRANSFER: 'TRANSFER',
  BILL_PAYMENT: 'BILL_PAYMENT',
  WITHDRAWAL: 'WITHDRAWAL'
};

export const PaymentTypeOptions = [
  { 
    value: PaymentType.TRANSFER, 
    label: '🔄 Fund Transfer', 
    description: 'Transfer between accounts',
    icon: 'arrow-left-right'
  },
  { 
    value: PaymentType.BILL_PAYMENT, 
    label: '📄 Bill Payment', 
    description: 'Pay bills and utilities',
    icon: 'receipt'
  },
  { 
    value: PaymentType.WITHDRAWAL, 
    label: '💵 Cash Withdrawal', 
    description: 'Withdraw cash from account',
    icon: 'cash'
  }
];

export const PaymentStatus = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REJECTED: 'REJECTED'
};

export const PaymentStatusOptions = [
  { value: PaymentStatus.PENDING, label: '⏳ Processing', variant: 'warning', icon: 'hourglass-split' },
  { value: PaymentStatus.COMPLETED, label: '✅ Completed', variant: 'success', icon: 'check-circle-fill' },
  { value: PaymentStatus.FAILED, label: '❌ Failed', variant: 'danger', icon: 'exclamation-triangle' },
  { value: PaymentStatus.REJECTED, label: '🚫 Rejected', variant: 'danger', icon: 'x-circle' }
];

export const PaymentStatusVariant = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.COMPLETED]: 'success',
  [PaymentStatus.FAILED]: 'danger',
  [PaymentStatus.REJECTED]: 'danger'
};

// ==================== NOTIFICATION SERVICE ====================

export const NotificationType = {
  EMAIL: 'EMAIL',
  SMS: 'SMS',
  PUSH: 'PUSH'
};

export const NotificationTypeOptions = [
  { value: NotificationType.EMAIL, label: '📧 Email Notification', icon: 'envelope' },
  { value: NotificationType.SMS, label: '📱 SMS Notification', icon: 'phone' },
  { value: NotificationType.PUSH, label: '🔔 Push Notification', icon: 'bell' }
];

export const NotificationStatus = {
  PENDING: 'PENDING',
  SENT: 'SENT',
  FAILED: 'FAILED'
};

export const NotificationStatusOptions = [
  { value: NotificationStatus.PENDING, label: '⏳ Pending', variant: 'warning', icon: 'hourglass-split' },
  { value: NotificationStatus.SENT, label: '✅ Sent', variant: 'success', icon: 'check-circle' },
  { value: NotificationStatus.FAILED, label: '❌ Failed', variant: 'danger', icon: 'x-circle' }
];

export const NotificationStatusVariant = {
  [NotificationStatus.PENDING]: 'warning',
  [NotificationStatus.SENT]: 'success',
  [NotificationStatus.FAILED]: 'danger'
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get badge variant for a given status
 * @param {string} status - Status value (e.g., 'PENDING', 'APPROVED')
 * @param {string} type - Type of status ('kyc', 'account', 'credit', 'payment', 'notification')
 * @returns {string} Bootstrap variant ('success', 'warning', 'danger', 'secondary')
 */
export const getStatusVariant = (status, type) => {
  const variantMap = {
    kyc: KYCStatusVariant,
    account: AccountStatusVariant,
    credit: CreditProductStatusVariant,
    payment: PaymentStatusVariant,
    notification: NotificationStatusVariant
  };
  
  return variantMap[type]?.[status] || 'secondary';
};

/**
 * Get status option details
 * @param {string} status - Status value
 * @param {string} type - Type of status
 * @returns {Object} Status option with label, variant, icon
 */
export const getStatusDetails = (status, type) => {
  const optionsMap = {
    kyc: KYCStatusOptions,
    account: AccountStatusOptions,
    credit: CreditProductStatusOptions,
    payment: PaymentStatusOptions,
    notification: NotificationStatusOptions
  };
  
  const options = optionsMap[type];
  return options?.find(opt => opt.value === status) || { label: status, variant: 'secondary', icon: 'circle' };
};

/**
 * Validate enum value
 * @param {string} value - Value to validate
 * @param {Object} enumObject - Enum object (e.g., AccountType)
 * @returns {boolean} True if valid
 */
export const isValidEnumValue = (value, enumObject) => {
  return Object.values(enumObject).includes(value);
};

// ==================== EXPORT ALL ====================

export default {
  // Auth
  UserRole,
  UserRoleOptions,
  
  // Customer
  KYCStatus,
  KYCStatusOptions,
  KYCStatusVariant,
  
  // Account
  AccountType,
  AccountTypeOptions,
  AccountStatus,
  AccountStatusOptions,
  AccountStatusVariant,
  
  // Credit
  CreditProductType,
  CreditProductTypeOptions,
  CreditProductStatus,
  CreditProductStatusOptions,
  CreditProductStatusVariant,
  
  // Payment
  PaymentType,
  PaymentTypeOptions,
  PaymentStatus,
  PaymentStatusOptions,
  PaymentStatusVariant,
  
  // Notification
  NotificationType,
  NotificationTypeOptions,
  NotificationStatus,
  NotificationStatusOptions,
  NotificationStatusVariant,
  
  // Helpers
  getStatusVariant,
  getStatusDetails,
  isValidEnumValue
};

