"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import Product from '@/app/components/product/Product';
import RelatedProducts from '@/app/components/product/RelatedProducts';

interface Product {
    id: number;
    image: string;
    title: string;
    price: string;
    type: string;
}

export default function ProductPageContent() {
    const params = useParams();  // Get the dynamic params from the URL
    const id = params?.id as string | undefined;  // Safely get 'id' from params

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;  // If 'id' is undefined, do not proceed

            console.log('sending data');
            console.log(id);


            try {
                setLoading(true);
                const res = await fetch(`${BASE_API_URL}/api/products/${id}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch product');
                }
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();  // Fetch product data when ID is available
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center py-72">Няма такъв продукт!</div>;
    }

    const images = ['/cards/wa-front-back.png', '/cards/mh-front-back.png', '/cards/bp-front-back.png'];

    return (
        <div className="text-white min-h-screen">
            <Product
                title={product.title}
                description={''} // Assuming the API doesn't provide description, otherwise pass it here
                price={product.price}
                imageUrls={[product.image, ...images]}
            />
            <RelatedProducts
                products={[
                    {
                        id: 1,
                        title: 'NFC Business Card',
                        imageUrl: '/nfc-card.webp',
                        price: '$19.99',
                    },
                    {
                        id: 2,
                        title: 'Custom NFC Tag',
                        imageUrl: '/nfc-card.webp',
                        price: '$14.99',
                    },
                    {
                        id: 3,
                        title: 'Smart Keychain NFC',
                        imageUrl: '/nfc-card.webp',
                        price: '$9.99',
                    }
                ]}
            />
        </div>
    );
}
