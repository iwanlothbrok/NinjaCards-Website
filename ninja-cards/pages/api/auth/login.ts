import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS middleware
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'POST') {
        const { email, password } = req.body;

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(402).json({ error: 'Invalid email or password' });
        }

        // Check if password is correct
        const isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Create JWT token
        const token = sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET as string, {
            expiresIn: '1h',
        });

        return res.status(200).json({ token, user });
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
