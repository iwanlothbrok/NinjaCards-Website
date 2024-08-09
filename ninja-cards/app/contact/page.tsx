"use client";

import React from 'react';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <section className="w-full py-16 text-center">
                <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
                <p className="text-lg mb-6">Get in touch with us to know more or to purchase our smart cards.</p>
                <ContactForm />
            </section>
        </main>
    );  
};

export default Contact;
