import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../../redux/slices/cartSlice';
import { createOrder } from '../../redux/slices/orderSlice';
import { FiUser, FiCreditCard, FiCheck, FiArrowRight, FiArrowLeft, FiPackage, FiMapPin, FiMail, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const ordersState = useSelector((state) => state.orders);
    const loading = ordersState?.loading || false;

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ').slice(1).join(' ') || '',
        email: user?.email || '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'USA'
        },
        paymentMethod: 'credit_card',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});

    // Auto-fill dummy data on component mount (for testing)
    useEffect(() => {
        // Only auto-fill if no user data is present
        if (!user?.name && !user?.email) {
            fillDummyData();
        }
    }, []);

    // Function to fill form with dummy data
    const fillDummyData = () => {
        const dummyData = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            address: {
                street: '123 Main Street',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
            },
            paymentMethod: 'credit_card',
            cardNumber: '4111 1111 1111 1111',
            expiryDate: '12/25',
            cvv: '123'
        };

        setFormData(dummyData);
        setErrors({}); // Clear any existing errors
    };

    const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10 : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const steps = [
        { id: 1, title: 'Shipping', icon: FiUser },
        { id: 2, title: 'Payment', icon: FiCreditCard },
        { id: 3, title: 'Review', icon: FiCheck }
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateStep = (step) => {
        const newErrors = {};

        if (step === 1) {
            if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
            if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
            if (!formData.email.trim()) newErrors.email = 'Email is required';
            if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
            if (!formData.address.street.trim()) newErrors['address.street'] = 'Street address is required';
            if (!formData.address.city.trim()) newErrors['address.city'] = 'City is required';
            if (!formData.address.state.trim()) newErrors['address.state'] = 'State is required';
            if (!formData.address.zipCode.trim()) newErrors['address.zipCode'] = 'ZIP code is required';
        }

        if (step === 2 && formData.paymentMethod === 'credit_card') {
            if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required';
            if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required';
            if (!formData.cvv.trim()) newErrors.cvv = 'CVV is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, 3));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!validateStep(currentStep)) {
            toast.error('Please fill in all required fields');
            return;
        }

        const orderData = {
            items: items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            shippingAddress: {
                name: `${formData.firstName} ${formData.lastName}`,
                phone: formData.phone,
                street: formData.address.street,
                city: formData.address.city,
                state: formData.address.state,
                zipCode: formData.address.zipCode,
                country: formData.address.country
            },
            paymentInfo: {
                id: `pay_${Date.now()}`,
                method: formData.paymentMethod === 'credit_card' ? 'stripe' : 'paypal'
            }
        };

        try {
            toast.loading('Creating your order...');
            await dispatch(createOrder(orderData)).unwrap();
            toast.dismiss();
            toast.success('Order placed successfully!');
            dispatch(clearCart());
            navigate('/orders');
        } catch (error) {
            toast.dismiss();
            console.error('Order creation failed:', error);
            console.error('Order data sent:', orderData);

            // Show specific error message if available
            const errorMessage = error?.message || error?.data?.message || 'Failed to create order. Please try again.';
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
    }, [items.length, navigate]);

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                    <p className="text-gray-600 dark:text-gray-400">Complete your purchase</p>
                </div>
            </div>

            {/* Stepper */}
            <div className="mb-8">
                <div className="flex items-center justify-center">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                    <step.icon className="w-6 h-6" />
                                </div>
                                <div className="ml-3">
                                    <p className={`text-sm font-medium ${currentStep >= step.id
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-500'
                                        }`}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id
                                    ? 'bg-blue-600'
                                    : 'bg-gray-200 dark:bg-gray-700'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Checkout Form */}
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FiUser className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shipping Information</h2>
                                    <button
                                        type="button"
                                        onClick={fillDummyData}
                                        className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <FiUser className="w-4 h-4" />
                                        Fill Dummy Data
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Email *
                                        </label>
                                        <div className="relative">
                                            <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                            />
                                        </div>
                                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Phone *
                                        </label>
                                        <div className="relative">
                                            <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                            />
                                        </div>
                                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Street Address *
                                        </label>
                                        <div className="relative">
                                            <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                name="address.street"
                                                value={formData.address.street}
                                                onChange={handleInputChange}
                                                className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors['address.street'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                    }`}
                                            />
                                        </div>
                                        {errors['address.street'] && <p className="text-red-500 text-sm mt-1">{errors['address.street']}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.city"
                                            value={formData.address.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors['address.city'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        {errors['address.city'] && <p className="text-red-500 text-sm mt-1">{errors['address.city']}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            State *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.state"
                                            value={formData.address.state}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors['address.state'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        {errors['address.state'] && <p className="text-red-500 text-sm mt-1">{errors['address.state']}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ZIP Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="address.zipCode"
                                            value={formData.address.zipCode}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors['address.zipCode'] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                }`}
                                        />
                                        {errors['address.zipCode'] && <p className="text-red-500 text-sm mt-1">{errors['address.zipCode']}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Country
                                        </label>
                                        <select
                                            name="address.country"
                                            value={formData.address.country}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        >
                                            <option value="USA">United States</option>
                                            <option value="Canada">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FiCreditCard className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Information</h2>
                                    <button
                                        type="button"
                                        onClick={fillDummyData}
                                        className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2"
                                    >
                                        <FiCreditCard className="w-4 h-4" />
                                        Fill Dummy Data
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Payment Method
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="credit_card"
                                                    checked={formData.paymentMethod === 'credit_card'}
                                                    onChange={handleInputChange}
                                                    className="mr-3"
                                                />
                                                <span>Credit Card</span>
                                            </label>
                                            <label className="flex items-center p-4 border border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="paypal"
                                                    checked={formData.paymentMethod === 'paypal'}
                                                    onChange={handleInputChange}
                                                    className="mr-3"
                                                />
                                                <span>PayPal</span>
                                            </label>
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'credit_card' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Card Number *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cardNumber"
                                                    value={formData.cardNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234 5678 9012 3456"
                                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.cardNumber ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                />
                                                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    Expiry Date *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="expiryDate"
                                                    value={formData.expiryDate}
                                                    onChange={handleInputChange}
                                                    placeholder="MM/YY"
                                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.expiryDate ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                />
                                                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    CVV *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="cvv"
                                                    value={formData.cvv}
                                                    onChange={handleInputChange}
                                                    placeholder="123"
                                                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${errors.cvv ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                                                        }`}
                                                />
                                                {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <FiCheck className="w-6 h-6 text-blue-600" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Review</h2>
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Shipping Address</h3>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {formData.firstName} {formData.lastName}<br />
                                            {formData.address.street}<br />
                                            {formData.address.city}, {formData.address.state} {formData.address.zipCode}<br />
                                            {formData.address.country}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                                        <p className="text-gray-600 dark:text-gray-400 capitalize">
                                            {formData.paymentMethod.replace('_', ' ')}
                                        </p>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Order Items</h3>
                                        <div className="space-y-3">
                                            {items.map((item, index) => (
                                                <div key={item.product._id || index} className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={item.product.image || '/placeholder-product.svg'}
                                                            alt={item.product.name}
                                                            className="w-12 h-12 object-cover rounded-lg"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-semibold text-gray-900 dark:text-white">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                >
                                    <FiArrowLeft className="w-4 h-4" />
                                    Previous
                                </button>
                            )}

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all ml-auto"
                                >
                                    Next
                                    <FiArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all ml-auto disabled:opacity-50"
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                    <FiCheck className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                            <FiPackage className="w-5 h-5" />
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {items.map((item, index) => (
                                <div key={item.product._id || index} className="flex items-center gap-3">
                                    <img
                                        src={item.product.image || '/placeholder-product.svg'}
                                        alt={item.product.name}
                                        className="w-12 h-12 object-cover rounded-lg"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 dark:text-white text-sm">{item.product.name}</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                                <span className="font-semibold">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                                <span className="font-semibold">${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Tax (8%)</span>
                                <span className="font-semibold">${tax.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout; 
