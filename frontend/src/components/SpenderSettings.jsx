import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SpenderSettings = () => {
    const { user, addSpender, removeSpender } = useAuth();
    const [newSpender, setNewSpender] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSpender.trim()) return;

        setLoading(true);
        setMessage('');
        const result = await addSpender(newSpender.trim());
        setLoading(false);

        if (result.success) {
            setNewSpender('');
            setMessage('Spender added successfully');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message);
        }
    };

    const handleRemove = async (spender) => {
        if (!window.confirm(`Are you sure you want to remove ${spender}?`)) return;

        setLoading(true);
        setMessage('');
        const result = await removeSpender(spender);
        setLoading(false);

        if (result.success) {
            setMessage('Spender removed successfully');
            setTimeout(() => setMessage(''), 3000);
        } else {
            setMessage(result.message);
        }
    };

    return (
        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8baff] mb-4">Manage Spenders</h3>

            <form onSubmit={handleAdd} className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={newSpender}
                    onChange={(e) => setNewSpender(e.target.value)}
                    placeholder="New Spender Name"
                    className="flex-1 rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 dark:bg-[#7c3aed] text-white py-2 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 font-bold shadow-lg shadow-indigo-500/20 dark:shadow-purple-900/20 disabled:opacity-50"
                >
                    Add
                </button>
            </form>

            {message && <p className="text-sm mb-4 text-center text-indigo-600 dark:text-[#a78bfa]">{message}</p>}

            <div className="space-y-2">
                {user?.spenders?.map((spender) => (
                    <div key={spender} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e]">
                        <span className="text-gray-800 dark:text-[#e2e4ff]">{spender}</span>
                        <button
                            onClick={() => handleRemove(spender)}
                            disabled={loading || user.spenders.length <= 1}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Remove Spender"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpenderSettings;
