"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import path from 'path';

const schema = yup.object().shape({
    email: yup.string().email('Invalid email format').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

interface Alert {
    message: string;
    title: string;
    color: string;
}

const Login: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const router = useRouter();
    const [alert, setAlert] = useState<Alert | null>(null);

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
            console.log(token + ' token');
            console.log(user + ' user');

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            showAlert('Logged', 'Success', 'green');

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);


        } else {
            const errorData = await res.json();
            showAlert('Неуспешно влизане в профила', 'Warning', 'red');
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-orange text-sm font-bold mb-2" htmlFor="email">
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
                        <label className="block text-orange text-sm font-bold mb-2" htmlFor="password">
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
                        <div
                            className="text-sm text-orange cursor-pointer"
                            onClick={() => router.push('/changePassword')}
                        >
                            Forgot Password?
                        </div>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default Login;
