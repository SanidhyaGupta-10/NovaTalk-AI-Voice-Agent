export const getCurremtBillingPeriodStart = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    return start;
}


export const PLANS = {
    FREE: 'FREE',
    PRO: 'PRO',
} as const;

export type PlanType = keyof typeof PLANS;

export const PLAN_LIMITS = {
    FREE: {
        maxBooks: 2,
        maxMinutes: 10,
    },
    PRO: {
        maxBooks: 20,
        maxMinutes: 100,
    },
};
