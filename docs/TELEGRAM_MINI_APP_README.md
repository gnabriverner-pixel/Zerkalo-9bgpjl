# Zerkalo — Telegram Mini App Guide
## MVP v0.4

---

## Overview

Zerkalo is built as a **Telegram Mini App-ready** application.
The app auto-detects Telegram WebView via `services/telegram.ts` and applies the correct theme.

No Telegram-specific code is required for the base MVP — it works as a standard web app.
Telegram integration is additive.

---

## How to use as a Telegram Mini App

### Step 1 — Deploy web build

```bash
npx expo export --platform web
# Deploy dist/ to a public HTTPS domain
# e.g. https://zerkalo.app or https://zerkalo.vercel.app
```

### Step 2 — Configure your bot

1. Open **@BotFather** in Telegram
2. Select your bot → **Bot Settings** → **Menu Button**
3. Set the URL to your deployed app
4. Optional: use `/newapp` to create a Web App entry

### Step 3 — Open in Telegram

Users tap the menu button → app opens in Telegram WebView.
The `services/telegram.ts` helper detects `window.Telegram.WebApp` automatically.

---

## Environment variables needed in production

```env
# Telegram Bot Token — NEVER expose in frontend
# Only used in backend/edge functions for initData verification
TELEGRAM_BOT_TOKEN=your_bot_token_here

# App URL
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

⚠️  **Never expose `TELEGRAM_BOT_TOKEN` in client-side code.**

---

## Where to add Telegram WebApp SDK

Option A — via CDN in `index.html` (web build):
```html
<script src="https://telegram.org/js/telegram-web-app.js"></script>
```

Option B — via npm package:
```bash
npm install @twa-dev/sdk
```

Then in `app/_layout.tsx`:
```ts
import WebApp from '@twa-dev/sdk';
WebApp.ready();
WebApp.expand();
```

---

## Detecting Telegram WebView

```ts
import { isTelegramWebApp, expandApp, readyApp } from '@/services/telegram';

// In _layout.tsx or root component
useEffect(() => {
  if (isTelegramWebApp()) {
    readyApp();   // Signal app is ready
    expandApp();  // Expand to full height
  }
}, []);
```

---

## Getting initData (for backend verification)

```ts
import { getInitData } from '@/services/telegram';

// Send to your backend for verification
const initData = getInitData();
```

Backend verification (Node.js / edge function):
```ts
// Verify HMAC signature
const secretKey = crypto.createHmac('sha256', 'WebAppData')
  .update(TELEGRAM_BOT_TOKEN).digest();
const hash = crypto.createHmac('sha256', secretKey)
  .update(dataCheckString).digest('hex');
// Compare hash with received hash
```

---

## Distinguishing Telegram WebView from browser

```ts
import { isTelegramWebApp } from '@/services/telegram';

if (isTelegramWebApp()) {
  // Telegram-specific behavior
  // e.g. use Telegram.WebApp.MainButton instead of custom CTA
} else {
  // Standard browser / PWA
}
```

---

## Getting Telegram user

```ts
import { getTelegramUser } from '@/services/telegram';

const user = getTelegramUser();
// { id: 123456789, first_name: 'Ivan', username: 'ivan' }
```

⚠️  `getTelegramUser()` returns `initDataUnsafe` which is **NOT verified**.
Always verify `initData` on the backend before trusting user identity.

---

## Telegram Stars payment (future)

For Russian users, Telegram Stars is the recommended payment method (no Stripe/YooKassa needed).

```ts
// Future implementation
Telegram.WebApp.openInvoice(invoiceUrl, (status) => {
  if (status === 'paid') unlockPremium();
});
```

Requires: bot with payment provider configured via BotFather.

---

## Connect Telegram bot

1. Create bot via @BotFather
2. Set webhook to your edge function URL
3. Handle `/start` command
4. Return Mini App URL as inline button

```json
{
  "inline_keyboard": [[{
    "text": "Открыть Зеркало себя",
    "web_app": { "url": "https://your-domain.com" }
  }]]
}
```

---

## Deploy web build on a domain

```bash
# Vercel (recommended)
npm i -g vercel
vercel deploy dist/

# Or Netlify
npm i -g netlify-cli
netlify deploy --dir=dist --prod
```

Telegram requires **HTTPS** — Vercel and Netlify provide this automatically.

---

## Safe area in Telegram WebView

Telegram WebView has its own insets. Our app uses `react-native-safe-area-context` which handles this automatically via `useSafeAreaInsets()`.

For maximum compatibility, all screens use:
```ts
const insets = useSafeAreaInsets();
// paddingTop: insets.top + Spacing.md
// paddingBottom: insets.bottom + Spacing.xxl
```
