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

function VapiControls({ book }: { book: IBook }) {

    const { status,
        isActive,
        messages,
        currentMessage,
        currentUserMessage,
        duration,
        start,
        stop,
        clearErrors, } = useVapi(book);

    return (
        <>
            <div className="vapi-header-card w-full">
                <div className="vapi-card-layout w-full">
                    {/* Left: Book cover */}
                    <div className="vapi-cover-wrapper">
                        <Image
                            src={book.coverURL || "/book-placeholder.png"}
                            alt={book.title}
                            width={120}
                            height={180}
                            className="vapi-cover-image"
                        />

                        <div className="vapi-mic-wrapper">
                            {isActive && <div className="vapi-pulse-ring" />}
                            <button 
                                className={`vapi-mic-btn ${isActive ? 'vapi-mic-btn-active' : 'vapi-mic-btn-inactive'}`}
                                onClick={isActive ? stop : start}
                            >
                                {isActive ? (
                                    <Mic className="size-6 text-[#663820]" />
                                ) : (
                                    <MicOff className="size-6 text-[#212a3b]" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right: Book details */}
                    <div className="flex-1 flex flex-col justify-center">
                        <h1 className="text-2xl md:text-3xl font-bold font-serif text-[#212a3b]">
                            {book.title}
                        </h1>
                        <p className="subtitle mb-4">
                            by {book.author}
                        </p>

                        <div className="flex flex-wrap gap-3">
                            <div className="vapi-status-indicator">
                                <span className={`vapi-status-dot vapi-status-dot-${status}`} />
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
                                    {isActive ? duration : "0:00"}/15:00
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="vapi-transcript-wrapper">
                <Transcript
                    messages={messages.map((m) => ({
                        ...m,
                        role: m.role as 'user' | 'assistant'
                    }))}
                    currentMessage={currentMessage}
                    currentUserMessage={currentUserMessage}
                />
            </div>
        </>
    )
}

export default VapiControls