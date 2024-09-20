"use client"; // Enable client-side rendering

import React, { useEffect, useState } from 'react';
import ProductList from './ProductList'; // Adjust this path if necessary
import { BASE_API_URL } from '@/utils/constants'; // Use your base API URL

interface Product {
    id: number;
    image: string; // Prisma field
    title: string; // Prisma field
    price: number;
    type: string;
}

const AllProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/products/allProducts`);
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data: Product[] = await response.json();
                console.log(data);

                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container mx-auto py-32">
            <h1 className="text-3xl font-bold text-center mt-10">All Products</h1>
            <ProductList products={products} />
        </div>
    );
};

export default AllProductsPage;
