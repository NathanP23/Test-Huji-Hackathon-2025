# Deployment Guide

This guide will walk you through deploying the LLM Chat application to free cloud services.

## Overview

The application consists of two main parts that need to be deployed separately:

1. **Backend**: FastAPI server + Redis (deployed to Render)
2. **Frontend**: Next.js application (deployed to Vercel or Render)

## Backend Deployment (Render)

### 1. Deploy Redis Database

1. Create a [Render](https://render.com) account if you don't have one
2. In your Render dashboard, click "New" and select "Redis"
3. Enter details:
   - Name: `llm-chat-redis`
   - Leave other settings as default
4. Click "Create Redis"
5. Once created, note the "Internal Database URL" - you'll need this for the backend 

### 2. Deploy FastAPI Backend

1. In your Render dashboard, click "New" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `llm-chat-backend`
   - Root Directory: `backend`
   - Runtime: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app:app --host 0.0.0.0 --port $PORT`
4. Add environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `REDIS_URL`: Your Redis URL from the previous step
5. Click "Create Web Service"

### 3. Test Backend Deployment

- Once deployed, test your API at `https://your-backend-name.onrender.com`
- The health check endpoint at `/` should return `{"status": "ok"}`
- The API documentation is available at `/docs`

## Frontend Deployment (Vercel)

### Option 1: Deploy to Vercel (Recommended for Next.js)

1. Create a [Vercel](https://vercel.com) account if you don't have one
2. From the Vercel dashboard, click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend`
5. Add environment variables:
   - `NEXT_PUBLIC_API_BASE`: Your backend URL (e.g., `https://your-backend-name.onrender.com`)
6. Click "Deploy"

### Option 2: Deploy to Render

1. In your Render dashboard, click "New" and select "Static Site"
2. Connect your GitHub repository
3. Configure the service:
   - Name: `llm-chat-frontend`
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build && npm run export`
   - Publish Directory: `out`
4. Add environment variables:
   - `NEXT_PUBLIC_API_BASE`: Your backend URL
5. Click "Create Static Site"

## Updating the WebSocket Connection

By default, WebSockets use `ws://` protocol, but in deployed environments, you need to use `wss://`. Make sure your frontend code handles this correctly.

In the `frontend/utils/api.ts` file, the WebSocket URL should be constructed like this:

```typescript
const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsUrl = `${protocol}://${API_BASE.replace('http://', '').replace('https://', '')}/chat/ws?prompt=${encodeURIComponent(prompt)}`;
```

## Troubleshooting

### CORS Issues

If you encounter CORS issues, you may need to update your FastAPI backend to allow your frontend domain:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### WebSocket Connection Issues

If WebSocket connections fail, check:
1. That you're using `wss://` protocol in production
2. That your backend supports WebSocket connections
3. That your backend accepts WebSocket connections from your frontend domain

### Environment Variables

Double-check all environment variables in both services:
- Backend: `OPENAI_API_KEY`, `REDIS_URL`
- Frontend: `NEXT_PUBLIC_API_BASE`

## Free Tier Limitations

Be aware of the limitations of free tiers:

- **Render**:
  - Free instances spin down after inactivity
  - Limited computing resources
  - Free Redis instances have storage limitations

- **Vercel**:
  - Limited serverless function execution time
  - Limited build minutes per month

For serious production use, consider upgrading to paid tiers.