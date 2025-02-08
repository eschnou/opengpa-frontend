# Build stage
FROM node:20-slim AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .

# Define build arguments with default values
ARG VITE_API_URL=http://localhost:3000
ARG VITE_SIGNUP_ENABLED=true
ARG VITE_REQUIRE_INVITE_CODE=false

# Set them as environment variables during build
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_SIGNUP_ENABLED=${VITE_SIGNUP_ENABLED}
ENV VITE_REQUIRE_INVITE_CODE=${VITE_REQUIRE_INVITE_CODE}

RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]