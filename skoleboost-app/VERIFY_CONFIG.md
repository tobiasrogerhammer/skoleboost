# Verifiser konfigurasjon - Sjekkliste for feilsøking

## 1. Sjekk .env.local filen

Opprett eller sjekk `.env.local` filen i `skoleboost-app/` mappen:

```env
VITE_CONVEX_URL=https://grand-goose-750.convex.cloud
VITE_CLERK_PUBLISHABLE_KEY=pk_test_Y3VyaW91cy1wZWFjb2NrLTQyLmNsZXJrLmFjY291bnRzLmRldiQ
```

**Viktig:**
- ✅ Filen skal hete `.env.local` (med punktum foran)
- ✅ Ingen anførselstegn rundt verdiene
- ✅ Ingen mellomrom før eller etter `=`
- ✅ Hver variabel på sin egen linje
- ✅ `VITE_CLERK_PUBLISHABLE_KEY` skal starte med `pk_test_` eller `pk_live_`
- ✅ `VITE_CONVEX_URL` skal være din Convex URL (fra `npx convex dev`)

**Etter endringer:**
- Restart frontend: `npm run dev` (stopp med Ctrl+C og start på nytt)

---

## 2. Sjekk Clerk Dashboard

### 2.1 API Keys
1. Gå til [Clerk Dashboard](https://dashboard.clerk.com)
2. Velg ditt application
3. Gå til **"API Keys"** i venstre meny
4. Verifiser at du har:
   - **Publishable Key** (starter med `pk_test_` eller `pk_live_`)
     - Denne skal være i `.env.local` som `VITE_CLERK_PUBLISHABLE_KEY`
   - **Secret Key** (starter med `sk_test_` eller `sk_live_`)
     - Denne skal være i Convex Dashboard som `CLERK_SECRET_KEY`

### 2.2 JWT Templates ✅ (Du har denne!)
1. I Clerk Dashboard, gå til **"JWT Templates"**
2. ✅ Du har en template med navnet **`convex`** - dette er riktig!
3. Template-innstillingene ser riktige ut:
   - Name: `convex` ✅
   - Token lifetime: 3600 sekunder (1 time) ✅
   - Allowed clock skew: 5 sekunder ✅
   - Issuer og JWKS Endpoint er satt automatisk ✅

### 2.3 Webhooks
1. I Clerk Dashboard, gå til **"Webhooks"**
2. Sjekk om du har en webhook som peker til:
   - `https://grand-goose-750.convex.site/clerk-webhook`
3. Hvis ikke, opprett en:
   - Klikk **"Add Endpoint"**
   - **Endpoint URL**: `https://grand-goose-750.convex.site/clerk-webhook`
   - **Events**: Velg `user.created` og `user.updated`
   - Klikk **"Create"**
   - Kopier **"Signing Secret"** (starter med `whsec_`)
     - Denne skal være i Convex Dashboard som `CLERK_WEBHOOK_SECRET`

---

## 3. Sjekk Convex Dashboard

Gå til [Convex Dashboard](https://dashboard.convex.dev) → Settings → Environment Variables

### 3.1 CLERK_SECRET_KEY ⚠️ SJEKK DETTE FØRST!
- **Name**: `CLERK_SECRET_KEY`
- **Value**: Din Clerk Secret Key (fra Clerk Dashboard → API Keys)
- **MÅ starte med**: `sk_test_` eller `sk_live_` (IKKE `pk_test_`!)
- **Environment**: Development (og Production hvis du vil)

**🚨 KRITISK:** 
- Hvis denne starter med `pk_test_`, er det FEIL! 
- Det må være en **Secret Key** (`sk_test_...`), ikke Publishable Key
- Dette er sannsynligvis årsaken til at "No authorization header found" feilen oppstår
- Uten riktig Secret Key kan Convex ikke verifisere JWT-tokens, selv om de sendes

**Hvordan sjekke:**
1. Gå til Clerk Dashboard → API Keys
2. Kopier **Secret Key** (ikke Publishable Key!)
3. Gå til Convex Dashboard → Settings → Environment Variables
4. Sjekk at `CLERK_SECRET_KEY` starter med `sk_test_` (ikke `pk_test_`)
5. Hvis feil, oppdater den og restart Convex

### 3.2 CLERK_WEBHOOK_SECRET
- **Name**: `CLERK_WEBHOOK_SECRET`
- **Value**: Din Clerk Webhook Signing Secret (fra Clerk Dashboard → Webhooks)
- **MÅ starte med**: `whsec_`
- **Environment**: Development (og Production hvis du vil)

**Etter endringer:**
- Restart Convex: `npx convex dev` (stopp med Ctrl+C og start på nytt)

---

## 4. Test sekvens

1. **Sjekk .env.local**
   ```bash
   cd skoleboost-app
   cat .env.local
   ```
   Verifiser at begge variablene er der og riktige.

2. **Sjekk at Convex kjører**
   ```bash
   npx convex dev
   ```
   Du skal se din Convex URL i output.

3. **Sjekk at frontend kjører**
   ```bash
   npm run dev
   ```
   Du skal se at appen starter uten feil.

4. **Sjekk browser console**
   - Åpne Developer Tools (F12)
   - Gå til Console
   - Se etter:
     - ✅ "Clerk Publishable Key loaded: pk_test_..."
     - ✅ "Token available, setting up auth fetcher"
     - ✅ "Clerk token fetched for Convex request: ..."
     - ❌ IKKE "No authorization header found in request" (dette betyr problemet fortsatt finnes)

5. **Sjekk Convex logs**
   - Gå til [Convex Dashboard](https://dashboard.convex.dev)
   - Gå til "Logs"
   - Se etter:
     - ✅ "Successfully extracted Clerk user ID: ..."
     - ❌ IKKE "No authorization header found in request"

---

## 5. Vanlige feil

### Feil 1: CLERK_SECRET_KEY er en publishable key
**Symptom:** "No authorization header found in request"  
**Løsning:** Bytt ut `pk_test_...` med `sk_test_...` i Convex Dashboard

### Feil 2: .env.local mangler eller er feil
**Symptom:** "Missing Clerk Publishable Key" eller appen fungerer ikke  
**Løsning:** Opprett `.env.local` med riktige verdier og restart frontend

### Feil 3: Variabler ikke restartet
**Symptom:** Endringer fungerer ikke  
**Løsning:** 
- Restart Convex: `npx convex dev`
- Restart frontend: `npm run dev`
- Hard refresh browser: Ctrl+Shift+R (Windows/Linux) eller Cmd+Shift+R (Mac)

### Feil 4: JWT Template mangler
**Symptom:** Token hentes, men fungerer ikke  
**Løsning:** Opprett JWT template med navnet `convex` i Clerk Dashboard

---

## 6. Hvis ingenting fungerer

1. Sjekk at alle tre steder har riktige verdier:
   - ✅ `.env.local` har `VITE_CLERK_PUBLISHABLE_KEY` (pk_test_...)
   - ✅ Convex Dashboard har `CLERK_SECRET_KEY` (sk_test_...)
   - ✅ Convex Dashboard har `CLERK_WEBHOOK_SECRET` (whsec_...)

2. Sjekk at du har restartet:
   - ✅ Convex backend
   - ✅ Frontend
   - ✅ Browser (hard refresh)

3. Sjekk browser console for feilmeldinger

4. Sjekk Convex Dashboard logs for feilmeldinger

