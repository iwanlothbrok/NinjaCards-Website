import type { NextApiRequest, NextApiResponse } from "next";

import cors from "@/utils/cors";
import { prisma } from "@/lib/prisma";
import { getCanonicalPlanId } from "@/lib/planCatalog";
import { getGenericCardQualification } from "@/lib/entitlements";

type CardRequestType = "generic" | "personalized";

function isCardRequestType(value: unknown): value is CardRequestType {
  return value === "generic" || value === "personalized";
}

function buildCardRequestSubject(params: {
  type: CardRequestType;
  userId: string;
  canonicalPlan: string;
  score?: number;
}) {
  const scorePart = typeof params.score === "number" ? `|score:${params.score}` : "";
  return `CARD_REQUEST|${params.type}|user:${params.userId}|plan:${params.canonicalPlan}${scorePart}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const corsHandled = cors(req, res);
  if (corsHandled) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, type } = req.body ?? {};
  if (typeof userId !== "string" || !isCardRequestType(type)) {
    return res.status(400).json({ error: "Missing or invalid request data" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const canonicalPlan = getCanonicalPlanId(user.subscription?.plan);
    const existingRequest = await prisma.contact.findFirst({
      where: {
        email: user.email ?? "",
        subject: {
          startsWith: `CARD_REQUEST|${type}|user:${user.id}`,
        },
      },
      orderBy: { sendedOn: "desc" },
    });

    if (existingRequest) {
      return res.status(409).json({
        error: "A request for this card is already in progress",
        state: "requested",
      });
    }

    if (type === "generic") {
      const qualification = getGenericCardQualification({
        profile: user,
        email: user.email,
        hasShippingPayment: true,
        hasExistingRequest: false,
        isFulfilled: false,
      });

      if (!qualification.qualifiesByScore || !qualification.hasVerifiedEmail) {
        return res.status(403).json({
          error: "Generic card requirements are not met yet",
          blockers: qualification.blockers,
          state: qualification.state,
        });
      }

      await prisma.contact.create({
        data: {
          name: user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "NinjaCards user",
          email: user.email ?? `user+${user.id}@ninjacards.local`,
          phone: user.phone1 ?? null,
          subject: buildCardRequestSubject({
            type,
            userId: user.id,
            canonicalPlan,
            score: qualification.score,
          }),
        },
      });

      return res.status(200).json({
        success: true,
        state: "requested",
        message: "Generic card request submitted. Our team will confirm shipping before fulfillment.",
      });
    }

    if (canonicalPlan === "FREE") {
      return res.status(403).json({
        error: "Personalized cards are available only on paid plans",
      });
    }

    await prisma.contact.create({
      data: {
        name: user.name || [user.firstName, user.lastName].filter(Boolean).join(" ") || "NinjaCards user",
        email: user.email ?? `user+${user.id}@ninjacards.local`,
        phone: user.phone1 ?? null,
        subject: buildCardRequestSubject({
          type,
          userId: user.id,
          canonicalPlan,
        }),
      },
    });

    return res.status(200).json({
      success: true,
      state: "requested",
      message: "Personalized card request submitted. Our team will confirm pricing and next steps.",
    });
  } catch (error) {
    console.error("[profile/card-request]", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
