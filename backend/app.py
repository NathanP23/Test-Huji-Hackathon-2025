# backend/app.py

import os
import json
from fastapi import FastAPI, HTTPException, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chat_handler import generate_response, stream_response

# Initialize FastAPI app
app = FastAPI(title="LLM Real-Time Chat API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development - in production you should limit this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load environment variables and check for OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    print("[ERROR] Missing OPENAI_API_KEY environment variable")

# Define request/response models
class ChatRequest(BaseModel):
    prompt: str

class ChatResponse(BaseModel):
    response: str

# Health check endpoint
@app.get("/")
async def health_check():
    """API health check endpoint"""
    print("[LOG] Health check endpoint called")
    return {"status": "ok", "version": "1.0.0"}

# REST API endpoint for non-streaming responses
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Process chat request and return a complete response
    """
    print(f"[LOG] POST /chat received prompt: {req.prompt}")
    try:
        result = await generate_response(req.prompt)
        print(f"[LOG] Generated response of length: {len(result)}")
        return ChatResponse(response=result)
    except Exception as e:
        print(f"[ERROR] Chat endpoint error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket endpoint for streaming responses
@app.websocket("/chat/ws")
async def chat_ws(websocket: WebSocket):
    """
    Handle WebSocket connection for streaming token-by-token responses
    """
    # Get origin for CORS
    client_origin = websocket.headers.get("origin", "http://localhost:3000")
    
    # Accept the WebSocket connection
    await websocket.accept(
        headers=[(b"access-control-allow-origin", client_origin.encode())]
    )
    print(f"[LOG] WebSocket connection accepted from origin: {client_origin}")
    
    # Get prompt from query parameters
    prompt = websocket.query_params.get("prompt")
    if not prompt:
        print("[ERROR] Missing prompt parameter in WebSocket request")
        await websocket.close(code=1003)
        return
    
    print(f"[LOG] WebSocket streaming for prompt: {prompt}")
    try:
        # Stream tokens to the client
        async for token in stream_response(prompt):
            await websocket.send_text(json.dumps({"token": token}))
    except Exception as e:
        print(f"[ERROR] WebSocket streaming error: {str(e)}")
        await websocket.send_text(json.dumps({"token": "[stream error]"}))
        await websocket.close(code=1011)
    else:
        print("[LOG] WebSocket streaming completed successfully")
        await websocket.close(code=1000)