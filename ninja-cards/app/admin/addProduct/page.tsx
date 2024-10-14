"use client";
import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';

export default function AddProduct() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [product, setProduct] = useState({
        title: '',
        price: '',
        oldPrice: '',
        qrColor: '',  // Default to the first option
        type: 'cards',  // Default to the first option
    });
    const [image, setImage] = useState<File | null>(null);
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);

    const router = useRouter();
    const adminPassword = "azsymivan"; // Replace with your secret password

    const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (password === adminPassword) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: string
    ) => {
        setProduct({
            ...product,
            [field]: e.target.value,
        });
    };


    const handleFileChange = (e: ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', product.title);
        formData.append('price', product.price);
        formData.append('oldPrice', product.oldPrice || '0');

        formData.append('type', product.type);
        formData.append('qrColor', product.qrColor);

        if (image) {
            formData.append('image', image);
        }
        if (frontImage) {
            formData.append('frontImage', frontImage);
        }
        if (backImage) {
            formData.append('backImage', backImage);
        }
        console.log(formData);
        console.log(image);


        const response = await fetch(`${BASE_API_URL}/api/admin/addProduct`, {
            method: 'POST',
            body: formData,  // Send the FormData with the files
        });
        console.log(response.statusText);

        if (response.ok) {
            router.push('/');  // Redirect to homepage or product list after submission
        } else {
            console.error('Failed to add product');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="max-w-md mx-auto p-6 shadow-lg mt-44 rounded-md bg-gray-500">
                <h1 className="text-2xl font-bold mb-4 text-center">Admin Access</h1>
                <form onSubmit={handlePasswordSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-800">Admin Password</label>
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
        <div className="max-w-2xl mx-auto p-6 shadow-lg rounded-md bg-gray-700 mt-20 text-gray-300">
            <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {['title', 'price', 'oldPrice', 'qrColor'].map((field) => (
                    <div key={field} className="mb-6">
                        <label className="block text-sm font-medium capitalize">
                            {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                            type={field.includes('rice') ? 'number' : 'text'}
                            className="mt-1 block w-full p-1 rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            value={product[field as keyof typeof product]}
                            onChange={(e) => handleChange(e, field)}
                            required
                        />
                    </div>
                ))}

                {/* File inputs for images */}
                <div className="mb-6">
                    <label className="block text-sm font-medium">Main Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full p-1 rounded-md border-gray-300 text-black shadow-sm"
                        onChange={(e) => handleFileChange(e, setImage)}
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium">Front Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full p-1 rounded-md border-gray-300 text-black shadow-sm"
                        onChange={(e) => handleFileChange(e, setFrontImage)}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium">Back Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        className="mt-1 block w-full p-1 rounded-md border-gray-300 text-black shadow-sm"
                        onChange={(e) => handleFileChange(e, setBackImage)}
                    />
                </div>

                {/* Type selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium">Type</label>
                    <select
                        value={product.type}
                        onChange={(e) => handleChange(e as ChangeEvent<HTMLSelectElement>, 'type')}
                        className="mt-1 block w-full p-1 rounded-md border-gray-300 text-black shadow-sm"
                        required
                    >
                        <option value="cards">Smart Cards</option>
                        <option value="reviews">Reviews</option>
                        <option value="stickers">Stickers</option>
                    </select>
                </div>

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
