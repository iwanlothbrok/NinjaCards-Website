"use client"; // Enable client-side rendering

import React, { useEffect, useState } from 'react';
import ProductList from '../ProductList'; // Adjust this path if necessary
import { BASE_API_URL } from '@/utils/constants'; // Use your base API URL
import Head from 'next/head';
import Header from '@/app/components/layout/Header';

interface Product {
    id: number;
    image: string; // Prisma field
    title: string; // Prisma field
    price: number;
    type: string;
}

export default function NfcCardsList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/products/getReviews`);
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
        return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }
    //  pageInformation, textOne, textTwo, textThree
    return (
        <>
            <Header pageInformation='Ревюта' textOne='NFC Визитки' textTwo='По Твой Дизайн' textThree='Бизнес Контакти' />
            <div className="container mx-auto">
                {products.length === 0 ? (<div className="flex justify-center items-center p-14" style={{ fontSize: '36px' }}>Няма добавени продукти от този тип.</div>) : <ProductList products={products} />}
            </div>
        </>
    );
}
