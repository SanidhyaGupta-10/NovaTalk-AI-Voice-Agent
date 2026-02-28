'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = () => {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md">
            <div className="relative">
                <div className="absolute inset-0 animate-ping rounded-full bg-slate-200 opacity-20" />
                <Loader2 className="h-16 w-16 animate-spin text-[#212a3b]" />
            </div>
            <div className="mt-8 text-center">
                <h2 className="text-2xl font-bold text-[#212a3b]">Awaiting Connection...</h2>
                <p className="mt-2 text-[#3d485e]">We're preparing your book and setting up the voice assistant.</p>
                <div className="mt-6 flex items-center justify-center gap-2">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#212a3b]" style={{ animationDelay: '0ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#212a3b]" style={{ animationDelay: '150ms' }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#212a3b]" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    );
};

export default LoadingOverlay;
