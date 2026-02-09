import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';
import appIcon from '../assets/app-icon.png';

const VerifyEmail = () => {
    const { token } = useParams();
    const { verifyEmail } = useAuth();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await verifyEmail(token);
                setStatus('success');
                setMessage(res.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed');
            }
        };

        if (token) {
            verify();
        }
    }, [token, verifyEmail]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b2e] transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-purple-100 dark:bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_25%)] opacity-30 animate-pulse transition-all duration-500"></div>
            </div>
            <div className="relative bg-white dark:bg-[#242642] border border-gray-100 dark:border-[#3e416d] rounded-2xl p-8 shadow-2xl w-full max-w-md backdrop-blur-sm transition-all duration-300 text-center">
                <div className="flex justify-center mb-6">
                    <img src={appIcon} alt="OurWallet Logo" className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#b8baff] mb-4">Email Verification</h2>

                {status === 'verifying' && (
                    <div className="text-gray-600 dark:text-[#7a7db8]">Verifying your email...</div>
                )}

                {status === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-600 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400 p-4 rounded-lg mb-6">
                        {message}
                    </div>
                )}

                {status === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 p-4 rounded-lg mb-6">
                        {message}
                    </div>
                )}

                <div className="mt-8">
                    <Link to="/login" className="px-6 py-3 bg-indigo-600 dark:bg-[#7c3aed] text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-purple-900/20">
                        Go to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
