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
        const corsHandled = cors(req, res);
        if (corsHandled) return; // If it's a preflight request, stop further execution

        // Allow only GET method
        if (req.method !== 'GET') {
            return res.status(405).json({ message: 'Method not allowed' });
        }

        // Log before fetching users
        console.log('Fetching users from the database');

        // Fetch all users
        const users = await prisma.user.findMany();

        // Check if users exist
        if (!users || users.length === 0) {
            console.log('No users found');
            return res.status(404).json({ message: 'No users found' });
        }

        // Log fetched users
        console.log('Fetched users:', users);

        // Return users in JSON format
        return res.status(200).json(users);

    } catch (error) {
        // Log any error that occurs
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
}
