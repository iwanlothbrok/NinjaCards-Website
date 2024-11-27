import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';
import { transliterate as translit } from 'transliteration'; // Install this library using: npm install transliteration

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Extract the `id` from the query
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'PDF ID is required' });
        }

        // Fetch the user and their PDF data from the database
        const user = await prisma.user.findUnique({
            where: { id },
            select: { pdf: true, name: true }, // Fetch PDF and optional user name
        });

        console.log('User data:', user);

        if (!user || !user.pdf) {
            return res.status(404).json({ error: 'PDF not found' });
        }

        // Get the current date in YYYY-MM-DD format
        const currentDate = new Date().toISOString().split('T')[0];

        // Ensure user.name is valid and sanitize it
        let userName = user.name?.trim() || `User_${id}`;

        // Check if the name contains Cyrillic characters
        const containsCyrillic = /[\u0400-\u04FF]/.test(userName);

        if (containsCyrillic) {
            userName = translit(userName); // Transliterate Cyrillic to Latin
            console.log('Transliterated username:', userName);
        }

        // Sanitize the name further
        userName = userName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_.-]/g, '');

        // Handle the case where sanitization makes the name empty
        if (!userName || userName === '_') {
            userName = `User_${id}`;
        }

        // Generate the file name
        const fileName = `${userName}-${currentDate}.pdf`;
        console.log('Generated filename:', fileName);

        // Decode the Base64 PDF and send it as a downloadable file
        const pdfBuffer = Buffer.from(user.pdf, 'base64');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`);
        res.status(200).send(pdfBuffer);
    } catch (error) {
        console.error('Error serving PDF:', error);
        res.status(500).json({ error: 'Failed to serve PDF' });
    }
}
