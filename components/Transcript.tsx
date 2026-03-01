"use client";

import React, { useEffect, useRef } from "react";
import { Mic } from "lucide-react";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface TranscriptProps {
  messages: Message[];
  currentMessage?: string;
  currentUserMessage?: string;
}

export function Transcript({ messages, currentMessage, currentUserMessage }: TranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages or streaming updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  const isEmpty = messages?.length === 0 && !currentMessage && !currentUserMessage;

  if (isEmpty) {
    return (
      <div className="transcript-container">
        <div className="transcript-empty">
          <div className="bg-[#f3e4c7] p-4 rounded-full mb-4">
            <Mic className="w-8 h-8 text-[#663820]" />
          </div>
          <p className="transcript-empty-text">No conversation yet</p>
          <p className="transcript-empty-hint">Click the microphone to start talking to the AI assistant.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="transcript-container">
      <div className="transcript-messages" ref={scrollRef}>
        {messages?.map((message, index) => (
          <div
            key={index}
            className={`transcript-message ${
              message.role === "user" ? "transcript-message-user" : "transcript-message-assistant"
            }`}
          >
            <div
              className={`transcript-bubble ${
                message.role === "user" ? "transcript-bubble-user" : "transcript-bubble-assistant"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {/* User Streaming Message */}
        {currentUserMessage && (
          <div className="transcript-message transcript-message-user">
            <div className="transcript-bubble transcript-bubble-user">
              {currentUserMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        )}

        {/* Assistant Streaming Message */}
        {currentMessage && (
          <div className="transcript-message transcript-message-assistant">
            <div className="transcript-bubble transcript-bubble-assistant">
              {currentMessage}
              <span className="transcript-cursor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
