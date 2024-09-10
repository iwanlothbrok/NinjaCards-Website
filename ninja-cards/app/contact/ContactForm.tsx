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
            <div className="grid grid-cols-1 md:grid-cols-12 border">
                <div className="bg-gray-900 md:col-span-4 p-10 text-white">
                    <p className="mt-4 text-sm leading-7 font-regular uppercase">
                        Контакт
                    </p>
                    <h3 className="text-3xl sm:text-4xl leading-normal font-extrabold tracking-tight">
                        Свържете се с нас <span className="text-indigo-600">Сега</span>
                    </h3>
                    <p className="mt-4 leading-7 text-gray-200">
                        Lorem Ipsum е просто фиктивен текст от печатната и издателската индустрия. Той се използва от 1500 г. насам.
                    </p>

                    <div className="flex items-center mt-5">
                        <svg className="h-6 mr-2 text-indigo-600" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 489.536 489.536">
                            <g>
                                <path d="M488.554,476l-99-280.2c-1-4.2-5.2-7.3-9.4-7.3h-45.6c12.9-31.1 19.6-54.9 19.6-70.8 0-64.6-50-117.7-112.5-117.7-61.5,0-112.5,52.1-112.5,117.7 0,17.6 8.2,43.1 19.9,70.8h-39.7c-4.2,0-8.3,3.1-9.4,7.3l-99,280.2c-3.2,10.3 6.3,13.5 9.4,13.5h468.8c4.2,0.5 12.5-4.2 9.4-13.5z"></path>
                                <rect width="136.5" x="177.054" y="379.1" height="20.8"></rect>
                                <path d="M289.554,108.2c0-26-21.9-47.9-47.9-47.9s-47.9,21.9-47.9,47.9 20.8,47.9 47.9,47.9c27.1,0 47.9-21.8 47.9-47.9zM214.554,107.2c0-14.6 11.5-27.1 27.1-27.1s27.1,12.5 27.1,27.1-11.5,27.1-27.1,27.1c-14.6,0-27.1-12.5-27.1-27.1z"></path>
                            </g>
                        </svg>
                        <span className="text-sm">Къща №14, Улица №12, Даруламан Роуд, Кабул, Афганистан.</span>
                    </div>
                    <div className="flex items-center mt-5">
                        <svg className="h-6 mr-2 text-indigo-600" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60.002 60.002">
                            <g>
                                <path d="M59.002,37.992c-3.69,0-6.693-3.003-6.693-6.693c0-0.553-0.447-1-1-1s-1,0.447-1,1c0,4.794,3.899,8.693,8.693,8.693c0.553,0,1-0.447,1-1S59.554,37.992,59.002,37.992z"></path>
                                <path d="M58.256,35.65c0.553,0,1-0.447,1-1s-0.447-1-1-1c-0.886,0-1.605-0.72-1.605-1.605c0-0.553-0.447-1-1-1s-1,0.447-1,1C54.65,34.033,56.267,35.65,58.256,35.65z"></path>
                            </g>
                        </svg>
                        <span className="text-sm">+93 749 99 65 50</span>
                    </div>
                    <div className="flex items-center mt-5">
                        <svg className="h-6 mr-2 text-indigo-600" fill="currentColor" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300.988 300.988">
                            <g>
                                <path d="M150.494,0.001C67.511,0.001,0,67.512,0,150.495s67.511,150.493,150.494,150.493s150.494-67.511,150.494-150.493S233.476,0.001,150.494,0.001z M150.494,285.987C75.782,285.987,15,225.206,15,150.495S75.782,15.001,150.494,15.001s135.494,60.782,135.494,135.493S225.205,285.987,150.494,285.987z"></path>
                            </g>
                        </svg>
                        <span className="text-sm">24/7</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="md:col-span-8 p-10">
                    <div className="flex flex-wrap -mx-3 mb-6">
                        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="name">
                                Име
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="w-full md:w-1/2 px-3">
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="phone">
                                Телефонен номер
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
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
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="email">
                                Имейл адрес
                            </label>
                            <input
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="subject">
                                Вашето съобщение
                            </label>
                            <textarea
                                className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
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
                            className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded"
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
