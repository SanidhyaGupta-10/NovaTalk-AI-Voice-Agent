import { PlanType } from "./subscription-constants";

export const getUserPlan = async (): Promise<PlanType> => {
    // Default to FREE for now
    return 'FREE';
};
