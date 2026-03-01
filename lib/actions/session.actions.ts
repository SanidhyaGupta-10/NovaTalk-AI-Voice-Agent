"use server";

import VoiceSession from "@/database/models/voice-session.model";
import { connectToDatabase } from "@/database/mongoose";
import { EndSessionResult, StartSessionResult } from "@/types";
import { getCurremtBillingPeriodStart } from "../subscription-constants";


export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        await connectToDatabase();

        // Limits/Plan to see whether a session is allowed

        const session = await VoiceSession.findOne({
            clerkId,  
            bookId, 
            startedAt: new Date(),
            billingPeriodStart: getCurremtBillingPeriodStart(),
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session?._id?.toString(), 
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

        if(!result) {
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
