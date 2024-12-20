"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'next/navigation';
import { BASE_API_URL } from '@/utils/constants';
import { useAuth } from '@/app/context/AuthContext';
// import { useAuth } from '../context/AuthContext';
// import { BASE_API_URL } from '../../utils/constants'
interface Alert {
  message: string;
  title: string;
  color: string;
}

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

    console.log(`${BASE_API_URL}/api/auth/register`);

    try {
      const res = await fetch(`${BASE_API_URL}/api/auth/register`, {
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
      showAlert('Registration failed', 'Warning', 'red');
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
      <div className="flex flex-col items-center justify-center  mx-auto">
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
          <div className="p-12 space-y-6 md:space-y-8 sm:p-14">
            <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-3xl dark:text-white">
              Създаване на акаунт
            </h1>
            {alert && (
              <div className={`my-2 w-full p-4 rounded ${alert.color === 'green' ? 'bg-green-500' : 'bg-red-500'} text-white animate-fadeIn`}>
                <strong>{alert.title}: </strong> {alert.message}
              </div>
            )}
            <form className="space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="name" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">Име</label>
                <input
                  type="text"
                  id="name"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Your name"
                  {...register('name')}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm italic">{errors.name.message}</p>}
              </div>
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
              <div>
                <label htmlFor="password" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">Парола</label>
                <input
                  type="password"
                  id="password"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('password')}
                  required
                />
                {errors.password && <p className="text-red-500 text-sm italic">{errors.password.message}</p>}
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-3 text-base font-medium text-gray-900 dark:text-white">Потвърждаване на паролата</label>
                <input
                  type="password"
                  id="confirmPassword"
                  className={`bg-gray-50 border border-gray-300 text-gray-900 text-base rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  required
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm italic">{errors.confirmPassword.message}</p>}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-orange hover:bg-opacity-60 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-base px-6 py-3 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Създай
              </button>
              <p className="text-base font-light text-gray-500 dark:text-gray-400">
                Вече имате акаунт? <a href="/login" className="font-medium text-teal-600 hover:underline">Влезте тук</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
