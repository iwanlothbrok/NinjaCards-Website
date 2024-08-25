// pages/api/auth/forgot-password.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from './mailgun';  // Adjust the import path based on your project structure
import { log } from 'node:console';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email } = req.body;
        console.log('inside forgot');
        console.log(email);

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
        await sendEmail(user.email, 'Промяна на паролата - Ninja Cards', `Вашата нова парола е: ${newPassword}`);

        return res.status(200).json({ message: 'New password has been sent to your email' });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
