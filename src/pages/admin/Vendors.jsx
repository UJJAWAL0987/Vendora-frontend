import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchVendors, updateVendorStatus } from '../../redux/slices/vendorsSlice';
import { toast } from 'react-hot-toast';

const AdminVendors = () => {
    const dispatch = useDispatch();
    const { vendors, loading, error, updating, updateError } = useSelector(state => state.vendors);

    useEffect(() => {
        dispatch(fetchVendors());
    }, [dispatch]);

    useEffect(() => {
        if (error) toast.error(error);
        if (updateError) toast.error(updateError);
    }, [error, updateError]);

    const handleStatusToggle = (vendor) => {
        dispatch(updateVendorStatus({ id: vendor._id, isActive: !vendor.isActive }))
            .unwrap()
            .then(() => {
                toast.success(`Vendor ${vendor.isActive ? 'disapproved' : 'approved'} successfully`);
            })
            .catch(() => { });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Vendors</h1>
            {loading ? (
                <div className="text-center py-8">Loading vendors...</div>
            ) : (
                <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
                    <thead>
                        <tr>
                            <th className="py-2 px-4">Name</th>
                            <th className="py-2 px-4">Email</th>
                            <th className="py-2 px-4">Status</th>
                            <th className="py-2 px-4">Created</th>
                            <th className="py-2 px-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor._id}>
                                <td className="py-2 px-4">{vendor.name}</td>
                                <td className="py-2 px-4">{vendor.email}</td>
                                <td className="py-2 px-4">
                                    {vendor.isActive ? (
                                        <span className="text-green-600 font-semibold">Approved</span>
                                    ) : (
                                        <span className="text-yellow-600 font-semibold">Pending</span>
                                    )}
                                </td>
                                <td className="py-2 px-4">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                                <td className="py-2 px-4">
                                    <button
                                        className={`px-3 py-1 rounded ${vendor.isActive ? 'bg-red-500' : 'bg-green-500'} text-white disabled:opacity-50`}
                                        onClick={() => handleStatusToggle(vendor)}
                                        disabled={updating}
                                    >
                                        {vendor.isActive ? 'Disapprove' : 'Approve'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminVendors; 
