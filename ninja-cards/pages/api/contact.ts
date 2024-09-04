import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    phone: string;
}

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};
const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


    if (req.method === 'POST') {
        const { name, email, subject, phone }: ContactFormData = req.body;

        if (!name || !email || !subject || !phone) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        // You can add more validation logic here
        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                phone,
                subject
            },
        });
        // Simulate email sending (you would normally send an email here)
        return res.status(200).json(contact);
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
