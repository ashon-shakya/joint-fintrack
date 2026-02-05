import { useState } from 'react';
import api from '../api/axios';

const ImportForm = ({ onImportSuccess }) => {
    const [csvInput, setCsvInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const parseCSV = (csvText) => {
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) return [];

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredFields = ['amount', 'type', 'category'];

        // Basic validation
        const missing = requiredFields.filter(field => !headers.includes(field));
        if (missing.length > 0) throw new Error(`Missing columns: ${missing.join(', ')}`);

        return lines.slice(1).map((line, index) => {
            // Handle empty lines
            if (!line.trim()) return null;

            const values = line.split(',').map(v => v.trim());
            const obj = {};

            headers.forEach((header, i) => {
                let value = values[i];
                if (header === 'amount') {
                    value = parseFloat(value);
                    if (isNaN(value)) throw new Error(`Invalid amount at row ${index + 2}`);
                }
                obj[header] = value;
            });

            // Default date if missing
            if (!obj.date) obj.date = new Date().toISOString().split('T')[0];

            return obj;
        }).filter(item => item !== null);
    };

    const handleImport = async () => {
        try {
            setLoading(true);
            setError('');

            let parsedData;
            try {
                parsedData = parseCSV(csvInput);
                if (parsedData.length === 0) {
                    setError('CSV is empty or missing data rows');
                    setLoading(false);
                    return;
                }
            } catch (e) {
                setError(`CSV Parse Error: ${e.message}`);
                setLoading(false);
                return;
            }

            const response = await api.post('/records/import', parsedData);
            onImportSuccess(response.data);
            setCsvInput('');
            setIsOpen(false);
            alert(`Successfully imported ${response.data.length} records!`);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Import failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-[#059669] dark:hover:bg-[#047857] text-white py-3 px-4 rounded-xl transition duration-300 font-bold shadow-lg shadow-emerald-500/20 dark:shadow-emerald-900/20"
            >
                Import CSV Data
            </button>
        )
    }

    return (
        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-emerald-100 dark:border-[#059669]/30 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8baff]">Import Records (CSV)</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-[#7a7db8] hover:text-gray-700 dark:hover:text-[#e2e4ff] transition-colors">Cancel</button>
            </div>

            {error && <div className="bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 p-3 rounded-lg mb-4 text-sm border border-red-100 dark:border-red-500/20">{error}</div>}

            <div className="text-xs text-gray-500 dark:text-[#7a7db8] mb-3 space-y-1">
                <p>Paste your CSV data below. Required columns: <b>amount, type, category</b>.</p>
                <p>Optional columns: <b>description, date</b>.</p>
                <p>Format example:</p>
                <pre className="bg-gray-100 dark:bg-[#1a1b2e] p-2 rounded text-gray-800 dark:text-[#a78bfa] overflow-x-auto">
                    amount,type,category,description,date
                    50.00,EXPENSE,Food,Lunch,2024-02-01
                    1500.00,INCOME,Salary,Monthly Pay,2024-02-01
                </pre>
            </div>

            <textarea
                className="w-full h-32 p-3 border rounded-xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] transition-colors duration-200"
                placeholder={`amount,type,category,description,date
50,EXPENSE,Food,Lunch,2024-02-05`}
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
            />

            <button
                onClick={handleImport}
                disabled={loading || !csvInput}
                className={`mt-4 w-full py-2.5 px-4 rounded-xl font-bold text-white transition duration-300 ${loading || !csvInput
                        ? 'bg-gray-400 dark:bg-[#3e416d] cursor-not-allowed text-gray-200 dark:text-[#7a7db8]'
                        : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-[#059669] dark:hover:bg-[#047857] shadow-lg shadow-emerald-500/20'
                    }`}
            >
                {loading ? 'Importing...' : 'Run Import'}
            </button>
        </div>
    );
};

export default ImportForm;
