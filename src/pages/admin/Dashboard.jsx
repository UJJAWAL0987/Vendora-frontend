import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
    FiUsers, FiPackage, FiShoppingCart, FiDollarSign, FiTrendingUp,
    FiTrendingDown, FiEye, FiStar, FiAlertCircle, FiCheckCircle,
    FiClock, FiActivity, FiBarChart, FiCalendar, FiMapPin,
    FiArrowUpRight, FiArrowDownRight, FiRefreshCw
} from 'react-icons/fi';
import { fetchAllProducts } from '../../redux/slices/productSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { orders } = useSelector((state) => state.orders);
    const [timeRange, setTimeRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                await Promise.all([
                    dispatch(fetchAllProducts()),
                ]);
            } catch (error) {
                console.error('Error loading dashboard data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, [dispatch]);

    // Calculate real-time metrics
    const metrics = {
        totalUsers: 1247,
        totalVendors: products.length > 0 ? new Set(products.map(p => p.vendor?._id)).size : 0,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue: orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0),
        pendingOrders: orders.filter(order => order.orderStatus === 'pending').length,
        activeProducts: products.filter(p => p.status === 'active').length,
        lowStockProducts: products.filter(p => p.stock < 10).length
    };

    // Monthly sales data
    const monthlySales = [
        { month: 'Jan', sales: 12500, orders: 89 },
        { month: 'Feb', sales: 15800, orders: 112 },
        { month: 'Mar', sales: 18200, orders: 134 },
        { month: 'Apr', sales: 22100, orders: 156 },
        { month: 'May', sales: 17300, orders: 128 },
        { month: 'Jun', sales: 21400, orders: 167 },
        { month: 'Jul', sales: 19800, orders: 145 },
        { month: 'Aug', sales: 23100, orders: 178 },
        { month: 'Sep', sales: 25600, orders: 201 },
        { month: 'Oct', sales: 28900, orders: 234 },
        { month: 'Nov', sales: 31200, orders: 267 },
        { month: 'Dec', sales: 34500, orders: 289 }
    ];

    // Top selling products
    const topProducts = [
        { name: 'Wireless Headphones', sales: 1247, revenue: 18705, growth: 12.5 },
        { name: 'Fitness Smartwatch', sales: 892, revenue: 26760, growth: 8.3 },
        { name: 'Yoga Mat Premium', sales: 756, revenue: 7560, growth: 15.7 },
        { name: 'Bluetooth Speaker', sales: 634, revenue: 12680, growth: -2.1 },
        { name: 'Wireless Earbuds', sales: 589, revenue: 11780, growth: 22.4 }
    ];

    // Category distribution
    const categoryData = [
        { name: 'Electronics', value: 35, color: '#0088FE' },
        { name: 'Clothing', value: 25, color: '#00C49F' },
        { name: 'Home & Garden', value: 20, color: '#FFBB28' },
        { name: 'Sports', value: 15, color: '#FF8042' },
        { name: 'Books', value: 5, color: '#8884D8' }
    ];

    // Recent activity
    const recentActivity = [
        { type: 'order', message: 'New order #1234 received', time: '2 min ago', status: 'success' },
        { type: 'product', message: 'Product "Wireless Headphones" updated', time: '5 min ago', status: 'info' },
        { type: 'vendor', message: 'New vendor "TechStore" registered', time: '12 min ago', status: 'warning' },
        { type: 'user', message: 'User "john.doe" created account', time: '18 min ago', status: 'info' },
        { type: 'order', message: 'Order #1230 marked as shipped', time: '25 min ago', status: 'success' }
    ];

    const getStatusIcon = (status) => {
        switch (status) {
            case 'success': return <FiCheckCircle className="w-4 h-4 text-green-500" />;
            case 'warning': return <FiAlertCircle className="w-4 h-4 text-yellow-500" />;
            case 'error': return <FiAlertCircle className="w-4 h-4 text-red-500" />;
            default: return <FiActivity className="w-4 h-4 text-blue-500" />;
        }
    };

    const StatCard = ({ title, value, change, icon, color, subtitle }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
                    {change && (
                        <div className={`flex items-center mt-2 text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? <FiArrowUpRight className="w-4 h-4 mr-1" /> : <FiArrowDownRight className="w-4 h-4 mr-1" />}
                            {Math.abs(change)}% from last month
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="container-responsive">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 h-32" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container-responsive">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
                </div>
                <div className="flex items-center gap-4">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                        <option value="1y">Last year</option>
                    </select>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                        <FiRefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value={`$${metrics.totalRevenue.toLocaleString()}`}
                    change={12.5}
                    icon={<FiDollarSign className="w-6 h-6 text-green-600" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Total Orders"
                    value={metrics.totalOrders}
                    change={8.2}
                    icon={<FiShoppingCart className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Active Products"
                    value={metrics.activeProducts}
                    change={-2.1}
                    icon={<FiPackage className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-100"
                />
                <StatCard
                    title="Total Users"
                    value={metrics.totalUsers}
                    change={15.7}
                    icon={<FiUsers className="w-6 h-6 text-orange-600" />}
                    color="bg-orange-100"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Sales Chart */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Sales Overview</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiBarChart className="w-4 h-4" />
                            Monthly Revenue
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlySales}>
                            <defs>
                                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                fill="url(#salesGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category Distribution</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiStar className="w-4 h-4" />
                            Product Categories
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {categoryData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {categoryData.map((category, index) => (
                            <div key={category.name} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">{category.name}</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white ml-auto">{category.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Products</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiStar className="w-4 h-4" />
                            Best Sellers
                        </div>
                    </div>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{product.sales} sales</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">${product.revenue.toLocaleString()}</p>
                                    <div className={`flex items-center text-sm ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.growth > 0 ? <FiArrowUpRight className="w-3 h-3 mr-1" /> : <FiArrowDownRight className="w-3 h-3 mr-1" />}
                                        {Math.abs(product.growth)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Activity</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiActivity className="w-4 h-4" />
                            Live Updates
                        </div>
                    </div>
                    <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                {getStatusIcon(activity.status)}
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.message}</p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{activity.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Stats</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiBarChart className="w-4 h-4" />
                            Overview
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FiClock className="w-5 h-5 text-yellow-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Pending Orders</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting processing</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-yellow-600">{metrics.pendingOrders}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FiAlertCircle className="w-5 h-5 text-red-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Low Stock</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Products running out</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-red-600">{metrics.lowStockProducts}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <FiUsers className="w-5 h-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">Active Vendors</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Selling products</p>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-green-600">{metrics.totalVendors}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard; 
