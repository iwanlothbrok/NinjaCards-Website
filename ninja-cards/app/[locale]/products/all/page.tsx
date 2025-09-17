"use client"; // Enable client-side rendering

import React, { useEffect, useState } from "react";
import ProductList from "../ProductList";
import { BASE_API_URL } from "@/utils/constants";
import Header from "../../components/layout/Header";
import { useTranslations } from "next-intl";

interface Product {
    id: number;
    image: string;
    title: string;
    price: number;
    type: string;
    oldPrice: number;
    qrColor: string;
}

const AllProductsPage: React.FC = () => {
    const t = useTranslations("AllProductsPage");
    console.log("Current locale:", t);

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${BASE_API_URL}/api/products/allProducts`);
                if (!response.ok) throw new Error("Failed to fetch products");
                const data: Product[] = await response.json();
                setProducts(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-72">
                <img src="/load.gif" alt={t("states.loadingAlt")} className="w-40 h-40" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center py-72 px-10 text-3xl">
                {t("states.fetchError")}
            </div>
        );
    }

    return (
        <>
            <Header
                pageInformation={t("header.pageInformation")}
                textOne={t("header.textOne")}
                textTwo={t("header.textTwo")}
                textThree={t("header.textThree")}
            />

            <div className="container mx-auto py-12">
                {products.length === 0 ? (
                    <div className="flex justify-center items-center p-14" style={{ fontSize: "36px" }}>
                        {t("states.noProductsOfType")}
                    </div>
                ) : (
                    <ProductList products={products} />
                )}
            </div>
        </>
    );
};

export default AllProductsPage;
