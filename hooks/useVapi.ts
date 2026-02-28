import { IBook, Messages } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useRef, useState } from "react";

export type CallStatus = "idle" | "connection" | "starting" | "listening" | "thinking" | "speaking";

export const useVapi = () => {
    const { userId } = useAuth();

    const [status, setStatus] = useState<CallStatus>("idle");
    const [message, setMessage] = useState<Messages[]>([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [currentUserMessage, setCurrentUserMessage] = useState('');
    const [duration, setDuration] = useState(0);
    const [limitError, setLimitError] = useState<string | null>(null)

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const sessionIdRef = useRef<string | null>(null);
    const isStoppingRef = useRef(false);

};
