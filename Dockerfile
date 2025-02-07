# Build stage
FROM node:20-slim as builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application with default values
ARG VITE_API_URL
ARG VITE_SIGNUP_ENABLED
ARG VITE_REQUIRE_INVITE_CODE

ENV VITE_API_URL=${VITE_API_URL:-http://localhost:8000}
ENV VITE_SIGNUP_ENABLED=${VITE_SIGNUP_ENABLED:-false}
ENV VITE_REQUIRE_INVITE_CODE=${VITE_REQUIRE_INVITE_CODE:-false}

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy env.sh script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]