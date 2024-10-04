import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Increase the body size limit by configuring the API route
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb', // Set desired limit (e.g., 10MB)
        },
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { cardName, cardTitle, userName, userPhone, userEmail, frontDataUrl, backDataUrl, backLogoUrl, courierIsSpeedy, courierAddress } = req.body;

        if (!cardName || !cardTitle || !userName || !userPhone || !userEmail || !frontDataUrl || !backDataUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        try {
            const newCard = await prisma.cardDesign.create({
                data: {
                    cardName,
                    cardTitle,
                    userName,
                    userPhone,
                    userEmail,
                    frontDataUrl,
                    backDataUrl,
                    backLogoUrl,
                    courierIsSpeedy,
                    courierAddress,
                },
            });

            return res.status(200).json(newCard);
        } catch (error) {
            console.error('Error saving card design:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
