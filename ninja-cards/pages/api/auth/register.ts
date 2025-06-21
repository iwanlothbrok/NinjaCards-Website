import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            // Respond to preflight request
            return res.status(200).end();
        }

        if (req.method === 'POST') {
            const { name, email, password } = req.body;

            console.log('Request body:', req.body);

            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
                where: { email },
            });

            if (existingUser) {
                console.log('User already exists:', email);
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await hash(password, 10);

            // Create new user
            const user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                },
            });

            const qrCodeUrl = `https://www.ninjacardsnfc.com/profileDetails/${user.id}`;

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