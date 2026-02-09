import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import appIcon from '../assets/app-icon.png';

const HowToUse = () => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1b2e] transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Header */}
            <div className="bg-white dark:bg-[#242642] shadow-sm sticky top-0 z-10 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center">
                            <img src={appIcon} alt="OurWallet" className="h-8 w-8 mr-2" />
                            <Link to="/login" className="text-2xl font-bold text-indigo-600 dark:text-[#a78bfa]">
                                OurWallet
                            </Link>
                        </div>
                        <div>
                            <Link to="/login" className="text-gray-600 dark:text-[#b8baff] hover:text-indigo-600 dark:hover:text-[#a78bfa] font-medium mr-4">
                                Login
                            </Link>
                            <Link to="/register" className="bg-indigo-600 dark:bg-[#7c3aed] text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-colors shadow-lg shadow-indigo-500/30 dark:shadow-purple-900/20">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold text-gray-900 dark:text-[#e2e4ff] mb-4">
                        Master Your Shared Finances
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-[#7a7db8]">
                        A simple guide to getting started with OurWallet
                    </p>
                </div>

                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="bg-white dark:bg-[#242642] rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-[#3e416d] transition-all duration-300 hover:transform hover:scale-[1.01]">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 dark:bg-purple-900/30 rounded-full p-4">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-[#a78bfa]">1</span>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e4ff] mb-2">Create an Account & Verify</h3>
                                <p className="text-gray-600 dark:text-[#b8baff] leading-relaxed">
                                    Start by signing up with your name and email. We'll send you a verification link to your inbox.
                                    Clicking it unlocks your account access. Security is our priority!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="bg-white dark:bg-[#242642] rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-[#3e416d] transition-all duration-300 hover:transform hover:scale-[1.01]">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 dark:bg-purple-900/30 rounded-full p-4">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-[#a78bfa]">2</span>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e4ff] mb-2">Set Up Spenders</h3>
                                <p className="text-gray-600 dark:text-[#b8baff] leading-relaxed">
                                    Once logged in, go to your dashboard. You'll see default spenders (e.g., Joint, You, Partner).
                                    You can customize these names! Just type a new name in the "Add Spender" box to track who is spending what.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="bg-white dark:bg-[#242642] rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-[#3e416d] transition-all duration-300 hover:transform hover:scale-[1.01]">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 dark:bg-purple-900/30 rounded-full p-4">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-[#a78bfa]">3</span>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e4ff] mb-2">Connect with a Partner</h3>
                                <p className="text-gray-600 dark:text-[#b8baff] leading-relaxed">
                                    Finances are better together. Use the "Invite Partner" feature to send an invitation to your partner's email.
                                    Once they accept, you'll both see the same dashboard and can track joint expenses in real-time.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="bg-white dark:bg-[#242642] rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-[#3e416d] transition-all duration-300 hover:transform hover:scale-[1.01]">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 bg-indigo-100 dark:bg-purple-900/30 rounded-full p-4">
                                <span className="text-2xl font-bold text-indigo-600 dark:text-[#a78bfa]">4</span>
                            </div>
                            <div className="ml-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-[#e2e4ff] mb-2">Track & Analyze</h3>
                                <p className="text-gray-600 dark:text-[#b8baff] leading-relaxed">
                                    Add transactions easily. Categorize them and see where your money goes.
                                    Check the "Analytics" tab for visual charts and breakdowns of your monthly spending habits.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-[#e2e4ff] mb-6">Ready to take control?</h2>
                    <Link to="/register" className="inline-block px-8 py-4 bg-indigo-600 dark:bg-[#7c3aed] text-white rounded-xl font-bold text-lg hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 shadow-xl shadow-indigo-500/30 dark:shadow-purple-900/20 transform hover:-translate-y-1">
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default HowToUse;
