# Multi-stage Dockerfile for React Frontend with Nginx
# Stage 1: Build the React application
# Stage 2: Serve with Nginx

# ========================================
# Stage 1: Build Stage
# ========================================
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
# This layer will be cached unless package.json or package-lock.json changes
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the React app for production
# The build will use .env.production for environment variables
RUN npm run build

# ========================================
# Stage 2: Production Stage with Nginx
# ========================================
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built React app from build stage to Nginx html directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 for HTTP traffic
EXPOSE 80

# Health check to ensure Nginx is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]

# ========================================
# Future HTTPS Setup Instructions
# ========================================
# To add HTTPS support with Certbot:
# 
# Option 1: Use Certbot in a separate container (Recommended for Docker)
# - Add certbot service to docker-compose.yml
# - Mount /etc/letsencrypt volume to this container
# - Run certbot certonly --webroot in certbot container
#
# Option 2: Install Certbot on the host machine
# - Install certbot on your server
# - Run: certbot certonly --webroot -w /var/www/html -d yourdomain.com
# - Mount certificate directory to container: -v /etc/letsencrypt:/etc/letsencrypt:ro
# - Update nginx.conf to use SSL certificates
#
# After obtaining certificates, expose port 443:
# EXPOSE 443
