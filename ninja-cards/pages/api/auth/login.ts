import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Apply CORS settings
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allowed headers

    // Handle preflight requests (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Respond with 200 OK for OPTIONS requests
    }

    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            // Check if user exists
            const user = await prisma.user.findUnique({
                where: { email },
            });

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Compare provided password with hashed password
            const isPasswordValid = await compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            // Generate JWT token

            console.log('bef');
            const token = sign({ id: user.id, email: user.email }, process.env.NEXTAUTH_SECRET as string, {
                expiresIn: '1h',
            });
            console.log('after');


            // Send back the token and user info
            return res.status(200).json({ token, user });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    } else {
        return res.status(405).json({ error: 'Method not allowed' });
    }
}
