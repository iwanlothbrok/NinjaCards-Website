// lib/cors.ts
import { NextApiRequest, NextApiResponse } from 'next';

const allowedOrigins = ['https://www.ninjacardsnfc.com']; // Add all allowed origins here

export default function cors(req: NextApiRequest, res: NextApiResponse) {
    const origin = req.headers.origin;

    if (!origin) {
        return;
    }

    // Check if the origin is allowed
    if (allowedOrigins.includes(origin!)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', 'https://www.ninjacardsnfc.com'); // Default origin
    }

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        // End preflight requests
        res.status(200).end();
        return true; // Early exit
    }

    return false; // Continue with API logic
}
