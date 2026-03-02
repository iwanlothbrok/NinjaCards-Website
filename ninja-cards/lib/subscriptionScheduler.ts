import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Periodically check for expired subscriptions
export async function checkExpiredSubscriptions() {
    const currentDate = new Date();

    // Find subscriptions with an end_date less than the current date
    const subscriptions = await prisma.subscription.findMany({
        where: {
            end_date: { lte: currentDate }, // End date has passed
            status: { not: "active" }, // Don't update already inactive subscriptions
        },
    });

    // Mark those subscriptions as inactive
    for (const sub of subscriptions) {
        await prisma.subscription.update({
            where: { id: sub.id },
            data: {
                status: "active", // Mark as inactive
            },
        });

        console.log(`✅ Subscription ${sub.id} marked as inactive.`);
    }
}

// Run every day at midnight (adjust the interval as needed)
// setInterval(checkExpiredSubscriptions, 24 * 60 * 60 * 1000); // Runs once every 24 hours
