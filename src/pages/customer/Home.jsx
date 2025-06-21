import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import { fetchProducts } from '../../redux/slices/productSlice';
import { FiShoppingBag, FiStar, FiTruck, FiShield, FiHeadphones, FiHeart, FiSearch } from 'react-icons/fi';

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { items } = useSelector((state) => state.cart);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name');
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(12);
    const [showToast, setShowToast] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState([]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const categories = ['All', 'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Beauty', 'Books', 'Toys', 'Automotive', 'Health', 'Food', 'Other'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price;
            case 'price-high':
                return b.price - a.price;
            case 'rating':
                return b.ratings?.average - a.ratings?.average;
            case 'name':
            default:
                return a.name.localeCompare(b.name);
        }
    });

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    const handleAddToCart = (product) => {
        dispatch(addToCart({ product, quantity: 1 }));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleFavorite = (id) => {
        setFavoriteIds((prev) =>
            prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
        );
    };

    const isInCart = (productId) => {
        return items.some(item => item.id === productId);
    };

    const features = [
        {
            icon: FiTruck,
            title: 'Free Shipping',
            description: 'Free shipping on orders over $50'
        },
        {
            icon: FiShield,
            title: 'Secure Payment',
            description: '100% secure payment processing'
        },
        {
            icon: FiHeadphones,
            title: '24/7 Support',
            description: 'Round the clock customer support'
        },
        {
            icon: FiShoppingBag,
            title: 'Easy Returns',
            description: '30-day return policy'
        }
    ];

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center text-red-600">
                    Error loading products: {error}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-blue-700 via-purple-600 to-pink-500 text-white rounded-3xl p-10 mb-10 overflow-hidden shadow-xl flex flex-col md:flex-row items-center justify-between min-h-[320px]">
                <div className="z-10">
                    <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">Discover Amazing Products</h1>
                    <p className="text-2xl mb-6 font-light">Shop from trusted vendors. Enjoy exclusive deals!</p>
                    <button className="bg-white text-blue-700 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-blue-100 transition-all text-lg">Shop Now</button>
                </div>
                <div className="hidden md:flex absolute right-8 bottom-0 w-72 h-72 items-center justify-center opacity-80 z-0">
                    <FiShoppingBag className="w-48 h-48 text-white/30" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 pointer-events-none rounded-3xl" />
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto mb-8">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-full bg-white dark:bg-gray-900 shadow focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-all"
                />
            </div>

            {/* Filters and Sort */}
            <div className="flex flex-wrap gap-4 mb-6 items-center justify-between">
                <div className="flex gap-2 flex-wrap items-center">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 shadow"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-900 shadow"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Sort by Rating</option>
                    </select>
                    {/* Active Filters as Chips */}
                    {selectedCategory !== 'All' && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1 animate-fade-in">
                            {selectedCategory}
                            <button onClick={() => setSelectedCategory('All')} className="ml-1 text-blue-700 hover:text-blue-900">&times;</button>
                        </span>
                    )}
                </div>
                <div className="text-gray-600 dark:text-gray-300 text-lg">
                    {filteredProducts.length} products found
                </div>
            </div>

            {/* Skeleton Loader */}
            {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {[...Array(productsPerPage)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg h-80" />
                    ))}
                </div>
            )}

            {/* Products Grid */}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-10">
                    {currentProducts.map((product) => (
                        <div
                            key={product._id}
                            className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group transition-transform duration-300 hover:scale-105 hover:shadow-2xl"
                        >
                            {/* Badges */}
                            {product.discount > 0 && (
                                <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-bounce">
                                    -{product.discount}%
                                </div>
                            )}
                            {product.createdAt && (Date.now() - new Date(product.createdAt).getTime() < 1000 * 60 * 60 * 24 * 7) && (
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10 animate-fade-in">
                                    New
                                </div>
                            )}
                            {/* Favorite Button */}
                            <button
                                className={`absolute top-3 right-3 z-20 p-2 rounded-full bg-white/80 hover:bg-pink-100 transition-colors ${favoriteIds.includes(product._id) ? 'text-pink-500' : 'text-gray-400'}`}
                                onClick={() => handleFavorite(product._id)}
                                aria-label="Add to favorites"
                            >
                                <FiHeart className={`w-5 h-5 transition-transform ${favoriteIds.includes(product._id) ? 'scale-125' : ''}`} />
                            </button>
                            {/* Product Image */}
                            <div className="relative h-52 bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                <img
                                    src={product.images[0]?.url || '/placeholder-product.svg'}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                        e.target.src = '/placeholder-product.svg';
                                    }}
                                />
                            </div>
                            {/* Product Info */}
                            <div className="p-5 flex flex-col gap-2">
                                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white truncate">
                                    {product.name}
                                </h3>
                                <div className="flex items-center mb-1">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < Math.floor(product.ratings?.average || 0) ? 'fill-current' : 'fill-gray-300'}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                        ({product.ratings?.count || 0})
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                                    {product.description}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                    {product.originalPrice && product.originalPrice > product.price && (
                                        <span className="text-gray-400 line-through text-base">${product.originalPrice}</span>
                                    )}
                                    <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${product.price}</span>
                                </div>
                                {/* Add to Cart Button */}
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-full mt-2 transition-all shadow group-hover:scale-105 group-hover:shadow-lg"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <FiShoppingBag /> Add to Cart
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-2 mt-8">
                <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-blue-100 disabled:opacity-50 transition-all"
                >
                    &larr;
                </button>
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-full font-bold transition-all ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}
                <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-blue-100 disabled:opacity-50 transition-all"
                >
                    &rarr;
                </button>
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
                    Added to cart!
                </div>
            )}

            {/* Features Section */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800">
                <div className="container-responsive">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                            Why Choose Us
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            We provide the best shopping experience for our customers
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-primary-600 text-white">
                <div className="container-responsive text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Start Shopping?
                    </h2>
                    <p className="text-xl mb-8 text-primary-100">
                        Join thousands of satisfied customers
                    </p>
                    <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                        Browse Products
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home; 
