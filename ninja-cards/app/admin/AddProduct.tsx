"use client";
// pages/add-product.tsx
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import internal from 'stream';

export default function AddProduct() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [product, setProduct] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        nfcType: '',
        features: [''],
        benefits: [''],
    });

    const router = useRouter();
    const adminPassword = "yourSecretPassword"; // Replace with your secret password

    const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        setProduct({
            ...product,
            [field]: e.target.value,
        });
    };

    const handleArrayChange = (e: ChangeEvent<HTMLInputElement>, field: 'features' | 'benefits', index: number) => {
        const newArray = [...product[field]];
        newArray[index] = e.target.value;
        setProduct({
            ...product,
            [field]: newArray,
        });
    };

    const addArrayItem = (field: 'features' | 'benefits') => {
        setProduct({
            ...product,
            [field]: [...product[field], ''],
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const productData = {
            ...product,
            price: parseFloat(product.price),
            features: product.features.filter(Boolean),
            benefits: product.benefits.filter(Boolean),
        };

        const response = await fetch('/api/admin/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (response.ok) {
            router.push('/'); // Redirect to homepage or product list after submission
        } else {
            console.error('Failed to add product');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto p-6 shadow-lg rounded-md bg-white">
                <h1 className="text-2xl font-bold mb-4 text-center">Admin Access</h1>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700">Admin Password</label>
                        <input
                            type="password"
                            className="mt-1 p-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Submit
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-md bg-gray-700 text-white">
            <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
            <form onSubmit={handleSubmit}>
                {['title', 'description', 'price', 'imageUrl', 'nfcType'].map((field) => (
                    <div key={field} className="mb-6">
                        <label className="block text-sm font-medium capitalize">
                            {field === 'imageUrl' ? 'Image URL' : field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field === 'price' ? 'number' : 'text'}
                            className="mt-1 block w-full p-1 rounded-md border-gray-300  text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={product[field as keyof typeof product]}
                            onChange={(e) => handleChange(e, field)}
                            required
                        />
                    </div>
                ))}
                {['features', 'benefits'].map((field) => (
                    <div key={field} className="mb-6">
                        <label className="block text-sm font-medium  capitalize">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        {product[field as keyof typeof product].map((item: any, index: number) => (
                            <input
                                key={index}
                                type="text"
                                className="mt-1 block text-black w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                value={item}
                                onChange={(e) => handleArrayChange(e, field as 'features' | 'benefits', index)}
                                placeholder={`${field.charAt(0).toUpperCase() + field.slice(1)} ${index + 1}`}
                            />
                        ))}
                        <button
                            type="button"
                            className="mt-2 text-indigo-500 hover:text-indigo-600"
                            onClick={() => addArrayItem(field as 'features' | 'benefits')}
                        >
                            + Add another {field.slice(0, -1)}
                        </button>
                    </div>
                ))}
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Add Product
                </button>
            </form>
        </div>
    );
}
