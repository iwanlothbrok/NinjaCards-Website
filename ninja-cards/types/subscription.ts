export interface Subscription {
    id: string;
    subscription_id: string;   // Stripe sub id
    stripe_user_id: string;    // Stripe customer id
    plan_id: string;
    status: "active" | "trialing" | "cancelled" | string;
    start_date: string;
    end_date: string | null;
    userId: string;
};