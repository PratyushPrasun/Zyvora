import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Loader from '@/components/ui/Loader';
import MainLayout from '@/components/layout/MainLayout';
import AdminLayout from '@/components/layout/AdminLayout';
import DashboardLayout from '@/components/layout/DashboardLayout';
import ProtectedRoute from '@/components/routes/ProtectedRoute';
import AdminRoute from '@/components/routes/AdminRoute';
import GuestRoute from '@/components/routes/GuestRoute';

// Public Pages
const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetail = lazy(() => import('@/pages/ProductDetail'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));

// User Pages
const Profile = lazy(() => import('@/pages/user/Profile'));
const Orders = lazy(() => import('@/pages/user/Orders'));
const OrderDetail = lazy(() => import('@/pages/user/OrderDetail'));
const Addresses = lazy(() => import('@/pages/user/Addresses'));

// Cart & Checkout
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const PaymentStatus = lazy(() => import('@/pages/PaymentStatus'));

// Admin Pages
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminProducts = lazy(() => import('@/pages/admin/Products'));
const AddProduct = lazy(() => import('@/pages/admin/AddProduct'));
const EditProduct = lazy(() => import('@/pages/admin/EditProduct'));
const AdminOrders = lazy(() => import('@/pages/admin/Orders'));
const AuditLogs = lazy(() => import('@/pages/admin/AuditLogs'));

const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<Loader size="lg" />}>{children}</Suspense>
);

const AppRouter = () => {
  return (
    <SuspenseWrapper>
      <Routes>
        {/* Auth Pages (No Navbar/Footer) */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Main Layout */}
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment-status"
            element={
              <ProtectedRoute>
                <PaymentStatus />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* User Dashboard Layout */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="account" element={<Profile />} />
          <Route path="account/orders" element={<Orders />} />
          <Route path="account/orders/:id" element={<OrderDetail />} />
          <Route path="account/addresses" element={<Addresses />} />
        </Route>

        {/* Admin Layout */}
        <Route
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/products" element={<AdminProducts />} />
          <Route path="admin/products/new" element={<AddProduct />} />
          <Route path="admin/products/edit/:id" element={<EditProduct />} />
          <Route path="admin/orders" element={<AdminOrders />} />
          <Route path="admin/audit-logs" element={<AuditLogs />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </SuspenseWrapper>
  );
};

export default AppRouter;
