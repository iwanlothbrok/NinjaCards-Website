"use client";

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const ImportantLinks: React.FC = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        links: '',
        qrCode: '',
        photo: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files[0]) {
            setFormData({ ...formData, [name]: files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Handle file upload logic if necessary
        const response = await fetch('/api/user/updateLinks', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user?.id, ...formData }),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            alert('Links updated successfully');
        } else {
            alert('Failed to update links');
        }
    };

    return (
        <div className="w-screen h-screen flex justify-center items-center p-3">
            <h2 className="text-xl font-bold mb-4">Links</h2>
            <form onSubmit={handleSubmit}>
                <label className="block mb-2">All most used platforms</label>
                <textarea name="links" value={formData.links} onChange={handleChange} className="block w-full p-2 mb-4 border rounded"></textarea>
                <label className="block mb-2">QR Code</label>
                <input type="text" name="qrCode" value={formData.qrCode} onChange={handleChange} className="block w-full p-2 mb-4 border rounded" />
                <label className="block mb-2">Photo</label>
                <input type="file" name="photo" onChange={handleFileChange} className="block w-full p-2 mb-4 border rounded" />
                <button className="bg-teil text-black px-4 py-2 rounded">Save</button>
            </form>
        </div>
    );
};

export default ImportantLinks;
