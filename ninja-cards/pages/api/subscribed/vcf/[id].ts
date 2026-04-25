import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';
import { buildLeadVcf, buildLeadVcfFilename, verifyLeadVcfToken } from '@/lib/leadVcf';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const leadId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    const token = Array.isArray(req.query.token) ? req.query.token[0] : req.query.token;

    if (!leadId || !token) {
        return res.status(400).json({ error: 'Missing lead id or token' });
    }

    try {
        const lead = await prisma.subscribed.findUnique({
            where: { id: leadId },
            select: {
                id: true,
                userId: true,
                name: true,
                email: true,
                phone: true,
                message: true,
                createdAt: true,
            },
        });

        if (!lead) {
            return res.status(404).json({ error: 'Lead not found' });
        }

        if (!verifyLeadVcfToken(token, lead.id, lead.userId)) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        const vcf = buildLeadVcf({
            ...lead,
            ownerId: lead.userId,
        });
        const filename = buildLeadVcfFilename(lead.name);

        res.setHeader('Content-Type', 'text/vcard; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        return res.status(200).send(vcf);
    } catch (error) {
        console.error('Failed to generate lead VCF:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
