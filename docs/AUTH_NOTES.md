# Zerkalo — Auth Notes
## MVP v0.4

---

## Current state

Authentication is **mock / local state only**.

- Guest mode: `login(email, isGuest=true)` — stores local UserProfile
- Email: `login(email)` — stores local UserProfile, no server check
- No tokens, no sessions, no persistence

---

## Auth strategy for production

### Option A — Telegram Auth (recommended for Mini App)

```ts
// Receive Telegram user from initDataUnsafe
const tgUser = getTelegramUser(); // services/telegram.ts

// Send initData to backend for verification
const { token } = await fetch('/api/auth/telegram', {
  method: 'POST',
  body: JSON.stringify({ initData: getInitData() }),
}).then(r => r.json());

// Store token in SecureStore
await SecureStore.setItemAsync('auth_token', token);
```

Backend verifies HMAC signature of initData using bot token.

### Option B — Email Magic Link (via Supabase/OnSpace)

```ts
const { error } = await supabase.auth.signInWithOtp({ email });
// User clicks link in email → session created
```

### Option C — Guest with anonymous ID

```ts
// Create anonymous Supabase session
const { data } = await supabase.auth.signInAnonymously();
// User gets persistent ID without email
// Can be upgraded to email auth later
```

---

## Where to add auth

`contexts/AppContext.tsx` → `login()` function

Replace:
```ts
setUser({ id: email, name: email.split('@')[0], isGuest: false });
```

With real auth call + token storage.

---

## Where to store auth token

```ts
import * as SecureStore from 'expo-secure-store';

// Store
await SecureStore.setItemAsync('zerkalo_auth_token', token);

// Retrieve on app start
const token = await SecureStore.getItemAsync('zerkalo_auth_token');
```

---

## Profile screen placeholder

`app/(tabs)/profile.tsx` currently shows guest mode for all users.

The "Войти или создать аккаунт" button leads to `app/auth.tsx` which is a placeholder screen.

To activate real auth:
1. Implement auth in `app/auth.tsx`
2. Call `AppContext.login()` on success
3. Update `AppContext` to persist session via SecureStore

---

## Guest mode is intentional

Users can use the full free layer without any auth.
Auth is only required for:
- Persistent saved reports
- Cross-device premium access
- Telegram user identification
