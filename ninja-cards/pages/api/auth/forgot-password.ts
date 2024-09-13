// path: pages/api/auth/forgot-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import emailjs from 'emailjs-com';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

const sendEmail = async (recipientEmail: string, subject: string, message: string) => {
    try {
        await emailjs.send(
            process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
            process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
            {
                email: recipientEmail,
                subject: subject,
                message: message,
            },
            process.env.NEXT_PUBLIC_EMAILJS_USER_ID!
        );
    } catch (error) {
        throw new Error(`Error sending email: ${error}`);
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = await cors(req, res);
    if (corsHandled) return; // Stop further execution for preflight request

    if (req.method === 'POST') {
        const { email } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a new random password
        const newPassword = uuidv4().slice(0, 8); // e.g., 8-character password
        const hashedPassword = await hash(newPassword, 10);

        // Update user's password in the database
        await prisma.user.update({
            where: { email },
            data: { password: hashedPassword },
        });

        // Send email with the new password
        try {
            await sendEmail(
                user.email,
                'Password Reset - Ninja Cards',
                `Your new password is: ${newPassword}`
            );
            return res.status(200).json({ message: 'New password has been sent to your email' });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to send email' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
    