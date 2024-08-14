// pages/api/updateLinks.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        try {
            const { id, facebook, instagram, linkedin, twitter, tiktok, googleReview, revolut, website, qrCode } = req.body;

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
