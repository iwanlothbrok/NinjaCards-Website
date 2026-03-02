import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Helper function to check if the subscription is active.
 * @param subscription - The user's subscription
 * @returns true if the subscription is active, false otherwise.
 */
function isSubscriptionActive(subscription: any): boolean {
    if (!subscription) return false;

    // Check if the subscription has a valid end date and is still active
    if (subscription.end_date && new Date(subscription.end_date) < new Date()) {
        return false; // Subscription expired
    }

    // Check if the subscription status is valid (active, trialing)
    if (["active", "trialing"].includes(subscription.status)) {
        return true;
    }

    // Otherwise, return false if the subscription is paused, cancelled, or unpaid
    return false;
}

/**
 * Express handler to check if user has an active subscription.
 * @param req - The request object containing the user id
 * @param res - The response object
 */

// 1️⃣ checkUserSubscription (API Endpoints)
// Във всеки API endpoint, който изисква валиден абонамент, можеш да ползваш този guard:
export async function checkUserSubscription(req: any, res: any) {
    const { id } = req.params;

    try {
        // Fetch the user with their subscription
        const user = await prisma.user.findUnique({
            where: { id },
            include: { subscription: true },
        });

        // If the user doesn't exist or the subscription is not active
        if (!user || !isSubscriptionActive(user.subscription)) {
            return res.status(403).json({ error: "Subscription is not active" });
        }

        // If the subscription is valid, continue with the logic
        res.status(200).json({ message: "Subscription is active" });

    } catch (error) {
        console.error("Error checking subscription:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
}

/**
 * CRON job logic to mark subscriptions as cancelled when expired
 */
// This is a cleanup process that will run every day to mark expired subscriptions as cancelled

// 2️⃣ markExpiredSubscriptions (CRON)
// Това е процес, който трябва да се пуска редовно (например с cron job):
export async function markExpiredSubscriptions() {
    try {
        const now = new Date();

        // Update subscriptions that are expired
        await prisma.subscription.updateMany({
            where: {
                end_date: {
                    lte: now, // Where the end date is less than or equal to the current date
                },
                status: {
                    not: "cancelled", // Don't update already cancelled subscriptions
                },
            },
            data: {
                status: "cancelled", // Mark as cancelled
            },
        });

        console.log("Expired subscriptions successfully marked as cancelled");
    } catch (error) {
        console.error("Error marking expired subscriptions:", error);
    }
}

export { };
