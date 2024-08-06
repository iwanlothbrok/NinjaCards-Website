"use client";

import React from 'react';

const ContactForm: React.FC = () => {
    return (
        <form className="max-w-lg mx-auto">
            <div className="mb-4">
                <label className="block text-orange text-sm font-bold mb-2" htmlFor="name">
                    Name
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-orange leading-tight focus:outline-none focus:shadow-outline"
                    id="name"
                    type="text"
                    placeholder="Your name"
                />
            </div>
            <div className="mb-4">
                <label className="block text-orange text-sm font-bold mb-2" htmlFor="email">
                    Email
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-orange leading-tight focus:outline-none focus:shadow-outline"
                    id="email"
                    type="email"
                    placeholder="Your email"
                />
            </div>
            <div className="mb-6">
                <label className="block text-orange text-sm font-bold mb-2" htmlFor="message">
                    Message
                </label>
                <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-orange leading-tight focus:outline-none focus:shadow-outline"
                    id="message"
                    placeholder="Your message"
                    rows={4}
                ></textarea>
            </div>
            <div className="flex items-center justify-between">
                <button
                    className="bg-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600"
                    type="button"
                >
                    Send Message
                </button>
            </div>
        </form>
    );
};

export default ContactForm;
