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
        <main className="flex flex-col items-center justify-center min-h-screen ">
            <section className="w-full max-w-md p-8  rounded shadow-md bg-blue-900">
                {alert && (
                    <div className={`my-2 w-full p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
                        <strong>{alert.title}: </strong> {alert.message}
                    </div>
                )}
                <h2 className="text-2xl font-bold mb-6 text-orange">Login</h2>
                <form onSubmit={onForgotPasswordSubmit}>
                    <div className="mb-4">
                        <label className="block text-orange text-sm font-bold mb-2" htmlFor="email">
                            Enter your email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Your email"
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange"
                            type="submit"
                        >
                            Reset Password
                        </button>
                    </div>
                    <div className="mt-4 text-sm text-center text-orange cursor-pointer" onClick={() => router.push('/login')}>
                        Back to Login
                    </div>
                </form>
            </section>
        </main>
    );
}
