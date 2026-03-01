import { auth } from "@clerk/nextjs/server";
import { PLANS, PlanType } from "./subscription-constants";

export const getUserPlan = async (): Promise<PlanType> => {
    const { has } = await auth();

    if (has({ plan: PLANS.PRO })) return PLANS.PRO;
    if (has({ plan: PLANS.STANDARD })) return PLANS.STANDARD;

    return PLANS.FREE;
};
