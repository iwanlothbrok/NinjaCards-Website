// /app/api/stripe/checkout-session.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-03-31.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const session = await getServerSession(req, res, authOptions) as { user?: { email?: string } };
    if (!session?.user?.email) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: 'subscription',
            payment_method_types: ['card'],
            customer_email: session.user.email,
            line_items: [
                {
                    price: process.env.STRIPE_MONTHLY_PRICE_ID!,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
        });

        return res.status(200).json({ url: checkoutSession.url });
    } catch (error: any) {
        console.error('Stripe Checkout error:', error);
        return res.status(500).json({ error: error.message });
    }
}
