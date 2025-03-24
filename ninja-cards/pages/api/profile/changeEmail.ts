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
            const email = fields.email ? fields.email[0] : undefined;
            const workEmail = fields.workEmail ? fields.workEmail[0] : undefined;

            console.log(fields);

            if (!id || (!email)) {
                res.status(400).json({ error: 'ID и поне един от имейлите са задължителни' });
                return;
            }

            const updatedData: any = {};

            if (email) {
                updatedData.email = email;
            }
            if (workEmail) {
                updatedData.email2 = workEmail;
            } else {
                updatedData.email2 = '';
            }

            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ error: 'Неуспешно обновяване на потребителя', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Методът не е позволен' });
    }
}
