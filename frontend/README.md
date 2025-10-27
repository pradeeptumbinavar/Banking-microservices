# 🏦 Banking Portal - Frontend

Modern, spacious React-based frontend for the Banking Microservices application.

## ✨ Features

### **Modern UI Design**
- ✅ Spacious, minimal layout (2-3x more padding)
- ✅ Gradient backgrounds and modern color palette
- ✅ Smooth animations and hover effects
- ✅ Card-based design system
- ✅ Responsive mobile-first approach

### **Authentication**
- ✅ JWT-based authentication
- ✅ Role-based access (Customer/Admin)
- ✅ Auto token refresh
- ✅ Secure password handling

### **Customer Features**
- ✅ Modern dashboard with stats cards
- ✅ Account management
- ✅ Money transfers
- ✅ Payment history
- ✅ Credit applications
- ✅ Profile management

### **Admin Features**
- ✅ User management
- ✅ Approval system (KYC, accounts, credits, payments)
- ✅ System dashboard
- ✅ Bulk operations

---

## 🚀 Quick Start

### **1. Install Dependencies**
```bash
npm install
```

### **2. Start Development Server**
```bash
npm start
```

App opens at `http://localhost:3000`

### **3. First Time Setup**
1. Click "Register here"
2. Fill in details
3. Choose role:
   - 👤 **Customer Account** - Regular banking
   - 🛡️ **Administrator Account** - Full access

---

## 🎨 Design System

### **Color Palette**
- **Primary**: Indigo (#4F46E5)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Warning**: Orange (#F59E0B)
- **Info**: Blue (#3B82F6)

### **Spacing Scale**
- **xs**: 0.5rem | **sm**: 0.75rem | **md**: 1rem
- **lg**: 1.5rem | **xl**: 2rem | **2xl**: 3rem | **3xl**: 4rem

### **Border Radius**
- **Cards**: 1.5rem (24px)
- **Inputs**: 0.75rem (12px)
- **Badges**: 9999px (pill shape)

---

## 📦 Tech Stack

- **React** 18.2.0 + React Router 6.26.2
- **Bootstrap** 5.3.3 + React Bootstrap
- **Axios** 1.7.2 (API calls)
- **React Query** 3.39.3 (data fetching)
- **React Toastify** 9.1.3 (notifications)
- **Webpack** 5.94.0 (bundler)

---

## 📁 Project Structure

```
src/
├── components/       # Reusable components
├── pages/           # Page components
│   ├── auth/        # Login, Register
│   ├── dashboard/   # Customer Dashboard
│   ├── accounts/    # Account management
│   ├── payments/    # Transfers, History
│   ├── credit/      # Credit applications
│   ├── admin/       # Admin panel
│   └── profile/     # User profile
├── services/
│   ├── api.js              # Axios instance
│   ├── apiEndpoints.js     # All 52 endpoints
│   └── *Service.js         # Service APIs
├── context/         # React Context
├── styles/          # Global CSS
└── App.jsx
```

---

## 🔌 API Integration

All **52 endpoints** configured in `src/services/apiEndpoints.js`:

| Service | Port | Endpoints | Gateway Route |
|---------|------|-----------|---------------|
| Auth | 8081 | 11 | `/auth/**` |
| Customer | 8082 | 9 | `/customers/**` |
| Account | 8083 | 8 | `/accounts/**` |
| Credit | 8084 | 7 | `/credits/**` |
| Payment | 8085 | 7 | `/payments/**` |
| Notification | 8086 | 2 | `/notifications/**` |
| Admin | 8087 | 8 | `/admin/**` |

**All requests go through API Gateway**: `http://localhost:8080`

### **Example Usage:**
```javascript
import API_ENDPOINTS from '../services/apiEndpoints';
import api from '../services/api';

// Get accounts
const accounts = await api.get(API_ENDPOINTS.ACCOUNTS.BY_USER(userId));

// Transfer money
await api.post(API_ENDPOINTS.PAYMENTS.TRANSFER, {
  fromAccountId: 1,
  toAccountId: 2,
  amount: 100.00
});
```

---

## 🛣️ Routes

### **Public (No Auth)**
- `/login` - Login page
- `/register` - Registration

### **Customer/Admin**
- `/dashboard` - Dashboard
- `/accounts` - Accounts
- `/transfer` - Money transfer
- `/payments` - Payment history
- `/credit` - Credit products
- `/profile` - User profile

### **Admin Only**
- `/admin` - Admin dashboard
- `/admin/users` - User management

---

## 🎯 User Flows

### **Register & Login**
1. Go to `/register`
2. Fill form → Choose role (Customer/Admin)
3. Auto-login → Dashboard

### **Transfer Money**
1. Dashboard → "Transfer Money"
2. Select from/to accounts
3. Enter amount → Submit
4. View in payment history

### **Admin Approvals**
1. Login as Admin
2. Admin → Approvals
3. Review pending items
4. Approve/Reject

---

## 🎨 Customization

Edit `src/styles/globals.css`:

```css
/* Change colors */
--primary-color: #4F46E5;  /* Your brand color */

/* Adjust spacing */
--spacing-xl: 2rem;

/* Border radius */
--radius-2xl: 1.5rem;
```

---

## 🔧 Scripts

- **`npm start`** - Dev server (port 3000)
- **`npm run build`** - Production build
- **`npm run lint`** - ESLint

---

## 🐛 Troubleshooting

### **White Page**
- Check browser console (F12)
- Ensure backend running (port 8080)
- Hard refresh: `Ctrl + Shift + R`

### **Port in Use**
```bash
npx kill-port 3000
```

### **API Connection Failed**
- Start backend first
- Verify API Gateway on port 8080

### **Module Errors**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📱 Responsive

- **Mobile**: < 576px
- **Tablet**: 768px
- **Laptop**: 1024px
- **Desktop**: 1280px

---

## 🔒 Security

- JWT authentication
- Role-based access
- Auto token refresh
- Protected routes
- XSS/CSRF protection

---

## 📖 Additional Documentation

- **`API_INTEGRATION_GUIDE.md`** - Complete API reference with examples
- **`USER_FLOW_GUIDE.md`** - Detailed user journeys and flows

---

## 🎉 What's New

### **UI Revamp**
- ✨ 2-3x more spacious
- ✨ Modern gradients
- ✨ Card-based dashboard
- ✨ Smooth animations

### **API Integration**
- ✨ All 52 endpoints
- ✨ Centralized config
- ✨ Full documentation

---

## 💡 Pro Tips

1. Use `API_ENDPOINTS` for all API calls
2. Check browser console for errors
3. Test with both Customer & Admin roles
4. Start backend before frontend
5. Hard refresh after code changes

---

**🏦 Modern Banking Portal - Ready to Use!**
