export const getCurremtBillingPeriodStart = () => {
    const now = new Date();
    // Billing tracked by calendar month
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return start;
}

export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard',
    PRO: 'pro',
} as const;

export type PlanType = typeof PLANS[keyof typeof PLANS];

export const PLAN_LIMITS = {
    [PLANS.FREE]: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxMinutesPerSession: 5,
        hasHistory: false,
    },
    [PLANS.STANDARD]: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxMinutesPerSession: 15,
        hasHistory: true,
    },
    [PLANS.PRO]: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxMinutesPerSession: 60,
        hasHistory: true,
    },
};
