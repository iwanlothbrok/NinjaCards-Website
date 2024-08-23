// components/Product.tsx
import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';

type Review = {
    name: string;
    rating: number;
    comment: string;
};

type ProductProps = {
    title: string;
    description: string;
    price: string;
    imageUrl: string;
    features: string[];
    benefits: string[];
    nfcType: string;
    reviews: Review[];
};

const Product: React.FC<ProductProps> = ({
    title,
    description,
    price,
    imageUrl,
    features,
    benefits,
    nfcType,
    reviews,
}) => {
    const [showReviews, setShowReviews] = useState(false);
    const [designImage, setDesignImage] = useState<string | null>(null);
    const [isFrontView, setIsFrontView] = useState(true);
    const [qrCodeData, setQrCodeData] = useState<string>('');
    const [qrCodeUrl, setQrCodeUrl] = useState<string>('');

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => setDesignImage(e.target?.result as string);
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleQrCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQrCodeData(event.target.value);
    };

    useEffect(() => {
        if (qrCodeData) {
            QRCode.toDataURL(qrCodeData, { width: 150, margin: 1 })
                .then((url) => {
                    setQrCodeUrl(url);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [qrCodeData]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        const image = imageRef.current;

        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            if (isFrontView && designImage && image) {
                image.onload = () => {
                    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                };
            } else if (!isFrontView && qrCodeUrl) {
                const qrImage = new Image();
                qrImage.src = qrCodeUrl;
                qrImage.onload = () => {
                    ctx.drawImage(qrImage, canvas.width / 2 - 75, canvas.height / 2 - 75, 150, 150);
                    ctx.font = "16px Arial";
                    ctx.fillStyle = "black";
                    ctx.fillText("Scan for more info", canvas.width / 2 - 75, canvas.height / 2 + 90);
                };
            }
        }
    }, [designImage, isFrontView, qrCodeUrl]);

    const handleCanvasMouseDown = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
        event.preventDefault();
    };

    const resetDesign = () => {
        setDesignImage(null);
        setQrCodeData('');
        setQrCodeUrl('');
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    };

    const switchView = () => {
        setIsFrontView(!isFrontView);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Details */}
                <div>
                    <img src={imageUrl} alt={title} className="w-full h-auto rounded-lg shadow-lg" />
                    <h2 className="text-4xl font-bold text-gray-900 mt-4">{title}</h2>
                    <p className="mt-2 text-2xl font-semibold text-blue-600">{price}</p>
                    <p className="mt-4 text-gray-700">{description}</p>

                    <div className="mt-8 flex space-x-4">
                        <button
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition-colors duration-300"
                            onClick={() => alert('Added to Cart!')}
                        >
                            Add to Cart
                        </button>
                        <button
                            className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 transition-colors duration-300"
                            onClick={() => alert('Proceeding to Checkout!')}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>

                {/* Customization Section */}
                <div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold text-gray-900">Design Your NFC Card</h3>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="mt-4 w-full"
                        />
                        <div className="mt-4 flex justify-between items-center">
                            <button
                                onClick={switchView}
                                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-300"
                            >
                                {isFrontView ? 'Switch to Back View' : 'Switch to Front View'}
                            </button>
                            <button
                                onClick={resetDesign}
                                className="bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-900 transition-colors duration-300"
                            >
                                Reset Design
                            </button>
                        </div>

                        {!isFrontView && (
                            <div className="mt-4">
                                <label className="block text-gray-700">
                                    Enter URL/Text for QR Code:
                                </label>
                                <input
                                    type="text"
                                    value={qrCodeData}
                                    onChange={handleQrCodeChange}
                                    className="mt-2 w-full p-2 border border-gray-300 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="mt-4 perspective-1000">
                            <div className={`relative transition-transform duration-700 transform ${isFrontView ? 'rotate-y-0' : 'rotate-y-180'}`}>
                                <canvas
                                    ref={canvasRef}
                                    width={300}
                                    height={200}
                                    className="w-full h-auto border border-gray-300 rounded-lg shadow-lg"
                                    onMouseDown={handleCanvasMouseDown}
                                ></canvas>
                                {designImage && <img ref={imageRef} src={designImage} alt="Design Preview" className="hidden" />}
                            </div>
                        </div>
                    </div>

                    {/* Additional Information */}
                    <div className="mt-8">
                        <h3 className="text-xl font-semibold text-gray-900">Product Details</h3>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-900">Features</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                {features.map((feature, index) => (
                                    <li key={index}>{feature}</li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-900">Benefits</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                                {benefits.map((benefit, index) => (
                                    <li key={index}>{benefit}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-4">
                            <h4 className="text-lg font-medium text-gray-900">Customer Reviews</h4>
                            <button
                                className="bg-blue-600 text-white py-2 px-4 rounded-lg mt-2 hover:bg-blue-700 transition-colors duration-300"
                                onClick={() => setShowReviews(!showReviews)}
                            >
                                {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                            </button>
                            {showReviews && (
                                <div className="mt-4 space-y-4">
                                    {reviews.map((review, index) => (
                                        <div key={index} className="bg-gray-50 p-4 rounded-lg shadow">
                                            <p className="text-lg font-semibold text-gray-800">{review.name}</p>
                                            <p className="mt-1 text-yellow-500">
                                                {'★'.repeat(review.rating)}{' '}
                                                <span className="text-gray-500">{review.rating}/5</span>
                                            </p>
                                            <p className="mt-2 text-gray-700">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;
