# React Frontend Deployment Guide

Complete guide for deploying the React frontend with Nginx and connecting to a Spring Boot backend.

## Table of Contents
- [Environment Configuration](#environment-configuration)
- [Local Development](#local-development)
- [Production Build](#production-build)
- [Docker Deployment](#docker-deployment)
- [Nginx Configuration](#nginx-configuration)
- [HTTPS Setup](#https-setup)
- [Troubleshooting](#troubleshooting)

---

## Environment Configuration

### Environment Variables

The application uses `REACT_APP_API_URL` to configure the backend API endpoint.

**Files:**
- `.env` - Local development configuration
- `.env.production` - Production build configuration

### Local Development (`.env`)
```env
REACT_APP_API_URL=http://localhost:8080
```

### Production (`.env.production`)
```env
REACT_APP_API_URL=https://api.yourdomain.com
```

> **Important:** Update `.env.production` with your actual production API URL before building for production.

---

## Local Development

### Prerequisites
- Node.js 16+ and npm
- Spring Boot backend running on port 8080

### Steps

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:8080

The app will automatically reload when you make changes. All API calls will use `http://localhost:8080` as configured in `.env`.

---

## Production Build

### Build the Application

```bash
npm run build
```

This command:
- Uses environment variables from `.env.production`
- Creates optimized production bundle in `build/` directory
- Minifies JavaScript, CSS, and HTML
- Generates source maps

### Build Output

```
build/
├── index.html           # Main HTML file
├── static/
│   ├── css/            # Minified stylesheets
│   ├── js/             # Minified JavaScript bundles
│   └── media/          # Images, fonts, etc.
└── asset-manifest.json # Build metadata
```

### Test Production Build Locally

```bash
# Install serve globally if you haven't
npm install -g serve

# Serve the build folder
serve -s build -l 3000
```

Access at http://localhost:3000

---

## Docker Deployment

### Build Docker Image

```bash
docker build -t react-frontend:latest .
```

**Build process:**
1. Stage 1: Installs dependencies and builds React app
2. Stage 2: Copies build to Nginx Alpine image

### Run Docker Container

#### Standalone (without backend)
```bash
docker run -d \
  --name react-frontend \
  -p 80:80 \
  react-frontend:latest
```

#### With Docker Network (connecting to backend)
```bash
# Create a network
docker network create app-network

# Run backend container (example)
docker run -d \
  --name backend \
  --network app-network \
  -p 8080:8080 \
  your-backend-image:latest

# Run frontend container
docker run -d \
  --name react-frontend \
  --network app-network \
  -p 80:80 \
  react-frontend:latest
```

> **Note:** The Nginx config expects the backend service to be accessible at `http://backend:8080`. Adjust `nginx.conf` if your backend has a different hostname.

### Docker Compose (Recommended)

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  backend:
    image: your-backend-image:latest
    container_name: backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
    networks:
      - app-network

  frontend:
    image: react-frontend:latest
    container_name: react-frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

Run with:
```bash
docker-compose up -d
```

---

## Nginx Configuration

### Key Features

The `nginx.conf` file includes:

- **Static file serving** from `/usr/share/nginx/html`
- **API proxy** - Forwards `/api/*` requests to `http://backend:8080`
- **Gzip compression** for performance
- **Security headers** (X-Content-Type-Options, X-Frame-Options, etc.)
- **SPA routing support** - All routes fall back to `index.html`
- **Caching strategy** - Static files cached for 1 year

### Customization

#### Change Backend URL

Edit `nginx.conf`, line ~30:
```nginx
location /api/ {
    proxy_pass http://your-backend-host:8080;
    # ... rest of proxy configuration
}
```

#### Add Custom Domain

Edit `nginx.conf`, line ~8:
```nginx
server_name yourdomain.com www.yourdomain.com;
```

---

## HTTPS Setup

### Option 1: Using Certbot with Docker

1. **Update `docker-compose.yml` to add Certbot:**

```yaml
services:
  # ... existing services ...
  
  certbot:
    image: certbot/certbot
    container_name: certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot -w /var/www/certbot --email your-email@example.com -d yourdomain.com --agree-tos
```

2. **Mount certificates in frontend service:**

```yaml
  frontend:
    # ... existing config ...
    volumes:
      - ./certbot/conf:/etc/letsencrypt:ro
    ports:
      - "80:80"
      - "443:443"
```

3. **Update `nginx.conf`** to enable HTTPS (uncomment the SSL section at the bottom)

### Option 2: Using Certbot on Host

If running Nginx directly on the server:

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically update your nginx.conf
```

### Auto-renewal

Certbot certificates expire after 90 days. Set up auto-renewal:

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job
sudo crontab -e

# Add this line (runs twice daily)
0 12 * * * /usr/bin/certbot renew --quiet
```

---

## Troubleshooting

### API Calls Fail (CORS Errors)

**Symptom:** Browser console shows CORS errors

**Solution:**
1. Ensure Spring Boot backend has CORS configured:
   ```java
   @Configuration
   public class WebConfig {
       @Bean
       public WebMvcConfigurer corsConfigurer() {
           return new WebMvcConfigurer() {
               @Override
               public void addCorsMappings(CorsRegistry registry) {
                   registry.addMapping("/api/**")
                       .allowedOrigins("http://localhost:3000", "https://yourdomain.com")
                       .allowedMethods("GET", "POST", "PUT", "DELETE");
               }
           };
       }
   }
   ```

2. If using Nginx proxy, CORS is bypassed (requests appear to come from same origin)

### 404 on Page Refresh

**Symptom:** Direct navigation to routes like `/courses` returns 404

**Solution:** Already handled by `nginx.conf`:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### Cannot Connect to Backend

**Symptom:** API requests timeout or return connection refused

**Docker Solution:**
- Ensure containers are on the same network
- Backend service name must match proxy_pass host in `nginx.conf`
- Check backend container logs: `docker logs backend`

**Non-Docker Solution:**
- Verify backend is running: `curl http://localhost:8080/api/health`
- Check firewall rules
- Update `nginx.conf` with correct backend IP/hostname

### Build Fails - Module Not Found

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Docker Image Too Large

**Solution:**
- Ensure `.dockerignore` is present (already created)
- Use multi-stage build (already implemented in Dockerfile)
- Current image should be ~50MB (Nginx Alpine + build artifacts)

---

## Environment Summary

| Environment | API URL | Access URL | Configuration |
|-------------|---------|------------|---------------|
| **Development** | `http://localhost:8080` | `http://localhost:3000` | `.env` |
| **Production** | `https://api.yourdomain.com` | `https://yourdomain.com` | `.env.production` |
| **Docker Local** | `http://backend:8080` | `http://localhost` | Built from `.env.production` |

---

## Next Steps

1. ✅ Update `.env.production` with your production API URL
2. ✅ Build Docker image: `docker build -t react-frontend .`
3. ✅ Test locally: `docker run -p 80:80 react-frontend`
4. ✅ Deploy to production server
5. ✅ Configure domain DNS to point to your server
6. ✅ Set up HTTPS with Certbot
7. ✅ Set up monitoring and logging

---

## Support

For issues related to:
- **React Build:** Check console output, ensure Node.js 16+
- **Docker:** Verify Docker installation with `docker --version`
- **Nginx:** Check logs with `docker logs react-frontend`
- **SSL/HTTPS:** Review Certbot logs in `/var/log/letsencrypt/`
