// pages/api/updateLinks.ts
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

            // const { id, facebook, instagram, linkedin, twitter, tiktok, googleReview, revolut, website, qrCode } = req.body;
            const id = fields.id ? fields.id[0] : undefined;
            const facebook = fields.facebook ? fields.facebook[0] : undefined;
            const instagram = fields.instagram ? fields.instagram[0] : undefined;
            const linkedin = fields.linkedin ? fields.linkedin[0] : undefined;
            const twitter = fields.twitter ? fields.twitter[0] : undefined;
            const tiktok = fields.tiktok ? fields.tiktok[0] : undefined;
            const googleReview = fields.googleReview ? fields.googleReview[0] : undefined;
            const revolut = fields.revolut ? fields.revolut[0] : undefined;
            const website = fields.website ? fields.website[0] : undefined;
            const qrCode = fields.qrCode ? fields.qrCode[0] : undefined;

            console.log('id is ' + id);

            if (!id) {
                res.status(400).json({ error: 'ID is required' });
                return;
            }

            const updatedData: any = {};

            // Dynamically add links if provided
            if (facebook) updatedData.facebook = facebook;
            if (instagram) updatedData.instagram = instagram;
            if (linkedin) updatedData.linkedin = linkedin;
            if (twitter) updatedData.twitter = twitter;
            if (tiktok) updatedData.tiktok = tiktok;
            if (googleReview) updatedData.googleReview = googleReview;
            if (revolut) updatedData.revolut = revolut;
            if (website) updatedData.website = website;
            if (qrCode) updatedData.qrCode = qrCode;

            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) },
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