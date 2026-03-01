"use client"

import { IBook } from '@/types'
import useVapi from '@/hooks/useVapi'
import { DEFAULT_VOICE } from '@/lib/constants';
import Image from 'next/image';
import {
    MicOff,
    Clock,
    Mic
} from 'lucide-react';
import { Transcript } from './Transcript';
import { useState, useEffect } from 'react';

function VapiControls({ book }: { book: IBook }) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const { status,
        isActive,
        messages,
        currentMessages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearErrors, } = useVapi(book);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isMounted) return null;

    return (
        <div className="vapi-main-container">
            <div className="vapi-header-card">
                {/* Left: Book cover + Overlapping Mic */}
                <div className="relative shrink-0">
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || "/book-placeholder.png"}
                            alt={book.title}
                            width={162}
                            height={240}
                            className="vapi-cover-image"
                            priority
                        />
                    </div>

                    <div className="vapi-mic-wrapper">
                        {isActive && <div className="vapi-pulse-ring" />}
                        <button
                            className={`vapi-mic-btn ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                            onClick={isActive ? stop : start}
                            disabled={status === "connecting"}
                            aria-label={isActive ? "Stop call" : "Start call"}
                        >
                            {isActive ? (
                                <Mic size={26} />
                            ) : (
                                <MicOff size={26} />
                            )}
                        </button>
                    </div>
                </div>

                {/* Right: Book details + status badges */}
                <div className="flex-1 flex flex-col justify-center gap-6 w-full">
                    <div>
                        <h1 className="text-3xl md:text-3xl font-bold font-serif text-[#212a3b] mb-1">
                            {book.title}
                        </h1>
                        <p className="text-lg text-[#3d485e]">
                            by {book.author}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text">
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                        </div>

                        <div className="vapi-status-indicator">
                            <span className="vapi-status-text">
                                Voice: {(book.persona || DEFAULT_VOICE).charAt(0).toUpperCase() + (book.persona || DEFAULT_VOICE).slice(1)}
                            </span>
                        </div>

                        <div className="vapi-status-indicator">
                            <Clock className="size-4 text-[#212a3b]" />
                            <span className="vapi-status-text">
                                {isActive ? formatTime(duration) : "0:00"}/15:00
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="vapi-transcript-wrapper">
                <Transcript
                    messages={messages as any}
                    currentMessages={currentMessages as any}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </div>
        </div>
    )
}

export default VapiControls