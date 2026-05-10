# Zerkalo — Payment Integration Notes
## MVP v0.4

---

## Current state

Payment is **mock / placeholder** in this version.

When the user taps "Открыть за 2 900 ₽":
1. `handlePurchase()` is called in `app/paywall.tsx`
2. It calls `unlockPremium()` from AppContext
3. `isPremium` flag is set to `true` in local state
4. No real payment is processed

---

## Where price is defined

- `app/paywall.tsx` — CTA button label
- `app/(tabs)/index.tsx` — premium card
- `app/(tabs)/profile.tsx` — premium card
- `app/result.tsx` — upsell block

Currently hardcoded as `2 900 ₽`. To change, update all four locations.
Future: move to `constants/config.ts` as `PREMIUM_PRICE = 2900`.

---

## Payment options for Russian market

Stripe is **not the primary option** for RU launch due to sanctions restrictions.

Recommended alternatives:

| Provider | Notes |
|---|---|
| **YooKassa** | Сбербанк ecosystem, wide coverage |
| **CloudPayments** | API-friendly, good docs |
| **Telegram Stars** | Native Telegram payment, zero friction for Mini App |
| **Robokassa** | Popular for info-business |
| **Tinkoff** | Good API |

---

## Telegram Stars (recommended for Mini App)

If deployed as Telegram Mini App, Stars is the simplest option:
- No external payment gateway
- Works inside Telegram without leaving the app
- Requires bot with payment configuration via @BotFather

Implementation plan:
```ts
// app/paywall.tsx - replace handlePurchase with:
const handleStarsPurchase = () => {
  Telegram.WebApp.openInvoice(INVOICE_URL, (status) => {
    if (status === 'paid') {
      unlockPremium();
      router.back();
    }
  });
};
```

---

## Where to connect payment

**Frontend (app/paywall.tsx):**
```ts
const handlePurchase = async () => {
  // 1. Create payment session via your backend
  const { paymentUrl } = await fetch('/api/create-payment', {
    method: 'POST',
    body: JSON.stringify({ product: 'big_report', userId }),
  }).then(r => r.json());

  // 2. Open payment URL
  Linking.openURL(paymentUrl);
};
```

**Backend (edge function / webhook):**
```ts
// Receive payment webhook
// Verify signature
// Set isPremium = true for userId in database
// Return success
```

---

## What to do after payment is confirmed

1. Store `isPremium = true` in database for the user
2. Return auth token or session with premium flag
3. `AppContext.unlockPremium()` is called on the frontend
4. User gets access to all locked sections

---

## Price change procedure

1. Update display strings in 4 files (see above)
2. Update payment amount in backend payment config
3. No code architecture changes needed
