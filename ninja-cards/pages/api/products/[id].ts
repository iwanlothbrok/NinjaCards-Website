// File: pages/api/products/[id].ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors'; // Assuming you have a custom CORS handler

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Handle CORS for preflight requests
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    const { id } = req.query;

    // Ensure the method is GET, as we are fetching data
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Log the id for debugging purposes
    console.log('id in API is ' + id);

    try {
        // Fetch the product from the database using Prisma
        const product = await prisma.product.findUnique({
            where: {
                id: Number(id), // Convert the ID to a number since it's an integer in your database
            }
        });

        if (product && product.image) {
            // Add the proper data URI prefix if necessary
            product.image = `data:image/jpeg;base64,${product.image}`;
        }

        // Return 404 if the product is not found
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Return the product data in JSON format
        return res.status(200).json(product);
    } catch (error) {
        // Handle any server-side errors
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
