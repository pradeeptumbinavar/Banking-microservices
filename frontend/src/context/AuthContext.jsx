import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: true, 
        user: action.payload.user,
        token: action.payload.token 
      };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { 
        ...state, 
        isAuthenticated: false, 
        user: null, 
        token: null 
      };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem('authToken');
      const userStr = localStorage.getItem('user');

      if (!token || !userStr || userStr === 'undefined') {
        return; // not logged in
      }

      try {
        const user = JSON.parse(userStr);
        // Optimistically set state for immediate UI, then validate
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });

        // Validate token with backend; if invalid, clear and force logout
        await authService.validateToken();

        // Ensure we have fresh customer profile; if APPROVED, keep it and skip onboarding later
        if (user.role === 'CUSTOMER') {
          try {
            const customers = await authService.getCustomerByUserId(user.id, user.email);
            const data = Array.isArray(customers) ? customers[0] : customers;
            if (data) {
              updateUser({ customerId: data.id, kycStatus: data.kycStatus });
            }
          } catch (_) { /* ignore */ }
        }
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      }
    };
    bootstrap();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.login(credentials);
      
      // Backend returns: { accessToken, id, username, email, role, ... }
      const token = response.accessToken || response.token;
      const userId = response.id || response.userId;
      
      // Store token for API calls
      localStorage.setItem('authToken', token);
      
      // Fetch customer profile to get KYC status (for CUSTOMER role only)
      let customerData = null;
      let kycStatus = 'APPROVED'; // Default for ADMIN

      if (response.role === 'CUSTOMER') {
        try {
          // Get customer by userId (API returns a single object)
          const customerResp = await authService.getCustomerByUserId(userId, response.email);
          if (customerResp) {
            customerData = customerResp;
            kycStatus = customerResp.kycStatus || 'PENDING';
          } else {
            kycStatus = null; // no profile -> onboarding
          }
        } catch (err) {
          console.warn('Could not fetch customer data:', err);
          kycStatus = null; // ensure onboarding
        }
      }
      
      const user = {
        id: userId,
        username: response.username,
        email: response.email,
        role: response.role,
        customerId: customerData?.id,
        kycStatus: kycStatus
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: { token, user }
      });
      
      toast.success('Login successful!');
      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authService.register(userData);
      const token = response.accessToken || response.token;
      const userId = response.id || response.userId;

      // Persist token and a minimal user; onboarding will complete profile
      localStorage.setItem('authToken', token);
      const user = {
        id: userId,
        username: response.username,
        email: response.email,
        role: response.role,
        customerId: null,
        kycStatus: null
      };
      localStorage.setItem('user', JSON.stringify(user));

      if (token) {
        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, user } });
      } else {
        dispatch({ type: 'LOGIN_START' });
      }
      toast.success('Registration successful!');

      // Return full response so caller can handle MFA QR code when present
      return { success: true, user, ...response };
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      dispatch({
        type: 'LOGIN_ERROR',
        payload: errorMessage
      });
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      toast.info('Logged out successfully');
    }
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Keep customer profile fresh in local storage after signin/reload
  useEffect(() => {
    const syncCustomer = async () => {
      if (!state.isAuthenticated || state.user?.role !== 'CUSTOMER') return;
      try {
        const userId = state.user?.id;
        if (!userId) return;
        const resp = await authService.getCustomerByUserId(userId, state.user?.email);
        const data = Array.isArray(resp) ? resp[0] : resp;
        if (data && (state.user?.customerId !== data.id || state.user?.kycStatus !== data.kycStatus)) {
          updateUser({ customerId: data.id, kycStatus: data.kycStatus });
        }
      } catch (_) {
        // ignore fetch errors; onboarding flow will handle absence
      }
    };
    syncCustomer();
  }, [state.isAuthenticated, state.user?.role]);

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    dispatch
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

