import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    FiUsers, FiSearch, FiFilter, FiEdit3, FiTrash2, FiEye, FiCheck, FiX, FiMoreVertical, FiMail, FiPhone, FiMapPin,
    FiCalendar, FiShield, FiUserCheck, FiUserX, FiDownload, FiRefreshCw, FiPlus, FiMail as FiEmail, FiActivity
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const AdminUsers = () => {
    const dispatch = useDispatch();
    const [users, setUsers] = useState([
        {
            _id: 1,
            name: 'Alice Johnson',
            email: 'alice@email.com',
            phone: '+1 (555) 123-4567',
            role: 'customer',
            status: 'active',
            orders: 12,
            totalSpent: 1250.50,
            lastLogin: '2024-01-15T10:30:00Z',
            joinedDate: '2023-06-15T09:00:00Z',
            address: {
                city: 'New York',
                state: 'NY',
                country: 'USA'
            },
            avatar: null
        },
        {
            _id: 2,
            name: 'Bob Smith',
            email: 'bob@email.com',
            phone: '+1 (555) 987-6543',
            role: 'customer',
            status: 'banned',
            orders: 5,
            totalSpent: 450.25,
            lastLogin: '2024-01-10T14:20:00Z',
            joinedDate: '2023-08-22T11:30:00Z',
            address: {
                city: 'Los Angeles',
                state: 'CA',
                country: 'USA'
            },
            avatar: null
        },
        {
            _id: 3,
            name: 'Charlie Brown',
            email: 'charlie@email.com',
            phone: '+1 (555) 456-7890',
            role: 'vendor',
            status: 'active',
            orders: 8,
            totalSpent: 890.75,
            lastLogin: '2024-01-14T16:45:00Z',
            joinedDate: '2023-09-10T13:15:00Z',
            address: {
                city: 'Chicago',
                state: 'IL',
                country: 'USA'
            },
            avatar: null
        },
        {
            _id: 4,
            name: 'Diana Prince',
            email: 'diana@email.com',
            phone: '+1 (555) 321-6540',
            role: 'customer',
            status: 'active',
            orders: 25,
            totalSpent: 3200.00,
            lastLogin: '2024-01-15T08:15:00Z',
            joinedDate: '2023-03-05T10:45:00Z',
            address: {
                city: 'Miami',
                state: 'FL',
                country: 'USA'
            },
            avatar: null
        },
        {
            _id: 5,
            name: 'Edward Wilson',
            email: 'edward@email.com',
            phone: '+1 (555) 789-0123',
            role: 'vendor',
            status: 'inactive',
            orders: 3,
            totalSpent: 180.50,
            lastLogin: '2024-01-05T12:30:00Z',
            joinedDate: '2023-11-20T15:20:00Z',
            address: {
                city: 'Seattle',
                state: 'WA',
                country: 'USA'
            },
            avatar: null
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleStatusToggle = async (userId, newStatus) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId
                        ? { ...user, status: newStatus }
                        : user
                )
            );

            toast.success(`User ${newStatus === 'active' ? 'activated' : 'banned'} successfully`);
        } catch (error) {
            toast.error('Failed to update user status');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error('Failed to delete user');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleExportUsers = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Status', 'Orders', 'Total Spent', 'Joined Date'],
            ...users.map(user => [
                user.name,
                user.email,
                user.role,
                user.status,
                user.orders,
                `$${user.totalSpent}`,
                new Date(user.joinedDate).toLocaleDateString()
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users-export.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Users exported successfully');
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
            case 'banned': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
            case 'vendor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
            case 'customer': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
        }
    };

    // Filter and sort users
    const filteredUsers = users
        .filter(user => {
            const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone.includes(searchTerm);
            const matchesRole = selectedRole === 'all' || user.role === selectedRole;
            const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'totalSpent' || sortBy === 'orders') {
                aValue = parseFloat(aValue);
                bValue = parseFloat(bValue);
            } else if (sortBy === 'joinedDate' || sortBy === 'lastLogin') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            } else {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const stats = {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        banned: users.filter(u => u.status === 'banned').length,
        customers: users.filter(u => u.role === 'customer').length,
        vendors: users.filter(u => u.role === 'vendor').length
    };

    return (
        <div className="container-responsive">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">User Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage all users, customers, and vendors
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                            <FiUserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Banned Users</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.banned}</p>
                        </div>
                        <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
                            <FiUserX className="w-6 h-6 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Customers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.customers}</p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                            <FiUsers className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendors</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.vendors}</p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                            <FiShield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search users by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Role Filter */}
                    <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customers</option>
                        <option value="vendor">Vendors</option>
                        <option value="admin">Admins</option>
                    </select>

                    {/* Status Filter */}
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="banned">Banned</option>
                    </select>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="email">Sort by Email</option>
                        <option value="joinedDate">Sort by Join Date</option>
                        <option value="lastLogin">Sort by Last Login</option>
                        <option value="orders">Sort by Orders</option>
                        <option value="totalSpent">Sort by Total Spent</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>

                    {/* Export Button */}
                    <button
                        onClick={handleExportUsers}
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                        <FiDownload className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role & Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Activity
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-medium text-sm">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {user.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">{user.email}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.address.city}, {user.address.state}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col gap-2">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                            </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                                                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {user.orders} orders • ${user.totalSpent.toLocaleString()}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Last login: {new Date(user.lastLogin).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowUserModal(true);
                                                }}
                                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleStatusToggle(user._id, user.status === 'active' ? 'banned' : 'active')}
                                                disabled={isLoading}
                                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${user.status === 'active'
                                                    ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                                                    }`}
                                            >
                                                {isLoading ? 'Updating...' : user.status === 'active' ? 'Ban' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                disabled={isLoading}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Details Modal */}
            {showUserModal && selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">User Details</h2>
                                <button
                                    onClick={() => setShowUserModal(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FiX className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">
                                            {selectedUser.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h3>
                                        <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <FiPhone className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">{selectedUser.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiMapPin className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">
                                            {selectedUser.address.city}, {selectedUser.address.state}, {selectedUser.address.country}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiCalendar className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">
                                            Joined: {new Date(selectedUser.joinedDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FiActivity className="w-5 h-5 text-gray-400" />
                                        <span className="text-gray-900 dark:text-white">
                                            Last login: {new Date(selectedUser.lastLogin).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.orders}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">${selectedUser.totalSpent.toLocaleString()}</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
                                    </div>
                                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedUser.orders > 0 ? (selectedUser.totalSpent / selectedUser.orders).toFixed(2) : 0}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Avg Order</div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => {
                                            // Handle send email
                                            toast.success('Email sent successfully');
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <FiEmail className="w-4 h-4" />
                                        Send Email
                                    </button>
                                    <button
                                        onClick={() => handleStatusToggle(selectedUser._id, selectedUser.status === 'active' ? 'banned' : 'active')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedUser.status === 'active'
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : 'bg-green-600 text-white hover:bg-green-700'
                                            }`}
                                    >
                                        {selectedUser.status === 'active' ? <FiUserX className="w-4 h-4" /> : <FiUserCheck className="w-4 h-4" />}
                                        {selectedUser.status === 'active' ? 'Ban User' : 'Activate User'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
