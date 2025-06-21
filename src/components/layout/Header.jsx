import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, isAuthenticated } = useSelector(state => state.auth);
    const { items } = useSelector(state => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const getRoleBasedLinks = () => {
        if (!user) return [];

        switch (user.role) {
            case 'admin':
                return [
                    { to: '/admin/dashboard', label: 'Dashboard' },
                    { to: '/admin/products', label: 'Products' },
                    { to: '/admin/orders', label: 'Orders' },
                    { to: '/admin/users', label: 'Users' },
                    { to: '/admin/vendors', label: 'Vendors' },
                    { to: '/admin/analytics', label: 'Analytics' },
                    { to: '/admin/ai-assistant', label: 'AI Assistant' }
                ];
            case 'vendor':
                return [
                    { to: '/vendor/dashboard', label: 'Dashboard' },
                    { to: '/vendor/products', label: 'Products' },
                    { to: '/vendor/orders', label: 'Orders' },
                    { to: '/vendor/stats', label: 'Stats' },
                    { to: '/vendor/profile', label: 'Profile' }
                ];
            case 'customer':
                return [
                    { to: '/', label: 'Home' },
                    { to: '/products', label: 'Products' },
                    { to: '/orders', label: 'Orders' },
                    { to: '/profile', label: 'Profile' }
                ];
            default:
                return [];
        }
    };

    return (
        <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">V</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Vendora</span>
                    </Link>

                    {/* Navigation Links - Hidden on mobile */}
                    <nav className="hidden md:flex space-x-8">
                        {isAuthenticated && getRoleBasedLinks().map((link, index) => (
                            <Link
                                key={index}
                                to={link.to}
                                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'customer' && (
                                    <Link to="/cart" className="relative p-2 text-gray-700 hover:text-blue-600">
                                        <FiShoppingCart className="w-6 h-6" />
                                        {items.length > 0 && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {items.length}
                                            </span>
                                        )}
                                    </Link>
                                )}

                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                                        <FiUser className="w-5 h-5" />
                                        <span className="hidden sm:block">{user?.name}</span>
                                    </button>

                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                        <Link
                                            to={user?.role === 'admin' ? '/admin/profile' : user?.role === 'vendor' ? '/vendor/profile' : '/profile'}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 
