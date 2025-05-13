// utils/api.ts

// Base URL for our backend API
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

// Log the base URL at module load time
console.log("[API] Backend URL:", API_BASE);

/**
 * Send a prompt to the REST API and get a full response
 */
export async function fetchChat(prompt: string): Promise<string> {
  console.log("[API] Sending prompt to REST API:", prompt);

  try {
    // Send POST request to the chat endpoint
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    console.log("[API] Response status:", res.status);

    // Handle error response
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ detail: "Unknown error" }));
      console.error("[API] Error response:", errorData);
      throw new Error(errorData.detail || "Chat API error");
    }

    // Parse successful response
    const data = await res.json();
    console.log("[API] Response received, length:", data.response.length);
    return data.response;
  } catch (error) {
    console.error("[API] Fetch error:", error);
    throw error;
  }
}

/**
 * Open a WebSocket connection for streaming chat tokens
 */
export function openChatSocket(
  prompt: string,
  onToken: (token: string) => void,
  onClose: () => void
): WebSocket {
  // Create WebSocket URL
  const wsUrl = `${API_BASE.replace('http', 'ws')}/chat/ws?prompt=${encodeURIComponent(prompt)}`;
  console.log("[API] Opening WebSocket connection:", wsUrl);
  
  // Create WebSocket
  const socket = new WebSocket(wsUrl);

  // Connection opened
  socket.onopen = () => {
    console.log("[API] WebSocket connection established");
  };

  // Message received
  socket.onmessage = (event) => {
    try {
      const { token } = JSON.parse(event.data);
      console.log("[API] Token received:", token.substring(0, 20) + (token.length > 20 ? "..." : ""));
      onToken(token);
    } catch (error) {
      console.error("[API] Error processing WebSocket message:", error);
    }
  };

  // Error handler
  socket.onerror = (event) => {
    console.error("[API] WebSocket error:", event);
  };

  // Connection closed
  socket.onclose = (event) => {
    console.log("[API] WebSocket closed, code:", event.code);
    onClose();
  };

  return socket;
}