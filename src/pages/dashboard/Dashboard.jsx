import React, { useEffect, useState } from 'react';
import {
    TrendingUp,
    TrendingDown,
    Wallet,
    ArrowRight,
    Plus,
    CreditCard,
    Target,
    Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useAxiosPublic from '../../hooks/useAxiosPublic';

const Dashboard = () => {
    const [transactions, setTransactions] = useState([]);
    const [goals, setGoals] = useState([]);
    const [tips, setTips] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosSecure = useAxiosSecure();
    const axiosPublic = useAxiosPublic();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [transRes, goalsRes, tipsRes] = await Promise.all([
                    axiosSecure.get('/transactions'),
                    axiosSecure.get('/goals'),
                    axiosPublic.get('/tips')
                ]);
                setTransactions(transRes.data.transactions);
                setGoals(goalsRes.data);
                setTips(tipsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);


    // Summary Calculations
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + parseFloat(curr.amount), 0);

    const netBalance = totalIncome - totalExpense;

    // Chart Data Preparation - Monthly Trend (Actual Data for current year)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentYear = new Date().getFullYear();
    const currentMonthIdx = new Date().getMonth();

    // Show last 6 months
    const monthlyData = months.map((month, idx) => {
        const monthTransactions = transactions.filter(t => {
            const d = new Date(t.date);
            return d.getMonth() === idx && d.getFullYear() === currentYear;
        });
        const income = monthTransactions.filter(t => t.type === 'income').reduce((s, t) => s + parseFloat(t.amount), 0);
        const expense = monthTransactions.filter(t => t.type === 'expense').reduce((s, t) => s + parseFloat(t.amount), 0);
        return { name: month, income, expense };
    }).slice(Math.max(0, currentMonthIdx - 5), currentMonthIdx + 1);

    // Category Distribution Data
    const categoryData = transactions.reduce((acc, curr) => {
        if (curr.type === 'expense') {
            const existing = acc.find(item => item.name === curr.category);
            if (existing) {
                existing.value += parseFloat(curr.amount);
            } else {
                acc.push({ name: curr.category, value: parseFloat(curr.amount) });
            }
        }
        return acc;
    }, []);

    // Main Goal calculation
    const mainGoal = goals[0] || null;
    const goalProgress = mainGoal ? Math.min(Math.round((mainGoal.currentAmount / mainGoal.targetAmount) * 100), 100) : 0;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <span className="loading loading-spinner loading-lg text-primary"></span>
                <p className="font-medium animate-pulse">Calculating your financial footprint...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            {/* Greeting Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Financial Overview</h2>
                    <p className="text-base-content/60 mt-1">Welcome back! Here's what's happening with your money.</p>
                </div>
                <div className="flex gap-2">
                    <Link to="/dashboard/expenses" className="btn btn-primary shadow-lg shadow-primary/20">
                        <Plus className="size-5 mr-1" /> Add Transaction
                    </Link>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden group hover:border-primary/50 transition-all duration-300">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Balance</p>
                                <h3 className={`text-3xl font-black ${netBalance >= 0 ? 'text-base-content' : 'text-error'}`}>
                                    ${netBalance.toLocaleString()}
                                </h3>
                            </div>
                            <div className="p-3 bg-primary/10 text-primary rounded-2xl group-hover:scale-110 transition-transform">
                                <Wallet className="size-6" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold gap-1 text-success bg-success/10 w-fit px-2 py-1 rounded">
                            <TrendingUp className="size-3" /> Live from bank
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden group hover:border-success/50 transition-all duration-300">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Income</p>
                                <h3 className="text-3xl font-black text-success">${totalIncome.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-success/10 text-success rounded-2xl group-hover:scale-110 transition-transform">
                                <TrendingUp className="size-6" />
                            </div>
                        </div>
                        <p className="text-xs opacity-50 mt-4">Across {transactions.filter(t => t.type === 'income').length} entries</p>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-content/5 shadow-sm overflow-hidden group hover:border-error/50 transition-all duration-300">
                    <div className="card-body p-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest opacity-50 mb-1">Total Expenses</p>
                                <h3 className="text-3xl font-black text-error">${totalExpense.toLocaleString()}</h3>
                            </div>
                            <div className="p-3 bg-error/10 text-error rounded-2xl group-hover:scale-110 transition-transform">
                                <TrendingDown className="size-6" />
                            </div>
                        </div>
                        <p className="text-xs opacity-50 mt-4">Manage your spending</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bar Chart */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-lg">Cash Flow</h3>
                            <p className="text-xs opacity-50">Trend analysis for the last 6 months</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full relative overflow-hidden">
                        <ResponsiveContainer width="99%" height={300}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--b1))', border: '1px solid hsl(var(--bc)/.1)', borderRadius: '12px' }}
                                    cursor={{ fill: 'hsl(var(--bc)/.05)' }}
                                />
                                <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                                <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-black text-lg">Spending Breakdown</h3>
                            <p className="text-xs opacity-50">Distribution across categories</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full flex flex-col md:flex-row items-center overflow-hidden">
                        <div className="w-full h-full md:w-1/2 relative min-h-[250px] overflow-hidden">
                            <ResponsiveContainer width="99%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {(categoryData.length > 0 ? categoryData : [{ name: 'No Data', value: 1 }]).map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="w-full md:w-1/2 space-y-2 mt-4 md:mt-0">
                            {categoryData.length > 0 ? categoryData.slice(0, 5).map((item, index) => (
                                <div key={item.name} className="flex justify-between items-center px-4 py-2 bg-base-200/50 rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-xs font-bold opacity-70 truncate max-w-[100px]">{item.name}</span>
                                    </div>
                                    <span className="text-xs font-black">${item.value.toLocaleString()}</span>
                                </div>
                            )) : (
                                <p className="text-center text-xs opacity-50 italic">Start tracking to see your distribution</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Recent Transactions & Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                {/* Recent Transactions */}
                <div className="lg:col-span-2 card bg-base-100 border border-base-content/5 shadow-sm">
                    <div className="p-6 border-b border-base-content/5 flex justify-between items-center">
                        <h3 className="font-black text-lg">Recent Activities</h3>
                        <Link to="/dashboard/expenses" className="btn btn-ghost btn-sm text-primary">
                            View All <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="table table-md">
                            <tbody>
                                {transactions.slice(0, 5).map(t => (
                                    <tr key={t._id} className="hover:bg-base-200/30">
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${t.type === 'income' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}>
                                                    {t.type === 'income' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
                                                </div>
                                                <span className="font-bold text-sm">{t.note || t.category}</span>
                                            </div>
                                        </td>
                                        <td><span className="badge badge-sm badge-outline opacity-50">{t.category}</span></td>
                                        <td className="text-right font-black text-sm">
                                            {t.type === 'income' ? '+' : '-'}${parseFloat(t.amount).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan="3" className="text-center py-10 opacity-40 italic">
                                            No transactions yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Savings Goal Quick Look */}
                <div className="card bg-primary text-primary-content shadow-lg shadow-primary/20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Target className="size-24" />
                    </div>
                    <div className="card-body relative z-10 flex flex-col justify-between">
                        <div>
                            <h3 className="font-black text-xl mb-4">Prime Savings Goal</h3>
                            <p className="text-sm opacity-80">{mainGoal?.title || 'No active goal'}</p>

                            {mainGoal && (
                                <div className="mt-6">
                                    <div className="flex justify-between text-xs font-bold mb-2">
                                        <span>Progress</span>
                                        <span>{goalProgress}%</span>
                                    </div>
                                    <div className="h-3 w-full bg-white/20 rounded-full">
                                        <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${goalProgress}%` }}></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 flex justify-between items-end">
                            <div>
                                <p className="text-[10px] uppercase font-bold opacity-60">Saved so far</p>
                                <p className="text-2xl font-black">${mainGoal?.currentAmount.toLocaleString() || 0}</p>
                            </div>
                            <Link to="/dashboard/goals" className="btn btn-sm btn-outline border-white text-white hover:bg-white hover:text-primary">
                                Manage
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smart Insights / Financial Tips Section */}
            <div className="mt-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Lightbulb className="size-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black tracking-tight">Smart Financial Insights</h3>
                        <p className="text-xs opacity-50 font-medium uppercase tracking-widest">Platform Curated Advice</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tips.length > 0 ? (
                        tips.slice(0, 3).map(tip => (
                            <div key={tip._id} className="card bg-base-100 border border-base-content/5 shadow-sm p-6 hover:border-primary/30 transition-all">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 inline-block">{tip.category}</span>
                                <h4 className="font-bold text-lg mb-2">{tip.title}</h4>
                                <p className="text-sm opacity-70 leading-relaxed line-clamp-3">{tip.description}</p>
                            </div>
                        ))
                    ) : (
                        // Fallback Logic: Default Tips if no data exists
                        <>
                            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 inline-block">General Tip</span>
                                <h4 className="font-bold text-lg mb-2">Track Every BDT</h4>
                                <p className="text-sm opacity-70 leading-relaxed">Small, unrecorded expenses can quickly add up. Try recording even your minor snacks or transport fees.</p>
                            </div>
                            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 inline-block">Savings</span>
                                <h4 className="font-bold text-lg mb-2">The 50/30/20 Rule</h4>
                                <p className="text-sm opacity-70 leading-relaxed">Allocate 50% for needs, 30% for wants, and 20% for savings or debt repayment for optimal growth.</p>
                            </div>
                            <div className="card bg-base-100 border border-base-content/5 shadow-sm p-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-2 inline-block">Budgeting</span>
                                <h4 className="font-bold text-lg mb-2">Review Monthly Patterns</h4>
                                <p className="text-sm opacity-70 leading-relaxed">Looking at your pie charts once a month helps you identify "spending leaks" you might have missed.</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
