import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

import appIcon from '../assets/app-icon.png';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const { register } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const { name, email, password } = formData;

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1a1b2e] transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -bottom-[50%] -right-[50%] w-[200%] h-[200%] bg-purple-100 dark:bg-[radial-gradient(circle_at_center,_#4c1d95_0%,_transparent_25%)] opacity-30 animate-pulse transition-all duration-500"></div>
            </div>
            <div className="relative bg-white dark:bg-[#242642] border border-gray-100 dark:border-[#3e416d] rounded-2xl p-8 shadow-2xl w-full max-w-md backdrop-blur-sm transition-all duration-300">
                <div className="flex justify-center mb-6">
                    <img src={appIcon} alt="OurWallet Logo" className="w-20 h-20" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-[#b8baff] mb-2 text-center">Create Account</h2>
                <p className="text-gray-500 dark:text-[#7a7db8] text-center mb-8">Join us to track your finances</p>
                {error && <div className="bg-red-50 border border-red-200 text-red-600 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="John Doe"
                            value={name}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="you@example.com"
                            value={email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-[#b8baff] text-sm font-medium mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e] border border-gray-300 dark:border-[#3e416d] text-gray-900 dark:text-[#e2e4ff] placeholder-gray-400 dark:placeholder-[#565985] focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent transition-all duration-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 bg-indigo-600 dark:bg-[#7c3aed] text-white rounded-xl font-bold hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 shadow-lg shadow-indigo-500/30 dark:shadow-purple-900/20 transform hover:-translate-y-0.5"
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-gray-600 dark:text-[#7a7db8] text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-indigo-600 dark:text-[#a78bfa] hover:text-indigo-800 dark:hover:text-[#c4b5fd] transition-colors">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
