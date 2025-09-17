"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import Product from '@/app/[locale]/components/product/Product';
import HowToUse from '@/app/[locale]/components/product/HowToUse';
import RelatedProducts from '@/app/[locale]/components/product/RelatedProducts';

interface Product {
    id: number;
    image: string;
    title: string;
    price: string;
    oldPrice: number;
    type: string;
    frontImage: string;
    backImage: string;
    qrColor: string;

}

export default function ProductPageContent() {
    const params = useParams();
    const id = params?.id as string | undefined;

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // State to store related products

    // Fetch the main product based on the id from the URL
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;

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

        fetchProduct();
    }, [id]);

    // Fetch the last three products to display as related products
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                const res = await fetch(`${BASE_API_URL}/api/products/getLastThree`); // Assume you created a `/related` API endpoint
                if (!res.ok) {
                    throw new Error('Failed to fetch related products');
                }
                const data = await res.json();
                setRelatedProducts(data);  // Store the fetched related products
            } catch (err) {
                setError((err as Error).message);
            }
        };

        fetchRelatedProducts();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center py-72"><img src="/load.gif" alt="Loading..." className="w-40 h-40" /></div>;
    }

    if (!product) {
        return <div className="flex justify-center items-center py-72">Няма такъв продукт!</div>;
    }

    const images = ['/cards/wa-front-back.png', '/cards/mh-front-back.png', '/cards/bp-front-back.png', '/cards/impr-front-back.png'];

    return (
        <div className="text-white min-h-screen">
            <Product
                title={product.title}
                price={product.price}
                oldPrice={product.oldPrice}
                imageUrls={[product.image, ...images]}
                back={product.backImage}
                front={product.frontImage}
                qrColor={product.qrColor}
                type={product.type}
            />
            <HowToUse />
            <RelatedProducts products={relatedProducts} />
        </div>
    );
}
