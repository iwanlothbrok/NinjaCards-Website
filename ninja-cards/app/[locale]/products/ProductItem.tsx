"use client";

import { motion } from "framer-motion";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

interface ProductItemProps {
    id: number;
    imageUrl: string;
    name: string;
    price: number;
    oldPrice: number;
    type: string;
    qrColor: string;
    locale?: string; // optional
}

const ProductItem: React.FC<ProductItemProps> = ({
    id,
    imageUrl,
    name,
    price,
    oldPrice,
    type,
}) => {
    const t = useTranslations("ProductItem");
    console.log("Current locale:", t);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: { opacity: 1, y: 0, scale: 1 },
                hidden: { opacity: 0, y: 50, scale: 0.95 },
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative w-full bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300 group"
        >
            {/* Image Section */}
            <div className="bg-white">
                <div className="w-full h-72 bg-white rounded-t-lg overflow-hidden">
                    <Link
                        href={`/products/${type}/${id}` as any}

                    >
                        <img
                            src={`data:image/jpeg;base64,${imageUrl}`}
                            alt={t("alt.productImage", { name })}
                            className="w-full h-80 object-center object-contain transition-transform duration-500 transform hover:scale-110"
                        />
                    </Link>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-5 flex flex-col items-center text-center">
                <h2 className="text-2xl font-bold text-black transition-colors duration-300 group-hover:text-orange-400">
                    {name}
                </h2>
                {oldPrice > 0 ? (
                    <>
                        <p className="text-3xl text-red-500 line-through">
                            {oldPrice} {t("currency")}
                        </p>
                        <p className="text-2xl font-semibold text-green-500 mt-2">
                            {price.toFixed(2)} {t("currency")}
                        </p>
                        <p className="text-lg text-gray-500 mt-1">
                            (~{(price / 1.95583).toFixed(2)} EUR)
                        </p>
                    </>
                ) : (
                    <>
                        <p className="text-2xl font-semibold text-green-500">
                            {price.toFixed(2)} {t("currency")}
                        </p>
                        <p className="text-lg text-gray-500 mt-1">
                            (~{(price / 1.95583).toFixed(2)} EUR)
                        </p>
                    </>
                )}

                {/* Call to Action */}
                <Link
                    href={`/products/${type}/${id}` as any}
                    className="mt-5 inline-block px-6 py-3 bg-orange text-white font-medium rounded-lg shadow-md hover:bg-orange hover:shadow-lg transition-transform transform hover:scale-110"
                >
                    {t("cta.learnMore")}
                </Link>
            </div>
        </motion.div>
    );
};

export default ProductItem;
