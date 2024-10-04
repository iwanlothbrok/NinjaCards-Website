// File: pages/api/card-designs/index.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors'; // Assuming you have a custom CORS handler

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS preflight requests
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    // Ensure it's a GET request
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Fetch all card designs from the database
        const cardDesigns = await prisma.cardDesign.findMany();
        return res.status(200).json(cardDesigns);
    } catch (error) {
        console.error('Error fetching card designs:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
