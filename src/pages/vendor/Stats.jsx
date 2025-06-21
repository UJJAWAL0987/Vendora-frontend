import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiPackage, FiUsers, FiStar } from 'react-icons/fi';

const VendorStats = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    // Mock data - replace with real API calls
    const [timeRange, setTimeRange] = useState('month');
    const [stats, setStats] = useState({
        totalSales: 15420,
        totalOrders: 89,
        totalProducts: 12,
        averageRating: 4.5,
        growthRate: 12.5,
        customerCount: 156
    });

    const monthlySales = [
        { month: 'Jan', sales: 1200, orders: 8 },
        { month: 'Feb', sales: 1500, orders: 12 },
        { month: 'Mar', sales: 1800, orders: 15 },
        { month: 'Apr', sales: 2200, orders: 18 },
        { month: 'May', sales: 1700, orders: 14 },
        { month: 'Jun', sales: 2100, orders: 16 }
    ];

    const categorySales = [
        { category: 'Electronics', value: 60, color: '#2563eb' },
        { category: 'Fitness', value: 25, color: '#10b981' },
        { category: 'Home', value: 15, color: '#f59e42' }
    ];

    const topProducts = [
        { name: 'Wireless Headphones', sales: 25, revenue: 2247.75, growth: 15 },
        { name: 'Fitness Watch', sales: 18, revenue: 3599.82, growth: 8 },
        { name: 'Yoga Mat', sales: 15, revenue: 599.85, growth: 22 },
        { name: 'Smart Speaker', sales: 12, revenue: 1199.88, growth: -5 },
        { name: 'Bluetooth Earbuds', sales: 10, revenue: 899.90, growth: 12 }
    ];

    const customerMetrics = [
        { metric: 'New Customers', value: 23, change: 12, trend: 'up' },
        { metric: 'Repeat Customers', value: 67, change: 8, trend: 'up' },
        { metric: 'Customer Satisfaction', value: 4.5, change: 0.2, trend: 'up' },
        { metric: 'Average Order Value', value: 173.26, change: -5, trend: 'down' }
    ];

    const COLORS = ['#2563eb', '#10b981', '#f59e42', '#ef4444', '#8b5cf6'];

    const getTrendIcon = (trend) => {
        return trend === 'up' ? (
            <FiTrendingUp className="w-4 h-4 text-green-500" />
        ) : (
            <FiTrendingDown className="w-4 h-4 text-red-500" />
        );
    };

    const getChangeColor = (change) => {
        return change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
    };

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                        <FiTrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Stats</h1>
                        <p className="text-gray-600 dark:text-gray-400">Track your business performance</p>
                    </div>
                </div>

                <div className="flex gap-2">
                    {['week', 'month', 'quarter', 'year'].map((range) => (
                        <button
                            key={range}
                            onClick={() => setTimeRange(range)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${timeRange === range
                                    ? 'bg-purple-600 text-white shadow-lg'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {range.charAt(0).toUpperCase() + range.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalSales.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <FiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400">+{stats.growthRate}%</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                            <FiDollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalOrders}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <FiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.customerCount}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <FiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400">+15.3%</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                            <FiUsers className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.averageRating}</p>
                            <div className="flex items-center gap-1 mt-1">
                                <FiTrendingUp className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400">+0.2</span>
                            </div>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <FiStar className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Sales Trend */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sales Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlySales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="#2563eb" fillOpacity={0.3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Sales by Category</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={categorySales}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {categorySales.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products and Customer Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Products */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Performing Products</h2>
                    <div className="space-y-4">
                        {topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400">#{index + 1}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {product.sales} units • ${product.revenue.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={`flex items-center gap-1 ${getChangeColor(product.growth)}`}>
                                        {getTrendIcon(product.growth >= 0 ? 'up' : 'down')}
                                        <span className="text-sm font-medium">{Math.abs(product.growth)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Metrics */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Metrics</h2>
                    <div className="space-y-4">
                        {customerMetrics.map((metric, index) => (
                            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{metric.metric}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {metric.metric === 'Customer Satisfaction' ? 'Average rating' : 'This period'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                                        {typeof metric.value === 'number' && metric.value > 100
                                            ? `$${metric.value.toFixed(2)}`
                                            : metric.value}
                                    </p>
                                    <div className={`flex items-center gap-1 ${getChangeColor(metric.change)}`}>
                                        {getTrendIcon(metric.trend)}
                                        <span className="text-sm font-medium">{Math.abs(metric.change)}%</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Strong Growth</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Your sales are growing 12.5% month-over-month
                        </p>
                    </div>

                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiStar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">High Satisfaction</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Customer rating improved by 0.2 points
                        </p>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FiPackage className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Product Performance</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Yoga Mat shows highest growth at 22%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorStats; 
