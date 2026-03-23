"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TranscriptProps {
  messages: Message[];
  currentMessages: Message[];
  currentMessage?: string;
  currentUserMessage?: string;
}

export function Transcript({
  messages,
  currentMessages,
  currentMessage,
  currentUserMessage
}: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [currentMessages]);

  const isEmpty = currentMessages?.length === 0;

  if (isEmpty) {
    return (
      <div className="transcript-container">
        <div className="transcript-empty px-10">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-[#f3e4c7] rounded-full blur-2xl opacity-40 animate-pulse" />
            <div className="relative bg-[#f3e4c7] p-8 rounded-full border border-[rgba(33,42,59,0.1)] shadow-inner">
              <Mic className="w-12 h-12 text-[#663820]" />
            </div>
          </div>
          <h3 className="transcript-empty-text text-2xl mb-2 font-serif">Your conversation starts here</h3>
          <p className="transcript-empty-hint text-lg max-w-sm mx-auto leading-relaxed">
            Click the microphone above to begin discussing <span className="font-semibold text-[#663820]">NovaTalk</span> with your AI assistant.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container">
      <div className="transcript-messages scrollbar-hide" ref={scrollRef}>
        {currentMessages?.map((message, index) => {
          const isStreaming = messages && index >= messages.length;
          const isUser = message.role === "user";

          return (
            <div
              key={index}
              className={`transcript-message ${
                isUser ? "transcript-message-user" : "transcript-message-assistant"
              }`}
            >
              <div
                className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[75%]`}
              >
                <div
                  className={`transcript-bubble ${
                    isUser ? "transcript-bubble-user" : "transcript-bubble-assistant"
                  } shadow-sm`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {isStreaming && (
                    <span className="inline-block w-2 h-5 ml-1 bg-current animate-pulse align-middle" style={{ opacity: 0.6 }} />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-[#3d485e]/50 mt-1 font-bold px-1">
                  {isUser ? "You" : "Assistant"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
