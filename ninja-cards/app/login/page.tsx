"use client";

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();

    const onSubmit = async (data: any) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (res.ok) {
            const { token, user } = await res.json();
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            router.push('/');
            // window.location.reload();
        } else {
            const errorData = await res.json();
            alert(`Login failed: ${errorData.error}`);
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <section className="w-full max-w-md p-8 bg-white rounded shadow-md">
                <h2 className="text-2xl font-bold mb-6">Login</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.email ? 'border-red-500' : ''}`}
                            id="email"
                            type="email"
                            placeholder="Your email"
                            {...register('email')}
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''}`}
                            id="password"
                            type="password"
                            placeholder="Your password"
                            {...register('password')}
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600"
                            type="submit"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Login;
