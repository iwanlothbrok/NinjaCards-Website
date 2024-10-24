// pages/api/updateLinks.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
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
            const { fields } = await parseForm(req);

            const id = fields.id ? fields.id[0] : undefined;
            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            // Initialize an empty object to store the updated data
            const updatedData: any = {};

            // Iterate over the expected fields and set them to null if not provided
            const fieldsToCheck = [
                'facebook',
                'twitter',
                'instagram',
                'linkedin',
                'github',
                'youtube',
                'tiktok',
                'googleReview',
                'behance',
                'paypal',
                'viber',
                'whatsapp',
                'trustpilot',
                'googleReview',
                'revolut',
                'website',
                'telegram',
                'calendly',
                'discord',
                'tripadvisor',
                'telegram',  // TrustPilot URL
                'calendly',  // TrustPilot URL
                'discord',  // TrustPilot URL
                'tripadvisor',
            ];

            fieldsToCheck.forEach((field) => {
                updatedData[field] = fields[field] ? fields[field][0] : null;
            });

            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Error updating user links:', error);
            res.status(500).json({ error: 'Failed to update user links', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}