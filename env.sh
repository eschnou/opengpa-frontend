#!/bin/sh

# Replace environment variables in the JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
    -e "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL:-http://localhost:8000}|g" \
    -e "s|VITE_SIGNUP_ENABLED_PLACEHOLDER|${VITE_SIGNUP_ENABLED:-false}|g" \
    -e "s|VITE_REQUIRE_INVITE_CODE_PLACEHOLDER|${VITE_REQUIRE_INVITE_CODE:-false}|g" \
    {} \;