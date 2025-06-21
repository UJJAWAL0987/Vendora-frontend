import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById, clearCurrentOrder } from '../../redux/slices/orderSlice';
import { FiPackage, FiMapPin, FiDollarSign, FiCalendar, FiCheckCircle, FiXCircle, FiTruck, FiClock } from 'react-icons/fi';

const statusIcons = {
    pending: <FiClock className="w-5 h-5" />,
    processing: <FiPackage className="w-5 h-5" />,
    shipped: <FiTruck className="w-5 h-5" />,
    delivered: <FiCheckCircle className="w-5 h-5" />,
    cancelled: <FiXCircle className="w-5 h-5" />,
};

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    default: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
};

const OrderDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentOrder, loading, error } = useSelector(state => state.orders);

    useEffect(() => {
        if (id) dispatch(fetchOrderById(id));
        return () => { dispatch(clearCurrentOrder()); };
    }, [dispatch, id]);

    if (loading || !currentOrder) {
        return (
            <div className="container-responsive py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
            </div>
        );
    }
    if (error) {
        return (
            <div className="container-responsive py-16 text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                <p className="text-gray-600 dark:text-gray-400">{error}</p>
                <Link to="/orders" className="btn-primary mt-6">Back to Orders</Link>
            </div>
        );
    }
    const order = currentOrder;
    const status = order.orderStatus || order.vendorOrders?.[0]?.status || 'pending';
    const statusColor = statusColors[status?.toLowerCase()] || statusColors.default;
    const statusIcon = statusIcons[status?.toLowerCase()] || <FiPackage className="w-5 h-5" />;

    return (
        <div className="container-responsive max-w-3xl mx-auto py-8">
            <div className="mb-8 flex items-center gap-4">
                <Link to="/orders" className="text-blue-600 hover:underline">&larr; Back to Orders</Link>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex-1">Order #{order._id.slice(-8).toUpperCase()}</h1>
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusColor}`}>
                    {statusIcon}
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
                <div className="mb-4 flex flex-wrap gap-6">
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Placed On</div>
                        <div className="font-medium text-gray-900 dark:text-white">{new Date(order.createdAt).toLocaleString()}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Total</div>
                        <div className="font-medium text-gray-900 dark:text-white">${order.totalPrice.toFixed(2)}</div>
                    </div>
                    <div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs">Payment</div>
                        <div className="font-medium text-gray-900 dark:text-white">{order.paymentInfo?.method?.toUpperCase() || 'N/A'}</div>
                    </div>
                </div>
                <div className="mb-4">
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Shipping Address</div>
                    <div className="flex items-start gap-2">
                        <FiMapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div className="text-gray-900 dark:text-white">
                            <div>{order.shippingAddress?.name}</div>
                            <div>{order.shippingAddress?.street}</div>
                            <div>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</div>
                            <div>{order.shippingAddress?.country}</div>
                            <div>{order.shippingAddress?.phone}</div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Order Items</div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 py-4">
                                <img
                                    src={item.image || item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                                    alt={item.name || item.product?.name || 'Product'}
                                    className="w-16 h-16 object-cover rounded-lg border"
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-gray-900 dark:text-white">{item.name || item.product?.name || 'Product'}</div>
                                    <div className="text-gray-500 dark:text-gray-400 text-sm">Qty: {item.quantity} &bull; ${item.price.toFixed(2)}</div>
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-white">${(item.price * item.quantity).toFixed(2)}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">Order Summary</div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Items</span>
                        <span>${order.itemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Tax</span>
                        <span>${order.taxPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                        <span>Shipping</span>
                        <span>${order.shippingPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base font-bold border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                        <span>Total</span>
                        <span>${order.totalPrice.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <div className="font-semibold text-gray-900 dark:text-white mb-2">Payment Info</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Method: {order.paymentInfo?.method?.toUpperCase() || 'N/A'}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-1">Status: {order.paymentStatus || 'N/A'}</div>
                    <div className="text-sm text-gray-700 dark:text-gray-300">Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : 'N/A'}</div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail; 
