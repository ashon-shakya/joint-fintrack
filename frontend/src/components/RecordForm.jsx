import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RecordForm = ({ onAdd }) => {
    const { user } = useAuth(); // Get user from context
    const [formData, setFormData] = useState({
        amount: '',
        type: 'EXPENSE',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        spender: user?.spenders?.[0] || 'Joint', // Default to first spender
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
        setFormData({
            amount: '',
            type: 'EXPENSE',
            category: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            spender: user?.spenders?.[0] || 'Joint',
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8baff] mb-4">Add New Transaction</h3>
            <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Amount</label>
                        <input
                            type="number"
                            required
                            step="0.01"
                            className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Type</label>
                        <select
                            className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="INCOME">Income</option>
                            <option value="EXPENSE">Expense</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Spender</label>
                        <select
                            className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                            value={formData.spender}
                            onChange={(e) => setFormData({ ...formData, spender: e.target.value })}
                        >
                            {user?.spenders?.map((spender) => (
                                <option key={spender} value={spender}>{spender}</option>
                            )) || <option value="Joint">Joint (All)</option>}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Date</label>
                        <input
                            type="date"
                            required
                            className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Category</label>
                        <input
                            type="text"
                            required
                            list="categories"
                            className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                            placeholder="e.g., Food"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                        <datalist id="categories">
                            <option value="Food" />
                            <option value="Rent" />
                            <option value="Salary" />
                            <option value="Transport" />
                            <option value="Entertainment" />
                        </datalist>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-[#b8baff] mb-1">Description</label>
                    <input
                        type="text"
                        className="block w-full rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm transition-colors duration-200"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>
            <button
                type="submit"
                className="mt-6 w-full bg-indigo-600 dark:bg-[#7c3aed] text-white py-3 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 font-bold shadow-lg shadow-indigo-500/20 dark:shadow-purple-900/20 transform hover:-translate-y-0.5"
            >
                Add Transaction
            </button>
        </form>
    );
};

export default RecordForm;
