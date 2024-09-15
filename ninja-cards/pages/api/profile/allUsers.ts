// File: pages/api/profile/allUsers.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Log the incoming request
        console.log('Received request for all users');

        // Handle CORS preflight requests
        const corsHandled = await cors(req, res);
        if (corsHandled) return; // If it's a preflight request, stop further execution

        // Allow only GET method
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        // Log before fetching user ids
        console.log('Fetching user ids from the database');

        // Fetch only the ids of all users
        const userIds = await prisma.user.findMany({
            select: { id: true },  // Only select the 'id' field
        });

        // Check if users exist
        if (!userIds || userIds.length === 0) {
            console.log('No user ids found');
            return res.status(404).json({ message: 'No users found' });
        }

        // Log fetched user ids
        console.log('Fetched user ids:', userIds);

        // Return user ids in JSON format
        return res.status(200).json(userIds);

    } catch (error) {
        // Log any error that occurs
        console.error('Error fetching user ids:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    } finally {
        // Ensure PrismaClient is disconnected to avoid connection issues in long-running processes
        await prisma.$disconnect();
    }
}
