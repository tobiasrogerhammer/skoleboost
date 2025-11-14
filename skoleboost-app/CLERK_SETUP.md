# Clerk Auth Setup Guide

Appen bruker nå Clerk for autentisering i stedet for Convex Auth.

## Steg 1: Opprett Clerk-konto

1. Gå til https://clerk.com
2. Opprett en gratis konto
3. Opprett et nytt application

## Steg 2: Konfigurer Clerk

1. I Clerk Dashboard, gå til "API Keys"
2. Kopier "Publishable Key"
3. Legg den til i `.env.local`:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   ```

4. I Clerk Dashboard, gå til "JWT Templates"
5. Opprett en ny JWT Template med navn "convex"
6. I template-innstillingene, legg til custom claims hvis nødvendig

## Steg 3: Konfigurer Convex med Clerk

1. I Clerk Dashboard, gå til "Webhooks"
2. Opprett en ny webhook som peker til din Convex deployment
3. URL: `https://[din-convex-url].convex.site/clerk-webhook`
4. Velg events: `user.created`, `user.updated`
5. Kopier "Signing Secret"
6. Legg den til i Convex Dashboard som environment variable:
   - Navn: `CLERK_WEBHOOK_SECRET`
   - Verdi: (paste signing secret)

## Steg 4: Konfigurer Convex Auth

I Convex Dashboard, legg til environment variable:

- `CLERK_SECRET_KEY`: Din Clerk Secret Key (fra API Keys)

## Steg 5: Test

1. Start appen: `npm run dev`
2. Prøv å opprette en konto gjennom login-siden
3. Sjekk at brukeren blir opprettet i Convex database

## Merk

- Clerk håndterer nå all autentisering
- Brukere opprettes automatisk i Convex når de registrerer seg via Clerk
- Clerk user ID lagres i `studentId` feltet i `users` tabellen
