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
