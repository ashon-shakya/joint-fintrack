import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import appIcon from '../assets/app-icon.png';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { token } = useParams();
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        setStatus('loading');
        try {
            await resetPassword(token, password);
            setStatus('success');
            setMessage('Password reset successful. Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Failed to reset password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b2e] transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-purple-100 dark:bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_25%)] opacity-30 animate-pulse transition-all duration-500"></div>
            </div>
            <div className="relative bg-white dark:bg-[#242642] border border-gray-100 dark:border-[#3e416d] rounded-2xl p-8 shadow-2xl w-full max-w-md backdrop-blur-sm transition-all duration-300">
                <div className="flex justify-center mb-6">
                    <img src={appIcon} alt="OurWallet Logo" className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#b8baff] mb-2 text-center">Reset Password</h2>
                <p className="text-gray-500 dark:text-[#7a7db8] text-center mb-8">Enter new password</p>

                {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">New Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-3.5 bg-indigo-600 dark:bg-[#7c3aed] text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-purple-900/20 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {status === 'loading' ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
