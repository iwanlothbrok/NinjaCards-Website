// lib/cors.ts
import { NextApiRequest, NextApiResponse } from "next";

const allowedOrigins = ["https://www.ninjacardsnfc.com", "http://localhost:3000"]; // Add all allowed origins here

export default function cors(req: NextApiRequest, res: NextApiResponse) {
    const origin = req.headers.origin;

    if (origin && allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (req.method === "OPTIONS") {
        res.status(200).end();
        return true; // Stop further execution for preflight requests
    }

    return false; // Continue with the main handler
}
