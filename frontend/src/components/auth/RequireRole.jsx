import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const RequireRole = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // CUSTOMER routing guard
  if (user?.role === 'CUSTOMER') {
    // If KYC is approved, allow access without further redirects
    if (user?.kycStatus === 'APPROVED') {
      return children;
    }
    if (!user?.customerId) {
      return <Navigate to="/onboarding/profile" replace />;
    }
    if (!user?.kycStatus) {
      return <Navigate to="/onboarding/kyc" replace />;
    }
    if (user?.kycStatus === 'REJECTED') {
      return <Navigate to="/onboarding/kyc?resubmit=1" replace />;
    }
    if (user?.kycStatus === 'PENDING') {
      return <Navigate to="/kyc-pending" replace />;
    }
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default RequireRole;

