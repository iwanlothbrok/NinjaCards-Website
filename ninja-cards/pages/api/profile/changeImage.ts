import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable, { IncomingForm, Fields, Files } from 'formidable';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { fields, files } = await parseForm(req);

            const id = fields.id ? fields.id[0] : undefined;
            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            // Check if an image file is provided
            if (!files.image) {
                res.status(400).json({ error: 'Image file is required' });
                return;
            }

            const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

            // Validate image file size
            if (imageFile.size > 700 * 1024) {
                res.status(400).json({ error: 'Image size exceeds the 700 KB limit' });
                return;
            }

            // Read image file and convert to base64
            const imageData = fs.readFileSync(imageFile.filepath);
            const base64Image = imageData.toString('base64');

            // Update the user's profile image in the database
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
                data: { image: base64Image },
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Error updating profile image:', error);
            res.status(500).json({ error: 'Failed to update profile image', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
