"use client"; // Enable client-side rendering

import React from 'react';
import ProductItem from './ProductItem';

interface Product {
    id: number;
    image: string;
    title: string;
    price: number;
    oldPrice: number;
    type: string;
    qrColor: string;

}

interface ProductListProps {
    products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
    return (
        <div className="mt-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-16">
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        id={product.id}
                        imageUrl={product.image} // Adjusted to use the 'image' field
                        name={product.title} // Adjusted to use the 'title' field
                        price={product.price}
                        type={product.type}
                        oldPrice={product.oldPrice}
                        qrColor={product.qrColor}
                    />
                ))}
            </div>
        </div>
    );
};

export default ProductList;
