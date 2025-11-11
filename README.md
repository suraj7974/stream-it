# StreamIT - Audio & Video Calling Platform

A local-only streaming and communication platform built for audio/video calls using React, Express, LiveKit, and PostgreSQL.

## 🚀 Features

- ✅ High-quality audio calls
- ✅ HD video conferencing
- ✅ Screen sharing capability
- ✅ Multi-participant support
- ✅ 100% local deployment (no cloud required)

## 📁 Project Structure

```
streamIT/
├── client/              # React frontend (Vite)
├── server/              # Express backend
├── services/            # Service configurations
│   └── livekit/        # LiveKit config
├── database/            # Prisma schema
├── docker-compose.yml   # Docker services
└── README.md
```

## 🛠️ Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker & Docker Compose
- PostgreSQL (via Docker)

## 📦 Installation

### 1. Start Docker Services (PostgreSQL & LiveKit)

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on `localhost:5432`
- LiveKit on `localhost:7880`

### 2. Setup Server

```bash
cd server

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Generate Prisma client
pnpm prisma:generate

# Run database migrations
pnpm prisma:migrate

# Start development server
pnpm dev
```

Server will run on `http://localhost:5000`

### 3. Setup Client

```bash
cd client

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development server
pnpm dev
```

Client will run on `http://localhost:3000`

## 🎯 Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Choose either **Audio Call** or **Video Call**
3. Enter a **Room Name** and your **Name**
4. Click **Join Room**
5. Share the room name with others to join the same call!

## 🔧 Environment Variables

### Server (.env)

```env
PORT=5000
DATABASE_URL="postgresql://streamit:streamit@localhost:5432/streamit?schema=public"
LIVEKIT_URL=ws://localhost:7880
LIVEKIT_API_KEY=devkey
LIVEKIT_API_SECRET=secret
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
VITE_LIVEKIT_URL=ws://localhost:7880
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Restart services
docker-compose restart
```

## 📚 API Endpoints

### POST /api/call/token

Generate LiveKit token for joining a room

**Request:**

```json
{
  "roomName": "my-room",
  "participantName": "John Doe"
}
```

**Response:**

```json
{
  "token": "eyJhbGc...",
  "url": "ws://localhost:7880",
  "roomName": "my-room",
  "participantName": "John Doe"
}
```

### GET /api/call/rooms

Get list of active rooms (requires LiveKit webhook integration)

## 🎨 Technology Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Backend:** Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **WebRTC:** LiveKit
- **Styling:** CSS3
- **Package Manager:** pnpm

## 🔮 Future Features (Streaming Implementation)

After the calling features are stable, we'll add:

- 📹 VOD (Video on Demand) streaming
- 🔴 Live streaming (RTMP → HLS)
- 📺 HLS video player
- 🎬 Video upload and processing with FFmpeg

## 🐛 Troubleshooting

### Port Already in Use

If ports are already in use, update the port numbers in:

- `docker-compose.yml`
- `server/.env`
- `client/.env`
- `vite.config.ts`

### LiveKit Connection Issues

1. Ensure Docker services are running: `docker-compose ps`
2. Check LiveKit logs: `docker-compose logs livekit`
3. Verify WebSocket URL in `.env` files

### Database Connection Issues

1. Check PostgreSQL is running: `docker-compose ps postgres`
2. Verify DATABASE_URL in `server/.env`
3. Run migrations: `cd server && pnpm prisma:migrate`

## 📄 License

ISC

## 👨‍💻 Author

Your Name

Suraj Patel

**Happy Calling! 🎉**
