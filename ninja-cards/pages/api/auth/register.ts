import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { log } from 'console';
import { NextApiRequest, NextApiResponse } from 'next';


const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    console.log('in');

    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        console.log(name);
        console.log(email);
        console.log(password);

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

        res.status(201).json(user);
    } else {
        res?.status(405).json({ error: 'Method not allowed' });
    }
}
