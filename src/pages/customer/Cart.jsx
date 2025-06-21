import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../../redux/slices/cartSlice';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiArrowLeft, FiPackage } from 'react-icons/fi';

const Cart = () => {
    const dispatch = useDispatch();
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [removingItem, setRemovingItem] = useState(null);

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) {
            setRemovingItem(itemId);
            setTimeout(() => {
                dispatch(removeFromCart(itemId));
                setRemovingItem(null);
            }, 300);
        } else {
            dispatch(updateQuantity({ id: itemId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (itemId) => {
        setRemovingItem(itemId);
        setTimeout(() => {
            dispatch(removeFromCart(itemId));
            setRemovingItem(null);
        }, 300);
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    if (items.length === 0) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FiShoppingCart className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                        Looks like you haven't added any products to your cart yet. Start shopping to discover amazing products!
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        <FiArrowLeft className="w-5 h-5" />
                        Start Shopping
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
                    <FiShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
                    <p className="text-gray-600 dark:text-gray-400">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <FiPackage className="w-5 h-5" />
                                Cart Items ({items.length})
                            </h2>
                            <button
                                onClick={handleClearCart}
                                className="text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-full transition-all"
                            >
                                Clear All
                            </button>
                        </div>

                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className={`flex items-center gap-4 p-6 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-all duration-300 ${removingItem === item.id ? 'opacity-50 scale-95' : ''
                                        }`}
                                >
                                    <div className="relative">
                                        <img
                                            src={item.image || '/placeholder-product.svg'}
                                            alt={item.name}
                                            className="w-24 h-24 object-cover rounded-xl shadow-md"
                                            onError={(e) => {
                                                e.target.src = '/placeholder-product.svg';
                                            }}
                                        />
                                        {item.discount > 0 && (
                                            <div className="absolute -top-2 -left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                -{item.discount}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-lg">
                                            {item.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            Vendor: <span className="font-medium">{item.vendor}</span>
                                        </p>
                                        <p className="text-blue-600 font-bold text-lg">
                                            ${item.price}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full overflow-hidden">
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FiMinus className="w-4 h-4" />
                                            </button>
                                            <span className="w-12 text-center font-semibold text-lg">
                                                {item.quantity}
                                            </span>
                                            <button
                                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                            >
                                                <FiPlus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-red-600 hover:text-red-700 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-full transition-all flex items-center gap-1"
                                        >
                                            <FiTrash2 className="w-4 h-4" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FiPackage className="w-5 h-5" />
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-semibold text-lg">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-semibold">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                                <span className="font-semibold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {user ? (
                            <Link
                                to="/checkout"
                                className="w-full bg-blue-600 text-white py-4 px-6 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-center block text-lg"
                            >
                                Proceed to Checkout
                            </Link>
                        ) : (
                            <div className="space-y-3">
                                <Link
                                    to="/login"
                                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl text-center block text-lg"
                                >
                                    Login to Checkout
                                </Link>
                                <Link
                                    to="/register"
                                    className="w-full bg-gray-600 text-white py-4 px-6 rounded-full font-semibold hover:bg-gray-700 transition-all shadow-lg hover:shadow-xl text-center block text-lg"
                                >
                                    Create Account
                                </Link>
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <Link
                                to="/"
                                className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-full transition-all inline-flex items-center gap-2"
                            >
                                <FiArrowLeft className="w-4 h-4" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart; 
