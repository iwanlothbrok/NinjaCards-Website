'use client';

import { useState, type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import { BASE_API_URL } from '@/utils/constants';

const initialState = {
    title: '',
    price: '',
    oldPrice: '',
    qrColor: '',
    type: 'cards',
};

export default function AddProductPanel() {
    const [product, setProduct] = useState(initialState);
    const [image, setImage] = useState<File | null>(null);
    const [frontImage, setFrontImage] = useState<File | null>(null);
    const [backImage, setBackImage] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
        field: keyof typeof initialState,
    ) => {
        setProduct((current) => ({
            ...current,
            [field]: e.target.value,
        }));
    };

    const handleFileChange = (
        e: ChangeEvent<HTMLInputElement>,
        setter: Dispatch<SetStateAction<File | null>>,
    ) => {
        if (e.target.files?.length) {
            setter(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('title', product.title);
            formData.append('price', product.price);
            formData.append('type', product.type);
            formData.append('qrColor', product.qrColor);
            if (product.oldPrice) formData.append('oldPrice', product.oldPrice);
            if (image) formData.append('image', image);
            if (frontImage) formData.append('frontImage', frontImage);
            if (backImage) formData.append('backImage', backImage);

            const response = await fetch(`${BASE_API_URL}/api/admin/addProduct`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({ error: 'Failed to create product' }));
                throw new Error(data.error || 'Failed to create product');
            }

            setProduct(initialState);
            setImage(null);
            setFrontImage(null);
            setBackImage(null);
            setMessage('Product created successfully.');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'Failed to create product');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
                <div className="rounded-2xl border border-orange/20 bg-orange/10 px-4 py-3 text-sm text-orange">
                    {message}
                </div>
            )}

            <div className="grid gap-5 md:grid-cols-2">
                <label className="space-y-2">
                    <span className="text-sm font-semibold text-white/70">Title</span>
                    <input
                        value={product.title}
                        onChange={(event) => handleChange(event, 'title')}
                        required
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-semibold text-white/70">QR Color</span>
                    <input
                        value={product.qrColor}
                        onChange={(event) => handleChange(event, 'qrColor')}
                        required
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-semibold text-white/70">Price</span>
                    <input
                        type="number"
                        value={product.price}
                        onChange={(event) => handleChange(event, 'price')}
                        required
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-semibold text-white/70">Old Price</span>
                    <input
                        type="number"
                        value={product.oldPrice}
                        onChange={(event) => handleChange(event, 'oldPrice')}
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                    />
                </label>

                <label className="space-y-2">
                    <span className="text-sm font-semibold text-white/70">Type</span>
                    <select
                        value={product.type}
                        onChange={(event) => handleChange(event, 'type')}
                        className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-white outline-none transition focus:border-orange/40"
                    >
                        <option value="cards">Smart Cards</option>
                        <option value="reviews">Reviews</option>
                        <option value="stickers">Stickers</option>
                    </select>
                </label>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
                {[
                    { label: 'Main Image', setter: setImage },
                    { label: 'Front Image', setter: setFrontImage },
                    { label: 'Back Image', setter: setBackImage },
                ].map(({ label, setter }) => (
                    <label key={label} className="space-y-2">
                        <span className="text-sm font-semibold text-white/70">{label}</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(event) => handleFileChange(event, setter)}
                            className="w-full rounded-2xl border border-white/10 bg-[#0d1319] px-4 py-3 text-sm text-white outline-none transition file:mr-3 file:rounded-xl file:border-0 file:bg-orange/15 file:px-3 file:py-2 file:text-orange focus:border-orange/40"
                        />
                    </label>
                ))}
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center rounded-2xl bg-gradient-to-r from-orange to-[#ff7b00] px-6 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {submitting ? 'Saving...' : 'Add Product'}
            </button>
        </form>
    );
}
