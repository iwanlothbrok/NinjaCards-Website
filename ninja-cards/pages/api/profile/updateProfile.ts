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

            // Extract values from arrays
            const id = fields.id ? fields.id[0] : undefined;
            const name = fields.name ? fields.name[0] : undefined;
            const email = fields.email ? fields.email[0] : undefined;
            const password = fields.password ? fields.password[0] : undefined;
            
            console.log(fields);
            // Log the fields received
            console.log('Received fields:', { id, name, email, password });

            // Validate that `id` is present
            if (!id) {
                console.error('Validation failed: Missing ID');
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            // Construct the updated data object dynamically
            const updatedData: any = {  };

            console.log('hop trop');
            console.log(updatedData);

            if (name) {
                updatedData.name = name;
            }
            if (email) {
                updatedData.email = email;
            }
            if (password) {
                updatedData.password = await bcrypt.hash(password, 10);
            }

            // Handle the image file if provided
            if (files.image) {
                const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
                const imageData = fs.readFileSync(imageFile.filepath);
                updatedData.image = imageData;
            }

            // Update the user in the database only with provided fields
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) }, // Ensure id is a number
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
