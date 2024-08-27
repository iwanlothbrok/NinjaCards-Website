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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b  p-6">
            <div className="w-full max-w-lg bg-gray-800 bg-opacity-90 rounded-lg shadow-lg p-8">
                <h2 className="text-3xl font-semibold text-center text-teal-400 mb-8">Get In Touch</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-teal-300 font-medium mb-2" htmlFor="name">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-teal-300 font-medium mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-teal-300 font-medium mb-2" htmlFor="phone">
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-teal-300 font-medium mb-2" htmlFor="subject">
                            Subject
                        </label>
                        <textarea
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-700 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-32 resize-none"
                            required
                        />
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-6 py-3 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition-transform transform hover:scale-105"
                        >
                            Send Message
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
                            className="px-6 py-3 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-transform transform hover:scale-105"
                        >
                            Reset Form
                        </button>
                    </div>
                    {error && <p className="mt-6 text-red-500 text-center">{error}</p>}
                    {success && <p className="mt-6 text-green-500 text-center">{success}</p>}
                </form>
            </div>
        </div>
    );
};

export default SimpleContactForm;
