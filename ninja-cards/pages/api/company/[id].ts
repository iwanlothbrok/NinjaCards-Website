// File: pages/api/products/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors'; // Assuming a custom CORS handler is present

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS for preflight requests
    await cors(req, res); // Call it without returning prematurely

    // Ensure the method is GET
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;

    if (!id || typeof id !== 'string') {
        // Check that id is present and is a valid string
        return res.status(400).json({ message: 'Invalid or missing ID' });
    }

    try {
        // Fetch the company data from the database using Prisma
        const product = await prisma.company.findUnique({
            where: {
                id, // ID is a string, assuming your Prisma schema uses a String ID
            },
        });

        if (!product) {
            return res.status(404).json({ message: 'Company not found' });
        }

        return res.status(200).json(product);
    } catch (error) {
        // Handle any server-side errors
        console.error('Error fetching company:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
