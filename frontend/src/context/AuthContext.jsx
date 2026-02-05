import { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await api.post('/auth/register', { name, email, password });
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            setUser(response.data);
        }
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const addSpender = async (spender) => {
        try {
            const response = await api.post('/users/spenders', { spender });
            const updatedUser = { ...user, spenders: response.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to add spender' };
        }
    };

    const removeSpender = async (spender) => {
        try {
            const response = await api.delete(`/users/spenders/${spender}`);
            const updatedUser = { ...user, spenders: response.data };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to remove spender' };
        }
    };

    // --- Partners ---

    const refreshUser = async () => {
        try {
            // Re-fetch user data to get updated partners/spenders
            const response = await api.get('/partners');
            // We need to make sure we keep existing user data and just update partners
            // OR ideally we should have a /users/me endpoint that returns everything.
            // Since we don't have /users/me yet, we will rely on this patch.

            setUser(prevUser => {
                const updatedUser = { ...prevUser, partners: response.data };
                localStorage.setItem('user', JSON.stringify(updatedUser)); // Update local storage
                return updatedUser;
            });

        } catch (error) {
            console.error(error);
        }
    };

    const invitePartner = async (email) => {
        try {
            await api.post('/partners/invite', { email });
            await refreshUser(); // Refresh to show pending invite
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to send invite' };
        }
    };

    const acceptInvite = async (partnerId) => {
        try {
            await api.put('/partners/accept', { partnerId });
            await refreshUser();
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to accept invite' };
        }
    };

    const removePartner = async (partnerId) => {
        try {
            await api.delete(`/partners/${partnerId}`);
            await refreshUser();
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Failed to remove partner' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user, login, register, logout, loading,
            addSpender, removeSpender,
            invitePartner, acceptInvite, removePartner, refreshUser
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
