import React, { useEffect, useState } from 'react';
import {
    Plus,
    Target,
    TrendingUp,
    Trash2,
    Edit3,
    Wallet,
    Calendar,
    ChevronRight,
    Calculator
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Swal from 'sweetalert2';

const SavingsGoals = () => {
    const [goals, setGoals] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);

    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const fetchData = async () => {
        try {
            const [goalsRes, transRes] = await Promise.all([
                axiosSecure.get('/goals'),
                axiosSecure.get('/transactions')
            ]);
            setGoals(goalsRes.data);
            setTransactions(transRes.data.transactions);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onSubmit = async (data) => {
        try {
            const goalData = {
                ...data,
                targetAmount: parseFloat(data.targetAmount),
                currentAmount: parseFloat(data.currentAmount || 0)
            };

            if (editingGoal) {
                await axiosSecure.patch(`/goals/${editingGoal._id}`, goalData);
                Swal.fire('Updated!', 'Goal has been modified.', 'success');
            } else {
                await axiosSecure.post('/goals', goalData);
                Swal.fire('Success!', 'New savings goal set.', 'success');
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            Swal.fire('Error', 'Something went wrong', 'error');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Goal?',
            text: "This cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Yes, delete it'
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/goals/${id}`);
                Swal.fire('Deleted!', 'Goal has been removed.', 'success');
                fetchData();
            } catch (err) {
                Swal.fire('Error', 'Deletion failed', 'error');
            }
        }
    };

    const openAddModal = () => {
        setEditingGoal(null);
        reset({ title: '', targetAmount: '', currentAmount: 0, deadline: '' });
        setIsModalOpen(true);
    };

    const openEditModal = (goal) => {
        setEditingGoal(goal);
        reset({
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline?.split('T')[0]
        });
        setIsModalOpen(true);
    };

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-content/5 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <Target className="text-primary size-7" /> Savings Goals
                    </h2>
                    <p className="text-base-content/60 text-sm">Plan and track your future milestones.</p>
                </div>
                <button onClick={openAddModal} className="btn btn-primary gap-2 shadow-lg shadow-primary/20">
                    <Plus className="size-5" /> Set New Goal
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => {
                    const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
                    const remaining = goal.targetAmount - goal.currentAmount;

                    return (
                        <div key={goal._id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:shadow-md transition-all group">
                            <div className="card-body p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-xl">
                                        <Wallet className="size-6" />
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => openEditModal(goal)} className="btn btn-ghost btn-xs btn-square">
                                            <Edit3 className="size-4" />
                                        </button>
                                        <button onClick={() => handleDelete(goal._id)} className="btn btn-ghost btn-xs btn-square text-error">
                                            <Trash2 className="size-4" />
                                        </button>
                                    </div>
                                </div>

                                <h3 className="text-lg font-black truncate">{goal.title}</h3>
                                <div className="flex justify-between text-xs font-bold opacity-50 mt-1 uppercase tracking-widest">
                                    <span>Target</span>
                                    <span>${goal.targetAmount.toLocaleString()}</span>
                                </div>

                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-sm font-black">
                                        <span>Progress</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-base-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-between items-end pt-4 border-t border-base-content/5">
                                    <div>
                                        <p className="text-[10px] font-bold opacity-40 uppercase">Saved so far</p>
                                        <p className="font-black text-xl text-primary">${goal.currentAmount.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold opacity-40 uppercase">Remaining</p>
                                        <p className="font-bold text-sm text-base-content/70">${remaining > 0 ? remaining.toLocaleString() : 0}</p>
                                    </div>
                                </div>

                                {goal.deadline && (
                                    <div className="mt-4 flex items-center gap-2 text-[10px] font-bold opacity-50 bg-base-200/50 w-fit px-2 py-1 rounded">
                                        <Calendar className="size-3" />
                                        Deadline: {new Date(goal.deadline).toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {goals.length === 0 && (
                    <div className="col-span-full py-20 bg-base-100 rounded-3xl border border-dashed border-base-content/20 flex flex-col items-center justify-center opacity-40">
                        <Target className="size-16 mb-4" />
                        <p className="font-bold text-xl uppercase tracking-tighter">No goals set yet</p>
                        <p className="text-sm">Start planning your next big milestone!</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal modal-open">
                    <div className="modal-box rounded-3xl p-0 overflow-hidden max-w-sm">
                        <div className="bg-primary p-6 text-primary-content">
                            <h3 className="text-xl font-black">{editingGoal ? 'Edit Goal' : 'Set New Goal'}</h3>
                        </div>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                            <div className="form-control">
                                <label className="label-text font-bold mb-2">Goal Title</label>
                                <input type="text" className="input input-bordered w-full" placeholder="e.g. New Macbook Pro" {...register("title", { required: true })} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="form-control">
                                    <label className="label-text font-bold mb-2">Target Amount</label>
                                    <input type="number" className="input input-bordered w-full" placeholder="5000" {...register("targetAmount", { required: true })} />
                                </div>
                                <div className="form-control">
                                    <label className="label-text font-bold mb-2">Saved Already</label>
                                    <input type="number" className="input input-bordered w-full" placeholder="0" {...register("currentAmount")} />
                                </div>
                            </div>
                            <div className="form-control">
                                <label className="label-text font-bold mb-2">Target Deadline (Optional)</label>
                                <input type="date" className="input input-bordered w-full" {...register("deadline")} />
                            </div>
                            <div className="modal-action">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
                                <button type="submit" className="btn btn-primary px-8">Confirm</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SavingsGoals;
