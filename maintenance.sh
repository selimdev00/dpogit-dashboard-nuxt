#!/bin/bash

###############################################################################
# Docker Maintenance Script for DPOGTI Dashboard
# This script performs routine Docker cleanup to prevent disk space issues
# Run weekly via cron: 0 2 * * 0 /path/to/maintenance.sh >> /var/log/docker-maintenance.log 2>&1
###############################################################################

set -e

echo "=========================================="
echo "Docker Maintenance - $(date)"
echo "=========================================="

# Navigate to project directory (update this path)
PROJECT_DIR="/var/www/dpogit-dashboard-nuxt"
cd "$PROJECT_DIR" || exit 1

# Check current disk usage before cleanup
echo ""
echo "📊 Docker disk usage BEFORE cleanup:"
docker system df

# Stop containers gracefully
echo ""
echo "🛑 Stopping containers..."
docker compose stop

# Clean up Docker resources
echo ""
echo "🧹 Cleaning up Docker resources..."

# Remove stopped containers
echo "  → Removing stopped containers..."
docker container prune -f

# Remove unused images (keep last 7 days)
echo "  → Removing unused images (older than 7 days)..."
docker image prune -af --filter "until=168h"

# Remove unused volumes (be careful with this!)
echo "  → Removing unused volumes..."
docker volume prune -f

# Remove unused networks
echo "  → Removing unused networks..."
docker network prune -f

# Remove build cache
echo "  → Removing build cache..."
docker builder prune -af --filter "until=168h"

# Show disk usage after cleanup
echo ""
echo "📊 Docker disk usage AFTER cleanup:"
docker system df

# Restart containers
echo ""
echo "🚀 Restarting containers..."
docker compose up -d

# Wait for health check
echo ""
echo "⏳ Waiting for health check..."
sleep 15

# Verify container is healthy
HEALTH_STATUS=$(docker inspect --format='{{.State.Health.Status}}' dpogti-dashboard 2>/dev/null || echo "no-health")
if [ "$HEALTH_STATUS" = "healthy" ] || [ "$HEALTH_STATUS" = "no-health" ]; then
  echo "✅ Container is running and healthy"
else
  echo "❌ Health check failed: $HEALTH_STATUS"
  echo "   Check logs with: docker compose logs dpogti_dashboard"
  exit 1
fi

echo ""
echo "✅ Maintenance complete!"
echo "=========================================="
