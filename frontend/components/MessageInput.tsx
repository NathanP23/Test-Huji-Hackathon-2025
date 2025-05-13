// components/MessageInput.tsx
import React, { useState, FormEvent } from "react";

interface MessageInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSend, 
  isLoading = false 
}) => {
  const [text, setText] = useState("");

  // Handle form submission
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Skip if empty or already processing
    if (!text.trim() || isLoading) return;
    
    onSend(text.trim());
    setText("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: "flex", 
        marginTop: "1rem" 
      }}
    >
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
        disabled={isLoading}
        style={{
          flex: 1,
          padding: "0.75rem",
          borderRadius: "0.25rem 0 0 0.25rem",
          border: "1px solid #ccc",
          outline: "none",
          opacity: isLoading ? 0.7 : 1,
        }}
      />
      <button
        type="submit"
        disabled={isLoading}
        style={{
          padding: "0 1rem",
          border: "none",
          background: isLoading ? "#999" : "#0070f3",
          color: "#fff",
          borderRadius: "0 0.25rem 0.25rem 0",
          cursor: isLoading ? "not-allowed" : "pointer",
        }}
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  );
};