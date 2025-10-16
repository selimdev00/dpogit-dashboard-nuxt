# Docker Optimization Guide for Nuxt Project
## Server Specs: 1vCPU / 2GB RAM

---

## 1. Docker Daemon Configuration

Create or edit `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  },
  "max-concurrent-downloads": 2,
  "max-concurrent-uploads": 2,
  "default-shm-size": "64M",
  "userland-proxy": false,
  "live-restore": true,
  "iptables": true
}
```

Apply changes:
```bash
sudo systemctl restart docker
```

---

## 2. Optimized Dockerfile for Nuxt

```dockerfile
# Multi-stage build for smaller image size
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with production flag during build
RUN npm ci --prefer-offline --no-audit

# Copy source code
COPY . .

# Build the Nuxt app
RUN npm run build

# Production stage
FROM node:20-alpine

# Set NODE_ENV to production
ENV NODE_ENV=production

# Set memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=384"

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nuxtjs -u 1001 && \
    chown -R nuxtjs:nodejs /app

# Switch to non-root user
USER nuxtjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["node", ".output/server/index.mjs"]
```

---

## 3. Optimized docker-compose.yml

```yaml
version: '3.8'

services:
  nuxt-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: nuxt-app
    restart: unless-stopped
    
    # Resource limits for 2GB RAM server
    deploy:
      resources:
        limits:
          cpus: '0.8'
          memory: 768M
        reservations:
          cpus: '0.3'
          memory: 384M
    
    # Logging configuration
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
    
    # Environment variables
    environment:
      - NODE_ENV=production
      - PORT=3000
      - HOST=0.0.0.0
    
    # Port mapping
    ports:
      - "3000:3000"
    
    # Health check
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 40s
    
    # Security options
    security_opt:
      - no-new-privileges:true
    
    # Read-only root filesystem (optional, may need adjustment)
    # read_only: true
    # tmpfs:
    #   - /tmp
    #   - /app/.nuxt

networks:
  default:
    driver: bridge
```

---

## 4. Nuxt Configuration Optimizations

Add to your `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // Enable production optimizations
  devtools: { enabled: false },
  
  // Minimize bundle size
  optimization: {
    minimize: true,
  },
  
  // Optimize images
  image: {
    formats: ['webp', 'avif'],
    quality: 80,
  },
  
  // Enable compression
  nitro: {
    compressPublicAssets: true,
    minify: true,
    
    // Reduce memory usage
    experimental: {
      wasm: false,
    },
  },
  
  // Disable source maps in production
  sourcemap: {
    server: false,
    client: false,
  },
  
  // Optimize rendering
  experimental: {
    payloadExtraction: false,
  },
})
```

---

## 5. .dockerignore File

Create `.dockerignore` to reduce build context:

```
node_modules
npm-debug.log
.nuxt
.output
.git
.gitignore
README.md
.env
.env.*
!.env.example
*.md
.vscode
.idea
dist
coverage
.DS_Store
```

---

## 6. System Setup Commands

```bash
# Enable swap with low swappiness (if not already enabled)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Configure system limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf
```

---

## 7. Build and Deploy Commands

```bash
# Build the image
docker-compose build --no-cache

# Start the container
docker-compose up -d

# Check logs
docker-compose logs -f

# Monitor resources
docker stats nuxt-app

# View container health
docker inspect --format='{{.State.Health.Status}}' nuxt-app
```

---

## 8. Maintenance Scripts

Create a `maintenance.sh` script:

```bash
#!/bin/bash

# Clean up Docker resources
echo "Cleaning up Docker resources..."
docker system prune -af --volumes

# Remove unused images
docker image prune -af

# Show disk usage
echo "Docker disk usage:"
docker system df

# Restart containers
echo "Restarting containers..."
docker-compose restart

echo "Maintenance complete!"
```

Make it executable:
```bash
chmod +x maintenance.sh
```

Run weekly via cron:
```bash
# Add to crontab (crontab -e)
0 2 * * 0 /path/to/maintenance.sh >> /var/log/docker-maintenance.log 2>&1
```

---

## 9. Monitoring Commands

```bash
# Real-time resource monitoring
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"

# Check container health
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# View logs with timestamps
docker-compose logs --tail=100 -f --timestamps

# Check disk usage
docker system df -v
```

---

## 10. Performance Tips

### Memory Optimization
- Use Alpine-based Node images (saves ~200MB)
- Multi-stage builds to minimize final image size
- Set `NODE_OPTIONS="--max-old-space-size=384"` to limit Node.js heap
- Enable compression in Nuxt config

### CPU Optimization
- Limit concurrent builds with `max-concurrent-downloads: 2`
- Use `cpus` limits in docker-compose
- Enable `live-restore` to avoid downtime during Docker updates

### Build Optimization
- Use `.dockerignore` to reduce build context
- Cache npm dependencies in separate layer
- Use `npm ci` instead of `npm install` for faster, reproducible builds

### Runtime Optimization
- Run as non-root user for security
- Disable source maps in production
- Enable gzip/brotli compression
- Use health checks to ensure service availability

---

## 11. Troubleshooting

### Out of Memory (OOM) Errors
```bash
# Check kernel logs
dmesg | grep -i kill

# Increase swap or reduce memory limits
# Restart with lower memory allocation
docker-compose down
# Edit memory limits in docker-compose.yml
docker-compose up -d
```

### Container Won't Start
```bash
# Check logs
docker-compose logs nuxt-app

# Verify resource availability
free -h
docker system df

# Rebuild without cache
docker-compose build --no-cache
```

### Slow Performance
```bash
# Check resource usage
docker stats

# Verify swap is active
swapon --show

# Check for CPU throttling
cat /sys/fs/cgroup/cpu/docker/*/cpu.stat
```

---

## 12. Resource Allocation Summary

For a 2GB RAM server running Nuxt:

| Component | Memory | CPU |
|-----------|---------|-----|
| Host OS | ~500MB | 0.2 |
| Docker Daemon | ~200MB | 0.1 |
| Nuxt Container | 768MB (limit) | 0.8 |
| Buffer | ~532MB | - |

**Important**: Keep at least 500MB free for system operations and swap.

---

## Quick Start Checklist

- [ ] Apply Docker daemon configuration
- [ ] Enable and configure swap
- [ ] Create optimized Dockerfile
- [ ] Configure docker-compose.yml with resource limits
- [ ] Add .dockerignore file
- [ ] Optimize nuxt.config.ts
- [ ] Build and test locally
- [ ] Deploy to server
- [ ] Set up monitoring
- [ ] Schedule weekly maintenance
- [ ] Test health checks

---

**Last Updated**: October 2025  
**Tested on**: Ubuntu 22.04 LTS, Docker 24.x, Node.js 20.x, Nuxt 3.x