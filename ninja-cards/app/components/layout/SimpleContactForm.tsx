import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
    name: string;
    email: string;
    phone: string;
    subject: string;
}

const SimpleContactForm: React.FC = () => {
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

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            setSuccess('Съобщението е изпратено успешно!');
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
            });
        } else {
            setError('Не успя да изпрати съобщение. Моля, опитайте отново.');
        }
    };

    return (
        <div className="bg-gradient-to-b from-gray-950 to-black min-h-screen flex flex-col justify-center items-center p-6">
            <div className="transition duration-500 ease-in-out transform scale-100 translate-x-0 translate-y-0 opacity-100">
                <div className="space-y-4 text-center pt-10">
                    <div className="inline-block px-4 py-2 text-sm font-semibold text-indigo-100 rounded-full bg-[#202c47] bg-opacity-70 hover:cursor-pointer hover:bg-opacity-50">
                        Свържете се с нас
                    </div>
                    <h1 className="text-3xl font-bold text-white sm:text-4xl">
                        Връзка с нашия екип
                    </h1>
                    <p className="text-lg text-gray-300 sm:text-xl">
                        Ние сме тук, за да помогнем. Свържете се с нас за всякакви въпроси или предложения.
                    </p>
                </div>
            </div>

            <div className="w-full max-w-lg bg-[#121923] bg-opacity-95 rounded-lg shadow-2xl p-8 mt-10">
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2" htmlFor="name">
                            Имена
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Вашето име"
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2" htmlFor="email">
                            Имейл
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Вашият имейл"
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2" htmlFor="phone">
                            Телефонен номер
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Вашият телефонен номер"
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-white font-medium mb-2" htmlFor="subject">
                            Запитване
                        </label>
                        <textarea
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            placeholder="Вашето съобщение"
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-28 resize-none"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-orange text-white font-semibold rounded-lg shadow-lg hover:bg-orange-600 transition-transform transform hover:scale-105"
                        >
                            Изпрати
                        </button>
                        <button
                            type="reset"
                            onClick={() =>
                                setFormData({
                                    name: '',
                                    email: '',
                                    phone: '',
                                    subject: '',
                                })
                            }
                            className="px-8 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-lg hover:bg-red-600 transition-transform transform hover:scale-105"
                        >
                            Нулиране
                        </button>
                    </div>
                    {error && <p className="mt-6 text-red-500 text-center font-medium">{error}</p>}
                    {success && <p className="mt-6 text-green-500 text-center font-medium">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default SimpleContactForm;
