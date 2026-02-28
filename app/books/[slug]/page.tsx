import { auth } from '@clerk/nextjs/server';
import { getBookBySlug } from '@/lib/actions/book.actions';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Mic,
    MicOff,
    Clock
} from 'lucide-react';
import { IBook } from '@/types';
import { DEFAULT_VOICE } from '@/lib/constants';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BookDetailsPage({ params }: PageProps) {
    const { userId } = await auth();
    if (!userId) redirect('/sign-in');

    const { slug } = await params;
    const response = await getBookBySlug(slug);

    if (!response.success || !response.data) {
        redirect('/');
    }

    const book = response.data as IBook;

    return (
        <div className="book-page-container">
            <Link href="/" className="back-btn-floating">
                <ArrowLeft className="size-6 text-[#212a3b]" />
            </Link>

            <div className="vapi-main-container space-y-8">
                {/* Header card */}
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
                                <button className="vapi-mic-btn">
                                    <MicOff className="size-6 text-[#212a3b]" />
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
                                    <span className="vapi-status-dot vapi-status-dot-ready" />
                                    <span className="vapi-status-text">Ready</span>
                                </div>

                                <div className="vapi-status-indicator">
                                    <span className="vapi-status-text">
                                        Voice: {(book.persona || DEFAULT_VOICE).charAt(0).toUpperCase() + (book.persona || DEFAULT_VOICE).slice(1)}
                                    </span>
                                </div>

                                <div className="vapi-status-indicator">
                                    <Clock className="size-4 text-[#212a3b]" />
                                    <span className="vapi-status-text">0:00/15:00</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Transcript area */}
                <div className="transcript-container flex-1">
                    <div className="transcript-empty">
                        <Mic className="size-12 text-[#d4c4a8] mb-4" />
                        <h3 className="transcript-empty-text">No conversation yet</h3>
                        <p className="transcript-empty-hint">
                            Click the mic button above to start talking
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
