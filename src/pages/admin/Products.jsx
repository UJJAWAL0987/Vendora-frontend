import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllProducts, updateProductStatus, deleteProduct } from '../../redux/slices/productSlice';
import { FiPackage, FiSearch, FiFilter, FiEdit3, FiTrash2, FiEye, FiCheck, FiX, FiMoreVertical } from 'react-icons/fi';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { products, loading } = useSelector((state) => state.products);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [selectedVendor, setSelectedVendor] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [updatingProduct, setUpdatingProduct] = useState(null);

    useEffect(() => {
        dispatch(fetchAllProducts());
    }, [dispatch]);

    const handleStatusUpdate = async (productId, newStatus) => {
        setUpdatingProduct(productId);
        try {
            await dispatch(updateProductStatus({ productId, status: newStatus })).unwrap();
            dispatch(fetchAllProducts()); // Refresh products
        } catch (error) {
            console.error('Failed to update product status:', error);
        } finally {
            setUpdatingProduct(null);
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await dispatch(deleteProduct(productId)).unwrap();
                dispatch(fetchAllProducts()); // Refresh products
            } catch (error) {
                console.error('Failed to delete product:', error);
            }
        }
    };

    const getStatusColor = (status) => {
        if (!status) {
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }

        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    // Get unique categories and vendors for filters
    const categories = [...new Set(products.map(product => product.category))];
    const vendors = [...new Set(products.map(product => product.vendor?.name).filter(Boolean))];

    // Filter and sort products
    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
            const matchesStatus = selectedStatus === 'all' || (product.status || 'unknown') === selectedStatus;
            const matchesVendor = selectedVendor === 'all' || product.vendor?.name === selectedVendor;

            return matchesSearch && matchesCategory && matchesStatus && matchesVendor;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'price') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else if (sortBy === 'createdAt') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 h-64" />
                        ))}
                    </div>
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
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Product Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all products across vendors
                    </p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    {/* Vendor Filter */}
                    <div>
                        <select
                            value={selectedVendor}
                            onChange={(e) => setSelectedVendor(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">All Vendors</option>
                            {vendors.map(vendor => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        <option value="createdAt">Date Created</option>
                        <option value="name">Name</option>
                        <option value="price">Price</option>
                        <option value="status">Status</option>
                    </select>
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No products found</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Try adjusting your search or filter criteria
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            {/* Product Image */}
                            <div className="relative h-48 bg-gray-100 dark:bg-gray-700">
                                <img
                                    src={product.images?.[0]?.url || '/placeholder-product.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-3 right-3">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                                        {product.status || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-3">
                                        {product.description}
                                    </p>
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                            ${product.price}
                                        </span>
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                            Stock: {product.stock}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>Category: {product.category}</span>
                                        <span>Vendor: {product.vendor?.name || 'Unknown'}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {(product.status || 'unknown') === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusUpdate(product._id, 'active')}
                                                disabled={updatingProduct === product._id}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                                            >
                                                <FiCheck className="w-4 h-4" />
                                                {updatingProduct === product._id ? 'Updating...' : 'Approve'}
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(product._id, 'inactive')}
                                                disabled={updatingProduct === product._id}
                                                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                                            >
                                                <FiX className="w-4 h-4" />
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {(product.status || 'unknown') === 'active' && (
                                        <button
                                            onClick={() => handleStatusUpdate(product._id, 'inactive')}
                                            disabled={updatingProduct === product._id}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            <FiX className="w-4 h-4" />
                                            {updatingProduct === product._id ? 'Updating...' : 'Deactivate'}
                                        </button>
                                    )}

                                    {(product.status || 'unknown') === 'inactive' && (
                                        <button
                                            onClick={() => handleStatusUpdate(product._id, 'active')}
                                            disabled={updatingProduct === product._id}
                                            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm"
                                        >
                                            <FiCheck className="w-4 h-4" />
                                            {updatingProduct === product._id ? 'Updating...' : 'Activate'}
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        className="px-3 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{products.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Products</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {products.filter(p => (p.status || 'unknown') === 'active').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                            <FiCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {products.filter(p => (p.status || 'unknown') === 'pending').length}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
                            <FiEye className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Vendors</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{vendors.length}</p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                            <FiPackage className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProducts; 
