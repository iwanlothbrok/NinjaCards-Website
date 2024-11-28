import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // Handle preflight requests

    if (req.method === 'PUT') {
        try {
            const { id, coverImage } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            if (!coverImage) {
                return res.status(400).json({ error: 'Cover image is required' });
            }

            // Validate the base64 image (optional)
            const isBase64Valid = coverImage.startsWith('data:image/');
            if (!isBase64Valid) {
                return res.status(400).json({ error: 'Invalid image format' });
            }

            // Update the user's cover image in the database
            const updatedUser = await prisma.user.update({
                where: { id },
                data: { coverImage },
            });

            return res.status(200).json({
                message: 'Cover image uploaded successfully',
                coverImage: updatedUser.coverImage,
            });
        } catch (error: any) {
            console.error('Error uploading cover image:', error);
            return res.status(500).json({
                error: 'Failed to upload cover image',
                details: error.message,
            });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
