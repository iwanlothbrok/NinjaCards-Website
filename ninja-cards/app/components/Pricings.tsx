"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

const plans = [
    {
        title: "Starter",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER,
        price: 0,
        description: "Start with basic features, free for 30 days.",
        features: [
            "Free for 30 days",
            "Basic Analytics",
            "Access to public profile",
        ],
    },
    {
        title: "Pro",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO,
        price: 29,
        description: "Advanced features for growing businesses.",
        features: [
            "Everything in Starter",
            "Advanced Analytics",
            "Priority Support",
            "Unlimited Profile Actions",
        ],
    },
];

export default function Pricing() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleCheckout = async (priceId: string) => {
        if (!user) return;

        setLoading(true);
        try {
            const { data } = await axios.post("/api/payments/create-checkout-session", {
                userId: user.id,
                email: user.email,
                priceId,
            });

            //const stripe = await stripePromise;
            //            await stripe?.redirectToCheckout({ sessionId: data.sessionId });
            window.location.href = data.url;

        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-12 items-center py-20 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
            <h2 className="text-4xl font-extrabold text-center">
                Find Your Perfect Plan
            </h2>
            <p className="text-lg text-gray-300 text-center max-w-2xl">
                Start free. Upgrade anytime.
            </p>
            <div className="grid md:grid-cols-2 gap-12">
                {plans.map((plan) => (
                    <div
                        key={plan.title}
                        className="bg-gray-800 p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-transform duration-300"
                    >
                        <h3 className="text-2xl font-bold mb-4 text-center text-blue-400">
                            {plan.title}
                        </h3>
                        <p className="text-center text-gray-300 mb-6">
                            {plan.description}
                        </p>
                        <div className="text-center mb-6">
                            <span className="text-4xl font-extrabold text-white">
                                {plan.price === 0 ? "Free" : `$${plan.price}`}
                            </span>
                            {plan.price !== 0 && <span className="text-lg text-gray-400">/month</span>}
                        </div>
                        <ul className="mb-6 space-y-2">
                            {plan.features.map((feature, idx) => (
                                <li
                                    key={idx}
                                    className="flex items-center gap-2 text-gray-300"
                                >
                                    <svg
                                        className="w-5 h-5 text-green-500"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                        ></path>
                                    </svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled={loading}
                            onClick={() => handleCheckout(plan.priceId!)}
                            className={`w-full py-3 rounded-lg text-lg font-semibold ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                } text-white transition-colors duration-300`}
                        >
                            {loading ? "Processing..." : plan.price === 0 ? "Start Free Trial" : "Subscribe"}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
