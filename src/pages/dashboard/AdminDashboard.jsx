import React, { useEffect, useState } from 'react';
import {
    BarChart3,
    Users,
    Wallet,
    ArrowUpRight,
    ShieldCheck,
    Zap,
    Activity,
    Server
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosSecure.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);



    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    // Calculate chart data using server-side aggregated monthlyStats
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const growthData = months.map((month, idx) => {
        const monthNum = idx + 1;
        const stat = (stats?.monthlyStats || []).find(s => s._id === monthNum);

        return {
            name: month,
            operations: stat?.count || 0,
            volume: stat?.total || 0
        };
    });

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-primary text-primary-content p-8 rounded-3xl shadow-xl shadow-primary/20 relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4 w-fit">
                        <ShieldCheck className="size-3" /> System Control Center
                    </div>
                    <h2 className="text-4xl font-black tracking-tight">Admin Overview</h2>
                    <p className="opacity-80 mt-1 max-w-md">Health check and global statistics for the FinTrack ecosystem.</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md text-center min-w-[100px]">
                        <p className="text-2xl font-black">{stats?.usersCount || 0}</p>
                        <p className="text-[10px] uppercase font-bold opacity-60">Total Users</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md text-center min-w-[100px]">
                        <p className="text-2xl font-black">{stats?.transactionsCount || 0}</p>
                        <p className="text-[10px] uppercase font-bold opacity-60">Operations</p>
                    </div>
                </div>
                {/* Decorative background element */}
                <Zap className="absolute -right-10 -bottom-10 size-64 opacity-10 rotate-12" />
            </div>

            {/* Admin Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-secondary/10 text-secondary rounded-2xl">
                            <Activity className="size-6" />
                        </div>
                        <ArrowUpRight className="size-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Total Volume</p>
                    <h3 className="text-3xl font-black mt-1">${stats?.totalAmount?.toLocaleString() || 0}</h3>
                    <p className="text-xs text-secondary font-bold mt-4">+18% vs last week</p>
                </div>

                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-accent/10 text-accent rounded-2xl">
                            <Server className="size-6" />
                        </div>
                    </div>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Server Uptime</p>
                    <h3 className="text-3xl font-black mt-1">99.9%</h3>
                    <p className="text-xs text-accent font-bold mt-4">System is stable</p>
                </div>

                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                            <Wallet className="size-6" />
                        </div>
                    </div>
                    <p className="text-xs font-bold opacity-50 uppercase tracking-widest">Average ARPU</p>
                    <h3 className="text-3xl font-black mt-1">${(stats?.totalAmount / (stats?.usersCount || 1)).toFixed(2)}</h3>
                    <p className="text-xs text-primary font-bold mt-4">Per active user</p>
                </div>
            </div>

            {/* Global Activity Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-8">
                    <h3 className="font-black text-xl mb-8 flex items-center gap-2">
                        <BarChart3 className="size-5 text-primary" /> User Acquisition
                    </h3>
                    <div className="h-[300px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={300}>
                            <AreaChart data={growthData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="volume" stroke="#6366f1" fillOpacity={1} fill="url(#colorValue)" strokeWidth={4} name="Cash Volume" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-8">
                    <h3 className="font-black text-xl mb-8 flex items-center gap-2">
                        <Activity className="size-5 text-secondary" /> Transaction Density
                    </h3>
                    <div className="h-[300px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={300}>
                            <BarChart data={growthData}>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <Tooltip />
                                <Bar dataKey="operations" fill="#ec4899" radius={[10, 10, 0, 0]} barSize={30} name="Transactions" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
