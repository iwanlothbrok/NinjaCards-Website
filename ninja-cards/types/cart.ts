export interface CartItem {
    plan: string; // Например: 'SHINOBI', 'SAMURAI', 'SHOGUN'
    design: string; // Идентификатор на избрания дизайн
    quantity: number;
    freeTrialUsed: boolean;
}