export const APP_CONFIG = {
  signupEnabled: import.meta.env.VITE_SIGNUP_ENABLED === "true",
  requireInviteCode: import.meta.env.VITE_REQUIRE_INVITE_CODE === "true",
} as const;

// Type for the config to ensure type safety
export type AppConfig = typeof APP_CONFIG;