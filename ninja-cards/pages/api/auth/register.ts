import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        // Respond to preflight request
        return res.status(200).end();
    }
    console.log('setted res');


    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
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

        const qrCodeUrl = `https://ninjacardsnfc.com/profileDetails?id=${user.id}`;

        // Generate the QR code from the URL
        const qrCodeImage = await QRCode.toDataURL(qrCodeUrl);

        // Update user with the QR code image
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { qrCode: qrCodeImage },
        });

        res.status(201).json(updatedUser);
    } else {

        console.log('mamati sheba');

        res.status(405).json({ error: 'Method not allowed' });
    }
}
