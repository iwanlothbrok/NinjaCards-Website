import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import fs from 'fs';

// Import formidable and its types
import formidable, { IncomingForm, Fields, Files, File } from 'formidable';

const prisma = new PrismaClient();

// Disable Next.js's default body parsing to allow formidable to handle file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = new IncomingForm({
        multiples: true, // Enable multiple file uploads
        keepExtensions: true, // Keep file extensions
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            console.log('Parsed fields:', fields); // Log fields
            console.log('Parsed files:', files); // Log files
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { fields, files } = await parseForm(req);
            const { id, name, email, password, ...rest } = fields;

            // Log the fields received
            console.log('Received fields:', fields);

            // Validate the input
            if (!id || (!name && !email && !password && Object.keys(rest).length === 0)) {
                console.error('Validation failed:', { id, name, email, password, rest });
                res.status(400).json({ error: 'Invalid input' });
                return;
            }

            // Continue with the update logic...
        } catch (error: any) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
