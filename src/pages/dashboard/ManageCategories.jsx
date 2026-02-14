import React, { useEffect, useState } from 'react';
import {
    Layers,
    Plus,
    Trash2,
    Tag,
    Search,
    CheckCircle2,
    X
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import Swal from 'sweetalert2';

const ManageCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();

    const fetchCategories = async () => {
        try {
            const res = await axiosPublic.get('/categories');
            setCategories(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;

        try {
            const res = await axiosSecure.post('/categories', { name: newCategory.trim() });
            if (res.data.insertedId) {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'Category added',
                    showConfirmButton: false,
                    timer: 2000
                });
                setNewCategory("");
                fetchCategories();
            }
        } catch (err) {
            Swal.fire('Error', 'Failed to add category', 'error');
        }
    };

    // Note: Backend delete for categories isn't implemented in the snippet above, 
    // but I'll add the UI and a dummy handler for now or implement it if needed.
    const handleDeleteCategory = async (id, name) => {
        Swal.fire({
            title: `Delete ${name}?`,
            text: "This category will no longer be available for new transactions.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete'
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Assuming backend delete category exists or will be added
                await axiosSecure.delete(`/categories/${id}`);
                fetchCategories();
            }
        });
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-base-100 p-8 rounded-3xl border border-base-content/5 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
                        <Layers className="text-primary size-8" /> Category Management
                    </h2>
                    <p className="text-base-content/60 mt-1">Configure global transaction categories.</p>
                </div>

                <form onSubmit={handleAddCategory} className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                        <input
                            type="text"
                            placeholder="New category name..."
                            className="input input-bordered w-full pl-12 rounded-2xl h-12 focus:border-primary font-bold"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary h-12 rounded-2xl px-6 shadow-lg shadow-primary/20">
                        <Plus className="size-5" /> Add
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2 lg:col-span-4 relative mb-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-base-content/30" />
                    <input
                        type="text"
                        placeholder="Filter categories..."
                        className="input input-bordered w-full pl-12 rounded-2xl h-12 focus:border-primary"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="col-span-full py-10 text-center"><span className="loading loading-spinner text-primary"></span></div>
                ) : filteredCategories.map(cat => (
                    <div key={cat._id} className="card bg-base-100 border border-base-content/5 shadow-sm hover:border-primary/30 transition-all group overflow-hidden">
                        <div className="card-body p-4 flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 text-primary rounded-xl">
                                    <CheckCircle2 className="size-5" />
                                </div>
                                <span className="font-bold text-lg">{cat.name}</span>
                            </div>
                            <button
                                onClick={() => handleDeleteCategory(cat._id, cat.name)}
                                className="btn btn-ghost btn-sm btn-square text-error"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageCategories;
