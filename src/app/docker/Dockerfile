# Multi-stage build for smaller image size and better resource management
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

# Set memory limit for Node.js (384MB for 2GB server)
ENV NODE_OPTIONS="--max-old-space-size=384"

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/package*.json /app/

# Create non-root user for security
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