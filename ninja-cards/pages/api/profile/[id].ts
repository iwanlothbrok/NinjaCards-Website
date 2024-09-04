// File: pages/api/users/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    const { id } = req.query;

    console.log('id in api is ' + id);

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                id: Number(id), // Convert the id to a number if it's stored as an integer
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
