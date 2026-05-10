# Zerkalo — Backend Notes
## MVP v0.4

---

## Current state

No backend is connected. All data is **local React state** (lost on app restart).

---

## Where to connect backend

All backend integration points are in `contexts/AppContext.tsx`.

### User / Auth
```ts
// Replace local setUser() with:
const { data: user } = await supabase.auth.signInWithMagicLink({ email });
// or Telegram user from initDataUnsafe (verified server-side)
```

### Saved reports
```ts
// Replace setSavedReports() with:
await supabase.from('reports').insert({ user_id, name, date_of_birth, core_data });
const { data } = await supabase.from('reports').select().eq('user_id', userId);
```

### Premium status
```ts
// Replace setIsPremium() with:
await supabase.from('purchases').insert({ user_id, product: 'big_report' });
// On load:
const { data } = await supabase.from('purchases').select().eq('user_id', userId);
const isPremium = data?.length > 0;
```

---

## Recommended database schema

```sql
-- Users
create table users (
  id uuid primary key default gen_random_uuid(),
  telegram_id bigint unique,
  email text unique,
  created_at timestamptz default now()
);

-- Reports
create table reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  name text not null,
  date_of_birth text not null,
  core_data jsonb,  -- CoreNumbers JSON
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Purchases
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id),
  product text not null,  -- 'big_report'
  amount integer,          -- in kopecks: 290000
  payment_provider text,   -- 'telegram_stars' | 'yookassa' | 'cloudpayments'
  paid_at timestamptz default now()
);
```

---

## Backend options

| Option | Notes |
|---|---|
| **OnSpace Cloud** | Built-in, Supabase-compatible, fastest to connect |
| **Supabase** | Self-hosted or cloud, full Postgres |
| **Firebase** | Good for auth + realtime |
| **PocketBase** | Lightweight self-hosted |
| Custom API | Full control, more work |

---

## Where to store Telegram user id

```ts
// In AppContext.login():
login(email, isGuest) {
  const telegramUser = getTelegramUser(); // from services/telegram.ts
  setUser({
    id: telegramUser?.id?.toString() ?? email,
    telegramId: telegramUser?.id,
    name: telegramUser?.first_name ?? email.split('@')[0],
    ...
  });
}
```

---

## Where to connect PDF generation

Planned: `services/pdfExport.ts`

Options:
- Edge function that accepts `CoreNumbers` JSON → returns PDF URL
- `expo-print` for native on-device generation
- Server-side: Puppeteer, WeasyPrint, PDFShift
