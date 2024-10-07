// pages/api/changePasswordAndEmail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import formidable, { IncomingForm, Fields } from 'formidable';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields }> => {
    const form = new IncomingForm();

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields) => {
            if (err) reject(err);
            resolve({ fields });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'PUT') {
        try {
            const { fields } = await parseForm(req);

            // Extract values from arrays
            const id = fields.id ? fields.id[0] : undefined;
            const password = fields.password ? fields.password[0] : undefined;


            const user = await prisma.user.findUnique({
                where: {
                    id: id, // Convert the id to a number if it's stored as an integer
                },
            });


            if (!id || (!password)) {
                res.status(400).json({ error: 'ID, and either password are required' });
                return;
            }

            const updatedData: any = {};

            if (password) {
                updatedData.password = await bcrypt.hash(password, 10);
            }

            if (user?.password === updatedData.password) {
                res.status(400).json({ error: 'Do not use the same password' });
                return;
            }

            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ error: 'Failed to update user', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
