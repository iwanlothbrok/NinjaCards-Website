export interface Invoice {
    id: string;
    stripeId: string;
    amountPaidMinor: number;
    amountPaid: string;             // formatted by API
    currency: string;
    hostedInvoiceUrl: string;
    createdAt: string;
    stripeSubscriptionId: string | null;
    subscriptionId: string | null;
}