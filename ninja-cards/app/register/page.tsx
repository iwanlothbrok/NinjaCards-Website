"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

interface Alert {
  message: string;
  title: string;
  color: string;
}

const REGISTER_URL = '/api/auth/register';
const SUCCESS_DELAY = 1000;

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email format').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), ''], 'Passwords must match')
    .required('Confirm Password is required'),
});

const Register: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [alert, setAlert] = useState<Alert | null>(null);

  const router = useRouter();
  const { login } = useAuth();

  const onSubmit = async (data: any) => {
    try {
      const res = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      await handleResponse(res);
    } catch (error) {
      showAlert('An error occurred while processing your request', 'Error', 'red');
      console.error('Error during registration:', error);
    }
  };

  const handleResponse = async (res: Response) => {
    if (res.ok) {
      setTimeout(() => {
        showAlert('Profile updated successfully', 'Success', 'green');
      }, SUCCESS_DELAY);

      const { token, user } = await res.json();
      login(token, user);
      router.push('/login');
    } else {
      showAlert('Неуспешна регистрация', 'Warning', 'red');
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
      <section className="w-full max-w-md p-8  rounded shadow-md bg-blue-800">
        {alert && (
          <div className={`my-2 w-full p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
            <strong>{alert.title}: </strong> {alert.message}
          </div>
        )}
        <h2 className="text-2xl font-bold mb-6 text-orange">Register</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-orange text-sm font-bold mb-2" htmlFor="name">
              Name
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
              id="name"
              type="text"
              placeholder="Your name"
              {...register('name')}
            />
            {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label className="block text-orange text-sm font-bold mb-2" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.confirmPassword ? 'border-red-500' : ''}`}
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register('confirmPassword')}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs italic">{errors.confirmPassword.message}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-orange text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:bg-orange-600"
              type="submit"
            >
              Register
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Register;
