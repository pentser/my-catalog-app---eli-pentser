import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    if (userData) {
                        setUser(userData);
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            }
            setLoading(false);
        };
        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await authAPI.login(credentials);
            const { user: userData, token } = response.data;
            
            const fullUserData = {
                ...userData,
                isAuthenticated: true
            };
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(fullUserData));
            setUser(fullUserData);
            
            return fullUserData;
        } catch (error) {
            console.error('Login error:', error);
            throw error.response?.data?.error || 'Login failed';
        }
    };

    const register = async (userData) => {
        try {
            const response = await authAPI.register(userData);
            const { user: newUser, token } = response.data;
            
            const fullUserData = {
                ...newUser,
                isAuthenticated: true
            };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(fullUserData));
            setUser(fullUserData);
            
            return fullUserData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error.response?.data?.error || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider 
            value={{
                user,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.isAdmin || false
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 