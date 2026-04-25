import crypto from 'crypto';

type LeadVcfInput = {
    id: string;
    ownerId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    message?: string | null;
    createdAt?: Date | string | null;
};

const VCF_LINK_TTL_MS = 1000 * 60 * 60 * 24 * 30;

function escapeVcfValue(value: string) {
    return value
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,');
}

function sanitizeFilenamePart(value: string) {
    return value
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]+/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 80);
}

function getSigningSecret() {
    return (
        process.env.LEAD_VCF_SECRET ||
        process.env.NEXTAUTH_SECRET ||
        process.env.JWT_SECRET ||
        process.env.STRIPE_WEBHOOK_SECRET ||
        process.env.DATABASE_URL ||
        'ninja-cards-lead-vcf'
    );
}

export function buildLeadVcf(lead: LeadVcfInput) {
    const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${escapeVcfValue(lead.name)}`,
        `N:${escapeVcfValue(lead.name)};;;;`,
    ];

    if (lead.phone) {
        lines.push(`TEL;TYPE=CELL:${escapeVcfValue(lead.phone)}`);
    }

    if (lead.email) {
        lines.push(`EMAIL;TYPE=INTERNET:${escapeVcfValue(lead.email)}`);
    }

    const notes = [
        lead.message ? `Message: ${lead.message}` : null,
        lead.createdAt ? `Created at: ${new Date(lead.createdAt).toISOString()}` : null,
        `Lead ID: ${lead.id}`,
    ].filter(Boolean);

    if (notes.length) {
        lines.push(`NOTE:${escapeVcfValue(notes.join('\n'))}`);
    }

    lines.push('END:VCARD');

    return lines.join('\r\n');
}

export function buildLeadVcfFilename(leadName: string) {
    const safeName = sanitizeFilenamePart(leadName) || 'lead';
    return `${safeName}.vcf`;
}

export function createLeadVcfToken(leadId: string, ownerId: string, expiresAt = Date.now() + VCF_LINK_TTL_MS) {
    const payload = `${leadId}.${ownerId}.${expiresAt}`;
    const signature = crypto.createHmac('sha256', getSigningSecret()).update(payload).digest('hex');
    return Buffer.from(`${payload}.${signature}`, 'utf8').toString('base64url');
}

export function verifyLeadVcfToken(token: string, leadId: string, ownerId: string) {
    try {
        const decoded = Buffer.from(token, 'base64url').toString('utf8');
        const [tokenLeadId, tokenOwnerId, expiresAtRaw, signature] = decoded.split('.');

        if (!tokenLeadId || !tokenOwnerId || !expiresAtRaw || !signature) {
            return false;
        }

        if (tokenLeadId !== leadId || tokenOwnerId !== ownerId) {
            return false;
        }

        const expiresAt = Number(expiresAtRaw);
        if (!Number.isFinite(expiresAt) || Date.now() > expiresAt) {
            return false;
        }

        const payload = `${tokenLeadId}.${tokenOwnerId}.${expiresAtRaw}`;
        const expectedSignature = crypto.createHmac('sha256', getSigningSecret()).update(payload).digest('hex');

        return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
    } catch {
        return false;
    }
}
