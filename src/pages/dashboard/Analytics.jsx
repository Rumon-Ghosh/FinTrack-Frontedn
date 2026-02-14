import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    Legend,
    AreaChart,
    Area
} from 'recharts';
import {
    PieChart as PieIcon,
    BarChart3,
    TrendingUp,
    Calendar,
    Filter,
    ArrowRight
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await axiosSecure.get('/transactions');
                setTransactions(res.data.transactions);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);
    console.log(transactions)

    // 1. Category-wise Spending (Expenses only)
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, curr) => {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += parseFloat(curr.amount);
            } else {
                acc.push({ name: curr.category, value: parseFloat(curr.amount) });
            }
            return acc;
        }, []);

    // 2. Monthly Trends (Actual Data)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();

    const monthlyTrendData = months.map((month, idx) => {
        const monthTransactions = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === idx && d.getFullYear() === currentYear;
        });

        const income = monthTransactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        const expense = monthTransactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
            name: month,
            income,
            expense,
            savings: Math.max(0, income - expense)
        };
    });

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

    if (loading) return <div className="flex justify-center p-20"><span className="loading loading-spinner loading-lg text-primary"></span></div>;

    return (
        <div className="space-y-8 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-base-100 p-6 rounded-2xl border border-base-content/5 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                        <PieIcon className="text-primary size-7" /> Financial Analytics
                    </h2>
                    <p className="text-base-content/60 text-sm">In-depth insights into your spending habits.</p>
                </div>
                <div className="flex bg-base-200 p-1 rounded-xl">
                    <button className="btn btn-sm btn-ghost bg-base-100 shadow-sm border border-base-content/5">Monthly</button>
                    <button className="btn btn-sm btn-ghost opacity-50">Yearly</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Spending Analysis */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 overflow-hidden">
                    <h3 className="font-black text-lg mb-6">Spending Analysis</h3>
                    <div className="h-[350px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={350}>
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cash Flow Area Chart */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                    <h3 className="font-black text-lg mb-6">Income Trend</h3>
                    <div className="h-[350px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={350}>
                            <AreaChart data={monthlyTrendData}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="income" stroke="#6366f1" fillOpacity={1} fill="url(#colorIncome)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Savings Growth */}
                <div className="lg:col-span-2 card bg-base-100 border border-base-content/5 shadow-sm p-6">
                    <h3 className="font-black text-lg mb-6">Savings Capacity Target</h3>
                    <div className="h-[350px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={350}>
                            <BarChart data={monthlyTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, opacity: 0.5 }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="savings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} name="Monthly Savings" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
