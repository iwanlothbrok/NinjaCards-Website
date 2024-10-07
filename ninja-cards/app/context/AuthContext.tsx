"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/user';



interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true); // Loading state to prevent premature redirection
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (token && userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
            } catch (error) {
                console.error("Failed to parse user data:", error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setUser(null);
            }
        } else {
            setUser(null);
        }

        // After checking localStorage, stop loading
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/');  // Redirect to homepage after login
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');  // Redirect to login page after logout
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900  to-black"> {/* Ensures full-screen black background */}

            <AuthContext.Provider value={{ user, login, logout, setUser }}>
                {loading ? ( // Show a loading spinner while checking the auth state
                    <div className="flex justify-center items-center py-96 ">
                        <img src="/load.gif" alt="Loading..." className="w-40 h-40" />
                    </div>
                ) : (
                    children
                )}
            </AuthContext.Provider>
        </div>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
