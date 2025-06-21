import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { closeSidebar } from '../../redux/slices/uiSlice';
import { logout } from '../../redux/slices/authSlice';
import { clearCart } from '../../redux/slices/cartSlice';
import toast from 'react-hot-toast';
import {
  FiHome,
  FiShoppingBag,
  FiPackage,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiTruck,
  FiMessageSquare,
  FiX,
  FiLogOut,
  FiUser,
  FiShield
} from 'react-icons/fi';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const { role, user } = useSelector((state) => state.auth);
  const [hovered, setHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      dispatch(clearCart());
      localStorage.removeItem('cart');
      toast.success('Logged out successfully');
      navigate('/');
      dispatch(closeSidebar());
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const getNavigationItems = () => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/admin', icon: FiHome, badge: null },
          { name: 'Users', path: '/admin/users', icon: FiUsers, badge: null },
          { name: 'Vendors', path: '/admin/vendors', icon: FiShoppingBag, badge: null },
          { name: 'Products', path: '/admin/products', icon: FiPackage, badge: null },
          { name: 'Orders', path: '/admin/orders', icon: FiTruck, badge: null },
          { name: 'Analytics', path: '/admin/analytics', icon: FiBarChart, badge: null },
          { name: 'AI Assistant', path: '/admin/ai-assistant', icon: FiMessageSquare, badge: 'New' },
        ];
      case 'vendor':
        return [
          { name: 'Dashboard', path: '/vendor', icon: FiHome, badge: null },
          { name: 'Products', path: '/vendor/products', icon: FiPackage, badge: null },
          { name: 'Orders', path: '/vendor/orders', icon: FiTruck, badge: null },
          { name: 'Stats', path: '/vendor/stats', icon: FiBarChart, badge: null },
          { name: 'Profile', path: '/vendor/profile', icon: FiSettings, badge: null },
        ];
      case 'customer':
        return [
          { name: 'Home', path: '/', icon: FiHome, badge: null },
          { name: 'Products', path: '/products', icon: FiShoppingBag, badge: null },
          { name: 'Orders', path: '/orders', icon: FiPackage, badge: null },
          { name: 'Profile', path: '/profile', icon: FiSettings, badge: null },
        ];
      default:
        return [
          { name: 'Home', path: '/', icon: FiHome, badge: null },
          { name: 'Products', path: '/products', icon: FiShoppingBag, badge: null },
        ];
    }
  };

  const navigationItems = getNavigationItems();

  const getRoleIcon = () => {
    switch (role) {
      case 'admin':
        return <FiShield className="h-5 w-5 text-red-500" />;
      case 'vendor':
        return <FiShoppingBag className="h-5 w-5 text-blue-500" />;
      case 'customer':
        return <FiUser className="h-5 w-5 text-green-500" />;
      default:
        return <FiUser className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-red-600';
      case 'vendor':
        return 'from-blue-500 to-blue-600';
      case 'customer':
        return 'from-green-500 to-green-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  // Mobile overlay
  const mobileSidebar = (
    sidebarOpen && (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => dispatch(closeSidebar())}
        />
        <aside className="sidebar sidebar-open lg:hidden">
          <div className="flex flex-col h-full bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor()} text-white`}>
                  {getRoleIcon()}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                    {role === 'admin' ? 'Admin Panel' : role === 'vendor' ? 'Vendor Panel' : 'Menu'}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {role} Dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => dispatch(closeSidebar())}
                className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {/* User Info */}
            {user && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => dispatch(closeSidebar())}
                    className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-105'
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-500'}`} />
                      <span className="font-medium">{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
              >
                <FiLogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
                <p>© 2024 Ecommerce</p>
                <p>Version 1.0.0</p>
              </div>
            </div>
          </div>
        </aside>
      </>
    )
  );

  // Desktop sidebar: slim by default, expands on hover
  const desktopSidebar = (
    <aside
      className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-50 bg-white dark:bg-gray-800 shadow-xl transition-all duration-300 ease-in-out
        ${hovered ? 'w-64' : 'w-20'}
      `}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ marginTop: 0 }}
    >
      {/* Header */}
      <div className={`flex items-center ${hovered ? 'justify-between px-6' : 'justify-center'} h-16 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300`}>
        <div className={`flex items-center space-x-3 ${!hovered && 'justify-center w-full'}`}>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getRoleColor()} text-white`}>
            {getRoleIcon()}
          </div>
          {hovered && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {role === 'admin' ? 'Admin Panel' : role === 'vendor' ? 'Vendor Panel' : 'Menu'}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {role} Dashboard
              </p>
            </div>
          )}
        </div>
      </div>
      {/* User Info */}
      {user && (
        <div className={`border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-700 transition-all duration-300 ${hovered ? 'p-4' : 'p-2 flex justify-center'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </span>
            </div>
            {hovered && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user.email}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center rounded-xl transition-all duration-200 px-2 py-3 my-1 ${isActive
                ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg transform scale-105'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:transform hover:scale-105'
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon className={`h-5 w-5 transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-500'}`} />
              {hovered && <span className="ml-4 font-medium">{item.name}</span>}
              {item.badge && hovered && (
                <span className="ml-auto px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      {/* Footer */}
      <div className={`border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 ${hovered ? 'p-4' : 'p-2 flex justify-center'}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
        >
          <FiLogOut className="h-4 w-4" />
          {hovered && <span className="font-medium">Logout</span>}
        </button>
        {hovered && (
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 text-center">
            <p>© 2024 Ecommerce</p>
            <p>Version 1.0.0</p>
          </div>
        )}
      </div>
    </aside>
  );

  return (
    <>
      {mobileSidebar}
      {desktopSidebar}
    </>
  );
};

export default Sidebar; 
