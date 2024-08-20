// pages/api/profile/downloadCv.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    // Ensure the ID is a valid string
    if (typeof id !== 'string') {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
    }

    try {
        // Retrieve the user from the database by ID
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
        });

        // Check if the user and the CV exist
        if (!user || !user.cv) {
            res.status(404).json({ error: 'CV not found' });
            return;
        }

        // Convert the base64 CV string back into binary data (Buffer)
        const cvBuffer = Buffer.from(user.cv, 'base64');

        // Set the headers to initiate a file download
        res.setHeader('Content-Disposition', `attachment; filename="${user.firstName}_${user.lastName}_CV.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Send the CV file data as the response
        res.status(200).send(cvBuffer);
    } catch (error) {
        console.error('Error serving CV:', error);
        res.status(500).json({ error: 'Failed to download CV' });
    }
}
