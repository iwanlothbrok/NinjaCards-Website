// pages/api/profile/updateProfile.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, name, email, password, ...rest } = req.body;

        try {
            // Validate the input
            if (!id || (!name && !email && !password && Object.keys(rest).length === 0)) {
                res.status(400).json({ error: 'Invalid input' });
                return;
            }

            // Construct the updated data
            const updatedData: any = { name, email, ...rest };

            if (password) {
                updatedData.password = await bcrypt.hash(password, 10);
            }

            // Log the data being used to update the user
            console.log('Updating user with data:', updatedData);

            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: Number(id) }, // Ensure id is a number
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user', details: error });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
