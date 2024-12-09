import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'DELETE') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract the `id` from the request body
        const { id } = req.body;
        console.log(id);

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'User ID is required' });
        }

        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: { id },
            select: { pdf: true },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!user.pdf) {
            return res.status(404).json({ error: 'No PDF found for this user' });
        }

        // Update the user's record and remove the PDF
        await prisma.user.update({
            where: { id },
            data: { pdf: null },
        });

        return res.status(200).json({ message: 'PDF successfully deleted' });
    } catch (error) {
        console.error('Error deleting PDF:', error);
        return res.status(500).json({ error: 'Failed to delete PDF' });
    }
}
