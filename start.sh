#!/bin/bash

# StreamIT - Start Docker Services Only
# You need to run server and client separately in different terminals

echo "🎬 Starting StreamIT Infrastructure..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL & LiveKit)..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to initialize..."
sleep 5

# Check if services are running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Docker services failed to start"
    docker-compose logs
    exit 1
fi

echo ""
echo "✅ Docker services are running!"
echo ""
echo "📍 Infrastructure Ready:"
echo "   PostgreSQL: localhost:5432"
echo "   LiveKit:    ws://localhost:7880"
echo ""
echo "🚀 Next Steps:"
echo ""
echo "   Terminal 2 - Start Backend:"
echo "   $ cd server && pnpm dev"
echo ""
echo "   Terminal 3 - Start Frontend:"
echo "   $ cd client && pnpm dev"
echo ""
echo "   Then open http://localhost:3000"
echo ""
echo "To stop Docker services: docker-compose down"
echo ""
