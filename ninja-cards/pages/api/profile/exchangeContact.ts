// pages/api/auth/forgot-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { sendEmail } from '../auth/mailgun'
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { to: email, vCard }: { to: string; vCard: string } = req.body;

        if (!email || !vCard) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Send email with the vCard as an attachment
        try {
            await sendEmail(
                email,
                'Размяна на контакти - Ninja Cards',
                'Можете да намерите изпратената Ви информация в закачения файл.',
                vCard
            );

            return res.status(200).json({ message: 'Contact information has been sent to your email' });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ error: 'Failed to send email' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
