# Sjekkliste for Clerk og Convex konfigurasjon

## Viktig: Sjekk at følgende er konfigurert

### 1. Convex Dashboard Environment Variables

Gå til [Convex Dashboard](https://dashboard.convex.dev) → Settings → Environment Variables

**Må ha:**

- `CLERK_SECRET_KEY` = Din Clerk Secret Key (starter med `sk_test_` eller `sk_live_`)
- `CLERK_WEBHOOK_SECRET` = Din Clerk Webhook Signing Secret (starter med `whsec_`)

**Hvorfor:**

- `CLERK_SECRET_KEY` brukes til å verifisere JWT-tokens fra Clerk
- Uten denne kan Convex ikke verifisere at tokens er gyldige
- Dette kan være årsaken til at authorization header ikke fungerer

### 2. Clerk Dashboard JWT Template (Valgfritt, men anbefalt)

Gå til [Clerk Dashboard](https://dashboard.clerk.com) → JWT Templates

**Anbefalt:**

- Opprett en JWT template med navnet `convex`
- Dette gir bedre kontroll over token-formatet

### 3. Frontend .env.local

Sjekk at `.env.local` inneholder:

```env
VITE_CONVEX_URL=https://din-convex-url.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 4. Test

1. Sjekk at `CLERK_SECRET_KEY` er satt i Convex Dashboard
2. Restart Convex backend: `npx convex dev`
3. Restart frontend: `npm run dev`
4. Prøv å logge inn
5. Sjekk Convex logs for "Successfully extracted Clerk user ID"

## Hvis det fortsatt ikke fungerer

1. Sjekk at `CLERK_SECRET_KEY` er riktig kopiert (ingen mellomrom, hele keyen)
2. Sjekk at keyen er satt for riktig environment (Development/Production)
3. Prøv å slette og legge til keyen på nytt i Convex Dashboard
4. Sjekk Convex logs for feilmeldinger om JWT-verifisering
