import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import cors from '@/utils/cors'; // Import the CORS utility

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS settings
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    try {
        if (req.method === 'POST') {
            const { email, password } = req.body;

            // Check if user exists
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user || !user.password) {  // Ensure user exists and has a password
                console.log('User not found or password missing');
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Check if password is correct
            const isPasswordValid = await compare(password, user.password);
            if (!isPasswordValid) {
                console.log('Invalid password');
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Ensure NEXTAUTH_SECRET is set
            if (!process.env.NEXTAUTH_SECRET) {
                console.error('NEXTAUTH_SECRET is not set');
                return res.status(500).json({ error: 'Internal server error: Missing secret' });
            }

            // Create JWT token
            const token = sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET as string, {
                expiresIn: '1h',
            });

            console.log('Token generated:', token);

            return res.status(200).json({ token, user });
        } else {
            return res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Internal server error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
