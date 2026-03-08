// app/api/hubspot/sync/route.ts
// Proxies lead data to HubSpot Contacts API
// Uses the user's own Private App token — never stored server-side beyond the request

import cors from '@/utils/cors'
import type { NextApiRequest, NextApiResponse } from 'next'

interface LeadPayload {
    id: string
    name: string
    email?: string
    phone?: string
    message?: string
    createdAt: string
}

interface HubSpotProperty {
    property: string
    value: string
}

function buildHubSpotProperties(lead: LeadPayload): HubSpotProperty[] {
    const [firstName, ...rest] = (lead.name || '').trim().split(' ')
    const lastName = rest.join(' ')

    const props: HubSpotProperty[] = [
        { property: 'firstname', value: firstName || lead.name },
    ]
    if (lastName) props.push({ property: 'lastname', value: lastName })
    if (lead.email) props.push({ property: 'email', value: lead.email })
    if (lead.phone) props.push({ property: 'phone', value: lead.phone })
    if (lead.message) props.push({ property: 'message', value: lead.message })

    // Tag the source
    props.push({ property: 'hs_lead_status', value: 'NEW' })
    props.push({ property: 'lifecyclestage', value: 'lead' })

    return props
}

// POST /api/hubspot/sync
// Body: { apiToken: string, leads: LeadPayload[] }
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {

        // Handle CORS preflight requests
        const corsHandled = cors(req, res);
        if (corsHandled) return; // If it's a preflight request, stop further execution
        const body = req.body as { apiToken: string; leads: LeadPayload[] }
        const { apiToken, leads } = body

        if (!apiToken?.trim()) {
            return res.status(400).json({ error: 'Missing HubSpot API token' })
        }
        if (!Array.isArray(leads) || leads.length === 0) {
            return res.status(400).json({ error: 'No leads provided' })
        }

        const results: { id: string; status: 'synced' | 'duplicate' | 'failed'; hubspotId?: string; error?: string }[] = []

        // HubSpot rate limit: 10 req/s — process sequentially with small delay
        for (const lead of leads) {
            try {
                const properties = buildHubSpotProperties(lead)

                // v1 contacts API — supports upsert by email
                const endpoint = lead.email
                    ? `https://api.hubapi.com/contacts/v1/contact/createOrUpdate/email/${encodeURIComponent(lead.email)}/`
                    : `https://api.hubapi.com/contacts/v1/contact/`

                const hubspotRes = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiToken}`,
                    },
                    body: JSON.stringify({ properties }),
                })

                const data = await hubspotRes.json()

                if (hubspotRes.status === 200 || hubspotRes.status === 201) {
                    results.push({
                        id: lead.id,
                        status: hubspotRes.status === 200 ? 'duplicate' : 'synced',
                        hubspotId: String(data.vid ?? data.id ?? ''),
                    })
                } else {
                    results.push({
                        id: lead.id,
                        status: 'failed',
                        error: data?.error || data?.message || `HTTP ${hubspotRes.status}`,
                    })
                }

                // Small delay to respect rate limits
                await new Promise(r => setTimeout(r, 110))
            } catch (err) {
                results.push({ id: lead.id, status: 'failed', error: String(err) })
            }
        }

        const synced = results.filter(r => r.status === 'synced').length
        const duplicate = results.filter(r => r.status === 'duplicate').length
        const failed = results.filter(r => r.status === 'failed').length

        return res.status(200).json({ results, summary: { synced, duplicate, failed } })
    } catch (err) {
        console.error('[HubSpot sync error]', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}