import jwt from "jsonwebtoken";

export async function generateGoogleWalletJwt(userId: string) {
    console.log("🔵 Inside Google Wallet utility");

    // ✅ Get the credentials from environment variables
    const credentialsBase64 = process.env.GOOGLE_WALLET_CREDENTIALS;

    if (!credentialsBase64) {
        throw new Error("❌ GOOGLE_WALLET_CREDENTIALS environment variable is missing!");
    }

    // ✅ Decode the Base64 encoded JSON key file
    const credentialsJson = Buffer.from(credentialsBase64, "base64").toString("utf-8");
    const credentials = JSON.parse(credentialsJson);

    // ✅ Payload for Google Wallet
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
    // ✅ Sign JWT using service account private key
    const signedJwt = jwt.sign(payload, credentials.private_key, { algorithm: "RS256" });

    console.log("✅ JWT successfully signed");
    return signedJwt;
}
