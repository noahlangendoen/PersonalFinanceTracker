import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            // Validate token and set user
            checkAuth();
        } else {
            setLoading(false);
        }
    }, []);

    const checkAuth = async () => {
        try {
            const response = await api.getProtectedData();
            if (response.user) {
                setUser(response.user);
            }
        } catch (error) {
            localStorage.removeItem('token');
        }
        setLoading(false);
    };

    const login = async (credentials) => {
        const response = await api.login(credentials);
        if (response.token) {
            localStorage.setItem('token', response.token);
            setUser(response.user);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);