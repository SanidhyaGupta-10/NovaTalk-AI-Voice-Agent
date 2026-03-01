import { startVoiceSession } from "@/lib/actions/session.actions";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "@/lib/constants";
import { getVoice } from "@/lib/utils";
import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import { useRef, useState } from "react";

export type CallStatus = "idle" | "connecting" | "starting" | "listening" | "thinking" | "speaking";

const useLatestRef = <T>(value: T) => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
};

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY!;

let vapi: InstanceType<typeof Vapi>

function getVapi() {
    if(!vapi) {
        if(!VAPI_API_KEY) throw new Error('VAPI_API_KEY is not defined');

        vapi = new Vapi(VAPI_API_KEY);
    }

    return vapi;
}

export function useVapi (book: IBook) {
    const { userId } = useAuth();

    const [status, setStatus] = useState<CallStatus>('idle');
    const [messages, setMessages] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef(false);

    // Keep refs in sync with latest values for use in callbacks
    const bookRef = useLatestRef(book);
    const durationRef = useLatestRef(duration);
    const voice = book.persona || DEFAULT_VOICE;
    
    const isActive = status === 'listening' || status === 'thinking' || status === 'speaking' || status === 'starting';

    // Limit 
    // const maxDurationRef = useLatestRef(maxDurationSeconds);

    const start = async () => {
        if(!userId) return setLimitError("Please login to use this feature");

        setLimitError(null);
        setStatus("connecting");

        try{
            const result = await startVoiceSession(userId, book._id);

            if(!result.success){
                setLimitError(result?.error || 'Failed to start call');
                setStatus('idle');
                return;
            }

            sessionIdRef.current = result.sessionId || null;

            const firstMessage = `Hey, good to meet you. Quick question, before we dive in: have you actually read ${book.title} yet? or we starting fresh?`            

            await getVapi().start(ASSISTANT_ID, {
                firstMessage,
                variableValues: {
                    title: book.title,
                    author: book.author,
                    bookId: book._id,
                }, 
                // voice : {
                //     provider: '11labs' as const,
                //     voiceId: getVoice(voice).id,
                //     model: 'eleven_flash_v2_5' as const,
                //         stability: VOICE_SETTINGS.stability,
                //         similarityBoost: VOICE_SETTINGS.similarityBoost,
                //         style: VOICE_SETTINGS.style,
                //         useSpeakerBoost: VOICE_SETTINGS.useSpeakerBoost,
                // }
            })

        } catch (error) {
            console.log('Error starting call', error);
            setStatus('idle');
            setLimitError('Failed to start call. Please try again.');
            
        }
    };
    const stop = async () => {
        isStoppingRef.current = true;
        await  getVapi().stop();
    };
    const clearErrors = async () => {
        setLimitError(null);
    };

    return {
        status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearErrors,
        // maxDurationSeconds, remainingDuration, showTimeWarning
    }
};

export default useVapi;
