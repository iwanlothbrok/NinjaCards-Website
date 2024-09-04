import { BASE_API_URL } from '@/utils/constants';
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
}

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
    });

    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const response = await fetch(`${BASE_API_URL}/api/contact'`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess('Message sent successfully!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
            });
        } else {
            setError('Failed to send message. Please try again.');
        }
    };

    return (
        <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-teal-800 shadow-lg transform transition-transform duration-700 ease-in-out -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-black bg-opacity-50 shadow-lg sm:rounded-3xl sm:p-20 text-white animate-fade-in">
                    <div className="text-center pb-6">
                        <h1 className="text-3xl font-bold text-orange animate-bounce">Contact Us!</h1>
                        <p className="text-gray-300">Fill up the form below to send us a message.</p>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="name">
                                Name
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange"
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange"
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange"
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-200 mb-2" htmlFor="subject">
                                Subject
                            </label>
                            <textarea
                                className="shadow appearance-none border rounded h-32 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-orange"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                className="shadow bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105"
                                type="submit"
                            >
                                Send ➤
                            </button>
                            <button
                                className="shadow bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out transform hover:scale-105"
                                type="reset"
                                onClick={() =>
                                    setFormData({
                                        name: '',
                                        email: '',
                                        phone: '',
                                        subject: '',
                                    })
                                }
                            >
                                Reset
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-4 animate-pulse">{error}</p>}
                        {success && <p className="text-green-500 mt-4 animate-pulse">{success}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
