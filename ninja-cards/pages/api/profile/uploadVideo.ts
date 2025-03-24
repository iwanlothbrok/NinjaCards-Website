import { v2 as cloudinary } from 'cloudinary';
import type { NextApiRequest, NextApiResponse } from 'next';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Грешка: Методът не е разрешен. Моля, използвайте POST заявка.' });
    }

    try {
        const { folder } = req.body;

        // Generate a signed upload preset
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = cloudinary.utils.api_sign_request(
            { timestamp, folder: folder || 'uploads' },
            process.env.CLOUDINARY_API_SECRET!
        );

        res.status(200).json({
            signature,
            timestamp,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            uploadPreset: folder || 'uploads',
        });
    } catch (error) {
        console.error('Грешка при генериране на подписа:', error);
        res.status(500).json({ error: 'Грешка: Възникна проблем при генериране на подписа. Моля, опитайте отново.' });
    }
}
