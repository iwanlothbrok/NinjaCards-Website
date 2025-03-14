import type { NextApiRequest, NextApiResponse } from "next";
import { generateGoogleWalletJwt } from "@/utils/googleWallet";
import formidable, { IncomingForm, Fields } from "formidable";
import cors from "@/utils/cors";

export const config = {
    api: {
        bodyParser: false, // Disable Next.js default body parser for FormData handling
    },
};

// ✅ Function to parse FormData
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
    console.log("🔵 Incoming request to API");

    const corsHandled = cors(req, res);
    if (corsHandled) return; // Stop execution for preflight requests

    if (req.method !== "POST") {
        console.log("❌ Invalid request method:", req.method);
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // ✅ Parse FormData from request
        const { fields } = await parseForm(req);
        const userId = fields.userId ? fields.userId[0] : undefined;

        if (!userId) {
            console.error("❌ Missing userId in request");
            return res.status(400).json({ error: "Missing userId" });
        }

        console.log("✅ Generating Google Wallet JWT for user:", userId);
        const jwtToken = await generateGoogleWalletJwt(userId);

        console.log("✅ JWT generated successfully");
        return res.status(200).json({ token: jwtToken });

    } catch (error) {
        console.error("❌ Google Wallet JWT Generation Failed:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
