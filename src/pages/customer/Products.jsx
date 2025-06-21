import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import {
    FiSearch,
    FiFilter,
    FiGrid,
    FiList,
    FiHeart,
    FiShoppingCart,
    FiStar,
    FiPackage
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Products = () => {
    const dispatch = useDispatch();
    const { products, loading, pagination } = useSelector((state) => state.products);
    const { user } = useSelector((state) => state.auth);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedVendor, setSelectedVendor] = useState('all');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const params = {
            page: currentPage,
            limit: 12,
            search: searchTerm,
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            vendor: selectedVendor !== 'all' ? selectedVendor : undefined,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
            sortBy
        };

        dispatch(fetchProducts(params));
    }, [dispatch, currentPage, searchTerm, selectedCategory, selectedVendor, priceRange, sortBy]);

    const handleAddToCart = (product) => {
        if (!user) {
            toast.error('Please login to add items to cart');
            return;
        }

        dispatch(addToCart({ product, quantity: 1 }));
        toast.success(`${product.name} added to cart!`);
    };

    const handleAddToWishlist = (product) => {
        if (!user) {
            toast.error('Please login to add items to wishlist');
            return;
        }
        toast.success(`${product.name} added to wishlist!`);
    };

    const categories = ['all', 'electronics', 'clothing', 'books', 'home', 'sports', 'beauty'];
    const vendors = ['all', 'TechStore', 'FashionHub', 'BookWorld', 'HomeEssentials'];
    const sortOptions = [
        { value: 'newest', label: 'Newest First' },
        { value: 'oldest', label: 'Oldest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' },
        { value: 'name_asc', label: 'Name: A to Z' },
        { value: 'name_desc', label: 'Name: Z to A' }
    ];

    const getRatingStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FiStar
                    key={i}
                    className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
            );
        }
        return stars;
    };

    if (loading && currentPage === 1) {
        return (
            <div className="container-responsive">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
                        <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700" />
                            <div className="p-6 space-y-3">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
                                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container-responsive">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiPackage className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Products</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {pagination?.total || 0} products found
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="mb-8 space-y-4">
                {/* Search Bar */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-800"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2"
                    >
                        <FiFilter className="w-4 h-4" />
                        Filters
                    </button>
                    <div className="flex border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`px-3 py-3 transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <FiGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-3 transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            <FiList className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filters Panel */}
                {showFilters && (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Category
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category.charAt(0).toUpperCase() + category.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Vendor Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Vendor
                                </label>
                                <select
                                    value={selectedVendor}
                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                                >
                                    {vendors.map(vendor => (
                                        <option key={vendor} value={vendor}>
                                            {vendor.charAt(0).toUpperCase() + vendor.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={priceRange[0]}
                                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={priceRange[1]}
                                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                                    />
                                </div>
                            </div>

                            {/* Sort By */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Sort By
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
                                >
                                    {sortOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Grid */}
            {products.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                        <FiPackage className="w-16 h-16 text-gray-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">No products found</h2>
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
                        Try adjusting your search or filters to find what you're looking for.
                    </p>
                    <button
                        onClick={() => {
                            setSearchTerm('');
                            setSelectedCategory('all');
                            setSelectedVendor('all');
                            setPriceRange([0, 1000]);
                            setSortBy('newest');
                        }}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
                        {products.map((product) => (
                            <div key={product._id} className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${viewMode === 'list' ? 'flex' : ''}`}>
                                {/* Product Image */}
                                <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'h-48'}`}>
                                    <img
                                        src={product.images?.[0]?.url || '/placeholder-product.svg'}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.svg';
                                        }}
                                    />
                                    {product.discount > 0 && (
                                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                            -{product.discount}%
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleAddToWishlist(product)}
                                        className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                                    >
                                        <FiHeart className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                                    <div className="mb-4">
                                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                            by {product.vendor?.name || 'Unknown Vendor'}
                                        </p>
                                        <div className="flex items-center gap-1 mb-2">
                                            {getRatingStars(product.rating || 0)}
                                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                                                ({product.reviews?.length || 0})
                                            </span>
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                                            {product.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                ${product.price}
                                            </p>
                                            {product.originalPrice && product.originalPrice > product.price && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ${product.originalPrice}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-2">
                                            <Link
                                                to={`/product/${product._id}`}
                                                className="px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all flex items-center gap-2"
                                            >
                                                <FiShoppingCart className="w-4 h-4" />
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                {[...Array(pagination.pages)].map((_, i) => {
                                    const page = i + 1;
                                    if (page === 1 || page === pagination.pages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg transition-all ${page === currentPage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                                        return <span key={page} className="px-2">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setCurrentPage(Math.min(pagination.pages, currentPage + 1))}
                                    disabled={currentPage === pagination.pages}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Products; 
