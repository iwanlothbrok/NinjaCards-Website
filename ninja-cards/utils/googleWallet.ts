import { GoogleAuth } from "google-auth-library";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";

const SERVICE_ACCOUNT_KEY_PATH = path.resolve(process.cwd(), process.env.GOOGLE_WALLET_KEY_PATH);

export async function generateGoogleWalletJwt(userId: string) {
    console.log("🔵 Inside Google Wallet utility");

    console.log(SERVICE_ACCOUNT_KEY_PATH);

    try {
        const credentialsRaw = await fs.readFile(SERVICE_ACCOUNT_KEY_PATH, "utf-8");
        const credentials = JSON.parse(credentialsRaw);

        const payload = {
            iss: credentials.client_email,
            aud: "google",
            typ: "savetowallet",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600,
            payload: {
                genericObjects: [
                    {
                        id: `ninjaCardsGenericCard.${userId}`,
                        classId: "ninjaCardsGenericCard",
                        state: "active",
                        header: "Ninja Cards NFC",
                        subheader: "Tap or scan to open my business profile",
                        barcode: {
                            type: "qrCode",
                            value: `https://www.ninjacardsnfc.com/profileDetails/${userId}`,
                        },
                    },
                ],
            },
        };

        console.log("🔵 Signing JWT...");
        const signedJwt = jwt.sign(payload, credentials.private_key, { algorithm: "RS256" });

        console.log("✅ JWT successfully signed");
        return signedJwt;

    } catch (error) {
        console.error("❌ Error reading credentials or signing JWT:", error);
        throw new Error("Failed to generate Google Wallet JWT");
    }
}
