// pages/index.tsx

import React, { useState, useEffect } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { MessageInput } from "../components/MessageInput";
import { fetchChat, openChatSocket } from "../utils/api";

// Chat message interface
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export default function HomePage() {
  // State for chat history and active WebSocket
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Clean up WebSocket on unmount
  useEffect(() => {
    return () => {
      if (socket) {
        console.log("[UI] Cleaning up WebSocket connection");
        socket.close();
      }
    };
  }, [socket]);

  // Handle user message submission
  const handleSend = (text: string) => {
    console.log("[UI] Message submitted:", text);
    setIsLoading(true);
    
    // Add user message to chat
    setMessages((msgs) => [...msgs, { role: "user", content: text }]);

    // Close any existing WebSocket
    if (socket) {
      console.log("[UI] Closing previous WebSocket");
      socket.close();
    }

    // Open new WebSocket for streaming
    console.log("[UI] Setting up new WebSocket for streaming");
    const ws = openChatSocket(
      text,
      // Token handler - called for each incoming token
      (token) => {
        setMessages((msgs) => {
          const last = msgs[msgs.length - 1];
          
          // If last message is from assistant, append to it
          if (last?.role === "assistant") {
            const updated = [...msgs];
            updated[updated.length - 1] = {
              ...last,
              content: last.content + token,
            };
            return updated;
          } 
          // Otherwise create new assistant message
          else {
            return [...msgs, { role: "assistant", content: token }];
          }
        });
      },
      // Close handler - called when WebSocket closes
      () => {
        console.log("[UI] WebSocket closed");
        setSocket(null);
        setIsLoading(false);
      }
    );

    // Store the socket for later cleanup
    setSocket(ws);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "1rem",
      }}
    >
      <h1 style={{ textAlign: "center", margin: "0 0 1rem 0" }}>
        LLM Chat Demo
      </h1>
      
      <ChatWindow messages={messages} />
      <MessageInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}