import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../../redux/slices/orderSlice';
import { FiPackage, FiCalendar, FiMapPin, FiDollarSign, FiEye, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const Orders = () => {
    const dispatch = useDispatch();
    const { orders, loading } = useSelector((state) => state.orders);
    const { user } = useSelector((state) => state.auth);
    const [selectedStatus, setSelectedStatus] = useState('all');

    useEffect(() => {
        if (user) {
            dispatch(fetchMyOrders());
        }
    }, [dispatch, user]);

    const getStatusColor = (status) => {
        if (!status) return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';

        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getStatusIcon = (status) => {
        if (!status) return <FiPackage className="w-4 h-4" />;

        switch (status.toLowerCase()) {
            case 'pending':
                return <FiClock className="w-4 h-4" />;
            case 'processing':
                return <FiPackage className="w-4 h-4" />;
            case 'shipped':
                return <FiTruck className="w-4 h-4" />;
            case 'delivered':
                return <FiCheckCircle className="w-4 h-4" />;
            case 'cancelled':
                return <FiXCircle className="w-4 h-4" />;
            default:
                return <FiPackage className="w-4 h-4" />;
        }
    };

    const filteredOrders = selectedStatus === 'all'
        ? (orders || [])
        : (orders || []).filter(order => order.orderStatus?.toLowerCase() === selectedStatus);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                        <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-64" />
                    ))}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Sign in to view orders</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        Please sign in to access your order history and track your purchases.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {(orders || []).length} order{(orders || []).length !== 1 ? 's' : ''} found
                    </p>
                </div>
            </div>

            {/* Status Filter */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setSelectedStatus(status)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedStatus === status
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        {selectedStatus === 'all' ? 'No orders yet' : `No ${selectedStatus} orders`}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        {selectedStatus === 'all'
                            ? "You haven't placed any orders yet. Start shopping to see your order history here!"
                            : `You don't have any ${selectedStatus} orders at the moment.`
                        }
                    </p>
                    {selectedStatus === 'all' && (
                        <Link
                            to="/"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Start Shopping
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                            Order #{order._id ? order._id.slice(-8).toUpperCase() : 'N/A'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                        {getStatusIcon(order.orderStatus)}
                                        {order.orderStatus || 'Unknown'}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <FiCalendar className="w-4 h-4" />
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FiDollarSign className="w-4 h-4" />
                                        ${(order.totalPrice || 0).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-3 mb-4">
                                    {(order.items || []).slice(0, 2).map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <img
                                                src={item.image || item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                                                alt={item.name || item.product?.name || 'Product'}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {item.name || item.product?.name || 'Product'}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                    Qty: {item.quantity || 0} • ${(item.price || 0).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {(order.items || []).length > 2 && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            +{(order.items || []).length - 2} more item{(order.items || []).length - 2 !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="flex items-start gap-2">
                                            <FiMapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {order.shippingAddress.street}
                                                </p>
                                                <p>
                                                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Action Button */}
                                <Link
                                    to={`/order/${order._id}`}
                                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-all"
                                >
                                    <FiEye className="w-4 h-4" />
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders; 
