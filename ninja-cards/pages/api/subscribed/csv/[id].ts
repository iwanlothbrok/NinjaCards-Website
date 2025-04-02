
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { stringify } from 'csv-stringify/sync';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {
        query: { id, format },
        method,
    } = req;
    const corsHandled = cors(req, res);
    if (corsHandled) return; // If it'

    if (method !== 'GET') {
        return res.status(405).json({ error: 'Методът не е разрешен' });
    }

    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Липсващ или невалиден ID' });
    }

    try {
        const leads = await prisma.subscribed.findMany({
            where: { userId: id },
            orderBy: { createdAt: 'desc' },
        });

        if (format === 'csv') {
            const csv = stringify(leads, {
                header: true,
                columns: [
                    { key: 'name', header: 'Name' },
                    { key: 'email', header: 'Email' },
                    { key: 'phone', header: 'Phone' },
                    { key: 'message', header: 'Message' },
                    { key: 'createdAt', header: 'Created At' },
                ],
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
            return res.status(200).send(csv);
        }

        return res.status(200).json(leads);
    } catch (error) {
        console.error('Грешка при експортиране на CSV:', error);
        return res.status(500).json({ error: 'Вътрешна грешка на сървъра' });
    }
}
