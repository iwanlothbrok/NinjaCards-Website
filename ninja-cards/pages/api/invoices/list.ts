// POST /api/invoices/list
import type { NextApiRequest, NextApiResponse } from "next";
import { listUserInvoices, formatMinor } from "@/lib/billing";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { userId } = req.body || {};
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const invoices = await listUserInvoices(userId);

        const mapped = invoices.map(i => ({
            id: i.id,
            stripeId: i.stripeId,
            amountPaidMinor: i.amountPaid,
            amountPaid: formatMinor(i.amountPaid, i.currency),
            currency: i.currency,
            hostedInvoiceUrl: i.hostedInvoiceUrl,
            createdAt: i.createdAt,
            stripeSubscriptionId: i.stripeSubscriptionId,
            subscriptionId: i.subscriptionId,
        }));

        return res.status(200).json({ invoices: mapped });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
