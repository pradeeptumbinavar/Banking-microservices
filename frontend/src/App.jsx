import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import Navbar from './components/common/Navbar';
import Background from './components/common/Background';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import MfaSetup from './pages/auth/MfaSetup';

// Customer Pages
import CustomerDashboard from './pages/dashboard/CustomerDashboard';
import AccountsPage from './pages/accounts/AccountsPage';
import AccountDetailsPage from './pages/accounts/AccountDetailsPage';
import CreateAccountPage from './pages/accounts/CreateAccountPage';
import PaymentsPage from './pages/payments/PaymentsPage';
import TransactionsPage from './pages/payments/TransactionsPage';
import CreditProductsPage from './pages/credit/CreditProductsPage';
import CreditCardGalleryPage from './pages/credit/CreditCardGalleryPage';
import LoanApplicationPage from './pages/credit/LoanApplicationPage';
import ProfilePage from './pages/profile/ProfilePage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagementPage from './pages/admin/UserManagementPage';

// Common Pages
import NotFound from './pages/common/NotFound';
import Forbidden from './pages/common/Forbidden';
import KYCPendingPage from './pages/common/KYCPendingPage';
import OnboardingProfilePage from './pages/onboarding/OnboardingProfilePage';
import OnboardingKycPage from './pages/onboarding/OnboardingKycPage';
import LandingPage from './pages/landing/LandingPage';

// Protected Route Component
import RequireRole from './components/auth/RequireRole';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Background src="/assets/images/bg-banks2.jpg" />
      <Navbar />
      <main className="content-offset">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/mfa-setup" element={isAuthenticated ? <MfaSetup /> : <Navigate to="/login" />} />
        
        {/* KYC Pending Route - Authenticated but not approved */}
        <Route path="/kyc-pending" element={isAuthenticated ? <KYCPendingPage /> : <Navigate to="/login" />} />

        {/* Onboarding Routes */}
        <Route path="/onboarding/profile" element={isAuthenticated ? <OnboardingProfilePage /> : <Navigate to="/login" />} />
        <Route path="/onboarding/kyc" element={isAuthenticated ? <OnboardingKycPage /> : <Navigate to="/login" />} />

        {/* Customer Protected Routes */}
        <Route path="/dashboard" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CustomerDashboard />
          </RequireRole>
        } />

        <Route path="/accounts" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <AccountsPage />
          </RequireRole>
        } />

        <Route path="/accounts/:id" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <AccountDetailsPage />
          </RequireRole>
        } />

        <Route path="/accounts/create" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CreateAccountPage />
          </RequireRole>
        } />

        <Route path="/transfer" element={<Navigate to="/payments" replace />} />

        <Route path="/payments" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <PaymentsPage />
          </RequireRole>
        } />

        <Route path="/transactions" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <TransactionsPage />
          </RequireRole>
        } />

        <Route path="/credit" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CreditProductsPage />
          </RequireRole>
        } />
        <Route path="/credit/cards" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <CreditCardGalleryPage />
          </RequireRole>
        } />

        <Route path="/credit/loan/apply" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <LoanApplicationPage />
          </RequireRole>
        } />

        <Route path="/profile" element={
          <RequireRole allowedRoles={['CUSTOMER', 'ADMIN']}>
            <ProfilePage />
          </RequireRole>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin" element={
          <RequireRole allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </RequireRole>
        } />

        <Route path="/admin/users" element={
          <RequireRole allowedRoles={['ADMIN']}>
            <UserManagementPage />
          </RequireRole>
        } />

        {/* Error Routes */}
        <Route path="/forbidden" element={<Forbidden />} />
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </main>
    </>
  );
};

export default App;
