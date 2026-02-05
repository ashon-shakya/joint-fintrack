import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const PartnerManagement = () => {
    const { user, invitePartner, acceptInvite, removePartner, refreshUser } = useAuth();
    const [inviteEmail, setInviteEmail] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshUser();
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        const result = await invitePartner(inviteEmail);
        setLoading(false);
        if (result.success) {
            setMessage('Invitation sent successfully!');
            setInviteEmail('');
        } else {
            setMessage(result.message);
        }
        setTimeout(() => setMessage(''), 3000);
    };

    const handleAccept = async (partnerId) => {
        setLoading(true);
        const result = await acceptInvite(partnerId);
        setLoading(false);
        if (result.success) {
            // refreshUser is handled in acceptInvite
        } else {
            alert(result.message);
        }
    };

    const handleRemove = async (partnerId) => {
        if (!window.confirm("Are you sure? This will remove access to shared records.")) return;
        setLoading(true);
        const result = await removePartner(partnerId);
        setLoading(false);
    };

    // Filter partners based on status
    const pendingIncoming = user?.partners?.filter(p => p.status === 'PENDING' && p.initiatedBy !== user._id) || [];
    const pendingOutgoing = user?.partners?.filter(p => p.status === 'PENDING' && p.initiatedBy === user._id) || [];
    const activePartners = user?.partners?.filter(p => p.status === 'ACCEPTED') || [];

    return (
        <div className="bg-white dark:bg-[#242642] p-6 rounded-2xl shadow-sm dark:shadow-none border border-transparent dark:border-[#3e416d] transition-colors duration-300">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-[#b8baff] mb-4">Partner Management</h3>

            {/* Invite Form */}
            <form onSubmit={handleInvite} className="flex gap-2 mb-6">
                <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="Partner's Email"
                    className="flex-1 rounded-xl border-gray-300 dark:border-[#3e416d] bg-gray-50 dark:bg-[#1a1b2e] text-gray-900 dark:text-[#e2e4ff] focus:ring-2 focus:ring-indigo-500 dark:focus:ring-[#7c3aed] focus:border-transparent p-2.5 sm:text-sm"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 dark:bg-[#7c3aed] text-white py-2 px-4 rounded-xl hover:bg-indigo-700 dark:hover:bg-[#6d28d9] transition-all duration-300 font-bold shadow-lg shadow-indigo-500/20 dark:shadow-purple-900/20 disabled:opacity-50"
                >
                    Invite
                </button>
            </form>
            {message && <p className="text-sm mb-4 text-center text-indigo-600 dark:text-[#a78bfa]">{message}</p>}

            {/* Pending Incoming */}
            {pendingIncoming.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-[#7a7db8] mb-2 uppercase tracking-wide">Pending Requests</h4>
                    <div className="space-y-2">
                        {pendingIncoming.map((p) => (
                            <div key={p.user._id || p.user} className="flex justify-between items-center p-3 rounded-xl bg-indigo-50 dark:bg-[#3e416d]/30 border border-indigo-100 dark:border-[#3e416d]">
                                <div>
                                    <p className="font-medium text-gray-800 dark:text-[#e2e4ff]">{p.user.name || p.user.email || 'User'}</p>
                                    <p className="text-xs text-gray-500 dark:text-[#7a7db8]">Wants to link accounts</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(p.user._id || p.user)}
                                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleRemove(p.user._id || p.user)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Pending Outgoing */}
            {pendingOutgoing.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-500 dark:text-[#7a7db8] mb-2 uppercase tracking-wide">Sent Requests</h4>
                    <div className="space-y-2">
                        {pendingOutgoing.map((p) => (
                            <div key={p.user._id || p.user} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-[#1a1b2e]">
                                <span className="text-gray-600 dark:text-[#7a7db8]">{p.user.email || 'User'}</span>
                                <span className="text-xs text-orange-500 font-medium px-2 py-1 bg-orange-50 dark:bg-orange-900/20 rounded-md">Pending</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Active Partners */}
            <div>
                <h4 className="text-sm font-medium text-gray-500 dark:text-[#7a7db8] mb-2 uppercase tracking-wide">Your Partners</h4>
                {activePartners.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-[#565985] italic">No active partners yet.</p>
                ) : (
                    <div className="space-y-2">
                        {activePartners.map((p) => (
                            <div key={p.user._id || p.user} className="flex justify-between items-center p-3 rounded-xl bg-emerald-50 dark:bg-[#059669]/10 border border-emerald-100 dark:border-[#059669]/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-[#059669]/30 flex items-center justify-center text-emerald-600 dark:text-[#34d399] font-bold">
                                        {(p.user.name?.[0] || 'U').toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-800 dark:text-[#e2e4ff]">{p.user.name || p.user.email}</span>
                                </div>
                                <button
                                    onClick={() => handleRemove(p.user._id || p.user)}
                                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PartnerManagement;
