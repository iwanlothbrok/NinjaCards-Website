// /pages/api/profile/export-data.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import cors from '@/utils/cors';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const corsHandled = cors(req, res);
    if (corsHandled) return;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { userId } = req.query as { userId?: string };

    if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                firstName: true,
                lastName: true,
                company: true,
                position: true,
                phone1: true,
                phone2: true,
                email2: true,
                street1: true,
                street2: true,
                zipCode: true,
                city: true,
                state: true,
                country: true,
                bio: true,
                facebook: true,
                instagram: true,
                linkedin: true,
                twitter: true,
                tiktok: true,
                googleReview: true,
                revolut: true,
                website: true,
                viber: true,
                whatsapp: true,
                github: true,
                behance: true,
                youtube: true,
                paypal: true,
                trustpilot: true,
                calendly: true,
                discord: true,
                telegram: true,
                tripadvisor: true,
                language: true,
                isDirect: true,
                createdAt: true,
                updatedAt: true,
                // No password, no image blobs, no qrCode
                dashboard: {
                    select: {
                        profileVisits: true,
                        vcfDownloads: true,
                        profileShares: true,
                        socialLinkClicks: true,
                    },
                },
                leads: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        message: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
                subscription: {
                    select: {
                        plan: true,
                        status: true,
                        start_date: true,
                        end_date: true,
                    },
                },
                invoices: {
                    select: {
                        stripeId: true,
                        amountPaid: true,
                        currency: true,
                        hostedInvoiceUrl: true,
                        createdAt: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const payload = {
            exportedAt: new Date().toISOString(),
            gdpr: 'Exported under GDPR Article 20 — Right to data portability',
            profile: {
                id: user.id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                email2: user.email2,
                company: user.company,
                position: user.position,
                phone1: user.phone1,
                phone2: user.phone2,
                bio: user.bio,
                address: {
                    street1: user.street1,
                    street2: user.street2,
                    zipCode: user.zipCode,
                    city: user.city,
                    state: user.state,
                    country: user.country,
                },
                language: user.language,
                isDirect: user.isDirect,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            socialLinks: {
                facebook: user.facebook,
                instagram: user.instagram,
                linkedin: user.linkedin,
                twitter: user.twitter,
                tiktok: user.tiktok,
                googleReview: user.googleReview,
                revolut: user.revolut,
                website: user.website,
                viber: user.viber,
                whatsapp: user.whatsapp,
                github: user.github,
                behance: user.behance,
                youtube: user.youtube,
                paypal: user.paypal,
                trustpilot: user.trustpilot,
                calendly: user.calendly,
                discord: user.discord,
                telegram: user.telegram,
                tripadvisor: user.tripadvisor,
            },
            analytics: user.dashboard ?? null,
            leads: user.leads,
            subscription: user.subscription ?? null,
            invoices: user.invoices,
        };

        const json = JSON.stringify(payload, null, 2);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename="ninja-card-data-${userId.slice(0, 8)}.json"`);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(json);
    } catch (error: any) {
        console.error('[export-data]', error);
        return res.status(500).json({ error: 'Грешка при експортиране на данните' });
    }
}