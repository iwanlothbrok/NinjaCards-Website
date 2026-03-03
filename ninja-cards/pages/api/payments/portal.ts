// POST /api/payments/portal
import type { NextApiRequest, NextApiResponse } from "next";
import { createBillingPortalSession } from "@/lib/billing";
import cors from "@/utils/cors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    await cors(req, res); // Call it without returning prematurely
    
    try {
        if (req.method !== "POST") {
            return res.status(405).json({ error: "Method Not Allowed" });
        }

        const { userId } = req.body || {};
        if (!userId) {
            return res.status(400).json({ error: "Missing userId" });
        }

        const origin = `${req.headers["x-forwarded-proto"] ?? "http"}://${req.headers.host}`;
        const returnUrl = `${origin}/account`;

        const url = await createBillingPortalSession(userId, returnUrl);

        return res.status(200).json({ url });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: "Internal server error" });
    }
}
