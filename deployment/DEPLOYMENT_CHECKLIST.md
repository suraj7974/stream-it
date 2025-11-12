# StreamIT Production Deployment Checklist

## Prerequisites

- DigitalOcean Droplet (Ubuntu)
- Domain name (e.g., streamit-suraj.duckdns.org)
- Git installed on server

## 1. Initial Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git nginx postgresql docker.io docker-compose certbot python3-certbot-nginx

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2
npm install -g pm2
```

## 2. Clone Repository

```bash
# Create project directory
sudo mkdir -p /var/www
cd /var/www

# Clone repository
sudo git clone https://github.com/suraj7974/stream-it.git streamIT
sudo chown -R $USER:$USER /var/www/streamIT
cd streamIT
```

## 3. Database Setup

```bash
# Start PostgreSQL with Docker
cd /var/www/streamIT
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
sleep 10

# Run database migrations
cd server
pnpm install
npx prisma migrate deploy
```

## 4. Backend Setup

```bash
cd /var/www/streamIT/server

# Install dependencies
pnpm install

# Create .env file (use deployment/server.env.example as template)
cp ../deployment/server.env.example .env
nano .env
# Update DATABASE_URL, LIVEKIT secrets, and FRONTEND_URL

# Build backend
pnpm build

# Start with PM2
pm2 start dist/index.js --name streamit-backend
pm2 save
pm2 startup
```

## 5. Frontend Setup

```bash
cd /var/www/streamIT/client

# Install dependencies
pnpm install

# Create .env file (use deployment/client.env.example as template)
cp ../deployment/client.env.example .env
nano .env
# Update VITE_API_URL and VITE_LIVEKIT_URL with your domain

# Build frontend
pnpm build

# Set permissions
sudo chmod -R 755 dist
```

## 6. LiveKit Setup

```bash
cd /var/www/streamIT

# Verify livekit.yaml has correct node_ip
nano services/livekit/livekit.yaml
# Set node_ip to your droplet's public IP

# Start LiveKit
docker-compose up -d livekit

# Verify it's running
docker ps
docker logs streamit-livekit
```

## 7. Nginx Configuration

```bash
# Copy nginx config
sudo cp /var/www/streamIT/deployment/nginx-streamit.conf /etc/nginx/sites-available/streamit

# Update domain name in config
sudo nano /etc/nginx/sites-available/streamit
# Replace streamit-suraj.duckdns.org with your domain

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Enable streamit site
sudo ln -s /etc/nginx/sites-available/streamit /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Don't start nginx yet - wait for SSL
```

## 8. SSL Certificate (Certbot)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d your-domain.duckdns.org

# Follow prompts:
# - Enter email for renewal notifications
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (option 2)

# Verify auto-renewal
sudo certbot renew --dry-run
```

## 9. Firewall Configuration

```bash
# Check if UFW is active
sudo ufw status

# If active, allow necessary ports OR disable it (recommended with DigitalOcean Firewall)
sudo ufw disable

# Configure DigitalOcean Cloud Firewall (see FIREWALL_RULES.md)
```

## 10. Final Verification

```bash
# Check all services
docker ps                           # Should show postgres and livekit
pm2 status                          # Should show streamit-backend
sudo systemctl status nginx         # Should be active

# Test endpoints
curl http://localhost:5000/api/health
curl https://your-domain.duckdns.org/api/health

# Check logs
pm2 logs streamit-backend --lines 20
docker logs streamit-livekit --tail 20
sudo tail -f /var/log/nginx/error.log
```

## 11. Domain Configuration

### Using DuckDNS:

1. Go to https://www.duckdns.org
2. Sign in with GitHub/Google
3. Create subdomain (e.g., streamit-yourname)
4. Set IPv4 to your droplet IP (e.g., 143.110.242.132)
5. Leave IPv6 blank
6. Click "update ip"

## 12. Updates and Maintenance

```bash
# Update code
cd /var/www/streamIT
git pull origin main

# Update backend
cd server
pnpm install
pnpm build
pm2 restart streamit-backend

# Update frontend
cd ../client
pnpm install
pnpm build

# Restart services if needed
docker-compose restart livekit
sudo systemctl reload nginx
```

## Troubleshooting

### Backend not responding

```bash
pm2 logs streamit-backend --lines 50
pm2 restart streamit-backend
```

### Frontend 403 error

```bash
sudo chmod -R 755 /var/www/streamIT/client/dist
sudo systemctl reload nginx
```

### LiveKit connection issues

```bash
docker logs streamit-livekit --tail 50
# Verify node_ip is set to public IP in livekit.yaml
# Check firewall allows UDP 50000-60000
```

### Database connection errors

```bash
docker ps | grep postgres
docker logs streamit-postgres
# Verify DATABASE_URL in server/.env
```

## Security Improvements

1. Generate strong LiveKit secrets:

```bash
openssl rand -hex 32
```

2. Update secrets in:

   - `/var/www/streamIT/services/livekit/livekit.yaml`
   - `/var/www/streamIT/server/.env`

3. Restart services:

```bash
docker-compose restart livekit
pm2 restart streamit-backend
```

4. Change PostgreSQL password in docker-compose.yml

5. Enable automatic security updates:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## Monitoring

```bash
# View real-time logs
pm2 monit

# View system resources
htop

# View nginx access logs
sudo tail -f /var/log/nginx/access.log
```
