#!/bin/sh

# Replace environment variables in the JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL:-http://localhost:8000}|g" {} \;