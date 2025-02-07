#!/bin/sh

# Log environment variables (excluding sensitive data)
echo "Checking environment variables..."
echo "VITE_API_URL is set: $(if [ -n "${VITE_API_URL}" ]; then echo "yes"; else echo "no"; fi)"
echo "VITE_SIGNUP_ENABLED is set: $(if [ -n "${VITE_SIGNUP_ENABLED}" ]; then echo "yes"; else echo "no"; fi)"
echo "VITE_REQUIRE_INVITE_CODE is set: $(if [ -n "${VITE_REQUIRE_INVITE_CODE}" ]; then echo "yes"; else echo "no"; fi)"

# Replace environment variables in the JavaScript files
find /usr/share/nginx/html -type f -name "*.js" -exec sed -i \
    -e "s|VITE_API_URL_PLACEHOLDER|${VITE_API_URL:-http://localhost:8000}|g" \
    -e "s|VITE_SIGNUP_ENABLED_PLACEHOLDER|${VITE_SIGNUP_ENABLED:-false}|g" \
    -e "s|VITE_REQUIRE_INVITE_CODE_PLACEHOLDER|${VITE_REQUIRE_INVITE_CODE:-false}|g" \
    {} \;

echo "Environment variable replacement complete"