# Clerk Troubleshooting Guide

## 401 Unauthorized Error

Hvis du får 401 Unauthorized-feil fra Clerk, kan det være flere årsaker:

### 1. Sjekk Publishable Key

1. Gå til [Clerk Dashboard](https://dashboard.clerk.com)
2. Velg ditt application
3. Gå til **"API Keys"** i venstre meny
4. Under **"React"** seksjonen, kopier **"Publishable Key"**
5. Sjekk at keyen:
   - Starter med `pk_test_` (for development) eller `pk_live_` (for production)
   - Er minst 100+ tegn lang
   - Ikke har noen ekstra mellomrom eller linjeskift

### 2. Oppdater .env.local

Sett keyen i `.env.local`:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_din_fullstendige_key_her
```

**Viktig:**

- Keyen må være på én linje (ingen linjeskift)
- Ikke ha anførselstegn rundt keyen
- Ikke ha mellomrom før eller etter `=`

### 3. Restart Dev Server

Etter å ha oppdatert `.env.local`:

1. Stopp Vite dev serveren (Ctrl+C)
2. Start den på nytt: `npm run dev`
3. Last inn siden på nytt i nettleseren

### 4. Sjekk Clerk Application Status

1. Gå til Clerk Dashboard
2. Sjekk at application-en din er aktiv
3. Sjekk at du er logget inn på riktig Clerk-konto

### 5. CAPTCHA og Iframe Sandbox Issues

Hvis du får CAPTCHA-feil eller "Blocked script execution in 'about:blank'":

**Dette er et kjent problem med Cloudflare Turnstile CAPTCHA som Clerk bruker.**

**Løsning: Deaktiver CAPTCHA i Clerk Dashboard**

Se detaljerte instruksjoner i [`DISABLE_CAPTCHA.md`](./DISABLE_CAPTCHA.md)

**Kortversjon:**

1. Gå til [Clerk Dashboard](https://dashboard.clerk.com)
2. Velg ditt application
3. Gå til **User & Authentication** → **Bot Protection**
4. Deaktiver CAPTCHA (sett til "None" eller "Disabled")
5. Lagre endringene
6. Last inn appen på nytt

**Alternativ:**

- Du kan trygt ignorere disse feilene i development
- De påvirker ikke funksjonaliteten
- CAPTCHA vil fortsatt fungere i production

### 6. Verifiser Key Format

En gyldig Clerk publishable key ser slik ut:

```
pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
```

Hvis din key ser annerledes ut eller er mye kortere, kan det være at den er kuttet av eller feil.

## Hvis problemet fortsatt oppstår

1. Slett `.env.local` filen
2. Opprett en ny fil med bare:
   ```
   VITE_CONVEX_URL=https://din-convex-url.convex.cloud
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_din_key_her
   ```
3. Restart dev serveren
4. Prøv igjen
