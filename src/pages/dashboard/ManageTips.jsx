import React, { useEffect, useState } from 'react';
import {
    Lightbulb,
    Plus,
    Trash2,
    Edit3,
    Calendar,
    Tag,
    X,
    Save
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const ManageTips = () => {
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTip, setEditingTip] = useState(null);

    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const fetchTips = async () => {
        setLoading(true);
        try {
            const res = await axiosPublic.get('/tips');
            setTips(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTips();
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editingTip) {
                const res = await axiosSecure.patch(`/tips/${editingTip._id}`, data);
                if (res.data.modifiedCount > 0) {
                    Swal.fire('Updated!', 'Financial tip has been updated.', 'success');
                }
            } else {
                const res = await axiosSecure.post('/tips', data);
                if (res.data.insertedId) {
                    Swal.fire('Added!', 'New financial tip published.', 'success');
                }
            }
            setIsModalOpen(false);
            reset();
            fetchTips();
        } catch (err) {
            Swal.fire('Error', 'Failed to save tip', 'error');
        }
    };

    const handleEdit = (tip) => {
        setEditingTip(tip);
        setValue('title', tip.title);
        setValue('category', tip.category);
        setValue('description', tip.description);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this tip?',
            text: "Users will no longer see this advice.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/tips/${id}`);
                Swal.fire('Deleted!', 'Tip has been removed.', 'success');
                fetchTips();
            } catch (err) {
                Swal.fire('Error', 'Failed to delete', 'error');
            }
        }
    };

    const openAddModal = () => {
        setEditingTip(null);
        reset();
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-8 rounded-3xl border border-base-content/5 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Lightbulb className="text-primary size-8" /> Financial Tips
                    </h2>
                    <p className="text-base-content/60 mt-1">Manage expert advice and system announcements.</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="btn btn-primary gap-2 shadow-lg shadow-primary/20 px-6 h-12 rounded-2xl text-white font-bold"
                >
                    <Plus className="size-5" /> Add New Tip
                </button>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                    <p className="font-bold opacity-50">Loading tips...</p>
                </div>
            ) : tips.length === 0 ? (
                <div className="bg-base-100 p-20 rounded-3xl border border-dashed border-base-content/20 text-center space-y-4">
                    <div className="bg-base-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto opacity-50">
                        <Lightbulb className="size-10" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">No tips found</h3>
                        <p className="opacity-60 max-w-xs mx-auto mt-2">Start adding financial wisdom to help your users manage their money better.</p>
                    </div>
                    <button onClick={openAddModal} className="btn btn-outline btn-primary rounded-xl">Create your first tip</button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tips.map(tip => (
                        <div key={tip._id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col">
                            <div className="card-body p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="badge badge-primary font-bold px-3 py-3 h-auto">{tip.category}</span>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleEdit(tip)} className="btn btn-ghost btn-xs btn-circle text-primary hover:bg-primary/10">
                                            <Edit3 className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(tip._id)} className="btn btn-ghost btn-xs btn-circle text-error hover:bg-error/10">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black mb-3 line-clamp-2">{tip.title}</h3>
                                <p className="text-sm opacity-70 leading-relaxed flex-1 line-clamp-4">{tip.description}</p>
                            </div>
                            <div className="px-6 py-4 bg-base-200/50 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40">
                                <Calendar className="size-3" /> Published on {new Date(tip.date).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-lg rounded-3xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                {editingTip ? <Edit3 className="text-primary" /> : <Plus className="text-primary" />}
                                {editingTip ? 'Edit Financial Tip' : 'New Financial Tip'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-sm">
                                <X className="size-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Tip Title</span>
                                </label>
                                <input
                                    {...register("title", { required: true })}
                                    placeholder="e.g. Save 20% of your income"
                                    className="input input-bordered w-full focus:border-primary font-bold"
                                />
                                {errors.title && <span className="text-error text-xs mt-1">Title is required</span>}
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Advice Category</span>
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-4 opacity-40" />
                                    <select
                                        {...register("category", { required: true })}
                                        className="select select-bordered w-full pl-11 focus:border-primary font-bold"
                                    >
                                        <option value="Savings">Savings</option>
                                        <option value="Budgeting">Budgeting</option>
                                        <option value="Investment">Investment</option>
                                        <option value="Debt">Debt Management</option>
                                        <option value="Lifestyle">Lifestyle</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text font-bold">Detailed Advice</span>
                                </label>
                                <textarea
                                    {...register("description", { required: true })}
                                    rows="4"
                                    placeholder="Explain the strategy to your users..."
                                    className="textarea textarea-bordered w-full focus:border-primary leading-relaxed"
                                />
                                {errors.description && <span className="text-error text-xs mt-1">Description is required</span>}
                            </div>

                            <div className="modal-action mt-8">
                                <button type="submit" className="btn btn-primary w-full h-14 rounded-2xl shadow-xl shadow-primary/20 text-lg gap-2 text-white">
                                    <Save className="size-5" />
                                    {editingTip ? 'Update Tip' : 'Publish Tip'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageTips;
