// pages/api/parata.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { generateGoogleWalletJwt } from "@/utils/googleWallet";
import { IncomingForm, Fields } from "formidable";
import cors from "@/utils/cors";

export const config = {
    api: { bodyParser: false },
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
    if (corsHandled) return;

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { fields } = await parseForm(req);

        const get = (key: string) => fields[key]?.[0];

        const userId      = get("userId");
        const userName    = get("userName")    || "Ninja User";
        const userEmail   = get("userEmail");
        const userPhone   = get("userPhone");
        const userCompany = get("userCompany");
        const userPosition= get("userPosition");
        const userLogoUrl = get("userLogoUrl");
        const bgColor     = get("bgColor");

        // ✅ Log everything received from the frontend
        console.log("📦 Received fields from frontend:", {
            userId,
            userName,
            userEmail,
            userPhone,
            userCompany,
            userPosition,
            bgColor,
            userLogoUrl: userLogoUrl ? userLogoUrl.slice(0, 60) + "..." : undefined,
        });

        if (!userId) return res.status(400).json({ error: "Missing userId" });

        if (!process.env.GOOGLE_WALLET_CREDENTIALS) {
            return res.status(500).json({ error: "GOOGLE_WALLET_CREDENTIALS env var is missing" });
        }

        const jwtToken = await generateGoogleWalletJwt({
            userId,
            userName,
            userEmail,
            userPhone,
            userCompany,
            userPosition,
            userLogoUrl,
            bgColor,
        });

        return res.status(200).json({ token: jwtToken });

    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        const stack   = error instanceof Error ? error.stack   : undefined;
        console.error("❌ Google Wallet JWT Generation Failed:", message);
        return res.status(500).json({
            error: "Internal Server Error",
            details: message,
            stack: process.env.NODE_ENV === "development" ? stack : undefined,
        });
    }
}