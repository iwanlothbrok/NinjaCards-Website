// pages/api/updateInformation.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, Fields, Files } from 'formidable';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export const config = {
    api: {
        bodyParser: false,
    },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: Fields; files: Files }> => {
    const form = new IncomingForm({
        multiples: false,
        keepExtensions: true,
    });

    return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it's a preflight request, stop further execution

    if (req.method === 'PUT') {
        try {
            const { fields } = await parseForm(req);

            const id = fields.id ? fields.id[0] : undefined;
            if (!id) {
                res.status(400).json({ error: 'ID е задължително поле' });
                return;
            }

            // Initialize an empty object to store the updated data
            const updatedData: any = {};

            // List of fields to update
            const fieldsToCheck = [
                'name',
                'firstName',
                'lastName',
                'company',
                'position',
                'phone1',
                'phone2',
                'email2',
                'street1',
                'street2',
                'zipCode',
                'city',
                'state',
                'country',
                'bio',
            ];

            // Dynamically set fields to the provided value or null if not provided
            fieldsToCheck.forEach((field) => {
                updatedData[field] = fields[field] ? fields[field][0] : null;
            });


            // Update the user in the database
            const updatedUser = await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            console.error('Грешка при актуализиране на информацията за потребителя:', error);
            res.status(500).json({ error: 'Неуспешно актуализиране на информацията за потребителя', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Методът не е разрешен' });
    }
}
