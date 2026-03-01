import { startVoiceSession } from "@/lib/actions/session.actions";
import { ASSISTANT_ID, DEFAULT_VOICE, VOICE_SETTINGS } from "@/lib/constants";
import { getVoice } from "@/lib/utils";
import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import Vapi from "@vapi-ai/web";
import { useRef, useState, useEffect, useCallback } from "react";

export type CallStatus = "idle" | "connecting" | "starting" | "listening" | "thinking" | "speaking";

const useLatestRef = <T>(value: T) => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
};

const VAPI_API_KEY = process.env.NEXT_PUBLIC_VAPI_API_KEY!;

let vapi: InstanceType<typeof Vapi>

function getVapi() {
    if (!vapi) {
        if (!VAPI_API_KEY) throw new Error('VAPI_API_KEY is not defined');

        vapi = new Vapi(VAPI_API_KEY);
    }

    return vapi;
}

export function useVapi(book: IBook) {
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

    const start = useCallback(async () => {
        if (!userId) return setLimitError("Please login to use this feature");

        setLimitError(null);
        setStatus("connecting");
        setMessages([]);
        setCurrentMessage("");
        setCurrentUserMessage("");

        try {
            const result = await startVoiceSession(userId, book._id);

            if (!result.success) {
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
    }, [userId, book._id, book.title, book.author]);

    const stop = useCallback(async () => {
        isStoppingRef.current = true;
        await getVapi().stop();
    }, []);

    const clearErrors = useCallback(async () => {
        setLimitError(null);
    }, []);

    useEffect(() => {
        const vapiInstance = getVapi();

        const onCallStart = () => {
            console.log("Call started");
            setStatus("listening");
            startTimeRef.current = Date.now();
            timerRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
                    setDuration(elapsed);
                }
            }, 1000);
        };

        const onCallEnd = () => {
            console.log("Call ended");
            setStatus("idle");
            setMessages([]);
            setCurrentMessage("");
            setCurrentUserMessage("");
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            setDuration(0);
            startTimeRef.current = null;
        };

        const onMessage = (message: any) => {
            if (message.type === "transcript") {
                const { role, transcriptType, transcript } = message;

                if (transcriptType === "partial") {
                    if (role === "user") {
                        setCurrentUserMessage(transcript);
                    } else if (role === "assistant") {
                        setCurrentMessage(transcript);
                        setStatus("speaking");
                    }
                } else if (transcriptType === "final") {
                    if (role === "user") {
                        setCurrentUserMessage("");
                        setStatus("thinking");
                        setMessages((prev) => {
                            const isDuplicate = prev.length > 0 && prev[prev.length - 1].role === "user" && prev[prev.length - 1].content === transcript;
                            if (isDuplicate) return prev;
                            return [...prev, { role: "user", content: transcript }];
                        });
                    } else if (role === "assistant") {
                        setCurrentMessage("");
                        setStatus("listening");
                        setMessages((prev) => {
                            const isDuplicate = prev.length > 0 && prev[prev.length - 1].role === "assistant" && prev[prev.length - 1].content === transcript;
                            if (isDuplicate) return prev;
                            return [...prev, { role: "assistant", content: transcript }];
                        });
                    }
                }
            }
        };

        const onError = (error: any) => {
            console.error("Vapi Error:", error);
            setStatus("idle");
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };

        vapiInstance.on("call-start", onCallStart);
        vapiInstance.on("call-end", onCallEnd);
        vapiInstance.on("message", onMessage);
        vapiInstance.on("error", onError);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            vapiInstance.off("call-start", onCallStart);
            vapiInstance.off("call-end", onCallEnd);
            vapiInstance.off("message", onMessage);
            vapiInstance.off("error", onError);
        };
    }, []);

    const currentMessages = [
        ...messages,
        ...(currentUserMessage ? [{ role: "user", content: currentUserMessage }] : []),
        ...(currentMessage ? [{ role: "assistant", content: currentMessage }] : []),
    ];

    return {
        status,
        isActive,
        messages,
        currentMessages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearErrors,
    }
};

export default useVapi;
