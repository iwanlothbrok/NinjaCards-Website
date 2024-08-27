import React from 'react';

interface ProductCardProps {
    id: string;
    imageUrl: string;
    name: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, imageUrl, name }) => {
    return (
        <div className="relative bg-orange rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group">
            <div className="w-full h-96 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-center object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
            </div>
            <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-blue-600">
                    {name}
                </h2>
            </div>
            <a
                href={`/product/${id}`}
                className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                style={{ cursor: 'pointer' }}
            >
                <span className="sr-only">View {name}</span>
            </a>
        </div>
    );
};

export const ProductGallery: React.FC = () => {
    return (
        <div className="bg-gray-900 p-16">
            <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100 mb-16 space-y-4 text-center">
                <div className="inline-block px-3 py-1 text-sm font-semibold text-indigo-100 rounded-lg bg-[#202c47] bg-opacity-60 hover:cursor-pointer hover:bg-opacity-40">
                    Our Products
                </div>
                <h1 className="text-3xl font-semibold text-white sm:text-4xl">
                    Discover Our Range of NFC Products
                </h1>
                <p className="text-lg text-gray-100 sm:text-xl">
                    We offer a variety of NFC business cards tailored to meet your specific needs. Explore our collection and find the perfect fit for your business.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                <ProductCard
                    id='1'
                    imageUrl="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
                    name="Metal NFC Business Cards"
                />
                <ProductCard
                    id='2'
                    imageUrl="https://user-images.githubusercontent.com/2805249/64069998-305de300-cc9a-11e9-8ae7-5a0fe00299f2.png"
                    name="Wooden NFC Business Cards"
                />
                <ProductCard
                    id='3'
                    imageUrl="https://user-images.githubusercontent.com/2805249/64069899-8bdaa180-cc97-11e9-9b19-1a9e1a254c18.png"
                    name="PVC Digital Business Cards"
                />
            </div>
        </div>
    );
};

export default ProductGallery;
