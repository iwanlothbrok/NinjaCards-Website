// pages/api/updateInformation.ts

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
        multiples: false, // Only single file upload is supported in this example
        keepExtensions: true, // Keep the file extension
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

            // Extract values from arrays
            const id = fields.id ? fields.id[0] : undefined;
            const name = fields.name ? fields.name[0] : undefined;
            const firstName = fields.firstName ? fields.firstName[0] : undefined;
            const lastName = fields.lastName ? fields.lastName[0] : undefined;
            const company = fields.company ? fields.company[0] : undefined;
            const position = fields.position ? fields.position[0] : undefined;
            const phone1 = fields.phone1 ? fields.phone1[0] : undefined;
            const phone2 = fields.phone2 ? fields.phone2[0] : undefined;
            const email2 = fields.email2 ? fields.email2[0] : undefined;
            const street1 = fields.street1 ? fields.street1[0] : undefined;
            const street2 = fields.street2 ? fields.street2[0] : undefined;
            const zipCode = fields.zipCode ? fields.zipCode[0] : undefined;
            const city = fields.city ? fields.city[0] : undefined;
            const state = fields.state ? fields.state[0] : undefined;
            const country = fields.country ? fields.country[0] : undefined;
            const bio = fields.bio ? fields.bio[0] : undefined;

            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            const updatedData: any = {};

            // Update fields if they are provided
            if (name) updatedData.name = name;
            if (firstName) updatedData.firstName = firstName;
            if (lastName) updatedData.lastName = lastName;
            if (company) updatedData.company = company;
            if (position) updatedData.position = position;
            if (phone1) updatedData.phone1 = phone1;
            if (phone2) updatedData.phone2 = phone2;
            if (email2) updatedData.email2 = email2;
            if (street1) updatedData.street1 = street1;
            if (street2) updatedData.street2 = street2;
            if (zipCode) updatedData.zipCode = zipCode;
            if (city) updatedData.city = city;
            if (state) updatedData.state = state;
            if (country) updatedData.country = country;
            if (bio) updatedData.bio = bio;

            // Validate image file size
            if (files.image) {
                const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;

                // Check if the image size exceeds 500 KB
                if (imageFile.size > 700 * 1024) {
                    res.status(400).json({ error: 'Image size exceeds the 700 KB limit' });
                    return;
                }

                const imageData = fs.readFileSync(imageFile.filepath);
                const base64Image = imageData.toString('base64');
                updatedData.image = base64Image; // Store the image as a base64 string
            }

            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
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
