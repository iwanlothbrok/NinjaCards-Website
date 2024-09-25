import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    const { cardName, cardTitle, userName, userPhone, userEmail, frontDataUrl, backDataUrl } = req.body;


    if (req.method === 'POST') {

        if (!cardName || !cardTitle || !userName || !userPhone || !userEmail || !frontDataUrl || !backDataUrl) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validateEmail(userEmail)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // You can add more validation logic here
        const newCard = await prisma.cardDesign.create({
            data: {
                cardName,
                cardTitle,
                userName,
                userPhone,
                userEmail,
                frontDataUrl,
                backDataUrl
            }
        });

        // Simulate email sending (you would normally send an email here)
        return res.status(200).json(newCard);
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
