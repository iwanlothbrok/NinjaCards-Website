export interface Subscription {
    id: string;
    subscription_id: string;   // Stripe sub id
    stripe_user_id: string;    // Stripe customer id

    status: SubscriptionStatus;
    plan: PlanType;

    start_date: string;
    end_date: string | null;
    cancel_date: string | null;

    userId: string;
    invoices: Invoice[];
};
interface Invoice {
    id: string;
    stripeId: string;
    userId: string;
    amountPaid: number;
    currency: string;
    hostedInvoiceUrl: string;
    createdAt: Date;

}

enum PlanType {
    SHINOBI = "SHINOBI",
    SAMURAI = "SAMURAI",
    SHOGUN = "SHOGUN",
}

enum SubscriptionStatus {
    active,
    trialing,
    past_due,
    unpaid,
    paused,
    cancelled,
}
