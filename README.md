# LLM-Powered Real-Time Chat Application

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub issues](https://img.shields.io/github/issues/your-username/llm-chat-app)](https://github.com/your-username/llm-chat-app/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://makeapullrequest.com)

A real-time chat application demonstrating LLM integration with streaming responses, Redis caching, and a modern React frontend.

## Features

- **Real-time Streaming**: Responses appear word by word through WebSockets
- **Redis Caching**: Reduces API calls and improves response times
- **OpenAI Integration**: Uses OpenAI API for intelligent responses
- **Clean UI**: Simple and responsive chat interface

## Live Demo

Check out the live demo: [LLM Chat App](https://your-app-name.onrender.com)

## Setup Guide

This guide will walk you through setting up the project with its existing structure.

### Prerequisites

- Python 3.9+ 
- Node.js 16+
- Docker and Docker Compose
- OpenAI API Key

### Project Structure

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

### Setup Instructions

1. **Create a `.env` file** in the project root:
   ```
   OPENAI_API_KEY=your_openai_api_key
   REDIS_URL=redis://localhost:6379/0
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

2. **Install backend dependencies** (optional if using Docker):
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

### Running the Application

1. **Start the backend services with Docker**:
   ```bash
   # From the project root
   docker-compose up -d
   ```
   
   This starts:
   - Redis server for caching
   - FastAPI backend server

2. **Start the frontend development server**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**:
   Open [http://localhost:3000](http://localhost:3000) in your browser

4. **Testing the backend API**:
   - API documentation is available at [http://localhost:8000/docs](http://localhost:8000/docs)
   - Health check at [http://localhost:8000](http://localhost:8000)

### Troubleshooting

- **Redis Connection Issues**: If you see Redis connection errors, ensure the Redis service is running: `docker ps | grep redis`
- **OpenAI API Errors**: Verify your API key is correct and has sufficient quota
- **Frontend Connection Issues**: Check that `NEXT_PUBLIC_API_BASE` is set correctly in your `.env` file

### Developer Notes

- **API Keys**: Remember to never commit your `.env` file with API keys
- **Docker Volumes**: Redis data is persisted in a Docker volume named `redis_data`
- **OpenAI Models**: The application uses gpt-3.5-turbo by default. You can modify the model in `chat_handler.py`
- **Frontend Hot Reloading**: Any changes to frontend files will automatically reload in development mode

## Deployment

The application is deployed using the following services:

- **Backend**: [Render](https://render.com) (Web Service + Redis)
- **Frontend**: [Vercel](https://vercel.com) (Next.js)

### Deployment Instructions

Detailed deployment instructions are available in the [DEPLOYMENT.md](DEPLOYMENT.md) file.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [OpenAI](https://openai.com) for their powerful API
- [FastAPI](https://fastapi.tiangolo.com/) for the efficient backend framework
- [Next.js](https://nextjs.org/) for the frontend framework