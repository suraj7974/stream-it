#!/bin/bash

# StreamIT Quick Setup Script
echo "🚀 Setting up StreamIT..."

# Start Docker services
echo "📦 Starting Docker services (PostgreSQL & LiveKit)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 5

# Setup Server
echo "🔧 Setting up server..."
cd server

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created server .env file"
fi

# Install dependencies
echo "📥 Installing server dependencies..."
pnpm install

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpm prisma:generate

# Run migrations
echo "🗄️  Running database migrations..."
pnpm prisma:migrate

cd ..

# Setup Client
echo "🎨 Setting up client..."
cd client

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created client .env file"
fi

# Install dependencies (if not already done)
if [ ! -d node_modules ]; then
    echo "📥 Installing client dependencies..."
    pnpm install
fi

cd ..

echo ""
echo "✨ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Terminal 1 - Start server: cd server && pnpm dev"
echo "2. Terminal 2 - Start client: cd client && pnpm dev"
echo ""
echo "Then open http://localhost:3000 in your browser"
echo ""
