export interface User {
    id: string;
    name: string;
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    position: string;
    phone1: string;
    phone2: string;
    email2: string;
    street1: string;
    street2: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
    bio: string;
    facebook: string;
    twitter: string;
    instagram: string;
    linkedin: string;
    github: string;
    youtube: string;
    image: string;
    tiktok: string;
    googleReview: string;
    revolut: string;
    qrCode: string;
    selectedColor: string;
    cv: string;
    behance: string;
    paypal: string;
    trustpilot: string;
    viber: string;
    whatsapp: string;
    telegram: string;
    calendly: string;
    discord: string;
    tripadvisor: string;
    website: string;
    pdf: string;
    coverImage: string;
    isDirect: boolean;
    video: {
        data: {
            data: ArrayBuffer | Uint8Array;
        }; type?: string; // Optional MIME type
    } | null;
    videoUrl: string;
    language: string;
}
