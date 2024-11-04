import React from 'react';

type RelatedProduct = {
    id: number;
    title: string;
    image: string;
    price: string;
    type: string;
};

// Update the type of props to expect an object with a `products` key containing an array of `RelatedProduct`.
interface RelatedProductsProps {
    products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
    return (
        <div className="mt-16">
            <h3 className="text-3xl font-semibold text-white mb-8 text-center">Свързани продукти</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-6 gap-8">
                {products.map((product) => (
                    <div
                        key={product.id}
                        className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105"
                    >
                        {/* Image Section */}
                        <div className="w-full h-56 bg-gray-100 rounded-t-lg overflow-hidden relative">
                            <img
                                src={`data:image/jpeg;base64,${product.image}`}
                                alt={product.title}
                                className="w-full h-full object-center object-cover transition-transform duration-500 transform  group-hover:scale-110"
                            />
                            {/* Add a "View More" button overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300">
                                <a
                                    href={`/products/${product.type}/${product.id}`}
                                    className="text-white bg-orange px-4 py-2 rounded-lg font-semibold transition-colors duration-300"
                                >
                                    Виж
                                </a>
                            </div>
                        </div>

                        {/* Product Info Section */}
                        <div className="p-5">
                            <h4 className="text-lg font-semibold text-gray-800 transition-colors duration-300 group-hover:text-orange">
                                {product.title}
                            </h4>
                            {/* <p className="mt-2 text-xl font-bold text-gray-900">{product.price}</p> */}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;
