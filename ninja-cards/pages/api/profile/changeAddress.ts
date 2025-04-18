// pages/api/changePasswordAndEmail.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { IncomingForm, Fields } from 'formidable';
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
            const street1 = fields.street1 ? fields.street1[0] : undefined;
            const street2 = fields.street2 ? fields.street2[0] : undefined;
            const zipCode = fields.zipCode ? fields.zipCode[0] : undefined;
            const city = fields.city ? fields.city[0] : undefined;
            const state = fields.state ? fields.state[0] : undefined;
            const country = fields.country ? fields.country[0] : undefined;

            if (!id) {
                res.status(400).json({ error: 'ID е задължително поле.' });
                return;
            }

            const updatedData: any = {};

            if (street1) {
                updatedData.street1 = street1;
            } else {
                updatedData.street1 = '';
            }


            if (street2) {
                updatedData.street2 = street2;
            } else {
                updatedData.street2 = '';
            }


            if (zipCode) {
                updatedData.zipCode = zipCode;
            } else {
                updatedData.zipCode = '';
            }


            if (city) {
                updatedData.city = city;
            } else {
                updatedData.city = '';
            }


            if (state) {
                updatedData.state = state;
            } else {
                updatedData.state = '';
            }

            if (country) {
                updatedData.country = country;
            } else {
                updatedData.country = '';
            }

            await prisma.user.update({
                where: { id: id },
                data: updatedData,
            });

            const updatedUser = await prisma.user.findUnique({
                where: { id: id },
            });

            res.status(200).json(updatedUser);
        } catch (error: any) {
            res.status(500).json({ error: 'Неуспешно актуализиране на профила.', details: error.message });
        }
    } else {
        res.status(405).json({ error: 'Методът не е позволен.' });
    }
}
