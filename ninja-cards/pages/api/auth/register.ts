import cors from '@/utils/cors';
import { buildPublicProfileUrl } from '@/utils/constants';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (cors(req, res)) return;
    try {

        if (req.method === 'OPTIONS') {
            // Respond to preflight request
            return res.status(200).end();
        }

        if (req.method === 'POST') {
            const { name, email, password, slug, company, position, linkedin, website, image, coverImage, firstName, lastName, bio, city, country } = req.body;

            console.log('Request body:', req.body);

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({ error: 'User already exists' });
            }

            // Validate slug if provided
            const normalizedSlug = slug?.trim().toLowerCase() || null;
            if (normalizedSlug) {
                if (!/^[a-z0-9-]{3,40}$/.test(normalizedSlug)) {
                    return res.status(400).json({ error: 'Невалиден slug формат' });
                }
                const slugTaken = await prisma.user.findUnique({ where: { slug: normalizedSlug } });
                if (slugTaken) {
                    return res.status(400).json({ error: 'Slug вече се използва' });
                }
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);

            // Create new user
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    ...(normalizedSlug ? { slug: normalizedSlug } : {}),
                    ...(company ? { company } : {}),
                    ...(position ? { position } : {}),
                    ...(linkedin ? { linkedin } : {}),
                    ...(website ? { website } : {}),
                    ...(image ? { image } : {}),
                    ...(coverImage ? { coverImage } : {}),
                    ...(firstName ? { firstName } : {}),
                    ...(lastName ? { lastName } : {}),
                    ...(bio ? { bio } : {}),
                    ...(city ? { city } : {}),
                    ...(country ? { country } : {}),
                },
            });

            const qrCodeUrl = buildPublicProfileUrl({
                locale: 'bg',
                slug: normalizedSlug ?? undefined,
                userId: user.id,
            });

            // Generate the QR code from the URL
            const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

            // Update user with the QR code image
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { qrCode: qrCodeImage },
            });

            res.status(201).json(updatedUser);
        } else {
            console.log('Unsupported method:', req.method);
            res.status(405).json({ error: 'Method not allowed' });
        }
    } catch (error) {
        console.error('Error occurred in API handler:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
