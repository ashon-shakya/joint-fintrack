import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
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
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#b8baff] mb-2 text-center">Welcome Back</h2>
                <p className="text-gray-500 dark:text-[#7a7db8] text-center mb-8">Please sign in to continue</p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-indigo-600 dark:bg-[#7c3aed] text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-purple-900/20 transform hover:-translate-y-0.5"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-[#7a7db8] text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-semibold text-indigo-600 dark:text-[#a78bfa] hover:text-indigo-800 dark:hover:text-[#c4b5fd] transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
