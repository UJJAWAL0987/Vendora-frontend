import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchVendorOrders, updateOrderStatus } from '../../redux/slices/orderSlice';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiEye, FiEdit3 } from 'react-icons/fi';

const VendorOrders = () => {
    const dispatch = useDispatch();
    const { vendorOrders, loading } = useSelector((state) => state.orders);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [updatingOrder, setUpdatingOrder] = useState(null);

    useEffect(() => {
        dispatch(fetchVendorOrders());
    }, [dispatch]);

    const handleStatusUpdate = async (orderId, newStatus) => {
        setUpdatingOrder(orderId);
        try {
            await dispatch(updateOrderStatus({ orderId, statusData: { status: newStatus } })).unwrap();
            dispatch(fetchVendorOrders()); // Refresh orders
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setUpdatingOrder(null);
        }
    };

    const getStatusColor = (status) => {
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
        switch (status.toLowerCase()) {
            case 'pending':
                return <FiClock className="w-4 h-4" />;
            case 'processing':
                return <FiPackage className="w-4 h-4" />;
            case 'shipped':
                return <FiTruck className="w-4 h-4" />;
            case 'delivered':
                return <FiCheckCircle className="w-4 h-4" />;
            default:
                return <FiPackage className="w-4 h-4" />;
        }
    };

    const filteredOrders = selectedStatus === 'all'
        ? vendorOrders
        : vendorOrders.filter(order => order.status.toLowerCase() === selectedStatus);

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendor Orders</h1>
                        <p className="text-gray-600 dark:text-gray-400">Loading orders...</p>
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

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Vendor Orders</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your product orders
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
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        {selectedStatus === 'all'
                            ? "You don't have any orders yet. Start selling to see orders here!"
                            : `You don't have any ${selectedStatus} orders at the moment.`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOrders.map((order) => (
                        <div key={order._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Order Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                    <div>
                                        <span className="font-medium">Customer:</span> {order.user?.name || 'Unknown'}
                                    </div>
                                    <div>
                                        <span className="font-medium">Total:</span> ${order.total.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="p-6">
                                <div className="space-y-3 mb-4">
                                    {order.items.filter(item => item.product?.vendor === order.user?._id).slice(0, 3).map((item, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <img
                                                src={item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                                                alt={item.product?.name || 'Product'}
                                                className="w-12 h-12 object-cover rounded-lg"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                                    {item.product?.name || 'Product'}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                    Qty: {item.quantity} • ${item.price}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.filter(item => item.product?.vendor === order.user?._id).length > 3 && (
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                                            +{order.items.filter(item => item.product?.vendor === order.user?._id).length - 3} more item{order.items.filter(item => item.product?.vendor === order.user?._id).length - 3 !== 1 ? 's' : ''}
                                        </p>
                                    )}
                                </div>

                                {/* Status Update */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <FiEdit3 className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Update Status:</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
                                            <button
                                                key={status}
                                                onClick={() => handleStatusUpdate(order._id, status)}
                                                disabled={updatingOrder === order._id || order.status === status}
                                                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${order.status === status
                                                        ? 'bg-blue-600 text-white'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                    } disabled:opacity-50`}
                                            >
                                                {updatingOrder === order._id ? 'Updating...' : status.charAt(0).toUpperCase() + status.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                {order.shippingAddress && (
                                    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            <p className="font-medium text-gray-900 dark:text-white mb-1">Shipping Address:</p>
                                            <p>{order.shippingAddress.street}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VendorOrders; 
