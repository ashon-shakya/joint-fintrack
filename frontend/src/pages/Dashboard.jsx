import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import ImportForm from "../components/ImportForm";
import RecordForm from "../components/RecordForm";
import RecordList from "../components/RecordList";
import SpenderSettings from "../components/SpenderSettings";
import PartnerManagement from "../components/PartnerManagement";
import ThemeToggle from "../components/ThemeToggle";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [showSpenderSettings, setShowSpenderSettings] = useState(false);
    const [showPartners, setShowPartners] = useState(false);
    const [viewMode, setViewMode] = useState('ME'); // 'ME' or 'JOINT'
    const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        type: "",
        category: "",
    });

    const fetchRecords = async () => {
        try {
            setLoading(true);
            // Build query string
            const params = new URLSearchParams();
            params.append("page", page);
            params.append("limit", 20); // Force limit 20

            if (viewMode === 'JOINT' && user?.partners) {
                const partnerIds = user.partners
                    .filter(p => p.status === 'ACCEPTED')
                    .map(p => p.user._id || p.user);

                // If we have partners, include them + self
                // If no accepted partners, it effectively just shows own records which is fine, 
                // but maybe we should alert or just show own.
                if (partnerIds.length > 0) {
                    const allIds = [user._id || user.id, ...partnerIds].join(',');
                    params.append("userIds", allIds);
                }
            }

            if (filters.type) params.append("type", filters.type);
            if (filters.category) params.append("category", filters.category);

            params.append("sortBy", sortConfig.key);
            params.append("order", sortConfig.direction);

            const response = await api.get(`/records?${params.toString()}`);

            // Backend now returns object with { records, totalPages, ... }
            if (response.data.records) {
                setRecords(response.data.records);
                setTotalPages(response.data.totalPages);
            } else {
                // Fallback for previous api structure if needed, or initial load
                setRecords(response.data);
            }
        } catch (error) {
            console.error("Error fetching records:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, [filters, page, viewMode, sortConfig]); // Re-fetch on filter, page, or viewMode change

    const handleAddRecord = async (recordData) => {
        try {
            const response = await api.post("/records", recordData);
            fetchRecords(); // Refresh list to respect sort order and pagination
        } catch (error) {
            console.error("Error adding record:", error);
            alert("Failed to add record");
        }
    };

    const handleDeleteRecord = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transaction?"))
            return;
        try {
            await api.delete(`/records/${id}`);
            // Optimistic update
            setRecords(records.filter((r) => r._id !== id));
            // Trigger fetch to ensure pagination sync if needed
            fetchRecords();
        } catch (error) {
            console.error("Error deleting record:", error);
            alert("Failed to delete transaction");
        }
    };

    const handleBulkDelete = async (ids) => {
        try {
            await api.post("/records/delete-multiple", { ids });
            fetchRecords(); // Refresh list
        } catch (error) {
            console.error("Error deleting records:", error);
            alert("Failed to delete transactions");
        }
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
        setPage(1); // Reset to page 1 on filter change
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1b2e] font-sans transition-colors duration-300">
            <nav className="bg-white dark:bg-[#242642] shadow-sm sticky top-0 z-10 transition-colors duration-300 border-b dark:border-[#3e416d]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-[#a78bfa] dark:to-[#818cf8]">
                                FinTrack
                            </h1>
                            <div className="hidden md:flex space-x-4 ml-8">
                                <span className="text-indigo-600 dark:text-[#a78bfa] bg-indigo-50 dark:bg-[#3e416d]/50 px-3 py-2 rounded-md font-medium">
                                    Transactions
                                </span>
                                <Link
                                    to="/analytics"
                                    className="text-gray-500 dark:text-[#7a7db8] hover:text-indigo-600 dark:hover:text-[#e2e4ff] px-3 py-2 rounded-md font-medium transition-colors"
                                >
                                    Analytics
                                </Link>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <ThemeToggle />
                            <span className="text-gray-700 dark:text-[#b8baff] font-medium hidden sm:block">
                                Hi, {user?.name}
                            </span>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Stats or Form */}
                    <div className="lg:col-span-1 space-y-6">
                        <ImportForm onImportSuccess={() => fetchRecords()} />
                        <RecordForm onAdd={handleAddRecord} />

                        {/* Simple Stats Card */}
                        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8baff] mb-4">
                                Page Summary
                            </h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e]">
                                    <span className="text-gray-500 dark:text-[#7a7db8] font-medium">
                                        Income
                                    </span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">
                                        +$
                                        {records
                                            .filter((r) => r.type === "INCOME")
                                            .reduce((acc, curr) => acc + curr.amount, 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e]">
                                    <span className="text-gray-500 dark:text-[#7a7db8] font-medium">
                                        Expenses
                                    </span>
                                    <span className="text-rose-600 dark:text-rose-400 font-bold text-lg">
                                        -$
                                        {records
                                            .filter((r) => r.type === "EXPENSE")
                                            .reduce((acc, curr) => acc + curr.amount, 0)
                                            .toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Partner Management & Alerts */}
                        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                            {/* Invitation Alert */}
                            {user?.partners?.some(p => p.status === 'PENDING' && p.initiatedBy !== (user._id || user.id)) && !showPartners && (
                                <div className="mb-4 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-2 w-2 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                        </span>
                                        <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">New Partner Request!</span>
                                    </div>
                                    <button
                                        onClick={() => setShowPartners(true)}
                                        className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200"
                                    >
                                        Review
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={() => setShowPartners(!showPartners)}
                                className="w-full flex justify-between items-center text-gray-700 dark:text-[#b8baff] font-semibold"
                            >
                                <span>Manage Partners</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transform transition-transform ${showPartners ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            {showPartners && (
                                <div className="mt-4">
                                    <PartnerManagement />
                                </div>
                            )}
                        </div>

                        {/* Spender Settings */}
                        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
                            <button
                                onClick={() => setShowSpenderSettings(!showSpenderSettings)}
                                className="w-full flex justify-between items-center text-gray-700 dark:text-[#b8baff] font-semibold"
                            >
                                <span>Manage Spenders</span>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 transform transition-transform ${showSpenderSettings ? 'rotate-180' : ''}`}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </button>
                            {showSpenderSettings && (
                                <div className="mt-4">
                                    <SpenderSettings />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: List and Filters */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Filters */}
                        <div className="bg-white dark:bg-[#242642] p-4 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] flex flex-col sm:flex-row gap-4 items-center transition-colors duration-300">
                            {/* View Mode Toggle */}
                            <div className="flex bg-gray-100 dark:bg-[#1a1b2e] p-1 rounded-xl mr-auto sm:mr-4">
                                <button
                                    onClick={() => setViewMode('ME')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'ME'
                                        ? 'bg-white dark:bg-[#3e416d] text-indigo-600 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-[#7a7db8] hover:text-gray-700 dark:hover:text-[#e2e4ff]'
                                        }`}
                                >
                                    My Records
                                </button>
                                <button
                                    onClick={() => setViewMode('JOINT')}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${viewMode === 'JOINT'
                                        ? 'bg-white dark:bg-[#3e416d] text-indigo-600 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-[#7a7db8] hover:text-gray-700 dark:hover:text-[#e2e4ff]'
                                        }`}
                                >
                                    Joint View
                                </button>
                            </div>

                            <span className="font-medium text-gray-700 dark:text-[#b8baff]">
                                Filter By:
                            </span>
                            <select
                                name="type"
                                className="rounded-xl border-gray-300 dark:border-[#3e416d] bg-white dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 text-sm transition-colors duration-200"
                                value={filters.type}
                                onChange={handleFilterChange}
                            >
                                <option value="">All Types</option>
                                <option value="INCOME">Income</option>
                                <option value="EXPENSE">Expense</option>
                            </select>
                            <input
                                type="text"
                                name="category"
                                placeholder="Category (e.g., Food)"
                                className="w-full sm:w-auto flex-1 rounded-xl border-gray-300 dark:border-[#3e416d] bg-white dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 text-sm transition-colors duration-200"
                                value={filters.category}
                                onChange={handleFilterChange}
                            />
                        </div>

                        {loading ? (
                            <div className="text-center py-10 text-gray-500 dark:text-[#7a7db8]">
                                Loading transactions...
                            </div>
                        ) : (
                            <>
                                <RecordList
                                    records={records}
                                    onDelete={handleDeleteRecord}
                                    onBulkDelete={handleBulkDelete}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                />

                                {/* Pagination Controls */}
                                <div className="flex justify-between items-center mt-4 px-2">
                                    <button
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === 1
                                            ? "bg-gray-100 text-gray-400 dark:bg-[#242642] dark:text-[#3e416d] cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#242642] dark:text-[#b8baff] dark:hover:bg-[#2f3256] border border-gray-200 dark:border-[#3e416d]"
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <span className="text-gray-600 dark:text-[#7a7db8] text-sm">
                                        Page {page} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${page === totalPages
                                            ? "bg-gray-100 text-gray-400 dark:bg-[#242642] dark:text-[#3e416d] cursor-not-allowed"
                                            : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-[#242642] dark:text-[#b8baff] dark:hover:bg-[#2f3256] border border-gray-200 dark:border-[#3e416d]"
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main >
        </div >
    );
};

export default Dashboard;
