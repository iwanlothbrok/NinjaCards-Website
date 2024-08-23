"use client";
import React from 'react';
import RelatedProducts from '../components/RelatedProducts';
import Product from '../components/Product';

const ProductPage = () => {
    return (
        <>
            <Product
                title="Smart Vizitka"
                description="An individual business card with customizable design."
                price="$29.99"
                imageUrl="/nfc-card.webp"
                features={[
                    'Customizable design',
                    'High-quality print',
                    'Multiple design templates',
                    'Fast delivery',
                ]}
                benefits={[
                    'Professional and modern design',
                    'Enhances personal branding',
                    'Easy to share contact information',
                    'Reusable and eco-friendly',
                ]}
                nfcType="NXP NTAG213"
                reviews={[
                    {
                        name: 'John Doe',
                        rating: 5,
                        comment: 'This product exceeded my expectations! The print quality is superb.',
                    },
                    {
                        name: 'Jane Smith',
                        rating: 4,
                        comment: 'Very useful and well-designed NFC card. Highly recommend.',
                    },
                ]}
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
        </>
    );
};

export default ProductPage;
