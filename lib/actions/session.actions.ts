"use server";

import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurrentBillingPeriodStart } from "../subscription-constants";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();

        const { getUserPlan } = await import('@/lib/subscription.server');
        const { PLAN_LIMITS, getCurrentBillingPeriodStart } = await import('../subscription-constants');

        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];

        const billingPeriodStart = getCurrentBillingPeriodStart();

        // Check monthly session limits
        const sessionCount = await VoiceSession.countDocuments({
            clerkId,
            startedAt: { $gte: billingPeriodStart }
        });

        if (sessionCount >= limits.maxSessionsPerMonth) {
            return {
                success: false,
                error: `You have reached your monthly session limit (${limits.maxSessionsPerMonth}) for the ${plan} plan. Please upgrade to continue.`,
                isBillingError: true
            };
        }

        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session?._id?.toString(),
            maxDurationMinutes: limits.maxMinutesPerSession
        }

    } catch (error) {
        console.log('Error starting voice session', error);
        return { success: false, error: 'Failed to start voice session' };
    }
}

export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            durationSeconds,
            endedAt: new Date(),
        });

        if (!result) {
            return { success: false, error: 'Session not found' };
        }
        return {
            success: true,
        }
    } catch (error) {
        console.log('Error ending voice session', error);
        return { success: false, error: 'Failed to end voice session' };
    }
}
