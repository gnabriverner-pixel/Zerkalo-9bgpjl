/**
 * Telegram Mini App / WebApp helper
 * Zerkalo MVP v0.4
 *
 * USAGE:
 *   import { tg, isTelegramWebApp, expandApp, closeApp } from '@/services/telegram';
 *
 * This is an architectural stub — no real bot token or API keys here.
 * Connect real Telegram WebApp SDK in production by loading:
 *   <script src="https://telegram.org/js/telegram-web-app.js"></script>
 * or via the @twa-dev/sdk package.
 */

/** Safe access to the global Telegram.WebApp object */
export const tg = typeof window !== 'undefined'
  ? (window as any)?.Telegram?.WebApp ?? null
  : null;

/** Is the app running inside a Telegram WebView? */
export const isTelegramWebApp = (): boolean => {
  return !!tg && typeof tg.initData === 'string';
};

/** Expand the Mini App to full height */
export const expandApp = (): void => {
  try { tg?.expand?.(); } catch (_) {}
};

/** Signal that the app is ready to display */
export const readyApp = (): void => {
  try { tg?.ready?.(); } catch (_) {}
};

/** Close the Mini App */
export const closeApp = (): void => {
  try { tg?.close?.(); } catch (_) {}
};

/**
 * Get Telegram user from initDataUnsafe.
 * ⚠️  Never trust this on the server — always verify initData signature server-side.
 */
export const getTelegramUser = (): {
  id?: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
} | null => {
  try {
    return tg?.initDataUnsafe?.user ?? null;
  } catch (_) {
    return null;
  }
};

/** Current Telegram color scheme (dark | light) */
export const getTelegramColorScheme = (): 'dark' | 'light' => {
  try { return tg?.colorScheme ?? 'dark'; } catch (_) { return 'dark'; }
};

/** Apply Telegram theme variables (call once on app start) */
export const applyTelegramTheme = (): void => {
  if (!isTelegramWebApp()) return;
  try { tg?.setHeaderColor?.('#090909'); } catch (_) {}
  try { tg?.setBackgroundColor?.('#090909'); } catch (_) {}
};

/**
 * initData raw string — send to your backend to verify authenticity.
 * See: https://core.telegram.org/bots/webapps#validating-data-received-via-the-mini-app
 */
export const getInitData = (): string => {
  try { return tg?.initData ?? ''; } catch (_) { return ''; }
};
