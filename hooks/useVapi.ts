import { DEFAULT_VOICE } from "@/lib/constants";
import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";

export type CallStatus = "idle" | "connection" | "starting" | "listening" | "thinking" | "speaking";

const useLatestRef = <T>(value: T) => {
    const ref = useRef<T>(value);
    ref.current = value;
    return ref;
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

    const start = async () => {}
    const stop = async () => {}
    const clearErrors = async () => {}

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
