// components/ChatWindow.tsx
import React, { useRef, useEffect } from "react";

// Chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  messages: ChatMessage[];
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages }) => {
  // Create a ref for the messages container
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If no messages, show welcome message
  if (messages.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "0.5rem",
          background: "#fafafa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#666",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p>Welcome to the LLM Chat Demo!</p>
          <p>Type a message below to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "0.5rem",
        background: "#fafafa",
      }}
    >
      {messages.map((msg, idx) => (
        <div
          key={idx}
          style={{
            marginBottom: "0.75rem",
            textAlign: msg.role === "user" ? "right" : "left",
          }}
        >
          <div
            style={{
              display: "inline-block",
              maxWidth: "80%",
              padding: "0.75rem",
              borderRadius: "0.5rem",
              background: msg.role === "user" ? "#0070f3" : "#e4e4e4",
              color: msg.role === "user" ? "#fff" : "#000",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            {msg.content}
          </div>
        </div>
      ))}
      {/* Empty div for scrolling to the end */}
      <div ref={messagesEndRef} />
    </div>
  );
};