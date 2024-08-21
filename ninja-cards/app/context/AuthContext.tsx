"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { log } from 'console';

interface User {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    position: string;
    phone1: string;
    phone2: string;
    email2: string;
    street1: string;
    street2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    bio: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    image: string;
    tiktok: string;        // Field for TikTok URL
    googleReview: string;  // Field for Google Review URL
    revolut: string;       // Field for Revolut URL
    qrCode: string;        // Field for QR Code URL
    selectedColor: string; // Field for selected color
    cv: string;            // Field to store the CV as a base64 string
    behance: string;       // Field for Behance URL
    paypal: string;        // Field for PayPal URL
    trustpilot: string;    // Field for TrustPilot URL
    viber: string;         // Field for Viber Phone Number
    whatsapp: string;      // Field for WhatsApp Phone Number
    website: string;       // Field for Website URL
}

interface AuthContextType {
    user: User | null;
    login: (token: string, userData: User) => void;
    logout: () => void;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {
        const userData = localStorage.getItem('user');

        if (userData) {
            try {
                setUser(JSON.parse(userData));
            } catch (error) {
                console.error("Failed to parse user data:", error);
                // If parsing fails, clear the invalid data
                localStorage.removeItem('user');
            }
        }
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        router.push('/');
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
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
