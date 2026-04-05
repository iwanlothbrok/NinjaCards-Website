// utils/googleWallet.ts
import jwt from "jsonwebtoken";
import { google } from "googleapis";
import { JWT } from "google-auth-library";
import { PUBLIC_SITE_URL, buildPublicAssetUrl, buildPublicProfileUrl } from "./constants";

// ─── Translations ─────────────────────────────────────────────────────────────
const T = {
    bg: {
        cardTitle:   "Ninja Card",
        email:       "Имейл",
        phone:       "Телефон",
        company:     "Компания",
        position:    "Позиция",
        openProfile: "Отвори профил",
        viewProfile: "Виж профила",
    },
    en: {
        cardTitle:   "Ninja Card",
        email:       "Email",
        phone:       "Phone",
        company:     "Company",
        position:    "Position",
        openProfile: "Open Profile",
        viewProfile: "View Profile",
    },
}

interface WalletParams {
    userId:        string;
    language?:     string;   // 'bg' | 'en'
    userName?:     string;
    userEmail?:    string;
    userPhone?:    string;
    userCompany?:  string;
    userPosition?: string;
    userLogoUrl?:  string;
    bgColor?:      string;
}

export async function generateGoogleWalletJwt(params: WalletParams) {
    const {
        userId,
        language     = "bg",
        userName     = "Ninja User",
        userEmail,
        userPhone,
        userCompany,
        userPosition,
        userLogoUrl,
        bgColor      = "#000000",
    } = params;

    const isBg = language === "bg";
    const t    = isBg ? T.bg : T.en;
    const lang = isBg ? "bg-BG" : "en-US";

    console.log("🔵 Inside Google Wallet utility | lang:", language);

    const credentialsBase64 = process.env.GOOGLE_WALLET_CREDENTIALS;
    if (!credentialsBase64) throw new Error("GOOGLE_WALLET_CREDENTIALS is missing!");

    const cleaned = credentialsBase64.replace(/^\uFEFF/, "").replace(/[^A-Za-z0-9+/=]/g, "");

    let credentials: any;
    try {
        const json = Buffer.from(cleaned, "base64").toString("utf-8");
        credentials = JSON.parse(json.replace(/[^\x20-\x7E\n\r\t]/g, ""));
    } catch (e: any) {
        throw new Error(`Failed to parse GOOGLE_WALLET_CREDENTIALS: ${e.message}`);
    }

    const issuerId   = "3388000000023092535";
    const classId    = `${issuerId}.NinjaCard`;
    const objectId   = `${issuerId}.NinjaCard-${userId}`;
    const profileUrl = buildPublicProfileUrl({ locale: "bg", userId });
    const defaultLogo = buildPublicAssetUrl("/navlogo.png");
    const publicOrigin = new URL(PUBLIC_SITE_URL).hostname;

    const authClient = new JWT({
        email:  credentials.client_email,
        key:    credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/wallet_object.issuer"],
    });

    const walletobjects = google.walletobjects({ version: "v1", auth: authClient });

    // ── Ensure class exists ───────────────────────────────────────────────────
    try {
        await walletobjects.genericclass.get({ resourceId: classId });
        console.log("✅ Generic class exists:", classId);
    } catch (e: any) {
        if (e.code === 404) {
            await walletobjects.genericclass.insert({
                requestBody: { id: classId, issuerName: "Ninja Cards" },
            } as any);
            console.log("✅ Generic class created");
        } else {
            throw new Error("Error with class: " + e.message);
        }
    }

    // ── Text modules — localized labels ──────────────────────────────────────
    const textModules: any[] = [];
    if (userEmail)    textModules.push({ header: t.email,    body: userEmail,    id: "user_email"    });
    if (userPhone)    textModules.push({ header: t.phone,    body: userPhone,    id: "user_phone"    });
    if (userCompany)  textModules.push({ header: t.company,  body: userCompany,  id: "user_company"  });
    if (userPosition) textModules.push({ header: t.position, body: userPosition, id: "user_position" });

    // ── Subheader — position @ company ───────────────────────────────────────
    let subheaderValue = "";
    if (userCompany && userPosition) subheaderValue = `${userCompany} · ${userPosition}`;
    else if (userPosition)           subheaderValue = userPosition;
    else if (userCompany)            subheaderValue = userCompany;

    const objectBody: any = {
        id:      objectId,
        classId: classId,
        state:   "active",

        cardTitle: {
            defaultValue: { language: lang, value: t.cardTitle },
        },
        header: {
            defaultValue: { language: lang, value: userName !== "Ninja User" ? userName : t.cardTitle },
        },
        ...(subheaderValue ? {
            subheader: {
                defaultValue: { language: lang, value: subheaderValue },
            },
        } : {}),

        textModulesData: textModules,

        barcode: {
            type:          "QR_CODE",
            value:         profileUrl,
            alternateText: t.viewProfile,
        },
        linksModuleData: {
            uris: [{ uri: profileUrl, description: t.openProfile, id: "profile_link" }],
        },
        hexBackgroundColor: bgColor || "#000000",

        logo: {
            sourceUri: {
                uri: userLogoUrl?.startsWith("https://") ? userLogoUrl : defaultLogo,
            },
            contentDescription: {
                defaultValue: { language: lang, value: "Ninja Cards" },
            },
        },
    };

    // ── Delete old + insert fresh ─────────────────────────────────────────────
    try {
        await walletobjects.genericobject.get({ resourceId: objectId });
        console.log("🗑️ Deleting old object...");
        await (walletobjects.genericobject as any).delete({ resourceId: objectId });
        console.log("✅ Old object deleted");
    } catch (e: any) {
        if (e.code !== 404) {
            await walletobjects.genericobject.patch({ resourceId: objectId, requestBody: objectBody } as any);
            console.log("✅ Object patched (fallback)");
            return jwt.sign(
                {
                    iss:     credentials.client_email,
                    aud:     "google",
                    typ:     "savetowallet",
                    iat:     Math.floor(Date.now() / 1000),
                    origins: [publicOrigin],
                    payload: { genericObjects: [{ id: objectId, classId: classId }] },
                },
                credentials.private_key, { algorithm: "RS256" }
            );
        }
        console.log("✅ No existing object");
    }

    await walletobjects.genericobject.insert({ requestBody: objectBody } as any);
    console.log("✅ Fresh object inserted");

    const jwtPayload = {
        iss:     credentials.client_email,
        aud:     "google",
        typ:     "savetowallet",
        iat:     Math.floor(Date.now() / 1000),
        origins: [publicOrigin],
        payload: {
            genericObjects: [{ id: objectId, classId: classId }],
        },
    };

    const signedJwt = jwt.sign(jwtPayload, credentials.private_key, { algorithm: "RS256" });
    console.log("✅ JWT signed");
    return signedJwt;
}
