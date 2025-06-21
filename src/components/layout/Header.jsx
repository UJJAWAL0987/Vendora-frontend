import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import { toggleDarkMode, toggleSidebar } from '../../redux/slices/uiSlice';
import {
    FiShoppingCart,
    FiUser,
    FiLogOut,
    FiSun,
    FiMoon,
    FiMenu,
    FiSearch,
    FiBell
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated, user, role } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.ui);
    const { itemCount } = useSelector((state) => state.cart);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            dispatch(clearCart());
            localStorage.removeItem('cart');
            toast.success('Logged out successfully');
            navigate('/');
            setShowUserMenu(false);
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const handleDarkModeToggle = () => {
        dispatch(toggleDarkMode());
    };

    const handleSidebarToggle = () => {
        dispatch(toggleSidebar());
    };

    const getRoleBasedLinks = () => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'Dashboard', path: '/admin' },
                    { name: 'Users', path: '/admin/users' },
                    { name: 'Vendors', path: '/admin/vendors' },
                    { name: 'Products', path: '/admin/products' },
                    { name: 'Orders', path: '/admin/orders' },
                    { name: 'Analytics', path: '/admin/analytics' },
                    { name: 'AI Assistant', path: '/admin/ai-assistant' },
                ];
            case 'vendor':
                return [
                    { name: 'Dashboard', path: '/vendor' },
                    { name: 'Products', path: '/vendor/products' },
                    { name: 'Orders', path: '/vendor/orders' },
                    { name: 'Stats', path: '/vendor/stats' },
                    { name: 'Profile', path: '/vendor/profile' },
                ];
            case 'customer':
                return [
                    { name: 'Home', path: '/' },
                    { name: 'Products', path: '/products' },
                    { name: 'Orders', path: '/orders' },
                    { name: 'Profile', path: '/profile' },
                ];
            default:
                return [
                    { name: 'Home', path: '/' },
                    { name: 'Products', path: '/products' },
                ];
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 backdrop-blur-sm">
            <div className="container-responsive">
                <div className="flex items-center justify-between h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={handleSidebarToggle}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
                        >
                            <FiMenu className="h-5 w-5" />
                        </button>

                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg">
                                <span className="text-white font-bold text-sm">E</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                Ecommerce
                            </span>
                        </Link>
                    </div>

                    {/* Center - Navigation Links (Desktop) */}
                    {/* Removed for modern sidebar-only navigation */}

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <FiSearch className="h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="bg-transparent border-none outline-none text-sm text-gray-900 dark:text-white placeholder-gray-500 w-48"
                            />
                        </div>

                        {/* Dark mode toggle */}
                        <button
                            onClick={handleDarkModeToggle}
                            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            {darkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                        </button>

                        {/* Cart (for customers) */}
                        {role === 'customer' && (
                            <Link
                                to="/cart"
                                className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
                            >
                                <FiShoppingCart className="h-5 w-5" />
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-bounce">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center space-x-2 p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                        <span className="text-white text-sm font-medium">
                                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <span className="hidden md:block text-sm font-medium">
                                        {user?.name || 'User'}
                                    </span>
                                </button>

                                {/* Dropdown menu */}
                                {showUserMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50 backdrop-blur-sm">
                                        <div className="py-1">
                                            <Link
                                                to={role === 'customer' ? '/profile' : role === 'vendor' ? '/vendor/profile' : '/admin'}
                                                onClick={() => setShowUserMenu(false)}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FiUser className="h-4 w-4 mr-2" />
                                                Profile
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FiLogOut className="h-4 w-4 mr-2" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link
                                    to="/login"
                                    className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdown */}
            {showUserMenu && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowUserMenu(false)}
                />
            )}
        </header>
    );
};

export default Header; 
