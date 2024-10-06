"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaEye, FaEyeSlash } from 'react-icons/fa';  // Import the icons for showing/hiding password
import { BASE_API_URL } from '@/utils/constants';

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
    const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

    const onSubmit = async (data: any) => {
        const res = await fetch(`${BASE_API_URL}/api/auth/login`, {
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

            showAlert('Logged', 'Success', 'green');

            setTimeout(() => {
                window.location.href = '/';
            }, 1500);

        } else {
            showAlert('Login failed', 'Warning', 'red');
        }
    };

    const showAlert = (message: string, title: string, color: string) => {
        setAlert({ message, title, color });
        setTimeout(() => {
            setAlert(null);
        }, 4000);
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-950 min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center justify-center mx-auto">
                <a href="#" className="flex items-center mb-6 text-3xl font-semibold text-gray-900 dark:text-white">
                    <Image className="w-24 h-24 filter grayscale" src="/navlogo.png" alt="logo" width={96} height={96} />
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
                        <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
                            Влезте в профила си
                        </h1>
                        {alert && (
                            <div className={`my-2 w-full p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
                                <strong>{alert.title}: </strong> {alert.message}
                            </div>
                        )}
                        <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label htmlFor="email" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">Имейл</label>
                                <input
                                    type="email"
                                    id="email"
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.email ? 'border-red-500' : ''}`}
                                    placeholder="name@company.com"
                                    {...register('email')}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-sm italic">{errors.email.message}</p>}
                            </div>
                            <div className="relative">
                                <label htmlFor="password" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">Парола</label>
                                <input
                                    type={showPassword ? 'text' : 'password'}  // Conditionally change input type
                                    id="password"
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    required
                                />
                                {/* Show/Hide password icon */}
                                <div
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-700 dark:text-gray-300 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}  // Toggle show/hide password
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}  {/* Icon toggling */}
                                </div>
                                {errors.password && <p className="text-red-500 text-sm italic">{errors.password.message}</p>}
                                <div className="mt-2 text-sm text-right">
                                    <a href="/changePassword" className="text-red-600 hover:underline">Забравена парола?</a>
                                </div>
                            </div>
                            <button
                                type="submit"
                                className="w-full text-white bg-orange hover:bg-opacity-60 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-6 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Влез
                            </button>
                            {/* <p className="text-base font-light text-gray-500 dark:text-gray-400">
                                Нямате акаунт? <a href="/register" className="font-medium text-teal-600 hover:underline">Регистрирайте се тук</a>
                            </p> */}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
