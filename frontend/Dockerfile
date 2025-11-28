# Build stage
FROM node:20-alpine AS build

# Build arguments
ARG BUILD_DATE
ARG VERSION

WORKDIR /app

# Copy package files and install dependencies (cached layer)
COPY package*.json ./
RUN npm ci --quiet --no-audit --no-fund

# Copy source code and build
COPY . .
RUN npm run build

# Runtime stage
FROM nginx:alpine

# Metadata labels
LABEL maintainer="Price Wise Team"
LABEL version="${VERSION:-1.0.0}"
LABEL description="Price Wise Frontend - React SPA"
LABEL build-date="${BUILD_DATE}"

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create non-root user and set permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Switch to non-root user
USER nginx

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
