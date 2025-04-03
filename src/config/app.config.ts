
export const APP_CONFIG = {
  signupEnabled: (import.meta.env.VITE_SIGNUP_ENABLED || "true") === "true",
  requireInviteCode: (import.meta.env.VITE_REQUIRE_INVITE_CODE || "false") === "true",
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:3000",
  branding: {
    // Logo URLs with defaults
    loginLogo: import.meta.env.VITE_LOGIN_LOGO || "/opengpa_logo_flat_transparent.png",
    navbarLogo: import.meta.env.VITE_NAVBAR_LOGO || "/opengpa_logo_flat_transparent.png",
    // Main accent color (HSL values)
    accentColor: import.meta.env.VITE_ACCENT_COLOR || "142.1 76.2% 36.3%",
    // App name
    appName: import.meta.env.VITE_APP_NAME || "OpenGPA",
  }
} as const;

// Type for the config to ensure type safety
export type AppConfig = typeof APP_CONFIG;
