import { BASE_API_URL } from '@/utils/constants';
import { useState, ChangeEvent, FormEvent } from 'react';
import { FaPhone, FaEnvelope, FaClock } from 'react-icons/fa';
import ActionButtons2 from '../components/profileDetails/ActionButtons2';

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

        const response = await fetch(`${BASE_API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess('Съобщението беше изпратено успешно!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
            });
        } else {
            setError('Неуспешно изпращане на съобщение. Моля, опитайте отново.');
        }
    };

    return (
        <div className="max-w-screen-lg mx-auto p-5">
            <div className="grid grid-cols-1 md:grid-cols-12">
                <div className="bg-gray-800 md:col-span-4 p-10 text-white">
                    <p className="mt-4 text-sm leading-7 font-regular uppercase">
                        Контакт
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight">
                        Свържете се с нас <span className="text-orange">Сега</span>
                    </h3>
                    <p className="mt-4 leading-7 text-gray-200">
                        Изпратете ни вашето съобщение и получете отговор в рамките на 24 часа.
                    </p>

                    {/* Phone Section */}
                    <div className="flex items-center mt-5">
                        <FaPhone className="h-6 mr-2 text-orange" />
                        <span className="text-sm">+359 88 904 4614</span>
                    </div>
                    {/* New Phone Number */}
                    <div className="flex items-center mt-2">
                        <FaPhone className="h-6 mr-2 text-orange" />
                        <span className="text-sm">+359 88 956 1329</span>
                    </div>

                    {/* Email Section */}
                    <div className="flex items-center mt-5">
                        <FaEnvelope className="h-6 mr-2 text-orange" />
                        <span className="text-sm">ninjacardnfc@gmail.com</span>
                    </div>

                    {/* 24/7 Section */}
                    <div className="flex items-center mt-5">
                        <FaClock className="h-6 mr-2 text-orange" />
                        <span className="text-sm">24/7</span>
                    </div>
                </div>

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="md:col-span-8 p-10 bg-gray-900">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="name">
                                Име
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="phone">
                                Телефонен номер
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="email">
                                Имейл адрес
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full px-3">
                            <label className="block uppercase tracking-wide text-gray-400 text-xs font-bold mb-2" htmlFor="subject">
                                Вашето съобщение
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-200 text-gray-400 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="subject"
                                name="subject"
                                rows={10}
                                value={formData.subject}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-between w-full px-3">
                        <div className="md:flex md:items-center">
                            <label className="block text-gray-500 font-bold">
                                <input className="mr-2 leading-tight" type="checkbox" />
                                <span className="text-sm">
                                    Изпратете ми вашия бюлетин!
                                </span>
                            </label>
                        </div>
                        <button
                            className="shadow bg-orange hover:bg-opacity-50 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
                            type="submit"
                        >
                            Изпратете съобщението
                        </button>
                    </div>

                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {success && <p className="text-green-500 mt-4">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default ContactForm;
