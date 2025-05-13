# backend/chat_handler.py

import os
import json
import asyncio
import openai
from typing import Optional
from dotenv import load_dotenv
import pathlib
from redis_client import get_redis, set_cache, get_cache

# Load environment variables
BASE_DIR = pathlib.Path(__file__).resolve().parent.parent
load_dotenv(dotenv_path=BASE_DIR / ".env")

# Configure OpenAI API
openai.api_key = os.getenv("OPENAI_API_KEY")
print(f"[LOG] OpenAI API key {'is set' if openai.api_key else 'not set'}")

# Cache settings
CACHE_TTL = 60 * 60  # 1 hour

async def generate_response(prompt: str) -> str:
    """
    Generate a response for the given prompt using OpenAI's API.
    Checks Redis cache first if available.
    """
    print(f"[LOG] Generating response for prompt: {prompt}")
    
    # Create cache key
    cache_key = f"chat_response:{prompt}"
    
    # Check cache first
    cached_response = await get_cache(cache_key)
    if cached_response:
        print("[LOG] Cache hit: returning cached response")
        return cached_response
    
    try:
        # Call OpenAI API
        print("[LOG] Cache miss: calling OpenAI API")
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=False
        )
        reply = response.choices[0].message.content
        print(f"[LOG] Received response from OpenAI API")
        
        # Cache the response
        await set_cache(cache_key, reply, CACHE_TTL)
        
        return reply
    except Exception as e:
        print(f"[ERROR] OpenAI API error: {str(e)}")
        # Fall back to demo response
        return f"Demo response for: '{prompt}'. (API error: {str(e)})"

async def stream_response(prompt: str):
    """
    Stream a response token by token using OpenAI's streaming API.
    Checks Redis cache first if available.
    """
    print(f"[LOG] Streaming response for prompt: {prompt}")
    
    # Create cache key
    cache_key = f"chat_stream:{prompt}"
    
    # Check cache
    cached_tokens = await get_cache(cache_key)
    if cached_tokens:
        print("[LOG] Cache hit: streaming cached tokens")
        tokens = json.loads(cached_tokens)
        for token in tokens:
            yield token
            await asyncio.sleep(0.02)  # Slightly delay tokens for realistic streaming
        return
    
    try:
        # Stream from OpenAI API
        print("[LOG] Cache miss: streaming from OpenAI API")
        tokens = []  # Collect tokens for caching
        
        response = await openai.ChatCompletion.acreate(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        
        async for chunk in response:
            token = chunk.choices[0].delta.get("content")
            if token:
                tokens.append(token)
                yield token
        
        # Cache the token list
        if tokens:
            await set_cache(cache_key, json.dumps(tokens), CACHE_TTL)
            
    except Exception as e:
        print(f"[ERROR] Streaming error: {str(e)}")
        # Fall back to demo response
        demo_response = f"Demo response for: '{prompt}'. (API error: {str(e)})"
        words = demo_response.split()
        for word in words:
            yield word + " "
            await asyncio.sleep(0.05)  # Simulate streaming