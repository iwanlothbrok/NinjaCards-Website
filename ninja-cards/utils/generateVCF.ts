// import { User } from "@prisma/client";

import { User } from "@/types/user";
import { BASE_API_URL } from "./constants";

type SocialProfileKeys =
    | "facebook"
    | "twitter"
    | "instagram"
    | "linkedin"
    | "github"
    | "youtube"
    | "tiktok"
    | "googleReview"
    | "revolut";

export default async function generateVCF(currentUser: User): Promise<void> {
    if (!currentUser) return;

    try {
        // Increment VCF download count in the backend
        await fetch(`${BASE_API_URL}/api/dashboard/incrementVCFDownload`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id }),
        });
    } catch (error) {
        console.error("Failed to increment VCF download count:", error);
    }

    const vCard: string[] = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        "CLASS:PUBLIC",
        "PRODID:-//class_vcard //NONSGML Version 1//EN",
    ];

    if (currentUser.lastName && currentUser.firstName) {
        vCard.push(`N:${currentUser.lastName};${currentUser.firstName};;;`);
    }
    if (currentUser.name) {
        vCard.push(`FN:${currentUser.name}`);
    }

    if (currentUser.image) {
        vCard.push(`PHOTO;ENCODING=BASE64;TYPE=JPEG:${currentUser.image}`);
    }

    if (currentUser.position) {
        vCard.push(`TITLE:${currentUser.position}`);
    }
    if (currentUser.company) {
        vCard.push(`ORG:${currentUser.company}`);
    }

    if (currentUser.phone1) {
        vCard.push(`TEL;TYPE=CELL;TYPE=VOICE;TYPE=pref:${currentUser.phone1}`);
    }
    if (currentUser.phone2) {
        vCard.push(`TEL;TYPE=CELL;TYPE=VOICE:${currentUser.phone2}`);
    }

    if (currentUser.email) {
        vCard.push(`EMAIL;TYPE=INTERNET;TYPE=pref:${currentUser.email}`);
    }
    if (currentUser.email2) {
        vCard.push(`EMAIL;TYPE=INTERNET:${currentUser.email2}`);
    }

    const address = [
        currentUser.street1 || "",
        currentUser.city || "",
        currentUser.state || "",
        currentUser.zipCode || "",
        currentUser.country || "",
    ]
        .filter(Boolean)
        .join(";");
    if (address) {
        vCard.push(`ADR;TYPE=WORK;TYPE=pref:;;${address}`);
    }

    if (currentUser.website) {
        vCard.push(`URL;TYPE=Website;TYPE=pref:${currentUser.website}`);
    }

    const socialProfiles: Record<SocialProfileKeys, string> = {
        facebook: "Facebook",
        twitter: "Twitter",
        instagram: "Instagram",
        linkedin: "LinkedIn",
        github: "GitHub",
        youtube: "YouTube",
        tiktok: "TikTok",
        googleReview: "Google Review",
        revolut: "Revolut",
    };

    (Object.keys(socialProfiles) as SocialProfileKeys[]).forEach((key) => {
        const url = currentUser[key as keyof User];
        if (url) {
            vCard.push(`URL;TYPE=${socialProfiles[key]}:${url}`);
        }
    });

    if (currentUser.bio) {
        vCard.push(`NOTE;CHARSET=UTF-8:${currentUser.bio}`);
    }

    vCard.push(
        `REV:${new Date().toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`
    );
    vCard.push("END:VCARD");

    const blob = new Blob([vCard.join("\r\n")], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentUser.name || "User"}_Profile.vcf`;
    link.click();
    URL.revokeObjectURL(url);
}
