import React, { useEffect, useState } from 'react';
import {
    Users,
    Shield,
    ShieldAlert,
    Trash2,
    Mail,
    Search,
    UserCheck,
    MoreVertical
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const axiosSecure = useAxiosSecure();

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await axiosSecure.get('/users', {
                params: {
                    page: currentPage,
                    limit: 10,
                    search: searchTerm
                }
            });
            setUsers(res.data.users);
            setTotalPages(res.data.totalPages);
            setTotalItems(res.data.total);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
    };

    const handleToggleRole = async (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin';

        const result = await Swal.fire({
            title: `Make ${user.fullname} an ${newRole}?`,
            text: "This will change their access level immediately.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#6366f1',
            confirmButtonText: 'Yes, change role'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.patch(`/users/role/${user._id}`, { role: newRole });
                Swal.fire('Updated!', `Role changed to ${newRole}`, 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Failed to update role', 'error');
            }
        }
    };

    const handleDeleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            text: `This will remove ${user.fullname} and all their data permanently!`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete permanently'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/users/${user._id}`);
                Swal.fire('Deleted!', 'User has been removed from the system.', 'success');
                fetchUsers();
            } catch (err) {
                Swal.fire('Error', 'Deletion failed', 'error');
            }
        }
    };

    if (loading && currentPage === 1 && !searchTerm) return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="font-bold opacity-50">Fetching system users...</p>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-8 rounded-3xl border border-base-content/5 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Users className="text-primary size-8" /> User Management
                    </h2>
                    <p className="text-base-content/60 mt-1">Total {totalItems} registered users in the system.</p>
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="input input-bordered w-full pl-12 rounded-2xl h-12 focus:border-primary"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-base-100 rounded-3xl border border-base-content/5 shadow-sm overflow-hidden flex flex-col">
                <div className="overflow-x-auto flex-1">
                    <table className="table table-zebra table-lg">
                        <thead>
                            <tr className="bg-base-200/50">
                                <th className="py-6 pl-8">User Details</th>
                                <th>Role</th>
                                <th>Account Status</th>
                                <th className="text-center pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user._id} className="hover:bg-base-200/30 transition-colors">
                                    <td className="pl-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="avatar">
                                                <div className="w-12 h-12 rounded-2xl">
                                                    <img src={user.photo || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bSzVdk7zkqIZQ9G06tUJ9qzKLoADZQDg.jpg"} alt={user.fullname} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-black text-base">{user.fullname}</p>
                                                <div className="flex items-center gap-1 text-xs opacity-50 font-medium">
                                                    <Mail className="size-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        {user.role === 'admin' ? (
                                            <div className="badge badge-primary gap-1 font-bold h-7 px-3">
                                                <Shield className="size-3" /> Administrator
                                            </div>
                                        ) : (
                                            <div className="badge badge-ghost gap-1 font-bold h-7 px-3 opacity-60">
                                                <UserCheck className="size-3" /> Regular User
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                                            <span className="text-sm font-bold opacity-70">Active</span>
                                        </div>
                                    </td>
                                    <td className="pr-8">
                                        <div className="flex items-center justify-center gap-2">
                                            <button
                                                onClick={() => handleToggleRole(user)}
                                                className={`btn btn-sm btn-square ${user.role === 'admin' ? 'btn-ghost text-warning' : 'btn-ghost text-primary'}`}
                                                title={user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                                            >
                                                {user.role === 'admin' ? <ShieldAlert className="size-5" /> : <Shield className="size-5" />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user)}
                                                className="btn btn-sm btn-square btn-ghost text-error"
                                                title="Delete User"
                                            >
                                                <Trash2 className="size-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && !loading && (
                    <div className="p-20 text-center opacity-40">
                        <Users className="size-16 mx-auto mb-4" />
                        <p className="font-black text-xl">No users match your search</p>
                    </div>
                )}

                {/* Pagination footer */}
                {users.length > 0 && (
                    <div className="p-8 border-t border-base-content/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <p className="text-sm opacity-60 italic">
                            Showing <span className="font-bold">{users.length}</span> of <span className="font-bold">{totalItems}</span> registered accounts
                        </p>
                        <div className="join">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                className="join-item btn btn-sm px-4"
                            >
                                Previous
                            </button>
                            <button className="join-item btn btn-sm no-animation bg-primary text-primary-content pointer-events-none">
                                Page {currentPage} of {totalPages}
                            </button>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                className="join-item btn btn-sm px-4"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
