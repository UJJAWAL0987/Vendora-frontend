import React, { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, Legend, LineChart, Line, AreaChart, Area,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
    FiBarChart, FiTrendingUp, FiTrendingDown, FiDollarSign, FiShoppingCart,
    FiUsers, FiPackage, FiEye, FiDownload, FiCalendar, FiRefreshCw,
    FiArrowUpRight, FiArrowDownRight, FiActivity
} from 'react-icons/fi';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const AdminAnalytics = () => {
    const [timeRange, setTimeRange] = useState('30d');

    // Enhanced analytics data
    const monthlyRevenue = [
        { month: 'Jan', revenue: 12500, orders: 89, customers: 45, products: 120 },
        { month: 'Feb', revenue: 15800, orders: 112, customers: 67, products: 145 },
        { month: 'Mar', revenue: 18200, orders: 134, customers: 89, products: 167 },
        { month: 'Apr', revenue: 22100, orders: 156, customers: 112, products: 189 },
        { month: 'May', revenue: 17300, orders: 128, customers: 95, products: 156 },
        { month: 'Jun', revenue: 21400, orders: 167, customers: 134, products: 201 },
        { month: 'Jul', revenue: 19800, orders: 145, customers: 123, products: 178 },
        { month: 'Aug', revenue: 23100, orders: 178, customers: 156, products: 223 },
        { month: 'Sep', revenue: 25600, orders: 201, customers: 178, products: 245 },
        { month: 'Oct', revenue: 28900, orders: 234, customers: 201, products: 267 },
        { month: 'Nov', revenue: 31200, orders: 267, customers: 223, products: 289 },
        { month: 'Dec', revenue: 34500, orders: 289, customers: 245, products: 312 }
    ];

    const categoryPerformance = [
        { category: 'Electronics', revenue: 45000, orders: 234, growth: 15.2 },
        { category: 'Clothing', revenue: 32000, orders: 189, growth: 8.7 },
        { category: 'Home & Garden', revenue: 28000, orders: 156, growth: 12.3 },
        { category: 'Sports', revenue: 22000, orders: 134, growth: 18.9 },
        { category: 'Books', revenue: 15000, orders: 89, growth: 5.4 },
        { category: 'Beauty', revenue: 18000, orders: 112, growth: 22.1 }
    ];

    const vendorPerformance = [
        { vendor: 'TechStore', revenue: 25000, orders: 145, products: 67, rating: 4.8 },
        { vendor: 'FashionHub', revenue: 18000, orders: 112, products: 89, rating: 4.6 },
        { vendor: 'HomeEssentials', revenue: 15000, orders: 89, products: 45, rating: 4.9 },
        { vendor: 'SportsWorld', revenue: 12000, orders: 67, products: 34, rating: 4.7 },
        { vendor: 'BookWorld', revenue: 8000, orders: 45, products: 23, rating: 4.5 }
    ];

    const customerSegments = [
        { segment: 'New Customers', value: 35, color: '#0088FE' },
        { segment: 'Returning Customers', value: 45, color: '#00C49F' },
        { segment: 'VIP Customers', value: 20, color: '#FFBB28' }
    ];

    const salesTrends = [
        { day: 'Mon', sales: 1200, orders: 45 },
        { day: 'Tue', sales: 1400, orders: 52 },
        { day: 'Wed', sales: 1600, orders: 61 },
        { day: 'Thu', sales: 1800, orders: 67 },
        { day: 'Fri', sales: 2200, orders: 78 },
        { day: 'Sat', sales: 2400, orders: 89 },
        { day: 'Sun', sales: 2000, orders: 73 }
    ];

    const performanceMetrics = [
        { metric: 'Revenue Growth', value: 15.2, change: 2.1, trend: 'up' },
        { metric: 'Order Volume', value: 234, change: 8.7, trend: 'up' },
        { metric: 'Customer Acquisition', value: 45, change: -1.2, trend: 'down' },
        { metric: 'Average Order Value', value: 125.50, change: 5.3, trend: 'up' },
        { metric: 'Customer Retention', value: 78.5, change: 3.2, trend: 'up' },
        { metric: 'Product Performance', value: 4.8, change: 0.2, trend: 'up' }
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 1247, revenue: 18705, growth: 12.5 },
        { name: 'Fitness Smartwatch', sales: 892, revenue: 26760, growth: 8.3 },
        { name: 'Yoga Mat Premium', sales: 756, revenue: 7560, growth: 15.7 },
        { name: 'Bluetooth Speaker', sales: 634, revenue: 12680, growth: -2.1 },
        { name: 'Wireless Earbuds', sales: 589, revenue: 11780, growth: 22.4 }
    ];

    const StatCard = ({ title, value, change, trend, icon, color }) => (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
                    {change && (
                        <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                            {trend === 'up' ? <FiArrowUpRight className="w-4 h-4 mr-1" /> : <FiArrowDownRight className="w-4 h-4 mr-1" />}
                            {Math.abs(change)}% from last period
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="container-responsive">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Comprehensive insights into your e-commerce performance</p>
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
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                    <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                        <FiRefreshCw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Revenue"
                    value="$345,000"
                    change={15.2}
                    trend="up"
                    icon={<FiDollarSign className="w-6 h-6 text-green-600" />}
                    color="bg-green-100"
                />
                <StatCard
                    title="Total Orders"
                    value="2,847"
                    change={8.7}
                    trend="up"
                    icon={<FiShoppingCart className="w-6 h-6 text-blue-600" />}
                    color="bg-blue-100"
                />
                <StatCard
                    title="Active Customers"
                    value="1,234"
                    change={-1.2}
                    trend="down"
                    icon={<FiUsers className="w-6 h-6 text-purple-600" />}
                    color="bg-purple-100"
                />
                <StatCard
                    title="Products Sold"
                    value="8,456"
                    change={12.3}
                    trend="up"
                    icon={<FiPackage className="w-6 h-6 text-orange-600" />}
                    color="bg-orange-100"
                />
            </div>

            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Revenue Trend</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiTrendingUp className="w-4 h-4" />
                            Monthly Overview
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyRevenue}>
                            <defs>
                                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
                                dataKey="revenue"
                                stroke="#10B981"
                                strokeWidth={2}
                                fill="url(#revenueGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Category Performance</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiBarChart className="w-4 h-4" />
                            Revenue by Category
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={categoryPerformance}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="category" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Secondary Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Customer Segments */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Segments</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiUsers className="w-4 h-4" />
                            Distribution
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={customerSegments}
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {customerSegments.map((entry, index) => (
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
                    <div className="mt-4 space-y-2">
                        {customerSegments.map((segment, index) => (
                            <div key={segment.segment} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: segment.color }}
                                    />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">{segment.segment}</span>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{segment.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Sales Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Sales</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiActivity className="w-4 h-4" />
                            Daily Trend
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salesTrends}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="day" stroke="#6B7280" />
                            <YAxis stroke="#6B7280" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#1F2937',
                                    border: 'none',
                                    borderRadius: '8px',
                                    color: '#F9FAFB'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="sales"
                                stroke="#8B5CF6"
                                strokeWidth={2}
                                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Vendor Performance */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Top Vendors</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <FiPackage className="w-4 h-4" />
                            Revenue
                        </div>
                    </div>
                    <div className="space-y-4">
                        {vendorPerformance.slice(0, 5).map((vendor, index) => (
                            <div key={vendor.vendor} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-bold text-blue-600 dark:text-blue-400">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{vendor.vendor}</p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">{vendor.orders} orders</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">${vendor.revenue.toLocaleString()}</p>
                                    <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                        <span className="text-yellow-500 mr-1">★</span>
                                        {vendor.rating}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Metrics Grid */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Performance Metrics</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <FiBarChart className="w-4 h-4" />
                        Key Indicators
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {performanceMetrics.map((metric) => (
                        <div key={metric.metric} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.metric}</p>
                                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">{metric.value}</p>
                                </div>
                                <div className={`flex items-center text-sm ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                                    {metric.trend === 'up' ? <FiArrowUpRight className="w-4 h-4 mr-1" /> : <FiArrowDownRight className="w-4 h-4 mr-1" />}
                                    {Math.abs(metric.change)}%
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics; 
