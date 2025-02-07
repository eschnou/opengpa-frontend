export const APP_CONFIG = {
  signupEnabled: import.meta.env.VITE_SIGNUP_ENABLED === "true",
  requireInviteCode: import.meta.env.VITE_REQUIRE_INVITE_CODE === "true",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:8000",
} as const;

// Log configuration on initialization
console.log('APP_CONFIG initialized:', {
  signupEnabled: import.meta.env.VITE_SIGNUP_ENABLED,
  requireInviteCode: import.meta.env.VITE_REQUIRE_INVITE_CODE,
  apiUrl: import.meta.env.VITE_API_URL,
  parsedConfig: APP_CONFIG
});

// Type for the config to ensure type safety
export type AppConfig = typeof APP_CONFIG;