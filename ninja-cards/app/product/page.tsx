"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import RelatedProducts from '../components/product/RelatedProducts';
import Product from '../components/product/Product';
import { BASE_API_URL } from '@/utils/constants';

type Review = {
    id: number;
    name: string;
    rating: number;
    comment: string;
};

type Feature = {
    id: number;
    name: string;
};

type Benefit = {
    id: number;
    name: string;
};

type ProductData = {
    id: number;
    title: string;
    description: string;
    price: number;
    imageUrl: string;
    nfcType: string;
    features?: Feature[];
    benefits?: Benefit[];
    reviews?: Review[];
};

function ProductPageContent() {
    const searchParams = useSearchParams();
    // const id = searchParams?.get('id');

    // const [productData, setProductData] = useState<ProductData | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // useEffect(() => {
    //     if (id) {
    //         const fetchProduct = async () => {
    //             setLoading(true);
    //             try {
    //                 const response = await fetch(`${BASE_API_URL}/api/products/${id}`);
    //                 if (!response.ok) {
    //                     throw new Error('Failed to fetch product');
    //                 }
    //                 const data: ProductData = await response.json();

    //                 // Ensure the related entities are always defined as arrays
    //                 data.features = data.features || [];
    //                 data.benefits = data.benefits || [];
    //                 data.reviews = data.reviews || [];

    //                 setProductData(data);
    //             } catch (error) {
    //                 console.error('Error fetching product:', error);
    //             } finally {
    //                 setLoading(false);
    //             }
    //         };

    //         fetchProduct();
    //     }
    // }, [id]);

    // if (loading || !productData) {
    //     return <div className="text-center text-white pt-40">Loading...</div>;
    // }

    return (
        <div className=" text-white min-h-screen">
            <Product
                title={'NFC REVIEW'}
                description={'LOREM IMPSUM'}
                price={'$123'}
                imageUrls={['/cards/wa-front-back.png', '/cards/mh-front-back.png', '/cards/gr-1.png']}

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

export default function ProductPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProductPageContent />
        </Suspense>
    );
}
