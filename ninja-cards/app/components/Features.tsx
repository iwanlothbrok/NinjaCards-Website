"use client";

import React from 'react';

const Features: React.FC = () => {
    return (
        <section className="w-full py-16 bg-white text-center">
            <h2 className="text-3xl font-bold mb-6">Features</h2>
            <div className="flex flex-wrap justify-center items-center">
                <div className="w-full md:w-1/3 p-4">
                    <div className="bg-charcoal text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Feature One</h3>
                        <p className="text-lg">Description of feature one.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-4">
                    <div className="bg-charcoal text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Feature Two</h3>
                        <p className="text-lg">Description of feature two.</p>
                    </div>
                </div>
                <div className="w-full md:w-1/3 p-4">
                    <div className="bg-charcoal text-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4">Feature Three</h3>
                        <p className="text-lg">Description of feature three.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
