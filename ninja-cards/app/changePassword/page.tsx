"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Alert {
    message: string;
    title: string;
    color: string;
}

export default function ChangePassword() {
    const router = useRouter();
    const [alert, setAlert] = useState<Alert | null>(null);

    const onForgotPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form from refreshing the page
        const formData = new FormData(event.currentTarget);
        const email = formData.get('email') as string;

        console.log('inside of submit'); // This should log when the form is submitted

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                showAlert('New password sent to your email', 'Success', 'green');
            } else {
                showAlert('Failed to reset password', 'Warning', 'red');
            }
        } catch (error) {
            console.error('Error during password reset:', error);
            showAlert('An unexpected error occurred', 'Error', 'red');
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mx-auto">
                <a href="#" className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
                    <img className="w-24 h-24  filter grayscale" src="./navlogo.png" alt="logo" />
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
                            Reset Password
                        </h1>
                        {alert && (
                            <div className={`my-2 w-full p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
                                <strong>{alert.title}: </strong> {alert.message}
                            </div>
                        )}
                        <form className="space-y-6 md:space-y-8" onSubmit={onForgotPasswordSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">
                                    Enter your email
                                </label>
                                <input
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Your email"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-6 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                    type="submit"
                                >
                                    Reset Password
                                </button>
                            </div>
                            <div className="mt-4 text-base text-center text-teal-600 cursor-pointer hover:underline" onClick={() => router.push('/login')}>
                                Back to Login
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
