'use client';

import { useAuth } from "@clerk/nextjs";
import { PLANS, PlanType, PLAN_LIMITS } from "@/lib/subscription-constants";

export function usePlan() {
    const { has, isLoaded } = useAuth();

    if (!isLoaded) return { plan: PLANS.FREE, limits: PLAN_LIMITS[PLANS.FREE], isLoaded: false };

    let plan: PlanType = PLANS.FREE;

    if (has?.({ plan: PLANS.PRO })) plan = PLANS.PRO;
    else if (has?.({ plan: PLANS.STANDARD })) plan = PLANS.STANDARD;

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded: true
    };
}
