import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'PUT') {
        const { userId, language } = req.body;
        console.log('Data 13:', userId, language);

        if (!userId || !language) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: { language },
            });
            console.log('Data 25:', updatedUser);

            return res.status(200).json(updatedUser);

        } catch (error) {
            console.error('Error updating language:', error);
            return res.status(500).json({ error: 'Server error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
