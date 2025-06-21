import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from './redux/slices/authSlice';
import { loadCartFromStorage } from './redux/slices/cartSlice';
import { setDarkMode } from './redux/slices/uiSlice';

// Layout Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleRoute from './components/auth/RoleRoute';

// Customer Pages
import Home from './pages/customer/Home';
import Products from './pages/customer/Products';
import ProductDetail from './pages/customer/ProductDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import Orders from './pages/customer/Orders';
import OrderDetail from './pages/customer/OrderDetail';
import Profile from './pages/customer/Profile';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorProducts from './pages/vendor/Products';
import VendorOrders from './pages/vendor/Orders';
import VendorStats from './pages/vendor/Stats';
import VendorProfile from './pages/vendor/Profile';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminVendors from './pages/admin/Vendors';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminAnalytics from './pages/admin/Analytics';
import AIAssistant from './pages/admin/AIAssistant';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Error Pages
import NotFound from './pages/NotFound';

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.ui);
    const cart = useSelector((state) => state.cart);

    useEffect(() => {
        // Initialize dark mode
        const savedDarkMode = localStorage.getItem('darkMode') === 'true';
        dispatch(setDarkMode(savedDarkMode));

        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                dispatch(loadCartFromStorage(cartData));
            } catch (error) {
                console.error('Error loading cart from storage:', error);
            }
        }

        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (token && !isAuthenticated) {
            dispatch(getCurrentUser());
        }
    }, [dispatch, isAuthenticated]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className={`App ${darkMode ? 'dark' : ''}`}>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
                <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />

                {/* Customer Routes */}
                <Route path="/" element={
                    <Layout>
                        <Home />
                    </Layout>
                } />

                <Route path="/products" element={
                    <Layout>
                        <Products />
                    </Layout>
                } />

                <Route path="/product/:id" element={
                    <Layout>
                        <ProductDetail />
                    </Layout>
                } />

                {/* Protected Customer Routes */}
                <Route path="/cart" element={
                    <ProtectedRoute>
                        <Layout>
                            <Cart />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/checkout" element={
                    <ProtectedRoute>
                        <Layout>
                            <Checkout />
                        </Layout>
                    </ProtectedRoute>
                } />

                <Route path="/orders" element={
                    <RoleRoute allowedRoles={['customer']}>
                        <Layout>
                            <Orders />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/order/:id" element={
                    <RoleRoute allowedRoles={['customer']}>
                        <Layout>
                            <OrderDetail />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/profile" element={
                    <RoleRoute allowedRoles={['customer']}>
                        <Layout>
                            <Profile />
                        </Layout>
                    </RoleRoute>
                } />

                {/* Vendor Routes */}
                <Route path="/vendor" element={
                    <RoleRoute allowedRoles={['vendor']}>
                        <Layout>
                            <VendorDashboard />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/vendor/products" element={
                    <RoleRoute allowedRoles={['vendor']}>
                        <Layout>
                            <VendorProducts />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/vendor/orders" element={
                    <RoleRoute allowedRoles={['vendor']}>
                        <Layout>
                            <VendorOrders />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/vendor/stats" element={
                    <RoleRoute allowedRoles={['vendor']}>
                        <Layout>
                            <VendorStats />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/vendor/profile" element={
                    <RoleRoute allowedRoles={['vendor']}>
                        <Layout>
                            <VendorProfile />
                        </Layout>
                    </RoleRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminDashboard />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/users" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminUsers />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/vendors" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminVendors />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/products" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminProducts />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/orders" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminOrders />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/analytics" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AdminAnalytics />
                        </Layout>
                    </RoleRoute>
                } />

                <Route path="/admin/ai-assistant" element={
                    <RoleRoute allowedRoles={['admin']}>
                        <Layout>
                            <AIAssistant />
                        </Layout>
                    </RoleRoute>
                } />

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App; 
