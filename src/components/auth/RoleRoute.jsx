import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, role, loading } = useSelector((state) => state.auth);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(role)) {
        // Redirect based on role
        switch (role) {
            case 'customer':
                return <Navigate to="/" replace />;
            case 'vendor':
                return <Navigate to="/vendor" replace />;
            case 'admin':
                return <Navigate to="/admin" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return children;
};

export default RoleRoute; 
