import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const RecordList = ({ records, onDelete, onBulkDelete, sortConfig, onSort }) => {
    const { user } = useAuth();
    const [selectedIds, setSelectedIds] = useState([]);

    // Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Only select records owned by the current user
            const ownedRecords = records.filter(r =>
                (r.user._id === (user._id || user.id)) || (r.user === (user._id || user.id))
            );
            setSelectedIds(ownedRecords.map(r => r._id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleBulkDeleteClick = () => {
        if (window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
            onBulkDelete(selectedIds);
            setSelectedIds([]);
        }
    };

    const isAllSelected = records.length > 0 && selectedIds.length === records.length;

    const renderSortIcon = (key) => {
        if (sortConfig?.key !== key) return null;
        return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
    };

    return (
        <div className="bg-white dark:bg-[#242642] shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] rounded-2xl overflow-hidden transition-colors duration-300">
            {/* Bulk Actions Header */}
            {selectedIds.length > 0 && (
                <div className="bg-indigo-50 dark:bg-[#2f3256] px-6 py-3 flex justify-between items-center transition-colors duration-300">
                    <span className="text-sm font-medium text-indigo-700 dark:text-[#e2e4ff]">
                        {selectedIds.length} selected
                    </span>
                    <button
                        onClick={handleBulkDeleteClick}
                        className="text-white bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                        Delete Selected
                    </button>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-[#3e416d]">
                    <thead className="bg-gray-50 dark:bg-[#2f3256]">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#1a1b2e] dark:checked:bg-indigo-500"
                                    checked={isAllSelected}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 select-none"
                                onClick={() => onSort('date')}
                            >
                                Date {renderSortIcon('date')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider">Owner</th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 select-none"
                                onClick={() => onSort('spender')}
                            >
                                Spender {renderSortIcon('spender')}
                            </th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 select-none"
                                onClick={() => onSort('category')}
                            >
                                Category {renderSortIcon('category')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider">Description</th>
                            <th
                                scope="col"
                                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 select-none"
                                onClick={() => onSort('amount')}
                            >
                                Amount {renderSortIcon('amount')}
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-[#b8baff] uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-[#242642] divide-y divide-gray-200 dark:divide-[#3e416d]">
                        {records.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-[#7a7db8]">
                                    No records found.
                                </td>
                            </tr>
                        ) : (
                            records.map((record) => (
                                <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-[#2f3256] transition-colors duration-150">
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <input
                                            type="checkbox"
                                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-[#1a1b2e] dark:checked:bg-indigo-500 disabled:opacity-50"
                                            checked={selectedIds.includes(record._id)}
                                            onChange={() => handleSelectOne(record._id)}
                                            disabled={record.user?._id !== (user._id || user.id) && record.user !== (user._id || user.id)}
                                        />
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-[#7a7db8]">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-[#e2e4ff]">
                                        {record.user?.name || 'Unknown'}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-[#7a7db8]">
                                        {record.spender || 'Joint'}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-2 ${record.type === 'INCOME' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                            <span className="text-sm font-medium text-gray-900 dark:text-[#e2e4ff]">{record.category}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-[#7a7db8]">
                                        {record.description || '-'}
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-right text-sm font-bold">
                                        <span className={record.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                                            {record.type === 'INCOME' ? '+' : '-'}${Number(record.amount).toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-2 whitespace-nowrap text-center text-sm font-medium">
                                        {(record.user?._id === (user._id || user.id) || record.user === (user._id || user.id)) ? (
                                            <button
                                                onClick={() => onDelete(record._id)}
                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                                title="Delete Transaction"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                </svg>
                                            </button>
                                        ) : (
                                            <span className="text-gray-400 dark:text-gray-600 cursor-not-allowed px-2" title="Cannot delete partner's record">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                </svg>
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecordList;
