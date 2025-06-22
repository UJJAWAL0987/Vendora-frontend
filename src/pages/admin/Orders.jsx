import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { socket } from '../../utils/socket';
import { fetchAllOrders, fetchAdminOrderById, clearCurrentOrder, updateOrderStatusAdmin } from '../../redux/slices/orderSlice';
import { FiEye, FiCheckCircle, FiXCircle, FiTruck, FiClock } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const statusIcons = {
    pending: <FiClock className="w-5 h-5" />,
    processing: <FiTruck className="w-5 h-5" />,
    shipped: <FiTruck className="w-5 h-5" />,
    delivered: <FiCheckCircle className="w-5 h-5" />,
    cancelled: <FiXCircle className="w-5 h-5" />,
};

const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    default: 'bg-gray-100 text-gray-800',
};

const AdminOrders = () => {
    const dispatch = useDispatch();
    const { orders, loading, error, currentOrder } = useSelector(state => state.orders);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        dispatch(fetchAllOrders());
    }, [dispatch]);

    useEffect(() => {
        socket.on('orderCreated', () => {
            dispatch(fetchAllOrders());
        });
        return () => {
            socket.off('orderCreated');
        };
    }, [dispatch]);

    const handleViewDetails = (orderId) => {
        setSelectedOrderId(orderId);
        dispatch(fetchAdminOrderById(orderId));
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrderId(null);
        dispatch(clearCurrentOrder());
        setStatusToUpdate('');
    };

    const handleStatusChange = (e) => {
        setStatusToUpdate(e.target.value);
    };

    const handleUpdateStatus = async () => {
        if (!statusToUpdate) return;
        setUpdating(true);
        try {
            await dispatch(updateOrderStatusAdmin({ orderId: currentOrder._id, orderStatus: statusToUpdate })).unwrap();
            toast.success('Order status updated');
            setStatusToUpdate('');
        } catch (err) {
            toast.error(typeof err === 'object' && err !== null ? err.message : err);
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Orders</h1>
            <div className="flex gap-2 mb-4">
                <select className="border rounded px-2 py-1">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                </select>
                <button className="px-4 py-1 bg-blue-600 text-white rounded">Export CSV</button>
                <button className="px-4 py-1 bg-green-600 text-white rounded">Export PDF</button>
            </div>
            {loading ? (
                <div>Loading orders...</div>
            ) : error ? (
                <div className="text-red-500">{typeof error === 'object' && error !== null ? error.message : error}</div>
            ) : (
                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4">Order #</th>
                            <th className="py-2 px-4">Date</th>
                            <th className="py-2 px-4">Customer</th>
                            <th className="py-2 px-4">Vendor(s)</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Total</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            const status = order.orderStatus || order.vendorOrders?.[0]?.status || 'pending';
                            const statusColor = statusColors[status?.toLowerCase()] || statusColors.default;
                            const statusIcon = statusIcons[status?.toLowerCase()] || <FiClock className="w-5 h-5" />;
                            return (
                                <tr key={order._id}>
                                    <td className="py-2 px-4 font-mono">{order._id.slice(-8).toUpperCase()}</td>
                                    <td className="py-2 px-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td className="py-2 px-4">{order.user?.name || 'N/A'}</td>
                                    <td className="py-2 px-4">{order.vendorOrders?.map(vo => vo.vendor?.name).join(', ')}</td>
                                    <td className="py-2 px-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
                                            {statusIcon}
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4">${order.totalPrice.toFixed(2)}</td>
                                    <td className="py-2 px-4">
                                        <button
                                            className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                            onClick={() => handleViewDetails(order._id)}
                                        >
                                            <FiEye className="w-4 h-4" /> View Details
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
            {/* Order Detail Modal */}
            {showModal && currentOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full p-8 relative">
                        <button
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-2xl"
                            onClick={handleCloseModal}
                        >
                            &times;
                        </button>
                        <h2 className="text-2xl font-bold mb-4">Order #{currentOrder._id.slice(-8).toUpperCase()}</h2>
                        <div className="mb-4 flex flex-wrap gap-6">
                            <div>
                                <div className="text-gray-500 text-xs">Placed On</div>
                                <div className="font-medium text-gray-900">{new Date(currentOrder.createdAt).toLocaleString()}</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs">Customer</div>
                                <div className="font-medium text-gray-900">{currentOrder.user?.name} ({currentOrder.user?.email})</div>
                            </div>
                            <div>
                                <div className="text-gray-500 text-xs">Total</div>
                                <div className="font-medium text-gray-900">${currentOrder.totalPrice.toFixed(2)}</div>
                            </div>
                        </div>
                        <div className="mb-4">
                            <div className="text-gray-500 text-xs mb-1">Order Items</div>
                            <div className="divide-y divide-gray-200">
                                {currentOrder.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 py-2">
                                        <img
                                            src={item.image || item.product?.images?.[0]?.url || '/placeholder-product.svg'}
                                            alt={item.name || item.product?.name || 'Product'}
                                            className="w-12 h-12 object-cover rounded-lg border"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-gray-900">{item.name || item.product?.name || 'Product'}</div>
                                            <div className="text-gray-500 text-sm">Qty: {item.quantity} &bull; ${item.price.toFixed(2)}</div>
                                        </div>
                                        <div className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-4">
                                <div className="font-semibold text-gray-900 mb-2">Order Summary</div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Items</span>
                                    <span>${currentOrder.itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Tax</span>
                                    <span>${currentOrder.taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Shipping</span>
                                    <span>${currentOrder.shippingPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-base font-bold border-t border-gray-200 pt-2 mt-2">
                                    <span>Total</span>
                                    <span>${currentOrder.totalPrice.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-50 dark:bg-gray-800 rounded-xl shadow p-4">
                                <div className="font-semibold text-gray-900 mb-2">Shipping Address</div>
                                <div className="text-sm text-gray-700 mb-1">{currentOrder.shippingAddress?.name}</div>
                                <div className="text-sm text-gray-700 mb-1">{currentOrder.shippingAddress?.street}</div>
                                <div className="text-sm text-gray-700 mb-1">{currentOrder.shippingAddress?.city}, {currentOrder.shippingAddress?.state} {currentOrder.shippingAddress?.zipCode}</div>
                                <div className="text-sm text-gray-700 mb-1">{currentOrder.shippingAddress?.country}</div>
                                <div className="text-sm text-gray-700">{currentOrder.shippingAddress?.phone}</div>
                            </div>
                        </div>
                        <div className="mt-6 flex items-center gap-4">
                            <select
                                className="border rounded px-3 py-2"
                                value={statusToUpdate || currentOrder.orderStatus || ''}
                                onChange={handleStatusChange}
                            >
                                <option value="">Update Status...</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                            <button
                                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                                onClick={handleUpdateStatus}
                                disabled={updating || !statusToUpdate || statusToUpdate === currentOrder.orderStatus}
                            >
                                {updating ? 'Updating...' : 'Update Status'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders; 
