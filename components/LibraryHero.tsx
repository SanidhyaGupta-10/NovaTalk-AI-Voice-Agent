"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export default function LibraryHero() {
    return (
        <div className="wrapper mt-10 mb-10 md:mb-16">
            <div className="library-hero-card">
                <div className="library-hero-content">
                    {/* Left Column */}
                    <div className="library-hero-text">
                        <h1 className="library-hero-title">
                            Your Library
                        </h1>
                        <p className="library-hero-description">
                            Convert your books into interactive AI conversations. Listen, learn, and discuss your favorite reads.
                        </p>
                        <button className="library-cta-primary mt-2">
                            <Plus className="w-5 h-5 text-gray-600" />
                            Add new book
                        </button>
                    </div>

                    {/* Center Image - Only shown on large screens in this layout */}
                    <div className="library-hero-illustration-desktop">
                        <Image
                            src="/assets/hero-illustration.png"
                            alt="Vintage books, globe and a lamp"
                            width={400}
                            height={400}
                            className="object-contain mix-blend-multiply pointer-events-none"
                            priority
                        />
                    </div>

                    {/* Right Column */}
                    <ul className="library-steps-card flex flex-col gap-6 w-full lg:w-fit max-w-sm">

                        <li className="library-step-item">
                            <div className="library-step-number">1</div>
                            <div className="flex flex-col">
                                <span className="library-step-title">Upload PDF</span>
                                <span className="library-step-description">Add your book file</span>
                            </div>
                        </li>

                        <li className="library-step-item">
                            <div className="library-step-number">2</div>
                            <div className="flex flex-col">
                                <span className="library-step-title">AI Processing</span>
                                <span className="library-step-description">We analyze the content</span>
                            </div>
                        </li>

                        <li className="library-step-item">
                            <div className="library-step-number">3</div>
                            <div className="flex flex-col">
                                <span className="library-step-title">Voice Chat</span>
                                <span className="library-step-description">Discuss with AI</span>
                            </div>
                        </li>

                    </ul>
                </div>
            </div>
        </div>
    );
}
