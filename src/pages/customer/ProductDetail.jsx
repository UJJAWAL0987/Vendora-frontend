import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../../redux/slices/productSlice';
import { addToCart } from '../../redux/slices/cartSlice';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentProduct, loading, error } = useSelector((state) => state.products);
    const { items } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);

    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const [showToast, setShowToast] = useState(false);
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchProductById(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentProduct && currentProduct.images?.length > 0) {
            setSelectedImage(0);
        }
    }, [currentProduct]);

    const handleAddToCart = () => {
        if (!currentProduct) return;
        dispatch(addToCart({ product: currentProduct, quantity }));
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    const handleFavorite = () => setFavorite((f) => !f);

    const isInCart = () => {
        return items.some(item => item.id === currentProduct?._id);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= 1 && newQuantity <= currentProduct.stock) {
            setQuantity(newQuantity);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto p-4">
                <div className="flex justify-center items-center h-96">
                    <div className="animate-pulse bg-white dark:bg-gray-800 rounded-2xl shadow-lg w-full max-w-3xl h-96" />
                </div>
            </div>
        );
    }

    if (error || !currentProduct) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center py-12">
                    <div className="text-red-600 text-lg mb-4">Product not found</div>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-10">
                {/* Product Images */}
                <div className="space-y-4">
                    <div className="relative w-full aspect-w-1 aspect-h-1 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg group">
                        <img
                            src={currentProduct.images[selectedImage]?.url || '/placeholder-product.svg'}
                            alt={currentProduct.name}
                            className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                            onError={(e) => {
                                e.target.src = '/placeholder-product.svg';
                            }}
                        />
                        {/* Discount Badge */}
                        {currentProduct.discount > 0 && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                                -{currentProduct.discount}%
                            </div>
                        )}
                        {/* Favorite Button */}
                        <button
                            className={`absolute top-4 right-4 z-10 p-3 rounded-full bg-white/80 hover:bg-pink-100 transition-colors ${favorite ? 'text-pink-500' : 'text-gray-400'}`}
                            onClick={handleFavorite}
                            aria-label="Add to favorites"
                        >
                            <FiHeart className={`w-6 h-6 transition-transform ${favorite ? 'scale-125' : ''}`} />
                        </button>
                    </div>
                    {/* Thumbnails */}
                    {currentProduct.images && currentProduct.images.length > 1 && (
                        <div className="flex gap-2 mt-2">
                            {currentProduct.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 ${selectedImage === index ? 'border-blue-500' : 'border-gray-300'} transition-all`}
                                >
                                    <img
                                        src={image.url}
                                        alt={`${currentProduct.name} ${index + 1}`}
                                        className="w-full h-full object-cover object-center"
                                        onError={(e) => {
                                            e.target.src = '/placeholder-product.svg';
                                        }}
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Information */}
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
                            {currentProduct.name}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                            by <span className="font-semibold">{currentProduct.vendor?.name || 'Unknown Vendor'}</span>
                        </p>
                        {/* Rating */}
                        <div className="flex items-center mb-4">
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <FiStar
                                        key={i}
                                        className={`w-6 h-6 ${i < Math.floor(currentProduct.ratings?.average || 0) ? 'fill-current' : 'fill-gray-300'}`}
                                    />
                                ))}
                            </div>
                            <span className="ml-3 text-gray-600 dark:text-gray-400 text-lg">
                                {currentProduct.ratings?.average?.toFixed(1) || '0'} ({currentProduct.ratings?.count || 0} reviews)
                            </span>
                        </div>
                        {/* Price & Stock */}
                        <div className="flex items-center gap-4 mb-6">
                            {currentProduct.originalPrice && currentProduct.originalPrice > currentProduct.price && (
                                <span className="text-gray-400 line-through text-2xl">
                                    ${currentProduct.originalPrice}
                                </span>
                            )}
                            <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                ${currentProduct.price}
                            </span>
                            {currentProduct.discount > 0 && (
                                <span className="bg-red-500 text-white px-3 py-1 rounded text-base font-bold">
                                    -{currentProduct.discount}%
                                </span>
                            )}
                        </div>
                        {/* Stock Status */}
                        <div className="mb-6">
                            <span className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${currentProduct.stock > 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>
                        {/* Quantity and Add to Cart */}
                        <div className="flex items-center gap-6 mb-6">
                            <div className="flex items-center gap-2">
                                <label className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                    Quantity:
                                </label>
                                <div className="flex items-center border rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        disabled={quantity <= 1}
                                        className="px-4 py-2 border-r hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-xl"
                                    >
                                        -
                                    </button>
                                    <span className="px-6 py-2 text-lg">{quantity}</span>
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        disabled={quantity >= currentProduct.stock}
                                        className="px-4 py-2 border-l hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                disabled={currentProduct.stock === 0}
                                className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-full shadow-lg transition-all text-lg disabled:opacity-50"
                            >
                                <FiShoppingBag className="w-6 h-6" /> Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Tabs for Description, Reviews, Vendor Info */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6">
                        <div className="flex gap-6 border-b mb-4">
                            {['description', 'reviews', 'vendor'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-2 text-lg font-semibold transition-all border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600'}`}
                                >
                                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        {activeTab === 'description' && (
                            <div className="text-gray-700 dark:text-gray-200 text-lg min-h-[80px] animate-fade-in">
                                {currentProduct.description}
                            </div>
                        )}
                        {activeTab === 'reviews' && (
                            <div className="text-gray-700 dark:text-gray-200 text-lg min-h-[80px] animate-fade-in">
                                {currentProduct.reviews && currentProduct.reviews.length > 0 ? (
                                    <ul className="space-y-4">
                                        {currentProduct.reviews.map((review, idx) => (
                                            <li key={idx} className="border-b pb-2">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-blue-600">{review.user?.name || 'User'}</span>
                                                    <span className="text-yellow-400 flex items-center">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FiStar key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'fill-gray-300'}`} />
                                                        ))}
                                                    </span>
                                                </div>
                                                <div className="text-gray-600 dark:text-gray-300">{review.comment}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="text-gray-400">No reviews yet.</div>
                                )}
                            </div>
                        )}
                        {activeTab === 'vendor' && (
                            <div className="text-gray-700 dark:text-gray-200 text-lg min-h-[80px] animate-fade-in">
                                <div className="font-bold mb-2">Vendor Information</div>
                                <div>Name: {currentProduct.vendor?.name || 'Unknown'}</div>
                                <div>Email: {currentProduct.vendor?.email || 'N/A'}</div>
                                <div>Shop: {currentProduct.vendor?.shopName || 'N/A'}</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 animate-fade-in">
                    Added to cart!
                </div>
            )}
        </div>
    );
};

export default ProductDetail; 
