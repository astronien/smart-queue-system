# Smart Queue Server

Backend server for Smart Queue System with WebSocket support.

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database credentials

# Setup database
npm run db:generate
npm run db:push

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm start
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@localhost:5432/smartqueue"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
GEMINI_API_KEY=your_api_key
```

## API Documentation

See [BACKEND_SETUP.md](../BACKEND_SETUP.md) for full API documentation.

## Tech Stack

- Node.js + Express
- Socket.IO
- Prisma + PostgreSQL
- TypeScript
