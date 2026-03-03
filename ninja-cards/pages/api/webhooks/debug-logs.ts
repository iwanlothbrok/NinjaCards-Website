// FILE: pages/api/webhooks/debug-logs.ts
// ─────────────────────────────────────────────────────────────────────────────
// READ-ONLY endpoint to inspect the last 20 webhook events and their logs.
// Hit this in your browser or with curl after a checkout:
//
//   GET https://yourapp.com/api/webhooks/debug-logs
//   GET https://yourapp.com/api/webhooks/debug-logs?type=checkout.session.completed
//   GET https://yourapp.com/api/webhooks/debug-logs?status=failed
//
// REMOVE THIS FILE once you've diagnosed the issue.
// ─────────────────────────────────────────────────────────────────────────────
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).send("Method Not Allowed");

    const { type, status, id } = req.query;

    const where: any = {};
    if (type) where.type = String(type);
    if (status) where.status = String(status);
    if (id) where.id = String(id);

    const events = await prisma.webhookEvent.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: {
            id: true,
            type: true,
            status: true,
            attempts: true,
            lastError: true,   // contains the step-by-step debug trace
            processedAt: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    return res.status(200).json({
        count: events.length,
        hint: "lastError contains the step-by-step execution trace for each event",
        events,
    });
}