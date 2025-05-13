# backend/redis_client.py

import redis.asyncio as aioredis
import os

# Get Redis URL from environment variables
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

# Global Redis client instance
_redis_client = None

async def get_redis() -> aioredis.Redis:
    """
    Returns a Redis client instance, creating it if necessary.
    Uses connection pooling for efficiency.
    """
    global _redis_client
    
    if _redis_client is None:
        print(f"[LOG] Creating Redis client for {REDIS_URL}")
        _redis_client = aioredis.from_url(
            REDIS_URL,
            encoding="utf-8",
            decode_responses=True
        )
        
        # Test connection
        try:
            pong = await _redis_client.ping()
            print(f"[LOG] Redis connection successful: {pong}")
        except Exception as e:
            print(f"[ERROR] Redis connection failed: {str(e)}")
            print("[LOG] Will continue without Redis caching")
    
    return _redis_client

async def set_cache(key: str, value: str, expiry: int = 3600):
    """
    Store value in Redis cache with expiration time.
    Falls back gracefully if Redis is unavailable.
    """
    try:
        redis = await get_redis()
        await redis.set(key, value, ex=expiry)
        return True
    except Exception as e:
        print(f"[ERROR] Redis cache set failed: {str(e)}")
        return False

async def get_cache(key: str):
    """
    Retrieve value from Redis cache.
    Returns None if key doesn't exist or Redis is unavailable.
    """
    try:
        redis = await get_redis()
        return await redis.get(key)
    except Exception as e:
        print(f"[ERROR] Redis cache get failed: {str(e)}")
        return None