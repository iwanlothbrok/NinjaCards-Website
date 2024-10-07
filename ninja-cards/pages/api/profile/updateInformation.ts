// pages/api/updateInformation.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import cors from '@/utils/cors';

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
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'PUT') {
        try {
            const { fields, files } = await parseForm(req);

            const id = fields.id ? fields.id[0] : undefined;
            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            // Initialize an empty object to store the updated data
            const updatedData: any = {};

            // List of fields to update
            const fieldsToCheck = [
                'name',
                'firstName',
                'lastName',
                'company',
                'position',
                'phone1',
                'phone2',
                'email2',
                'street1',
                'street2',
                'zipCode',
                'city',
                'state',
                'country',
                'bio',
            ];

            // Dynamically set fields to the provided value or null if not provided
            fieldsToCheck.forEach((field) => {
                updatedData[field] = fields[field] ? fields[field][0] : null;
            });

            // Validate image file size and convert to base64 if it exists
            if (files.image) {
                const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

                if (imageFile.size > 700 * 1024) {
                    res.status(400).json({ error: 'Image size exceeds the 700 KB limit' });
                    return;
                }

                const imageData = fs.readFileSync(imageFile.filepath);
                const base64Image = imageData.toString('base64');
                updatedData.image = base64Image;
            }

            // Convert CV to base64 if it exists
            if (files.cv) {
                const cvFile = Array.isArray(files.cv) ? files.cv[0] : files.cv;

                if (cvFile.size > 2000 * 1024) {
                    res.status(400).json({ error: 'CV size exceeds the 2 MB limit' });
                    return;
                }

                const cvData = fs.readFileSync(cvFile.filepath);
                const base64CV = cvData.toString('base64');
                updatedData.cv = base64CV;
            }

            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Error updating user information:', error);
            res.status(500).json({ error: 'Failed to update user information', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
