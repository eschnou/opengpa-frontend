
import { APP_CONFIG } from "@/config/app.config";

/**
 * Applies the configured accent color to CSS variables
 */
export function applyThemeColors(): void {
  document.documentElement.style.setProperty('--accent-color', APP_CONFIG.branding.accentColor);
}
