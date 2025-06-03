# LLM-Powered Real-Time Chat Application

A demo project for the **2025 Hackathon at The Hebrew University of Jerusalem**.
This is a real-time chat application demonstrating LLM integration with streaming responses, Redis caching, and a modern React frontend.

## Features

* **Real-time Streaming**: Responses appear word by word using WebSockets
* **Redis Caching**: Reduces API calls and improves response times
* **OpenAI Integration**: Uses the OpenAI API for intelligent responses
* **Clean UI**: Built with Next.js for a responsive, minimalist chat interface

## Project Structure

```
/
├── backend/
│   ├── app.py               # FastAPI application endpoints
│   ├── chat_handler.py      # LLM response generation & streaming
│   ├── redis_client.py      # Redis cache functionality
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile           # Backend container configuration
├── frontend/
│   ├── components/
│   │   ├── ChatWindow.tsx   # Chat message display component
│   │   └── MessageInput.tsx # User input component
│   ├── pages/
│   │   └── index.tsx        # Main chat page
│   ├── styles/
│   │   └── globals.css      # Global styles
│   ├── utils/
│   │   └── api.ts           # API and WebSocket utilities
│   ├── next.config.js       # Next.js configuration
│   └── package.json         # Frontend dependencies
├── docker-compose.yml       # Development environment setup
└── README.md                # Project documentation
```

## Setup Instructions

### Prerequisites

* Python 3.9+
* Node.js 16+
* Docker and Docker Compose
* OpenAI API Key

### Configuration

Create a `.env` file in the project root:

```
OPENAI_API_KEY=your_openai_api_key
REDIS_URL=redis://localhost:6379/0
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

### Installation Steps

1. **Install backend dependencies**:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Install frontend dependencies**:

   ```bash
   cd frontend
   npm install
   ```

3. **Run with Docker** (from project root):

   ```bash
   docker-compose up -d
   ```

4. **Run frontend in dev mode**:

   ```bash
   cd frontend
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to use the app.
API docs available at [http://localhost:8000/docs](http://localhost:8000/docs)
