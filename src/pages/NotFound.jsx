import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-400">404</h1>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                    Page Not Found
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/"
                        className="btn-primary inline-flex items-center justify-center"
                    >
                        <FiHome className="h-5 w-5 mr-2" />
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="btn-outline inline-flex items-center justify-center"
                    >
                        <FiArrowLeft className="h-5 w-5 mr-2" />
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound; 
