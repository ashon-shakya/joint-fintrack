import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, BarChart, Bar
} from 'recharts';
import ThemeToggle from '../components/ThemeToggle';
import { Link } from 'react-router-dom';

const Analytics = () => {
    const { user, logout } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('ME'); // 'ME' or 'JOINT'

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = new URLSearchParams();

                if (viewMode === 'JOINT' && user?.partners) {
                    const partnerIds = user.partners
                        .filter(p => p.status === 'ACCEPTED')
                        .map(p => p.user._id || p.user);

                    if (partnerIds.length > 0) {
                        const allIds = [user._id || user.id, ...partnerIds].join(',');
                        params.append("userIds", allIds);
                    }
                }

                const response = await api.get(`/dashboard?${params.toString()}`);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching analytics:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [viewMode]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b2e] text-gray-700 dark:text-[#b8baff]">
                Loading Analytics...
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1b2e] font-sans transition-colors duration-300">
            <nav className="bg-white dark:bg-[#242642] shadow-sm sticky top-0 z-10 transition-colors duration-300 border-b dark:border-[#3e416d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:to-[#818cf8]">FinTrack</h1>
                            <div className="hidden md:flex space-x-4 ml-8">
                                <Link to="/" className="text-gray-500 dark:text-[#7a7db8] hover:text-indigo-600 dark:hover:text-[#e2e4ff] px-3 py-2 rounded-md font-medium transition-colors">Transactions</Link>
                                <span className="text-indigo-600 dark:text-[#a78bfa] bg-indigo-50 dark:bg-[#3e416d]/50 px-3 py-2 rounded-md font-medium">Analytics</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <Link to="/" className="md:hidden text-gray-500 dark:text-[#7a7db8]">Home</Link>
                            <div className="hidden sm:flex items-center bg-gray-100 dark:bg-[#1a1b2e] p-1 rounded-lg mr-4">
                                <button
                                    onClick={() => setViewMode('ME')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'ME'
                                            ? 'bg-white dark:bg-[#3e416d] text-indigo-600 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-[#7a7db8] hover:text-gray-700 dark:hover:text-[#e2e4ff]'
                                        }`}
                                >
                                    My View
                                </button>
                                <button
                                    onClick={() => setViewMode('JOINT')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${viewMode === 'JOINT'
                                            ? 'bg-white dark:bg-[#3e416d] text-indigo-600 dark:text-white shadow-sm'
                                            : 'text-gray-500 dark:text-[#7a7db8] hover:text-gray-700 dark:hover:text-[#e2e4ff]'
                                        }`}
                                >
                                    Joint View
                                </button>
                            </div>
                            <span className="text-gray-700 dark:text-[#b8baff] font-medium hidden sm:block">Hi, {user?.name}</span>
                            <button
                                onClick={logout}
                                className="bg-gray-100 hover:bg-gray-200 dark:bg-[#3e416d] dark:hover:bg-[#4c4f85] text-gray-700 dark:text-[#e2e4ff] px-4 py-2 rounded-md transition duration-200"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <p className="text-sm font-medium text-gray-500 dark:text-[#7a7db8]">Total Income</p>
                        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">
                            ${data?.summary?.totalIncome?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <p className="text-sm font-medium text-gray-500 dark:text-[#7a7db8]">Total Expenses</p>
                        <p className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">
                            ${data?.summary?.totalExpense?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <p className="text-sm font-medium text-gray-500 dark:text-[#7a7db8]">Net Balance</p>
                        <p className={`text-2xl font-bold mt-2 ${data?.summary?.balance >= 0 ? 'text-indigo-600 dark:text-[#a78bfa]' : 'text-rose-600 dark:text-rose-400'}`}>
                            ${data?.summary?.balance?.toFixed(2) || '0.00'}
                        </p>
                    </div>
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <p className="text-sm font-medium text-gray-500 dark:text-[#7a7db8]">Savings Rate</p>
                        <p className={`text-2xl font-bold mt-2 ${data?.summary?.savingsRate >= 20 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500 dark:text-amber-400'}`}>
                            {data?.summary?.savingsRate?.toFixed(1) || '0.0'}%
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Area Chart: Monthly Trends */}
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-[#b8baff] mb-6">Financial Trends (Monthly)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data?.trends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#F43F5E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="date" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} itemStyle={{ color: '#E5E7EB' }} />
                                    <Area type="monotone" dataKey="income" stroke="#10B981" fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="expense" stroke="#F43F5E" fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart: Weekly Activity */}
                    <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-[#b8baff] mb-6">Weekly Activity (Last 7 Days)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.dailyActivity}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                    <XAxis dataKey="_id" stroke="#9CA3AF" fontSize={10} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill="#10B981" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" name="Expense" fill="#F43F5E" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Pie Chart: Expense Breakdown */}
                    <div className="lg:col-span-2 bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-[#b8baff] mb-6">Expense Breakdown (Category)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="_id"
                                        label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {data?.categoryBreakdown?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>


                    <div className="lg:col-span-2 bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-[#b8baff] mb-6">Expense Breakdown (Spender)</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data?.spenderBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#82ca9d"
                                        paddingAngle={5}
                                        dataKey="total"
                                        nameKey="_id"
                                        label={({ _id, percent }) => `${_id} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {data?.spenderBreakdown?.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }} />
                                    <Legend layout="vertical" verticalAlign="middle" align="right" />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* List: Top Expenses */}
                    <div className="lg:col-span-1 bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-[#b8baff] mb-6">Top Expenses</h3>
                        <div className="space-y-4">
                            {data?.topExpenses?.length > 0 ? (
                                data.topExpenses.map((expense) => (
                                    <div key={expense._id} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e]">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-[#e2e4ff]">{expense.category}</p>
                                            <p className="text-xs text-gray-500 dark:text-[#7a7db8]">{new Date(expense.date).toLocaleDateString()}</p>
                                        </div>
                                        <span className="font-bold text-rose-600 dark:text-rose-400">
                                            -${Number(expense.amount).toFixed(2)}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 dark:text-[#7a7db8] text-center">No expenses recorded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
