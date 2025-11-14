# Hvordan koble sammen Clerk og Convex

Denne guiden viser deg hvordan du setter opp integrasjonen mellom Clerk (autentisering) og Convex (database).

## Oversikt

Clerk og Convex kobles sammen på 3 måter:

1. **JWT Tokens** - Frontend sender Clerk-token med alle Convex-requests
2. **Webhooks** - Clerk sender events til Convex når brukere opprettes/oppdateres
3. **Environment Variables** - Konfigurasjon i både Clerk Dashboard og Convex Dashboard

---

## Steg 1: Konfigurer Clerk Dashboard

### 1.1 Hent API Keys

1. Gå til [Clerk Dashboard](https://dashboard.clerk.com)
2. Velg ditt application
3. Gå til **"API Keys"** i venstre meny
4. Kopier følgende:
   - **Publishable Key** (starter med `pk_test_` eller `pk_live_`)
   - **Secret Key** (starter med `sk_test_` eller `sk_live_`)

### 1.2 Opprett JWT Template (Valgfritt, men anbefalt)

1. I Clerk Dashboard, gå til **"JWT Templates"**
2. Klikk **"New template"**
3. Gi den navnet: **`convex`**
4. La innstillingene være standard (eller legg til custom claims hvis nødvendig)
5. Klikk **"Save"**

**Merk:** Dette er valgfritt. Koden fungerer også uten JWT template, men det er anbefalt for bedre kontroll.

### 1.3 Opprett Webhook

1. I Clerk Dashboard, gå til **"Webhooks"**
2. Klikk **"Add Endpoint"**
3. Fyll inn:
   - **Endpoint URL**: `https://[din-convex-url].convex.site/clerk-webhook`
     - Eksempel: `https://grand-goose-750.convex.site/clerk-webhook`
   - **Events**: Velg `user.created` og `user.updated`
4. Klikk **"Create"**
5. **Viktig:** Kopier **"Signing Secret"** (starter med `whsec_`)
   - Du trenger denne i neste steg!

---

## Steg 2: Konfigurer Convex Dashboard

### 2.1 Legg til Environment Variables

1. Gå til [Convex Dashboard](https://dashboard.convex.dev)
2. Velg ditt project
3. Gå til **"Settings"** → **"Environment Variables"**
4. Legg til følgende variabler:

   **Variabel 1:**
   - **Name**: `CLERK_SECRET_KEY`
   - **Value**: (Paste din Clerk Secret Key fra steg 1.1)
   - **Environment**: Production (og Development hvis du vil)

   **Variabel 2:**
   - **Name**: `CLERK_WEBHOOK_SECRET`
   - **Value**: (Paste din Clerk Webhook Signing Secret fra steg 1.3)
   - **Environment**: Production (og Development hvis du vil)

5. Klikk **"Save"** for hver variabel

---

## Steg 3: Konfigurer Frontend (.env.local)

1. I prosjektet ditt, opprett/oppdater `.env.local` filen:

```env
# Convex URL (hentes automatisk når du kjører 'npx convex dev')
VITE_CONVEX_URL=https://din-convex-url.convex.cloud

# Clerk Publishable Key (fra Clerk Dashboard → API Keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_din_fullstendige_key_her
```

2. **Viktig:**
   - Keyen må være på én linje (ingen linjeskift)
   - Ikke ha anførselstegn rundt keyen
   - Ikke ha mellomrom før eller etter `=`

---

## Steg 4: Verifiser at alt fungerer

### 4.1 Start Convex Backend

```bash
cd skoleboost-app
npx convex dev
```

Dette vil:

- Koble til Convex
- Vise din `VITE_CONVEX_URL`
- Deploye backend-koden

### 4.2 Start Frontend

```bash
npm run dev
```

### 4.3 Test

1. Åpne appen i nettleseren
2. Prøv å opprette en konto
3. Sjekk Convex Dashboard → Data → users tabellen
4. Du skal se at brukeren er opprettet!

---

## Hvordan det fungerer

### Token Flow (Frontend → Convex)

```
1. User logger inn → Clerk oppretter JWT token
2. Frontend (main.tsx) → getToken() henter token
3. ConvexProviderWithAuth → Legger token i Authorization header
4. Alle Convex requests → Inkluderer token automatisk
5. Convex backend (clerkAuth.ts) → Dekoder token og henter user ID
```

### Webhook Flow (Clerk → Convex)

```
1. User opprettes i Clerk → Clerk sender webhook event
2. Convex mottar webhook → /clerk-webhook endpoint
3. Verifiserer signature → Med CLERK_WEBHOOK_SECRET
4. Oppretter bruker i Convex → Automatisk synkronisering
```

---

## Troubleshooting

### Problem: "Not authenticated" i Convex

Dette betyr at JWT-tokenet ikke sendes riktig eller ikke kan dekodes.

**Sjekkliste:**

1. **Sjekk browser console** - Se etter meldinger som:
   - "Clerk token added to request" (betyr token sendes)
   - "No Clerk token available for request" (betyr token mangler)
   - "Clerk not loaded yet" (betyr Clerk ikke er klar)

2. **Sjekk Convex logs** - I Convex Dashboard, se etter:
   - "No authorization header found in request"
   - "Successfully extracted Clerk user ID"
   - "No 'sub' claim found in JWT payload"

3. **Verifiser miljøvariabler:**
   - `VITE_CLERK_PUBLISHABLE_KEY` er riktig i `.env.local`
   - `CLERK_SECRET_KEY` er satt i Convex Dashboard
   - Restart både Convex (`npx convex dev`) og frontend (`npm run dev`)

4. **Sjekk timing:**
   - Token kan være utilgjengelig umiddelbart etter innlogging
   - Appen venter 500ms, men kan trenge mer tid
   - Hvis problemet vedvarer, vil webhook opprette brukeren automatisk

**Løsning:**

- Hvis token ikke sendes: Sjekk at `ConvexProviderWithAuth` er wrappet inni `ClerkProvider`
- Hvis token mangler: Vent litt lenger etter `setActive()` før du kaller Convex mutations
- Hvis problemet vedvarer: La webhook-en håndtere brukeropprettelsen (den vil fyre automatisk)

### Problem: Webhook fungerer ikke

**Løsning:**

- Sjekk at webhook URL er riktig: `https://[din-url].convex.site/clerk-webhook`
- Sjekk at `CLERK_WEBHOOK_SECRET` er satt i Convex Dashboard
- Sjekk webhook logs i Clerk Dashboard for feilmeldinger

### Problem: Token ikke sendt med requests

**Løsning:**

- Sjekk at `ConvexProviderWithAuth` er wrappet inni `ClerkProvider`
- Sjekk browser console for feilmeldinger
- Verifiser at `getToken()` fungerer (sjekk console logs)

---

## Eksempel på konfigurasjon

### .env.local

```env
VITE_CONVEX_URL=https://grand-goose-750.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y3VyaW91cy1wZWFjb2NrLTQyLmNsZXJrLmFjY291bnRzLmRldiQ
```

### Convex Dashboard Environment Variables

```
CLERK_SECRET_KEY=sk_test_VuN8qDV56bptBN35r5URCT5ADvxglHXAEdV7cqzI5L
CLERK_WEBHOOK_SECRET=whsec_abc123def456...
```

### Clerk Webhook URL

```
https://grand-goose-750.convex.site/clerk-webhook
```

---

## Neste steg

Når alt er konfigurert:

1. Test at innlogging fungerer
2. Test at brukeropprettelse fungerer
3. Sjekk at brukere synkroniseres til Convex
4. Verifiser at queries/mutations fungerer med autentisering
