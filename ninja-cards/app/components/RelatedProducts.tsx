import React from 'react';

type RelatedProduct = {
    id: number;
    title: string;
    imageUrl: string;
    price: string;
};

type RelatedProductsProps = {
    products: RelatedProduct[];
};

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
    return (
        <div className="mt-16">
            <h3 className="text-3xl font-semibold text-gray-900 mb-8">Related Products</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">

                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group relative bg-white border border-gray-200 rounded-lg m-10 shadow-sm hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="w-full h-56 bg-gray-200 rounded-t-lg overflow-hidden">
                            <img
                                src={product.imageUrl}
                                alt={product.title}
                                className="w-full h-full object-center object-cover transition-transform duration-300 transform group-hover:scale-105"
                            />
                        </div>
                        <div className="p-4">
                            <h4 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                                {product.title}
                            </h4>
                            <p className="mt-2 text-xl font-bold text-gray-900">{product.price}</p>
                        </div>
                        <a
                            href={`/product/${product.id}`}
                            className="absolute inset-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            <span className="sr-only">View {product.title}</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
